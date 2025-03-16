import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CharacteristicsService } from './characteristics.service';
import { CreateCharacteristicDto } from './dto/create-characteristic.dto';
import { UpdateCharacteristicDto } from './dto/update-characteristic.dto';
import { Permissions } from '../../decorator/permission/permission.decorator';
import { PermissionEnum } from '../../enum/permission.enum';
import { Public } from '../../decorator/public/public.decorator';
import { FindAllDto } from 'src/dto/findAll.dto';
import { Characteristic } from './entities/characteristic.entity';

@Controller('characteristics')
export class CharacteristicsController {
  constructor(private readonly characteristicsService: CharacteristicsService) { }

  @Post()
  @Permissions(PermissionEnum.CHARACTERISTICS_CREATE)
  create(@Body() createCharacteristicDto: CreateCharacteristicDto) {
    return this.characteristicsService.create(createCharacteristicDto);
  }

  @Post('restore/:id')
  @Permissions(PermissionEnum.CHARACTERISTICS_RESTORE)
  restore(@Param('id') id: string) {
    return this.characteristicsService.restore(id);
  }

  @Get()
  @Public()
  findAll(@Query() findAllDto: FindAllDto<Characteristic>) {
    return this.characteristicsService.findAll(findAllDto);
  }

  @Get('soft')
  @Permissions(PermissionEnum.CHARACTERISTICS_READ)
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<Characteristic>) {
    return this.characteristicsService.findAllSoftDeleted(findAllDto);
  }

  @Get(':id')
  @Permissions(PermissionEnum.CHARACTERISTICS_READ)
  findOne(@Param('id') id: string) {
    return this.characteristicsService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionEnum.CHARACTERISTICS_UPDATE)
  update(@Param('id') id: string, @Body() updateCharacteristicDto: UpdateCharacteristicDto) {
    return this.characteristicsService.update(id, updateCharacteristicDto);
  }

  @Delete('hard_delete/:id')
  @Permissions(PermissionEnum.CHARACTERISTICS_HARD_DELETE)
  hardDelete(@Param('id') id: string) {
    return this.characteristicsService.hardDelete(id);
  }

  @Delete('soft_delete/:id')
  @Permissions(PermissionEnum.CHARACTERISTICS_SOFT_DELETE)
  softDelete(@Param('id') id: string) {
    return this.characteristicsService.softDelete(id);
  }
}
