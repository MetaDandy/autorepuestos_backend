import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompatibilityService } from './compatibility.service';
import { CreateCompatibilityDto } from './dto/create-compatibility.dto';
import { UpdateCompatibilityDto } from './dto/update-compatibility.dto';
import { Permissions } from '../../decorator/permission/permission.decorator';
import { PermissionEnum } from '../../enum/permission.enum';
import { Public } from '../../decorator/public/public.decorator';
import { FindAllDto } from '../../dto/findAll.dto';
import { Compatibility } from './entities/compatibility.entity';

@Controller('compatibility')
export class CompatibilityController {
  constructor(private readonly compatibilityService: CompatibilityService) {}

  @Post()
  @Permissions(PermissionEnum.COMPATIBILITY_CREATE)
  create(@Body() createCompatibilityDto: CreateCompatibilityDto) {
    return this.compatibilityService.create(createCompatibilityDto);
  }

  @Post('restore/:id')
  @Permissions(PermissionEnum.COMPATIBILITY_RESTORE)
  restore(@Param('id') id: string) {
    return this.compatibilityService.restore(id);
  }

  @Get()
  @Public()
  findAll(@Query() findAllDto: FindAllDto<Compatibility>) {
    return this.compatibilityService.findAll(findAllDto);
  }

  @Get('soft')
  @Permissions(PermissionEnum.COMPATIBILITY_READ)
  findAllSoftDelete(@Query() findAllDto: FindAllDto<Compatibility>) {
    return this.compatibilityService.findAllSoftDeleted(findAllDto);
  }

  @Get('product/:id')
  @Public()
  findAllProducts(@Param('id') id: string, @Query() findAllDto: FindAllDto<Compatibility>) {
    return this.compatibilityService.findAllProducts(id, findAllDto);
  }

  @Get('model/:id')
  @Public()
  findAllModels(@Param('id') id: string, @Query() findAllDto: FindAllDto<Compatibility>) {
    return this.compatibilityService.findAllModels(id, findAllDto);
  }

  @Get(':id')
  @Permissions(PermissionEnum.COMPATIBILITY_READ)
  findOne(@Param('id') id: string) {
    return this.compatibilityService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionEnum.COMPATIBILITY_UPDATE)
  update(@Param('id') id: string, @Body() updateCompatibilityDto: UpdateCompatibilityDto) {
    return this.compatibilityService.update(id, updateCompatibilityDto);
  }

  @Delete('hard_delete/:id')
  @Permissions(PermissionEnum.COMPATIBILITY_HARD_DELETE)
  hardDelete(@Param('id') id: string) {
    return this.compatibilityService.hardDelete(id);
  }

  @Delete('soft_delete/:id')
  @Permissions(PermissionEnum.COMPATIBILITY_SOFT_DELETE)
  softDelete(@Param('id') id: string) {
    return this.compatibilityService.softDelete(id);
  }
}
