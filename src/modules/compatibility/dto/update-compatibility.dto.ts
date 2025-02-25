import { PartialType } from '@nestjs/mapped-types';
import { CreateCompatibilityDto } from './create-compatibility.dto';

export class UpdateCompatibilityDto extends PartialType(CreateCompatibilityDto) {}
