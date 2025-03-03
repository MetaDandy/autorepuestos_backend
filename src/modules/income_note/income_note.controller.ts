import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IncomeNoteService } from './income_note.service';
import { CreateIncomeNoteDto } from './dto/create-income_note.dto';
import { UpdateIncomeNoteDto } from './dto/update-income_note.dto';

@Controller('income-note')
export class IncomeNoteController {
  constructor(private readonly incomeNoteService: IncomeNoteService) {}

  @Post()
  create(@Body() createIncomeNoteDto: CreateIncomeNoteDto) {
    return this.incomeNoteService.create(createIncomeNoteDto);
  }

  @Get()
  findAll() {
    return this.incomeNoteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incomeNoteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncomeNoteDto: UpdateIncomeNoteDto) {
    return this.incomeNoteService.update(+id, updateIncomeNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incomeNoteService.remove(+id);
  }
}
