import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product_image.entity';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { ImageService } from '../../services/image/image.service';
import { BaseService } from '../../services/base/base.service';
import { ProductTypeModule } from '../product_type/product_type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    SupabaseModule,
    ProductTypeModule
  ],
  controllers: [ProductController],
  providers: [ProductService, ImageService, BaseService],
})
export class ProductModule {}
