import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand]),
    SupabaseModule
  ],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
