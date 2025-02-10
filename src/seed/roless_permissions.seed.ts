import { DataSource } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { Permission } from '../role/entities/permission.entity';

export async function seedRolesAndPermissions(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);

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
  await permissionRepository.delete({});
  await roleRepository.delete({});

  // Inserta permisos y roles
  const permissions = await permissionRepository.save(permissionsData);
  const roles = await roleRepository.save(rolesData);

  // Relaciona roles con permisos
  const rolePermissionsData = [
    { roleName: 'Admin', permissionCodes: ['CREATE_USER', 'UPDATE_USER', 'DELETE_USER'] },
    { roleName: 'Manager', permissionCodes: ['VIEW_REPORTS'] },
  ];

  for (const rp of rolePermissionsData) {
    const role = roles.find(r => r.name === rp.roleName);
    const permissionsForRole = permissions.filter(p => rp.permissionCodes.includes(p.code));
    
    if (role) {
      role.permissions = permissionsForRole; // Establece las relaciones Many-to-Many
      await roleRepository.save(role); // Guarda el rol con sus permisos
    }
  }

  console.log('Roles and Permissions Seed Completed');
}
