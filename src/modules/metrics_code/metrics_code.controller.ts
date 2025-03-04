import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MetricsCodeService } from './metrics_code.service';
import { CreateMetricsCodeDto } from './dto/create-metrics_code.dto';
import { UpdateMetricsCodeDto } from './dto/update-metrics_code.dto';
import { FindAllDto } from '../../dto/findAll.dto';
import { MetricsCode } from './entities/metrics_code.entity';

@Controller('metrics_code')
export class MetricsCodeController {
  constructor(private readonly metricsCodeService: MetricsCodeService) { }

  //TODO: agregar nuevos permisos y rehacer el rol del admin
  // borrar get code

  @Post()
  create(@Body() createMetricsCodeDto: CreateMetricsCodeDto) {
    return this.metricsCodeService.create(createMetricsCodeDto);
  }

  @Post('restore/:id')
  restore(@Param('id') id: string) {
    return this.metricsCodeService.restore(id);
  }

  @Get()
  findAll(@Query() findAllDto: FindAllDto<MetricsCode>) {
    return this.metricsCodeService.findAll(findAllDto);
  }

  @Get('soft')
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<MetricsCode>) {
    return this.metricsCodeService.findAllSoftDeleted(findAllDto);
  }

  @Get('code/:document')
  getCode(@Param('document') document: string) {
    return this.metricsCodeService.addMetric(document)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metricsCodeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetricsCodeDto: UpdateMetricsCodeDto) {
    return this.metricsCodeService.update(id, updateMetricsCodeDto);
  }

  @Delete('soft_delete/:id')
  softDelete(@Param('id') id: string) {
    return this.metricsCodeService.softDelete(id);
  }
}
