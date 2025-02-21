import { Module } from '@nestjs/common';
import { CategoryTypeService } from './category_type.service';
import { CategoryTypeController } from './category_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryType } from './entities/category_type.entity';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryType]),
    CategoryModule
  ],
  controllers: [CategoryTypeController],
  providers: [CategoryTypeService],
})
export class CategoryTypeModule {}
