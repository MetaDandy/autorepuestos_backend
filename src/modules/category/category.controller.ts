import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Permissions } from '../../decorator/permission/permission.decorator';
import { PermissionEnum } from '../../enum/permission.enum';
import { FindAllDto } from '../../dto/findAll.dto';
import { Category } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @Permissions(PermissionEnum.CATEGORY_CREATE)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Post('restore/:id')
  @Permissions(PermissionEnum.CATEGORY_RESTORE)
  restore(@Param('id') id: string) {
    return this.categoryService.restore(id);
  }

  @Get()
  @Permissions(PermissionEnum.CATEGORY_READ)
  findAll(@Query() findAllDto: FindAllDto<Category>) {
    return this.categoryService.findAll(findAllDto);
  }

  @Get('soft')
  @Permissions(PermissionEnum.CATEGORY_READ)
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<Category>) {
    return this.categoryService.findAllSoftDeleted(findAllDto);
  }

  @Get(':id')
  @Permissions(PermissionEnum.CATEGORY_READ)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete('hard_delete/:id')
  @Permissions(PermissionEnum.CATEGORY_HARD_DELETE)
  hardDelete(@Param('id') id: string) {
    return this.categoryService.hardDelete(id);
  }

  @Delete('soft_delete/:id')
  @Permissions(PermissionEnum.CATEGORY_SOFT_DELETE)
  softDelete(@Param('id') id: string) {
    return this.categoryService.softDelete(id);
  }
}
