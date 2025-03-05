import { Module } from '@nestjs/common';
import { IncomeNoteService } from './income_note.service';
import { IncomeNoteController } from './income_note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeNote } from './entities/income_note.entity';
import { IncomeDetail } from './entities/income_detail.entity';
import { DepositProductModule } from '../deposit_product/deposit_product.module';
import { AuthModule } from '../../auth/auth.module';
import { BaseService } from '../../services/base/base.service';
import { MetricsCodeModule } from '../metrics_code/metrics_code.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IncomeNote, IncomeDetail]),
    DepositProductModule,
    AuthModule,
    MetricsCodeModule
  ],
  controllers: [IncomeNoteController],
  providers: [IncomeNoteService, BaseService],
})
export class IncomeNoteModule {}
