import { Module } from '@nestjs/common';
import { CategoryTypeService } from './category_type.service';
import { CategoryTypeController } from './category_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryType } from './entities/category_type.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryType, Category])],
  controllers: [CategoryTypeController],
  providers: [CategoryTypeService],
})
export class CategoryTypeModule {}
