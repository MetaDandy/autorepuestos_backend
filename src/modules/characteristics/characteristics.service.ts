import { Injectable } from '@nestjs/common';
import { CreateCharacteristicDto } from './dto/create-characteristic.dto';
import { UpdateCharacteristicDto } from './dto/update-characteristic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Characteristic } from './entities/characteristic.entity';
import { ILike, Repository } from 'typeorm';
import { BaseService } from '../../services/base/base.service';
import { FindAllDto } from '../../dto/findAll.dto';

@Injectable()
export class CharacteristicsService {
  constructor(
    @InjectRepository(Characteristic)
    private readonly characteristicRepository: Repository<Characteristic>,
    private readonly baseService: BaseService,
  ) { }

  /**
   * Crea una característica con codigo único.
   * @param createCharacteristicDto - Variable para crear las características.
   * @returns La característica creada.
   */
  async create(createCharacteristicDto: CreateCharacteristicDto) {
    return await this.characteristicRepository.save({
      ...createCharacteristicDto,
    });
  }

  /**
   * Obtiene las características que no se han eliminado lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Las características que no se han eliminado lógicamente.
   */
  async findAll(query: FindAllDto<Characteristic>) {
    const { page, limit, orderBy, orderDirection, search } = query;

    const whereConditions = search
      ? [
        { code: ILike(`%${search}%`) },
      ]
      : [];

    const [items, total] = await this.characteristicRepository.findAndCount({
      where: whereConditions.length ? whereConditions : undefined,
      take: limit,
      skip: (page - 1) * limit,
      order: { [orderBy]: orderDirection },
    });

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtiene las características que fueron eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Las características que han sido eliminadas lógicamente.
   */
  async findAllSoftDeleted(query: FindAllDto<Characteristic>) {
    return await this.baseService.findAllSoftDeleted(this.characteristicRepository, query);
  }

  /**
   * Obtiene una característica por medio del id.
   * @param id - Uuid de la característica.
   * @returns La característica obtenida.
   */
  async findOne(id: string) {
    return await this.baseService.findOne(id, this.characteristicRepository);
  }

  /**
   * Actualiza una característica.
   * @param id - Uuid de la característica.
   * @param updateCharacteristicDto - Variables necesarias para actualizar una característica.
   * @returns La característica actualizada.
   */
  async update(id: string, updateCharacteristicDto: UpdateCharacteristicDto) {
    const characteristic = await this.findOne(id);

    this.characteristicRepository.merge(characteristic, updateCharacteristicDto);
    return await this.characteristicRepository.save(characteristic);
  }

  /**
   * Elimina de forma permanente una característica.
   * @param id - Uuid de la característica.
   * @returns El producto eliminada físicamente.
   */
  async hardDelete(id: string) {
    return await this.baseService.hardDeleteWithRelationsCheck(
      id,
      this.characteristicRepository,
      async (id) => {
        return await this.characteristicRepository
          .createQueryBuilder('characteristic')
          .leftJoin('characteristic.deposit_product', 'deposit_product')
          .where('product.id = :id', { id })
          .andWhere('deposit_product.id IS NOT NULL')
          .getExists();
      }
    );
  }

  /**
   * Elimina la característica lógicamente.
   * @param id - Uuid del producto.
   * @returns La característica eliminado lógicamente.
   */
  async softDelete(id: string) {
    return await this.baseService.softDeleteWithRelationsCheck(
      id,
      this.characteristicRepository,
      async (id) => {
        return await this.characteristicRepository
          .createQueryBuilder('characteristic')
          .leftJoin('characteristic.deposit_product', 'deposit_product')
          .where('product.id = :id', { id })
          .andWhere('deposit_product.id IS NOT NULL')
          .getExists();
      }
    );
  }

  /**
   * Restaura la característica y le quita la eliminación lógica.
   * @param id - Uuid del producto.
   * @returns La característica recuperado.
   */
  async restore(id: string) {
    return await this.baseService.restore(id, this.characteristicRepository);
  }
}
