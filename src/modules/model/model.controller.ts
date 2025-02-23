import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, Query } from '@nestjs/common';
import { ModelService } from './model.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { Permissions } from 'src/decorator/permission/permission.decorator';
import { PermissionEnum } from '../../enum/permission.enum';
import { OneImageUploadInterceptor } from '../../decorator/one_image_upload_interceptor/one_image_upload_interceptor.decorator';
import { FindAllDto } from 'src/dto/findAll.dto';
import { Model } from './entities/model.entity';
import { Public } from '../../decorator/public/public.decorator';

@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) { }

  @Post()
  @Permissions(PermissionEnum.MODEL_CREATE)
  @OneImageUploadInterceptor('image')
  create(
    @Body() createModelDto: CreateModelDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.modelService.create(createModelDto, file);
  }

  @Post('restore/:id')
  @Permissions(PermissionEnum.MODEL_RESTORE)
  restore(@Param('id') id: string) {
    return this.modelService.restore(id);
  }

  @Get()
  @Public()
  findAll(@Query() findAllDto: FindAllDto<Model>) {
    return this.modelService.findAll(findAllDto);
  }

  @Get('soft')
  @Permissions(PermissionEnum.MODEL_READ)
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<Model>) {
    return this.modelService.findAllSoftDeleted(findAllDto);
  }

  @Get(':id')
  @Permissions(PermissionEnum.MODEL_READ)
  findOne(@Param('id') id: string) {
    return this.modelService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionEnum.MODEL_UPDATE)
  @OneImageUploadInterceptor('image')
  update(
    @Param('id') id: string, 
    @Body() updateModelDto: UpdateModelDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.modelService.update(id, updateModelDto, file);
  }

  @Delete(':id/image')
  @Permissions(PermissionEnum.MODEL_UPDATE)
  deleteImage(@Param('id') id: string) {
    return this.modelService.deleteImage(id);
  }

  @Delete('hard_delete/:id')
  @Permissions(PermissionEnum.MODEL_HARD_DELETE)
  hardDelete(@Param('id') id: string) {
    return this.modelService.hardDelete(id);
  }

  @Delete('soft_delete/:id')
  @Permissions(PermissionEnum.MODEL_SOFT_DELETE)
  softDelete(@Param('id') id: string) {
    return this.modelService.softDelete(id);
  }
}
