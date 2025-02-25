import { Module } from '@nestjs/common';
import { CompatibilityService } from './compatibility.service';
import { CompatibilityController } from './compatibility.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compatibility } from './entities/compatibility.entity';
import { ProductModule } from '../product/product.module';
import { ModelModule } from '../model/model.module';
import { BaseService } from '../../services/base/base.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Compatibility]),
    ProductModule,
    ModelModule,
  ],
  controllers: [CompatibilityController],
  providers: [
    CompatibilityService,
    BaseService
  ],
})
export class CompatibilityModule {}
