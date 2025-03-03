import { Module } from '@nestjs/common';
import { IncomeNoteService } from './income_note.service';
import { IncomeNoteController } from './income_note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeNote } from './entities/income_note.entity';
import { IncomeDetail } from './entities/income_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IncomeNote, IncomeDetail])],
  controllers: [IncomeNoteController],
  providers: [IncomeNoteService],
})
export class IncomeNoteModule {}
