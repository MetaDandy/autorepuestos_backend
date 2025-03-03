import { PartialType } from '@nestjs/mapped-types';
import { CreateIncomeNoteDto } from './create-income_note.dto';

export class UpdateIncomeNoteDto extends PartialType(CreateIncomeNoteDto) {}
