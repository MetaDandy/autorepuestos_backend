import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../../decorator/permission/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext) {
    const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());

    if (!requiredPermissions || requiredPermissions.length === 0) {
      console.log('No hay permisos');
      return true; // 🔹 Si la ruta no tiene permisos asignados, se permite el acceso.
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions) {
      throw new ForbiddenException('No tienes permisos para acceder a esta ruta');
    }

    // 🔹 Verificar si el usuario tiene **todos** los permisos requeridos.
    const hasPermission = requiredPermissions.every((perm) => user.permissions.includes(perm));

    if (!hasPermission) {
      throw new ForbiddenException('No tienes los permisos necesarios para acceder a esta ruta');
    }

    return true;
  }
}
