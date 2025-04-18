import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UploadedFiles } from '@nestjs/common';
import { MultipleImagesUploadInterceptor } from '../../decorator/multiple_images_upload_interceptor/multiple_images_upload_interceptor.decorator';
import { OneImageUploadInterceptor } from '../../decorator/one_image_upload_interceptor/one_image_upload_interceptor.decorator';
import { Permissions } from '../../decorator/permission/permission.decorator';
import { Public } from '../../decorator/public/public.decorator';
import { FindAllDto } from '../../dto/findAll.dto';
import { PermissionEnum } from '../../enum/permission.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Permissions(PermissionEnum.PRODUCT_CREATE)
  @OneImageUploadInterceptor('image')
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.productService.create(createProductDto, file);
  }

  @Post('restore/:id')
  @Permissions(PermissionEnum.PRODUCT_RESTORE)
  restore(@Param('id') id: string) {
    return this.productService.restore(id);
  }

  @Get()
  @Public()
  findAll(@Query() findAllDto: FindAllDto<Product>) {
    return this.productService.findAll(findAllDto);
  }

  @Get('soft')
  @Permissions(PermissionEnum.PRODUCT_READ)
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<Product>) {
    return this.productService.findAllSoftDeleted(findAllDto);
  }

  @Get('images/:id')
  @Public()
  getProductImages(@Param('id') id: string) {
    return this.productService.getProductImages(id);
  }

  @Get(':id')
  @Public()
  //@Permissions(PermissionEnum.PRODUCT_READ)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch('images/:id')
  @Permissions(PermissionEnum.PRODUCT_UPDATE)
  @MultipleImagesUploadInterceptor('images',4)
  addProductImages(@Param('id') id: string, @UploadedFiles() files?: Express.Multer.File[]) {
    return this.productService.addProductImages(id, files);
  }

  @Patch(':id')
  @Permissions(PermissionEnum.PRODUCT_UPDATE)
  @OneImageUploadInterceptor('image')
  update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.productService.update(id, updateProductDto, file);
  }

  @Delete(':id/image')
  @Permissions(PermissionEnum.PRODUCT_UPDATE)
  deleteImage(@Param('id') id: string) {
    return this.productService.deleteImage(id);
  }

  @Delete('images/:id')
  @Permissions(PermissionEnum.PRODUCT_UPDATE)
  deleteProductImage(@Param('id') id: string) {
    return this.productService.deleteProductImage(id);
  }

  @Delete('hard_delete/:id')
  @Permissions(PermissionEnum.PRODUCT_HARD_DELETE)
  hardDelete(@Param('id') id: string) {
    return this.productService.hardDelete(id);
  }

  @Delete('soft_delete/:id')
  @Permissions(PermissionEnum.PRODUCT_SOFT_DELETE)
  softDelete(@Param('id') id: string) {
    return this.productService.softDelete(id);
  }
}
