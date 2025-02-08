import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './config/db.config';
import dbConfigProduction from './config/db.config.production';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      expandVariables: true,
      load: [dbConfig,dbConfigProduction]
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV === 'production'
        ? dbConfigProduction
        : dbConfig,
    }),
    SupabaseModule,
    AuthModule,
    RoleModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
