import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { Permissions } from '../../decorator/permission/permission.decorator';
import { PermissionEnum } from '../../enum/permission.enum';
import { Public } from '../../decorator/public/public.decorator';
import { FindAllDto } from '../../dto/findAll.dto';
import { Deposit } from './entities/deposit.entity';

@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) { }

  @Post()
  @Permissions(PermissionEnum.WAREHOUSE_CREATE)
  create(@Body() createDepositDto: CreateDepositDto) {
    return this.depositService.create(createDepositDto);
  }

  @Post('restore/:id')
  @Permissions(PermissionEnum.WAREHOUSE_RESTORE)
  restore(@Param('id') id: string) {
    return this.depositService.restore(id);
  }

  @Get()
  @Public()
  findAll(@Query() findAllDto: FindAllDto<Deposit>) {
    return this.depositService.findAll(findAllDto);
  }

  @Get('soft')
  @Permissions(PermissionEnum.WAREHOUSE_READ)
  findAllSoftDeleted(@Query() findAllDto: FindAllDto<Deposit>) {
    return this.depositService.findAllSoftDeleted(findAllDto);
  }

  @Get(':id')
  @Permissions(PermissionEnum.WAREHOUSE_READ)
  findOne(@Param('id') id: string) {
    return this.depositService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionEnum.WAREHOUSE_UPDATE)
  update(@Param('id') id: string, @Body() updateDepositDto: UpdateDepositDto) {
    return this.depositService.update(id, updateDepositDto);
  }

  @Delete('hard_delete/:id')
  @Permissions(PermissionEnum.WAREHOUSE_HARD_DELETE)
  hardDelete(@Param('id') id: string) {
    return this.depositService.hardDelete(id);
  }

  @Delete('soft_delete/:id')
  @Permissions(PermissionEnum.WAREHOUSE_SOFT_DELETE)
  softDelete(@Param('id') id: string) {
    return this.depositService.softDelete(id);
  }
}
