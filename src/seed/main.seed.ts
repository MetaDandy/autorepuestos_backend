import { Injectable } from '@nestjs/common';
import { PermissionSeeder } from './permission.seed';
import { RoleSeeder } from './role.seed';
import { UserSeeder } from './user.seed';

@Injectable()
export class MainSeeder {
  constructor(
    private readonly permissionSeeder: PermissionSeeder,
    private readonly roleSeeder: RoleSeeder,
    private readonly userSeeder: UserSeeder,
  ) {}

  async run() {
    console.log('🚀 Iniciando Seeders...');
    
    await this.permissionSeeder.syncPermissions();
    await this.roleSeeder.syncRoles();
    await this.userSeeder.syncAdminUser();

    console.log('✅ Seeders completados.');
  }
}
