import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompatibilityService } from './compatibility.service';
import { CreateCompatibilityDto } from './dto/create-compatibility.dto';
import { UpdateCompatibilityDto } from './dto/update-compatibility.dto';

@Controller('compatibility')
export class CompatibilityController {
  constructor(private readonly compatibilityService: CompatibilityService) {}

  @Post()
  create(@Body() createCompatibilityDto: CreateCompatibilityDto) {
    return this.compatibilityService.create(createCompatibilityDto);
  }

  @Get()
  findAll() {
    return this.compatibilityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.compatibilityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompatibilityDto: UpdateCompatibilityDto) {
    return this.compatibilityService.update(+id, updateCompatibilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.compatibilityService.remove(+id);
  }
}
