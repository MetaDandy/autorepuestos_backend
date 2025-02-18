import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { Permission } from '../role/entities/permission.entity';

@Injectable()
export class RoleSeeder {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async syncRoles() {
    const existingRole = await this.roleRepository.findOne({ where: { name: 'Admin' }, relations: ['permissions'] });

    if (!existingRole) {
      const allPermissions = await this.permissionRepository.find();
      
      const adminRole = this.roleRepository.create({
        name: 'Admin',
        permissions: allPermissions,
        description: 'Admin con todos los roles'
      });

      await this.roleRepository.save(adminRole);
      console.log('✅ Rol "Admin" creado con todos los permisos.');
    } else {
      console.log('⚠️ El rol "Admin" ya existe.');
    }
  }
}
