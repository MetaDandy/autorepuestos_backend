import { Injectable } from '@nestjs/common';
import { CreateCategoryTypeDto } from './dto/create-category_type.dto';
import { UpdateCategoryTypeDto } from './dto/update-category_type.dto';

@Injectable()
export class CategoryTypeService {
  create(createCategoryTypeDto: CreateCategoryTypeDto) {
    return 'This action adds a new categoryType';
  }

  findAll() {
    return `This action returns all categoryType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoryType`;
  }

  update(id: number, updateCategoryTypeDto: UpdateCategoryTypeDto) {
    return `This action updates a #${id} categoryType`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoryType`;
  }
}
