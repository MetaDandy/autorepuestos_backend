import { Controller, Get, Post, Body, Param, Req, Query } from '@nestjs/common';
import { IncomeNoteService } from './income_note.service';
import { CreateIncomeNoteDto } from './dto/create-income_note.dto';
import { FindAllDto } from '../../dto/findAll.dto';
import { IncomeNote } from './entities/income_note.entity';
import { Permissions } from '../../decorator/permission/permission.decorator';
import { PermissionEnum } from '../../enum/permission.enum';

@Controller('income_note')
export class IncomeNoteController {
  constructor(private readonly incomeNoteService: IncomeNoteService) { }

  @Post()
  @Permissions(PermissionEnum.INCOME_NOTE_CREATE)
  create(@Body() createIncomeNoteDto: CreateIncomeNoteDto, @Req() req) {
    return this.incomeNoteService.create(createIncomeNoteDto, req.user.userID);
  }

  @Get()
  findAll(@Query() findAllDto: FindAllDto<IncomeNote>) {
    return this.incomeNoteService.findAll(findAllDto);
  }
  
  @Get(':id')
  @Permissions(PermissionEnum.INCOME_NOTE_READ, PermissionEnum.INCOME_DETAIL_READ)
  findOne(@Param('id') id: string) {
    return this.incomeNoteService.findOne(id);
  }
}
