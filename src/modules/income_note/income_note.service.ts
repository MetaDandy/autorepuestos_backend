import { Injectable } from '@nestjs/common';
import { CreateIncomeNoteDto } from './dto/create-income_note.dto';
import { UpdateIncomeNoteDto } from './dto/update-income_note.dto';

@Injectable()
export class IncomeNoteService {

  // TODO: ver el tema de hacer una tabla para los codigos y el tema de metricas por ventas
  create(createIncomeNoteDto: CreateIncomeNoteDto) {
    return 'This action adds a new incomeNote';
  }

  findAll() {
    return `This action returns all incomeNote`;
  }

  findOne(id: number) {
    return `This action returns a #${id} incomeNote`;
  }

  update(id: number, updateIncomeNoteDto: UpdateIncomeNoteDto) {
    return `This action updates a #${id} incomeNote`;
  }

  remove(id: number) {
    return `This action removes a #${id} incomeNote`;
  }
}
