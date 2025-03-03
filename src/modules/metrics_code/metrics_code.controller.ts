import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MetricsCodeService } from './metrics_code.service';
import { CreateMetricsCodeDto } from './dto/create-metrics_code.dto';
import { UpdateMetricsCodeDto } from './dto/update-metrics_code.dto';
import { Public } from '../../decorator/public/public.decorator';
import { FindAllDto } from '../../dto/findAll.dto';
import { MetricsCode } from './entities/metrics_code.entity';

@Controller('metrics_code')
export class MetricsCodeController {
  constructor(private readonly metricsCodeService: MetricsCodeService) { }

  //TODO: agregar nuevos permisos y rehacer el rol del admin
  // borrar get code

  @Post()
  @Public()
  create(@Body() createMetricsCodeDto: CreateMetricsCodeDto) {
    return this.metricsCodeService.create(createMetricsCodeDto);
  }

  @Post('restore/:id')
  @Public()
  restore(@Param('id') id: string) {
    return this.metricsCodeService.restore(id);
  }

  @Get()
  @Public()
  findAll(@Query() findAllDto: FindAllDto<MetricsCode>) {
    return this.metricsCodeService.findAll(findAllDto);
  }

  @Get('soft')
  @Public()
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<MetricsCode>) {
    return this.metricsCodeService.findAllSoftDeleted(findAllDto);
  }

  @Get('code/:document')
  @Public()
  getCode(@Param('document') document: string) {
    return this.metricsCodeService.addMetric(document)
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.metricsCodeService.findOne(id);
  }

  @Patch(':id')
  @Public()
  update(@Param('id') id: string, @Body() updateMetricsCodeDto: UpdateMetricsCodeDto) {
    return this.metricsCodeService.update(id, updateMetricsCodeDto);
  }

  @Delete('soft_delete/:id')
  @Public()
  softDelete(@Param('id') id: string) {
    return this.metricsCodeService.softDelete(id);
  }
}
