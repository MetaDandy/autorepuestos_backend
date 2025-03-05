import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllDto } from '../dto/findAll.dto';
import { BaseService } from '../services/base/base.service';
import { ChangePasswordDto } from './dto/change_password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jswtService: JwtService,
    private readonly baseService: BaseService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  /**
   * TODO: 
   * - No dejar eliminar el usuario si este paso su llave a otra tabla, verificar!!
   */
  /**
   * Funcion de login.
   * @param authDto 
   * @returns Devuelve el token jwt y el refresh token del usuario.
   */
  async signIn(authDto: AuthDto) {
    const { email, password } = authDto;

    const { data, error } = await this.supabaseService.getClient().auth.signInWithPassword({
      email,
      password
    });

    if (error) throw new UnauthorizedException(error.message);

    const supabaseUserId = data.user?.id;

    if (!supabaseUserId) throw new UnauthorizedException('User Id not found');

    const user = await this.userRepository.findOne({
      where: {
        supabase_user_id: supabaseUserId,
      }
    });

    if (!user) throw new UnauthorizedException('User not found');

    const payload = { sub: user.id };
    const token = this.jswtService.sign(payload, {
      expiresIn: '18h'
    });

    await this.userRepository.save(user);

    return {
      token,
    }
  }

  /**
   * Funcion de creacion de un usuario.
   * Solo el administrador o un usuario con el permiso necesario puede crearlo.
   * @param userDto 
   */
  async create(userDto: CreateUserDto) {
    const { email, password, name, role_id, address, phone } = userDto;

    const userExist = await this.userRepository.findOne({
      where: {
        email,
      }
    });

    if (userExist) throw new BadRequestException('El email proporcionado ya tiene una cuenta viculada.')

    const { data, error } = await this.supabaseService
      .getClient()
      .auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (error) throw new UnauthorizedException(error.message);

    try {
      const role = await this.roleRepository.findOneBy({ id: role_id });

      const user = this.userRepository.create({
        supabase_user_id: data.user.id,
        email,
        role: role,
        name,
        address,
        phone
      });

      return await this.userRepository.save(user);
    } catch (dbError) {
      // Si hay un error al guardar en la base de datos, eliminamos el usuario de Supabase
      await this.supabaseService.getClient().auth.admin.deleteUser(data.user.id);
      throw new InternalServerErrorException('Error al guardar el usuario en la base de datos.');
    }
  }

  /**
   * Solo obtiene todos los usarios sin eliminacion suave.
   * @param query - Paginacion para la busqueda.
   * @returns Los usuarios que fueron no eliminados de manera suave.
   */
  async findAll(query: FindAllDto<User>) {
    return await this.baseService.findAll(this.userRepository, query, ['role']);
  }

  /**
   * Solo obtiene todos los usarios con eliminacion suave.
   * @param query - Paginacion para la busqueda.
   * @returns Los usuarios que fueron eliminados de manera suave.
   */
  async findAllSoftDeleted(query: FindAllDto<User>) {
    return await this.baseService.findAllSoftDeleted(this.userRepository, query, ['role']);
  }

  /**
   * Se obtiene el usuario solicitado
   * @param id - Uuid del usuario, no el uuid de supabase.
   * @returns - Retorna el usuario obtenido.
   */
  async findOne(id: string) {
    return await this.baseService.findOne(id, this.userRepository, ['role']);
  }

  /**
   * Actualiza un usuario.
   * @param id - Uuid del usuario, no el uuid de supabase.
   * @param updateAuthDto - El tipado necesario para actualizar un usuario.
   * @returns - Retorna el usuario actualizado.
   */
  async update(id: string, updateAuthDto: UpdateUserDto) {
    const user = await this.findOne(id);

    this.userRepository.merge(user, updateAuthDto);

    return await this.userRepository.save(user);
  }

  /**
   * Elimina de forma permanente un usario.
   * @param id - Uuid del usuario, no el uuid de supabase.
   * @returns - El usuario totalmente eliminado.
   */
  async hardDelete(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }

    if (!user.supabase_user_id) {
      throw new Error('User does not have a Supabase ID');
    }

    // Intentar eliminar el usuario en Supabase
    const { error } = await this.supabaseService
      .getClient()
      .auth.admin.deleteUser(user.supabase_user_id);

    if (error) {
      throw new Error(`Failed to delete user in Supabase: ${error.message}`);
    }

    return await this.baseService.hardDelete(id, this.userRepository);
  }

  /**
   * Elimina el usuario, pero se puede recuperar.
   * @param id - Uuid del usuario, no el uuid de supabase.
   * @returns - El usuario eliminado.
   */
  async softDelete(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('El usuario ya fue eliminado');
    }

    return await this.userRepository.softRemove(user);
  }

  /**
   * Restaura el usuario y le quita la eliminacion.
   * @param id - Uuid del usuario, no el uuid de supabase.
   * @returns - El usuario recuperado.
   */
  async restore(id: string) {
    return await this.baseService.restore(id, this.userRepository);
  }

  /**
   * Cambia la contraseña de un usuario verificando primero la contraseña actual.
   * @param id - UUID del usuario en tu base de datos.
   * @param changePasswordDto - Dto donde se encuentran la nueva y antigua contraseña.
   */
  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const { newPassword, oldPassword } = changePasswordDto;

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user || !user.supabase_user_id) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar la contraseña actual intentando iniciar sesión
    const { error: signInError } = await this.supabaseService.getClient().auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    });

    if (signInError) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // Si la contraseña es correcta, cambiarla
    const { error } = await this.supabaseService.getClient().auth.admin.updateUserById(user.supabase_user_id, {
      password: newPassword,
    });

    if (error) {
      throw new Error(`Error al cambiar la contraseña: ${error.message}`);
    }

    return { message: 'Contraseña actualizada correctamente' };
  }
}
