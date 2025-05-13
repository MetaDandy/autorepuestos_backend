import { Injectable } from '@nestjs/common';
import { CreateAuditDto } from './dto/create-audit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Audit } from './entities/audit.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/services/base/base.service';
import { FindAllDto } from 'src/dto/findAll.dto';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepo: Repository<Audit>,
    private readonly baseService: BaseService,
  ) { }

  /**
   * Crea una auditoría.
   * @param createAuditDto - Variables para crear la auditoría.
   * @returns La auditoría creada.
   */
  async create(createAuditDto: CreateAuditDto) {
    const audit = this.auditRepo.create(createAuditDto);

    await this.auditRepo.save(audit);
  }

  /**
   * Obtiene las auditorías.
   * @param query - Paginación para la búsqueda.
   * @returns Las auditorías.
   */
  findAll(query: FindAllDto<Audit>) {
    return this.baseService.findAll(this.auditRepo, query, ['user']);
  }

  /**
   * Retorna todas la auditorías de un usuario específico.
   * @param id - Uuid del usario.
   * @param query - Paginación para la búsqueda.
   * @returns Las auditorías de un usuario específico.
   */
  async findAllUsers(id: string, query: FindAllDto<Audit>) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const orderDir = (query.orderDirection === 'ASC') ? 'ASC' : 'DESC';
    const orderField = query.orderBy || 'createdAt'

    const [data, total] = await this.auditRepo.findAndCount({
      where: {
        user: {
          id
        }
      },
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { 
        [orderField]: orderDir
       },
    });

    return {
      page,
      limit,
      total,
      hasMore: page * limit < total,
      lastPage: Math.ceil(total / limit),
      data,
    };
  }
}
