import { Controller, Get, Post, Body, Param, Req, Query } from '@nestjs/common';
import { IncomeNoteService } from './income_note.service';
import { CreateIncomeNoteDto } from './dto/create-income_note.dto';
import { FindAllDto } from '../../dto/findAll.dto';
import { IncomeNote } from './entities/income_note.entity';

@Controller('income_note')
export class IncomeNoteController {
  constructor(private readonly incomeNoteService: IncomeNoteService) { }

  @Post()
  create(@Body() createIncomeNoteDto: CreateIncomeNoteDto, @Req() req) {
    return this.incomeNoteService.create(createIncomeNoteDto, req.user.userID);
  }

  @Get()
  findAll(@Query() findAllDto: FindAllDto<IncomeNote>) {
    return this.incomeNoteService.findAll(findAllDto);
  }

  @Get('test')
  test(@Req() req) {
    return req.user.userID
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incomeNoteService.findOne(id);
  }
}
