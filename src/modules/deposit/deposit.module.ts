import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deposit } from './entities/deposit.entity';
import { BaseService } from '../../services/base/base.service';

@Module({
  imports: [TypeOrmModule.forFeature([Deposit])],
  controllers: [DepositController],
  providers: [DepositService, BaseService],
  exports: [DepositService]
})
export class DepositModule {}
