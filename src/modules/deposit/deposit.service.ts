import { Injectable } from '@nestjs/common';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from './entities/deposit.entity';
import { Repository } from 'typeorm';
import { BaseService } from '../../services/base/base.service';
import { FindAllDto } from '../../dto/findAll.dto';

@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    private readonly baseService: BaseService,
  ) { }

  /**
   * Crea un deposito.
   * @param createCategoryDto - Variables para crear el deposito.
   * @returns El deposito creado.
   */
  async create(createDepositDto: CreateDepositDto) {
    const deposit = this.depositRepository.create({
      ...createDepositDto,
    });

    return await this.depositRepository.save(deposit);
  }

  /**
   * Obtiene los depositos que no fueron eliminadas.
   * @param query - Paginación para la búsqueda.
   * @returns Los depositos que no han sido eliminadas.
   */
  async findAll(query: FindAllDto<Deposit>) {
    return await this.baseService.findAll(this.depositRepository, query);
  }

  /**
   * Obtiene los depositos que fueron eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Los depositos que han sido eliminadas lógicamente.
   */
  async findAllSoftDeleted(query: FindAllDto<Deposit>) {
    return await this.baseService.findAllSoftDeleted(this.depositRepository, query);
  }

  /**
   * Obtiene un deposito por medio del id.
   * @param id - Uuid del deposito.
   * @returns El deposito obtenida.
   */
  async findOne(id: string) {
    return await this.baseService.findOne(id, this.depositRepository);
  }

  /**
   * Actualiza un deposito.
   * @param id - Uuid del deposito.
   * @param updateCategoryDto - Las variables necesarias para la actualización.
   * @returns El deposito actualizado.
   */
  async update(id: string, updateDepositDto: UpdateDepositDto) {
    const deposit = await this.findOne(id);

    this.depositRepository.merge(deposit, updateDepositDto);

    return await this.depositRepository.save(deposit);
  }

  /**
   * Elimina de forma permanente un deposito.
   * @param id - Uuid del deposito.
   * @returns El deposito eliminado físicamente.
   */
  async hardDelete(id: string) {
    return this.baseService.hardDelete(id, this.depositRepository);
  }

  /**
   * Elimina el deposito lógicamente.
   * @param id - Uuid del deposito.
   * @returns El deposito eliminado lógicamente.
   */
  async softDelete(id: string) {
    return this.baseService.softDelete(id, this.depositRepository);
  }

  /**
   * Restaura el deposito y le quita la eliminación lógica.
   * @param id - Uuid del deposito.
   * @returns El deposito recuperado.
   */
  async restore(id: string) {
    return this.baseService.restore(id, this.depositRepository);
  }
}
