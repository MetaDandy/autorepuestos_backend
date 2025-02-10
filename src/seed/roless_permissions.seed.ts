import { DataSource } from 'typeorm';
import { Role } from 'src/role/entities/role.entity';
import { Permission } from 'src/role/entities/permission.entity';
import { Role_Permission } from 'src/role/entities/role_permission.entity';

export async function seedRolesAndPermissions(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);
  const rolePermissionRepository = dataSource.getRepository(Role_Permission);

  // Define los roles
  const rolesData = [
    { name: 'Admin', description: 'Administrador con todos los permisos', father_id: null },
    { name: 'Manager', description: 'Gestión avanzada', father_id: null },
    { name: 'User', description: 'Usuario estándar', father_id: null },
  ];

  // Define los permisos
  const permissionsData = [
    { code: 'CREATE_USER', name: 'Crear usuario', description: 'Permite crear usuarios' },
    { code: 'UPDATE_USER', name: 'Actualizar usuario', description: 'Permite actualizar usuarios' },
    { code: 'DELETE_USER', name: 'Eliminar usuario', description: 'Permite eliminar usuarios' },
    { code: 'VIEW_REPORTS', name: 'Ver reportes', description: 'Acceso a reportes' },
  ];

  // Limpia la base de datos antes de insertar
  await rolePermissionRepository.clear();
  await permissionRepository.clear();
  await roleRepository.clear();

  // Inserta permisos
  const permissions = await permissionRepository.save(permissionsData);

  // Inserta roles
  const roles = await roleRepository.save(rolesData);

  // Relaciona roles con permisos
  const rolePermissionsData = [
    { role: roles.find(r => r.name === 'Admin'), permission: permissions.find(p => p.code === 'CREATE_USER') },
    { role: roles.find(r => r.name === 'Admin'), permission: permissions.find(p => p.code === 'UPDATE_USER') },
    { role: roles.find(r => r.name === 'Admin'), permission: permissions.find(p => p.code === 'DELETE_USER') },
    { role: roles.find(r => r.name === 'Manager'), permission: permissions.find(p => p.code === 'VIEW_REPORTS') },
  ];

  await rolePermissionRepository.save(rolePermissionsData);

  console.log('Roles and Permissions Seed Completed');
}
