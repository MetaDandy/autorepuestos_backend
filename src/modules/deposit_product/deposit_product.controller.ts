import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { DepositProductService } from './deposit_product.service';
import { CreateDepositProductDto } from './dto/create-deposit_product.dto';
import { Permissions } from '../../decorator/permission/permission.decorator';
import { PermissionEnum } from '../../enum/permission.enum';
import { FindAllDto } from '../../dto/findAll.dto';
import { DepositProduct } from './entities/deposit_product.entity';

@Controller('deposit_product')
export class DepositProductController {
  constructor(private readonly depositProductService: DepositProductService) { }

  @Post()
  @Permissions(PermissionEnum.PRODUCT_WAREHOUSE_CREATE)
  create(@Body() createDepositProductDto: CreateDepositProductDto) {
    return this.depositProductService.create(createDepositProductDto);
  }

  @Post('restore/:id')
  @Permissions(PermissionEnum.PRODUCT_WAREHOUSE_RESTORE)
  restore(@Param('id') id: string) {
    return this.depositProductService.restore(id);
  }

  @Get()
  @Permissions(PermissionEnum.PRODUCT_WAREHOUSE_READ)
  findAll(@Query() findAllDto: FindAllDto<DepositProduct>) {
    return this.depositProductService.findAll(findAllDto);
  }

  @Get('soft')
  @Permissions(PermissionEnum.PRODUCT_WAREHOUSE_READ)
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<DepositProduct>) {
    return this.depositProductService.findAllSoftDeleted(findAllDto);
  }

  @Get('product/:id')
  @Permissions(PermissionEnum.PRODUCT_WAREHOUSE_READ)
  findAllProducts(@Param('id') id: string, @Query() findAllDto: FindAllDto<DepositProduct>) {
    return this.depositProductService.findAllProducts(id, findAllDto);
  }

  @Get('deposit/:id')
  @Permissions(PermissionEnum.PRODUCT_WAREHOUSE_READ)
  findAllModels(@Param('id') id: string, @Query() findAllDto: FindAllDto<DepositProduct>) {
    return this.depositProductService.findAllDeposits(id, findAllDto);
  }

  @Get(':id')
  @Permissions(PermissionEnum.PRODUCT_WAREHOUSE_READ)
  findOne(@Param('id') id: string) {
    return this.depositProductService.findOne(id);
  }

  @Delete('soft_delete/:id')
  @Permissions(PermissionEnum.PRODUCT_WAREHOUSE_SOFT_DELETE)
  softDelete(@Param('id') id: string) {
    return this.depositProductService.softDelete(id);
  }
}
