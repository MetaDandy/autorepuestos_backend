import { Injectable } from '@nestjs/common';
import { CreateCompatibilityDto } from './dto/create-compatibility.dto';
import { UpdateCompatibilityDto } from './dto/update-compatibility.dto';

@Injectable()
export class CompatibilityService {
  create(createCompatibilityDto: CreateCompatibilityDto) {
    return 'This action adds a new compatibility';
  }

  findAll() {
    return `This action returns all compatibility`;
  }

  findOne(id: number) {
    return `This action returns a #${id} compatibility`;
  }

  update(id: number, updateCompatibilityDto: UpdateCompatibilityDto) {
    return `This action updates a #${id} compatibility`;
  }

  remove(id: number) {
    return `This action removes a #${id} compatibility`;
  }
}
