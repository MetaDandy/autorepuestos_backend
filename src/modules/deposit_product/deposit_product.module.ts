import { Module } from '@nestjs/common';
import { DepositProductService } from './deposit_product.service';
import { DepositProductController } from './deposit_product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositProduct } from './entities/deposit_product.entity';
import { ProductModule } from '../product/product.module';
import { DepositModule } from '../deposit/deposit.module';
import { BaseService } from 'src/services/base/base.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DepositProduct]),
    ProductModule,
    DepositModule
  ],
  controllers: [DepositProductController],
  providers: [DepositProductService, BaseService],
})
export class DepositProductModule {}
