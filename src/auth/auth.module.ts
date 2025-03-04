import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { SupabaseService } from '../supabase/supabase.service';
import { BaseService } from '../services/base/base.service';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    TypeOrmModule.forFeature([User,Role])
  ],
  controllers: [AuthController],
  providers: [AuthService, SupabaseService, BaseService],
  exports: [AuthService]
})
export class AuthModule { }
