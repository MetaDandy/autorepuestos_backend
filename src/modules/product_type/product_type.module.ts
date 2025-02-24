import { Module } from '@nestjs/common';
import { ProductTypeService } from './product_type.service';
import { ProductTypeController } from './product_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductType } from './entities/product_type.entity';
import { CategoryType } from '../category_type/entities/category_type.entity';
import { CategoryTypeModule } from '../category_type/category_type.module';
import { BaseService } from '../../services/base/base.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductType, CategoryType]),
    CategoryTypeModule
  ],
  controllers: [ProductTypeController],
  providers: [ProductTypeService, BaseService],
})
export class ProductTypeModule {}
