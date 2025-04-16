import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Public } from 'src/decorator/public/public.decorator';
import { Permissions } from '../../decorator/permission/permission.decorator';
import { FindAllDto } from '../../dto/findAll.dto';
import { PermissionEnum } from '../../enum/permission.enum';
import { DepositProductService } from './deposit_product.service';
import { CreateDepositProductDto } from './dto/create-deposit_product.dto';
import { UpdatePriceDepositProductDto } from './dto/update-price_deposit_product';
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

  @Get('code/:product/:characteristic')
  @Public()
  findAllWithCodes(
    @Param('product') product_code: string,
    @Param('characteristic') characteristic_code: string
  ) {
    return this.depositProductService.findAllWithCodes(product_code, characteristic_code)
  }

  @Get(':id')
  @Permissions(PermissionEnum.PRODUCT_WAREHOUSE_READ)
  findOne(@Param('id') id: string) {
    return this.depositProductService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionEnum.PRODUCT_WAREHOUSE_RESTORE)
  updatePrice(@Param('id') id: string, @Body() updatePriceDepositProductDto: UpdatePriceDepositProductDto) {
    return this.depositProductService.updatePrice(id, updatePriceDepositProductDto);
  }

  @Patch('bulk/update-price')
  @Permissions(PermissionEnum.PRODUCT_WAREHOUSE_RESTORE)
  async updatePricesBulk(
    @Body() updatePricesDto: { ids: string[]; price: string },
  ) {
    return this.depositProductService.updatePricesBulk(updatePricesDto.ids, updatePricesDto.price);
  }

  @Delete('soft_delete/:id')
  @Permissions(PermissionEnum.PRODUCT_WAREHOUSE_SOFT_DELETE)
  softDelete(@Param('id') id: string) {
    return this.depositProductService.softDelete(id);
  }
}
