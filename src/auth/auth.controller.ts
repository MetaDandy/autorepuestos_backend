import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllDto } from '../dto/findAll.dto';
import { User } from './entities/user.entity';
import { Public } from '../decorator/public/public.decorator';
import { Permission } from '../decorator/permission/permission.decorator';
import { PermissionEnum } from 'src/enum/permission.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Permission(PermissionEnum.USER_CREATE)
  create(@Body() createUserDto: CreateUserDto){
    return this.authService.create(createUserDto);
  }

  @Post('sign_in')
  @Public()
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @Post('restore/:id')
  @Permission(PermissionEnum.USER_RESTORE)
  restore(@Param('id') id:string) {
    return this.authService.restore(id);
  }

  @Get()
  @Permission(PermissionEnum.USER_READ)
  findAll(@Query() findAllDto: FindAllDto<User>) {
    return this.authService.findAll(findAllDto);
  }

  @Get('soft')
  @Permission(PermissionEnum.USER_READ)
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<User>) {
    return this.authService.findAllSoftDeleted(findAllDto);
  }

  @Get(':id')
  @Permission(PermissionEnum.USER_READ)
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  @Permission(PermissionEnum.USER_UPDATE)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }

  @Delete('hard_delete/:id')
  @Permission(PermissionEnum.USER_HARD_DELETE)
  hardDelete(@Param('id') id: string) {
    return this.authService.softDelete(id);
  }

  @Delete('soft_delete/:id')
  @Permission(PermissionEnum.USER_SOFT_DELETE)
  softDelete(@Param('id') id: string) {
    return this.authService.softDelete(id);
  }
}
