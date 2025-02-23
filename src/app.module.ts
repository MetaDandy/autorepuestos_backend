import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './config/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { SeedModule } from './seed/seed.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/strategies/jwt.stategy';
import { User } from './auth/entities/user.entity';
import { CategoryModule } from './modules/category/category.module';
import { CategoryTypeModule } from './modules/category_type/category_type.module';
import { BrandModule } from './modules/brand/brand.module';
import { ProductTypeModule } from './modules/product_type/product_type.module';
import { ModelModule } from './modules/model/model.module';
import { ImageService } from './services/image/image.service';
import { BaseService } from './services/base/base.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      expandVariables: true,
      load: [dbConfig]
    }),
    TypeOrmModule.forRootAsync({
      useFactory: dbConfig
    }),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SupabaseModule,
    AuthModule,
    RoleModule,
    SeedModule,
    CategoryModule,
    CategoryTypeModule,
    BrandModule,
    ProductTypeModule,
    ModelModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, ImageService, BaseService],
})
export class AppModule {}
