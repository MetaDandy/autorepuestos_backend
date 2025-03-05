import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoryTypeService } from './category_type.service';
import { CreateCategoryTypeDto } from './dto/create-category_type.dto';
import { UpdateCategoryTypeDto } from './dto/update-category_type.dto';
import { Permissions } from '../../decorator/permission/permission.decorator';
import { PermissionEnum } from '../../enum/permission.enum';
import { Public } from '../../decorator/public/public.decorator';
import { FindAllDto } from '../../dto/findAll.dto';
import { CategoryType } from './entities/category_type.entity';

@Controller('category_type')
export class CategoryTypeController {
  constructor(private readonly categoryTypeService: CategoryTypeService) { }

  @Post()
  @Permissions(PermissionEnum.CATEGORY_TYPE_CREATE)
  create(@Body() createCategoryTypeDto: CreateCategoryTypeDto) {
    return this.categoryTypeService.create(createCategoryTypeDto);
  }

  @Post('restore/:id')
  @Permissions(PermissionEnum.CATEGORY_TYPE_RESTORE)
  restore(@Param('id') id: string) {
    return this.categoryTypeService.restore(id);
  }

  @Get()
  @Public()
  findAll(@Query() findAllDto: FindAllDto<CategoryType>) {
    return this.categoryTypeService.findAll(findAllDto);
  }

  @Get('soft')
  @Permissions(PermissionEnum.CATEGORY_TYPE_READ)
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<CategoryType>) {
    return this.categoryTypeService.findAllSoftDeleted(findAllDto);
  }

  @Get(':id')
  @Permissions(PermissionEnum.CATEGORY_TYPE_READ)
  findOne(@Param('id') id: string) {
    return this.categoryTypeService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionEnum.CATEGORY_TYPE_UPDATE)
  update(@Param('id') id: string, @Body() updateCategoryTypeDto: UpdateCategoryTypeDto) {
    return this.categoryTypeService.update(id, updateCategoryTypeDto);
  }

  @Delete('hard_delete/:id')
  @Permissions(PermissionEnum.CATEGORY_TYPE_HARD_DELETE)
  hardDelete(@Param('id') id: string) {
    return this.categoryTypeService.hardDelete(id);
  }

  @Delete('soft_delete/:id')
  @Permissions(PermissionEnum.CATEGORY_TYPE_SOFT_DELETE)
  softDelete(@Param('id') id: string) {
    return this.categoryTypeService.softDelete(id);
  }
}
