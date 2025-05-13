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
import { ProductModule } from './modules/product/product.module';
import { CompatibilityModule } from './modules/compatibility/compatibility.module';
import { DepositModule } from './modules/deposit/deposit.module';
import { DepositProductModule } from './modules/deposit_product/deposit_product.module';
import { IncomeNoteModule } from './modules/income_note/income_note.module';
import { MetricsCodeModule } from './modules/metrics_code/metrics_code.module';
import { EgressNoteModule } from './modules/egress_note/egress_note.module';
import { SaleNoteModule } from './modules/sale_note/sale_note.module';
import { CharacteristicsModule } from './modules/characteristics/characteristics.module';
import { AuditModule } from './modules/audit/audit.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './modules/audit/audit.interceptor';

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
    ProductModule,
    CompatibilityModule,
    DepositModule,
    DepositProductModule,
    IncomeNoteModule,
    MetricsCodeModule,
    EgressNoteModule,
    SaleNoteModule,
    CharacteristicsModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    ImageService,
    BaseService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule { }
