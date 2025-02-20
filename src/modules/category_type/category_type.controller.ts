import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryTypeService } from './category_type.service';
import { CreateCategoryTypeDto } from './dto/create-category_type.dto';
import { UpdateCategoryTypeDto } from './dto/update-category_type.dto';

@Controller('category-type')
export class CategoryTypeController {
  constructor(private readonly categoryTypeService: CategoryTypeService) {}

  @Post()
  create(@Body() createCategoryTypeDto: CreateCategoryTypeDto) {
    return this.categoryTypeService.create(createCategoryTypeDto);
  }

  @Get()
  findAll() {
    return this.categoryTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryTypeDto: UpdateCategoryTypeDto) {
    return this.categoryTypeService.update(+id, updateCategoryTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryTypeService.remove(+id);
  }
}
