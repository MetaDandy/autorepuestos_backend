import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';
import { BaseService } from '../../services/base/base.service';
import { ImageService } from '../../services/image/image.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { BrandModule } from '../brand/brand.module';

@Module({
  imports: [TypeOrmModule.forFeature([Model]), BrandModule],
  controllers: [ModelController],
  providers: [
    ModelService,
    BaseService,
    ImageService,
    SupabaseService,
  ],
  exports: [ModelService]
})
export class ModelModule { }
