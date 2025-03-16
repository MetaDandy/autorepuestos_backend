import { Module } from '@nestjs/common';
import { DepositProductService } from './deposit_product.service';
import { DepositProductController } from './deposit_product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositProduct } from './entities/deposit_product.entity';
import { ProductModule } from '../product/product.module';
import { DepositModule } from '../deposit/deposit.module';
import { BaseService } from '../../services/base/base.service';
import { CharacteristicsModule } from '../characteristics/characteristics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DepositProduct]),
    ProductModule,
    DepositModule,
    CharacteristicsModule
  ],
  controllers: [DepositProductController],
  providers: [DepositProductService, BaseService],
  exports: [DepositProductService]
})
export class DepositProductModule {}
