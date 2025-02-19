import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllDto } from '../dto/findAll.dto';
import { User } from './entities/user.entity';
import { Public } from '../decorator/public/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto){
    return this.authService.create(createUserDto);
  }

  @Post('sign_in')
  @Public()
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @Post('restore/:id')
  restore(@Param('id') id:string) {
    return this.authService.restore(id);
  }

  @Get()
  findAll(@Query() findAllDto: FindAllDto<User>) {
    return this.authService.findAll(findAllDto);
  }

  @Get('soft')
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<User>) {
    return this.authService.findAllSoftDeleted(findAllDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }

  @Delete('hard_delete/:id')
  hardDelete(@Param('id') id: string) {
    return this.authService.softDelete(id);
  }

  @Delete('soft_delete/:id')
  softDelete(@Param('id') id: string) {
    return this.authService.softDelete(id);
  }
}
