import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MetricsCode } from "../modules/metrics_code/entities/metrics_code.entity";
import { Repository } from "typeorm";
import { MetricsCodeEnum } from "../enum/metrics_code.enum";

@Injectable()
export class MetricsCodeSeeder {
  constructor(
    @InjectRepository(MetricsCode)
    private readonly metricsCodeRepository: Repository<MetricsCode>,
  ) { }

  async syncMetricsCode() {
    const metricsData = [
      { document: MetricsCodeEnum.INCOME, prefix: 'NI', last_number: '0', zeros: 4 },
      { document: MetricsCodeEnum.EGRESS, prefix: 'NE', last_number: '0', zeros: 4 },
      { document: MetricsCodeEnum.SALE, prefix: 'NS', last_number: '0', zeros: 4 },
    ];

    for (const metric of metricsData) {
      const existingMetric = await this.metricsCodeRepository.findOne({
        where: { document: metric.document },
      });

      if (!existingMetric) {
        const newMetric = this.metricsCodeRepository.create(metric);
        await this.metricsCodeRepository.save(newMetric);
      }
    }

    console.log("Metrics Code synced successfully!");
  }
}