import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../role/entities/permission.entity';
import { PermissionEnum } from '../enum/permission.enum';

@Injectable()
export class PermissionSeeder {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async syncPermissions() {
    const existingPermissions = await this.permissionRepository.find();
    const existingCodes = existingPermissions.map((p) => p.code);

    const newPermissions = Object.values(PermissionEnum)
      .filter((code) => !existingCodes.includes(code))
      .map((code) => ({
        code,
        name: code.replace('.', ' '),
      }));

    if (newPermissions.length > 0) {
      await this.permissionRepository.save(newPermissions);
      console.log(`🔄 ${newPermissions.length} permisos sincronizados.`);
    } else {
      console.log('✅ Permisos actualizados.');
    }
  }
}
