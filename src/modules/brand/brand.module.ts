import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { SupabaseModule } from '../../supabase/supabase.module';
import { ImageService } from '../../services/image/image.service';
import { BaseService } from '../../services/base/base.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand]),
    SupabaseModule
  ],
  controllers: [BrandController],
  providers: [BrandService, ImageService, BaseService],
  exports: [BrandService]
})
export class BrandModule {}
