import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { In, IsNull, Not, Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { FindAllDto } from '../dto/findAll.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>
  ) { }
  // TODO: No dejar que borren o editen el rol admin

  /**
   * Crea un rol con permisos existentes en la base de datos.
   * @param createRoleDto - Variables para crear el rol.
   * @returns El rol creado.
   */
  async create(createRoleDto: CreateRoleDto) {
    const { description, name, permissions } = createRoleDto;

    if (permissions.length === 0) throw new BadRequestException('Se deben enviar permisos');

    const permissionEntity = await this.permissionRepository.find({
      where: {
        id: In(permissions),
      }
    });

    if (permissionEntity.length !== permissions.length) {
      throw new BadRequestException('Uno o más permisos no existen');
    }

    const role = await this.roleRepository.create({
      name,
      description,
      permissions: permissionEntity
    });

    return await this.roleRepository.save(role);
  }

  /**
   * Obtiene los roles que no fueron eliminados.
   * @param query - Paginación para la búsqueda.
   * @returns Los roles que no han sido eliminado.
   */
  async findAll(query: FindAllDto<Role>) {
    const { limit, page, orderBy = 'createdAt', orderDirection = 'ASC' } = query;
    const [roles, totalCount] = await this.roleRepository.findAndCount({
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
      data: roles
    };
  }

  /**
   * Obtiene los roles que fueron eliminados.
   * @param query - Paginación para la búsqueda.
   * @returns Los roles que han sido eliminado.
   */
  async findAllSoftDeleted(query: FindAllDto<Role>) {
    const { limit, page, orderBy = 'createdAt', orderDirection = 'ASC' } = query;
    const [roles, totalCount] = await this.roleRepository.findAndCount({
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
      data: roles
    };
  }

  /**
   * Obtiene todos los permisos con paginación.
   * @param query - Paginación para la búsqueda.
   * @returns Los permisos.
   */
  async findAllPermission(query: FindAllDto<Permission>) {
    const { limit, page, orderBy = 'createdAt', orderDirection = 'ASC' } = query;
    const [permissions, totalCount] = await this.permissionRepository.findAndCount({
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
      data: permissions
    };
  }

  /**
   * Obtiene un rol por medio del id.
   * @param id - Uuid del rol.
   * @returns El rol obtenido.
   */
  async findOne(id: string) {
    const role = await this.roleRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['permissions']
    });

    return role;
  }

  /**
   * Actualiza el rol.
   * @param id - Uuid del rol.
   * @param updateRoleDto - Las variables necesarias para actualizar el rol.
   * @returns El rol actualizado.
   */
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const { name, description, permissions } = updateRoleDto;
  
    const role = await this.findOne(id);
  
    if (permissions && permissions.length > 0) {
      const permissionEntities = await this.permissionRepository.find({
        where: { id: In(permissions) },
      });
  
      if (permissionEntities.length !== permissions.length) {
        throw new BadRequestException('Uno o más permisos no existen');
      }
  
      role.permissions = permissionEntities;
    }
  
    if (name) role.name = name;
    if (description) role.description = description;
  
    return await this.roleRepository.save(role);
  }

  /**
   * Elimina físicamente un rol.
   * @param id - Uuid del rol.
   * @returns El rol fisicamente eliminado.
   */
  async hardDelete(id: string) {
    const role = await this.roleRepository.findOne({
      where : { id },
      relations: ['user'],
      withDeleted: true,
    });

    if (!role) throw new UnauthorizedException('El rol no existe');

    if (role.user.length > 0)
      throw new UnauthorizedException('No se puede eliminar un rol con usuarios asignados');

    return await this.roleRepository.remove(role);
  }

  /**
   * Elimina el lógicamente un rol.
   * @param id - Uuid del rol.
   * @returns El rol eliminado lógicamente.
   */
  async softDelete(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['user'],
      withDeleted: true,
    });

    if (!role) throw new UnauthorizedException('El rol no existe');
 
    if (role.deletedAt) throw new UnauthorizedException('El rol ya fue eliminado.');

    if (role.user.length > 0)
      throw new UnauthorizedException('No se puede eliminar un rol con usuarios asignados');

    return await this.roleRepository.softRemove(role);
  }

  /**
   * Recupera un rol previamente eliminado.
   * @param id - Uuid del rol.
   * @returns El rol recuperado.
   */
  async restore(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!role) throw new UnauthorizedException('El rol no existe');
 
    if (!role.deletedAt) throw new UnauthorizedException('El rol no fue eliminado.');

    await this.roleRepository.restore(id);

    return { message: 'Rol restaurado correctamente', role };
  }
}
