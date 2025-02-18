import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllDto } from '../dto/findAll.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jswtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) { }

  /**
   * TODO: 
   * - Reemplazar el repositorio del rol por el servicio y usar el getOne
   * - Ver el tema del refresh token
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
    const token = this.jswtService.sign(payload);
    const refreshToken = this.jswtService.sign(payload, {
      expiresIn: '7d',
    });

    user.refresh_token = refreshToken;
    await this.userRepository.save(user);

    return {
      token,
      refresh_token: refreshToken,
    }
  }

  /**
   * Funcion de creacion de un usuario.
   * Solo el administrador o un usuario con el permiso necesario puede crearlo.
   * @param userDto 
   */
  //* El usuario creado no tiene refresh porque lo crea otra persona
  async create(userDto: CreateUserDto) {
    const { email, password, name, role_id, address, phone } = userDto;

    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signUp({
        email,
        password,
      });

    if (error) throw new UnauthorizedException(error.message);

    const role = await this.roleRepository.findOneBy({ id: role_id });

    const user = this.userRepository.create({
      supabase_user_id: data.user.id,
      role: role,
      name,
      address,
      phone
    });

    return await this.userRepository.save(user);
  }

  /**
   * Solo obtiene todos los usarios sin eliminacion suave.
   * @param query - Paginacion para la busqueda.
   * @returns Los usuarios que fueron no eliminados de manera suave.
   */
  async findAll(query: FindAllDto<User>) {
    const { limit, page, orderBy = 'createdAt', orderDirection = 'ASC' } = query;
    const [users, totalCount] = await this.userRepository.findAndCount({
      relations: ['role'],
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [orderBy]: orderDirection
      },
      withDeleted: false,
    });

    return {
      page,
      limit,
      totalCount,
      hasMore: page * limit < totalCount,
      data: users
    };
  }

  /**
   * Solo obtiene todos los usarios con eliminacion suave.
   * @param query - Paginacion para la busqueda.
   * @returns Los usuarios que fueron eliminados de manera suave.
   */
  async findAllSoftDeleted(query: FindAllDto<User>) {
    const { limit, page, orderBy = 'createdAt', orderDirection = 'ASC' } = query;
    const [users, totalCount] = await this.userRepository.findAndCount({
      relations: ['role'],
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [orderBy]: orderDirection
      },
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull())
      }
    });

    return {
      page,
      limit,
      totalCount,
      hasMore: page * limit < totalCount,
      data: users
    };
  }

  /**
   * Se obtiene el usuario solicitado
   * @param id - Uuid del usuario, no el uuid de supabase.
   * @returns - Retorna el usuario obtenido.
   */
  async findOne(id: string) {
    const user = await this.userRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['role'],
    });

    return user;
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

    return await this.userRepository.remove(user);
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
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }

    if (!user.deletedAt) {
      throw new UnauthorizedException('El usuario no está eliminado');
    }

    await this.userRepository.restore(id);

    return { message: 'Usuario restaurado correctamente', user };
  }
}
