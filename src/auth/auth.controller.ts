import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllDto } from '../dto/findAll.dto';
import { User } from './entities/user.entity';
import { Public } from '../decorator/public/public.decorator';
import { Permissions } from '../decorator/permission/permission.decorator';
import { PermissionEnum } from '../enum/permission.enum';
import { ChangePasswordDto } from './dto/change_password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO: ver el tema de los permisos, para que un usuario se edite a si mismo

  @Post()
  @Permissions(PermissionEnum.USER_CREATE)
  create(@Body() createUserDto: CreateUserDto){
    return this.authService.create(createUserDto);
  }

  @Post('sign_in')
  @Public()
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @Post('restore/:id')
  @Permissions(PermissionEnum.USER_RESTORE)
  restore(@Param('id') id:string) {
    return this.authService.restore(id);
  }

  @Get()
  @Permissions(PermissionEnum.USER_READ)
  findAll(@Query() findAllDto: FindAllDto<User>) {
    return this.authService.findAll(findAllDto);
  }

  @Get('soft')
  @Permissions(PermissionEnum.USER_READ)
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<User>) {
    return this.authService.findAllSoftDeleted(findAllDto);
  }

  @Get(':id')
  @Permissions(PermissionEnum.USER_READ)
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionEnum.USER_UPDATE)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }

  @Patch('change_password/:id')
  @Permissions(PermissionEnum.USER_UPDATE)
  changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(id, changePasswordDto);
  }

  @Delete('hard_delete/:id')
  @Permissions(PermissionEnum.USER_HARD_DELETE)
  hardDelete(@Param('id') id: string) {
    return this.authService.hardDelete(id);
  }

  @Delete('soft_delete/:id')
  @Permissions(PermissionEnum.USER_SOFT_DELETE)
  softDelete(@Param('id') id: string) {
    return this.authService.softDelete(id);
  }
}
