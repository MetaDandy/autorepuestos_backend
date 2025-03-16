import { Module } from '@nestjs/common';
import { CharacteristicsService } from './characteristics.service';
import { CharacteristicsController } from './characteristics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Characteristic } from './entities/characteristic.entity';
import { BaseService } from '../../services/base/base.service';

@Module({
  imports: [TypeOrmModule.forFeature([Characteristic])],
  controllers: [CharacteristicsController],
  providers: [CharacteristicsService, BaseService],
  exports: [CharacteristicsService]
})
export class CharacteristicsModule {}
