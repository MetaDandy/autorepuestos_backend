import { Controller, Get, Post, Body, Param, Req, Query } from '@nestjs/common';
import { SaleNoteService } from './sale_note.service';
import { CreateSaleNoteDto } from './dto/create-sale_note.dto';
import { Permissions } from '../../decorator/permission/permission.decorator';
import { PermissionEnum } from '../../enum/permission.enum';
import { FindAllDto } from 'src/dto/findAll.dto';
import { SaleNote } from './entities/sale_note.entity';

@Controller('sale_note')
export class SaleNoteController {
  constructor(private readonly saleNoteService: SaleNoteService) {}

  @Post()
  @Permissions(PermissionEnum.SALE_NOTE_CREATE)
  create(@Body() createSaleNoteDto: CreateSaleNoteDto, @Req() req) {
    return this.saleNoteService.create(createSaleNoteDto, req.user.userId);
  }

  @Get()
  findAll(@Query() findAllDto: FindAllDto<SaleNote>) {
    return this.saleNoteService.findAll(findAllDto);
  }

  @Get(':id')
  @Permissions(PermissionEnum.SALE_NOTE_READ, PermissionEnum.SALE_DETAIL_READ)
  findOne(@Param('id') id: string) {
    return this.saleNoteService.findOne(id);
  }
}
