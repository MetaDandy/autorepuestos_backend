import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductTypeService } from './product_type.service';
import { CreateProductTypeDto } from './dto/create-product_type.dto';
import { UpdateProductTypeDto } from './dto/update-product_type.dto';
import { Permissions } from '../../decorator/permission/permission.decorator';
import { PermissionEnum } from '../../enum/permission.enum';
import { FindAllDto } from 'src/dto/findAll.dto';
import { ProductType } from './entities/product_type.entity';
import { Public } from '../../decorator/public/public.decorator';

@Controller('product_type')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Post()
  @Permissions(PermissionEnum.PRODUCT_TYPE_CREATE)
  create(@Body() createProductTypeDto: CreateProductTypeDto) {
    return this.productTypeService.create(createProductTypeDto);
  }

  @Post('restore/:id')
  @Permissions(PermissionEnum.PRODUCT_TYPE_RESTORE)
  restore(@Param('id') id: string) {
    return this.productTypeService.restore(id);
  }

  @Get()
  @Public()
  findAll(@Query() findAllDto: FindAllDto<ProductType>) {
    return this.productTypeService.findAll(findAllDto);
  }

  @Get('soft')
  @Permissions(PermissionEnum.PRODUCT_TYPE_READ)
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<ProductType>) {
    return this.productTypeService.findAllSoftDeleted(findAllDto);
  }

  @Get(':id')
  @Permissions(PermissionEnum.PRODUCT_TYPE_READ)
  findOne(@Param('id') id: string) {
    return this.productTypeService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionEnum.PRODUCT_TYPE_UPDATE)
  update(@Param('id') id: string, @Body() updateProductTypeDto: UpdateProductTypeDto) {
    return this.productTypeService.update(id, updateProductTypeDto);
  }

  @Delete('hard_delete/:id')
  @Permissions(PermissionEnum.PRODUCT_TYPE_HARD_DELETE)
  hardDelete(@Param('id') id: string) {
    return this.productTypeService.hardDelete(id);
  }

  @Delete('soft_delete/:id')
  @Permissions(PermissionEnum.PRODUCT_TYPE_SOFT_DELETE)
  softDelete(@Param('id') id: string) {
    return this.productTypeService.softDelete(id);
  }
}
