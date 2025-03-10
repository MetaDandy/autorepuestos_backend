import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MetricsCodeService } from './metrics_code.service';
import { CreateMetricsCodeDto } from './dto/create-metrics_code.dto';
import { UpdateMetricsCodeDto } from './dto/update-metrics_code.dto';
import { FindAllDto } from '../../dto/findAll.dto';
import { MetricsCode } from './entities/metrics_code.entity';
import { Permissions } from '../../decorator/permission/permission.decorator';
import { PermissionEnum } from '../../enum/permission.enum';

@Controller('metrics_code')
export class MetricsCodeController {
  constructor(private readonly metricsCodeService: MetricsCodeService) { }

  @Post()
  @Permissions(PermissionEnum.METRICS_CREATE)
  create(@Body() createMetricsCodeDto: CreateMetricsCodeDto) {
    return this.metricsCodeService.create(createMetricsCodeDto);
  }

  @Post('restore/:id')
  @Permissions(PermissionEnum.METRICS_RESTORE)
  restore(@Param('id') id: string) {
    return this.metricsCodeService.restore(id);
  }

  @Get()
  @Permissions(PermissionEnum.METRICS_READ)
  findAll(@Query() findAllDto: FindAllDto<MetricsCode>) {
    return this.metricsCodeService.findAll(findAllDto);
  }

  @Get('soft')
  @Permissions(PermissionEnum.METRICS_READ)
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<MetricsCode>) {
    return this.metricsCodeService.findAllSoftDeleted(findAllDto);
  }

  @Get(':id')
  @Permissions(PermissionEnum.METRICS_READ)
  findOne(@Param('id') id: string) {
    return this.metricsCodeService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionEnum.METRICS_UPDATE)
  update(@Param('id') id: string, @Body() updateMetricsCodeDto: UpdateMetricsCodeDto) {
    return this.metricsCodeService.update(id, updateMetricsCodeDto);
  }

  @Delete('soft_delete/:id')
  @Permissions(PermissionEnum.METRICS_SOFT_DELETE)
  softDelete(@Param('id') id: string) {
    return this.metricsCodeService.softDelete(id);
  }
}
