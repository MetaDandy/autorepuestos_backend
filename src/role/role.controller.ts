import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permissions } from '../decorator/permission/permission.decorator';
import { PermissionEnum } from '../enum/permission.enum';
import { FindAllDto } from '../dto/findAll.dto';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  @Permissions(PermissionEnum.ROLE_CREATE)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Post('restore/:id')
  @Permissions(PermissionEnum.ROLE_RESTORE)
  restore(@Param('id') id: string) {
    return this.roleService.restore(id);
  }

  @Get()
  @Permissions(PermissionEnum.ROLE_READ)
  findAll(@Query() findAllDto: FindAllDto<Role>) {
    return this.roleService.findAll(findAllDto);
  }

  @Get('soft')
  @Permissions(PermissionEnum.ROLE_READ)
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<Role>) {
    return this.roleService.findAllSoftDeleted(findAllDto);
  }

  @Get('permissions')
  @Permissions(PermissionEnum.ROLE_READ)
  findAllPermission(@Query() findAllDto: FindAllDto<Permission>) {
    return this.roleService.findAllPermission(findAllDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete('hard_delete/:id')
  @Permissions(PermissionEnum.ROLE_HARD_DELETE)
  hardDelete(@Param('id') id:string) {
    return this.roleService.hardDelete(id);
  }

  @Delete('soft_delete/:id')
  @Permissions(PermissionEnum.ROLE_SOFT_DELETE)
  softDelete(@Param('id') id:string) {
    return this.roleService.softDelete(id);
  }
}
