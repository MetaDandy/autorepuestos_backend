import { Module } from '@nestjs/common';
import { SaleNoteService } from './sale_note.service';
import { SaleNoteController } from './sale_note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleNote } from './entities/sale_note.entity';
import { SaleDetail } from './entities/sale_detail.entity';
import { AuthModule } from '../../auth/auth.module';
import { DepositProductModule } from '../deposit_product/deposit_product.module';
import { MetricsCodeModule } from '../metrics_code/metrics_code.module';
import { BaseService } from '../../services/base/base.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SaleNote, SaleDetail]),
    AuthModule,
    DepositProductModule,
    MetricsCodeModule
  ],
  controllers: [SaleNoteController],
  providers: [SaleNoteService, BaseService],
})
export class SaleNoteModule {}
