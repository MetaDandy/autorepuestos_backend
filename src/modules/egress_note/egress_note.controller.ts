import { Controller, Get, Post, Body, Param, Req, Query } from '@nestjs/common';
import { EgressNoteService } from './egress_note.service';
import { CreateEgressNoteDto } from './dto/create-egress_note.dto';
import { FindAllDto } from '../../dto/findAll.dto';
import { EgressNote } from './entities/egress_note.entity';
import { Permissions } from '../../decorator/permission/permission.decorator';
import { PermissionEnum } from '../../enum/permission.enum';

@Controller('egress_note')
export class EgressNoteController {
  constructor(private readonly egressNoteService: EgressNoteService) {}

  @Post()
  @Permissions(PermissionEnum.EXPENSE_NOTE_CREATE)
  create(@Body() createEgressNoteDto: CreateEgressNoteDto, @Req() req) {
    return this.egressNoteService.create(createEgressNoteDto, req.user.userId);
  }
  
  @Get()
  findAll(@Query() findAllDto: FindAllDto<EgressNote>) {
    return this.egressNoteService.findAll(findAllDto);
  }
  
  @Get(':id')
  @Permissions(PermissionEnum.EXPENSE_NOTE_READ, PermissionEnum.EXPENSE_DETAIL_READ)
  findOne(@Param('id') id: string) {
    return this.egressNoteService.findOne(id);
  }
}
