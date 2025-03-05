import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Permission } from '../role/entities/permission.entity';
import { Role } from '../role/entities/role.entity';
import { PermissionSeeder } from './permission.seed';
import { RoleSeeder } from './role.seed';
import { UserSeeder } from './user.seed';
import { MainSeeder } from './main.seed';
import { SupabaseModule } from '../supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import dbConfig from '../config/db.config';
import { MetricsCode } from '../modules/metrics_code/entities/metrics_code.entity';
import { MetricsCodeSeeder } from './metrics_code.seed';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfig]
    }),
    TypeOrmModule.forRootAsync({
      useFactory: dbConfig
    }),
    TypeOrmModule.forFeature([
      Permission, 
      Role, 
      User,
      MetricsCode
    ]),
    SupabaseModule
  ],
  providers: [
    PermissionSeeder, 
    RoleSeeder, 
    UserSeeder, 
    MetricsCodeSeeder,
    MainSeeder,
  ],
  exports: [MainSeeder]
})
export class SeedModule { }
