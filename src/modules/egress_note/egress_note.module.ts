import { Module } from '@nestjs/common';
import { EgressNoteService } from './egress_note.service';
import { EgressNoteController } from './egress_note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EgressNote } from './entities/egress_note.entity';
import { EgressDetail } from './entities/egress_detail.entity';
import { DepositProductModule } from '../deposit_product/deposit_product.module';
import { AuthModule } from '../../auth/auth.module';
import { MetricsCodeModule } from '../metrics_code/metrics_code.module';
import { BaseService } from '../../services/base/base.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EgressNote, EgressDetail]),
    DepositProductModule,
    AuthModule,
    MetricsCodeModule
  ],
  controllers: [EgressNoteController],
  providers: [EgressNoteService, BaseService],
})
export class EgressNoteModule {}
