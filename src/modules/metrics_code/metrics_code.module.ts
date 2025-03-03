import { Module } from '@nestjs/common';
import { MetricsCodeService } from './metrics_code.service';
import { MetricsCodeController } from './metrics_code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsCode } from './entities/metrics_code.entity';
import { BaseService } from '../../services/base/base.service';

@Module({
  imports: [TypeOrmModule.forFeature([MetricsCode])],
  controllers: [MetricsCodeController],
  providers: [MetricsCodeService, BaseService],
})
export class MetricsCodeModule {}
