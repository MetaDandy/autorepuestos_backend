import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Permissions } from '../../decorator/permission/permission.decorator';
import { PermissionEnum } from 'src/enum/permission.enum';
import { Public } from 'src/decorator/public/public.decorator';
import { FindAllDto } from 'src/dto/findAll.dto';
import { Brand } from './entities/brand.entity';
import { OneFileUploadInterceptor } from 'src/decorator/one_file_upload_interceptor/one_file_upload_interceptor.decorator';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @Post()
  @Permissions(PermissionEnum.BRAND_CREATE)
  @OneFileUploadInterceptor('logo')
  create(
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    console.log(file);
    return this.brandService.create(createBrandDto, file);
  }

  @Post('restore/:id')
  @Permissions(PermissionEnum.BRAND_RESTORE)
  restore(@Param('id') id: string) {
    return this.brandService.restore(id);
  }

  @Get()
  @Public()
  findAll(@Query() findAllDto: FindAllDto<Brand>) {
    return this.brandService.findAll(findAllDto);
  }

  @Get('soft')
  @Permissions(PermissionEnum.BRAND_READ)
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<Brand>) {
    return this.brandService.findAllSoftDeleted(findAllDto);
  }

  @Get(':id')
  @Permissions(PermissionEnum.BRAND_READ)
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionEnum.BRAND_UPDATE)
  @OneFileUploadInterceptor('logo')
  update(
    @Param('id') id: string, 
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    console.log(updateBrandDto.logo)
    console.log(file)
    return this.brandService.update(id, updateBrandDto, file);
  }
  
  @Delete(':id/image')
  @Permissions(PermissionEnum.BRAND_UPDATE)
  deleteImage(@Param('id') id: string) {
    return this.brandService.deleteImage(id);
  }

  @Delete('hard_delete/:id')
  @Permissions(PermissionEnum.BRAND_HARD_DELETE)
  hardDelete(@Param('id') id: string) {
    return this.brandService.hardDelete(id);
  }

  @Delete('soft_delete/:id')
  @Permissions(PermissionEnum.BRAND_SOFT_DELETE)
  softDelete(@Param('id') id: string) {
    return this.brandService.softDelete(id);
  }
}
