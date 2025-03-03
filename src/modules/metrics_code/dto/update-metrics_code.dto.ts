import { PartialType } from '@nestjs/mapped-types';
import { CreateMetricsCodeDto } from './create-metrics_code.dto';

export class UpdateMetricsCodeDto extends PartialType(CreateMetricsCodeDto) {}
