import { Controller, Get, Query, Param } from '@nestjs/common';
import { AuditService } from './audit.service';
import { FindAllDto } from 'src/dto/findAll.dto';
import { Audit } from './entities/audit.entity';
import { Public } from 'src/decorator/public/public.decorator';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Public()
  findAll(@Query() findAllDto: FindAllDto<Audit>) {
    return this.auditService.findAll(findAllDto);
  }

  @Get(':id')
  @Public()
  findAllUsers(@Param('id') id: string, @Query() findAllDto: FindAllDto<Audit>) {
    return this.auditService.findAllUsers(id, findAllDto);
  }
}
