import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMetricsCodeDto } from './dto/create-metrics_code.dto';
import { UpdateMetricsCodeDto } from './dto/update-metrics_code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MetricsCode } from './entities/metrics_code.entity';
import { Repository } from 'typeorm';
import { BaseService } from '../../services/base/base.service';
import { FindAllDto } from '../../dto/findAll.dto';

@Injectable()
export class MetricsCodeService {
  constructor(
    @InjectRepository(MetricsCode)
    private readonly metricsCodeRepository: Repository<MetricsCode>,
    private readonly baseService: BaseService,
  ) { }

  /**
   * Crea un código de métricas.
   * @param createCategoryDto - Variables para crear un código de métricas.
   * @returns Un código de métricas creado.
   */
  async create(createMetricsCodeDto: CreateMetricsCodeDto) {
    const metricsCode = this.metricsCodeRepository.create({
      ...createMetricsCodeDto,
    });

    return await this.metricsCodeRepository.save(metricsCode);
  }

  /**
   * Obtiene los códigos de métricas que no fueron eliminadas.
   * @param query - Paginación para la búsqueda.
   * @returns Los código de métricas que no han sido eliminadas.
   */
  async findAll(query: FindAllDto<MetricsCode>) {
    return await this.baseService.findAll(this.metricsCodeRepository, query);
  }

  /**
   * Obtiene los códigos de métricas que fueron eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Los códigos de métricas que han sido eliminadas lógicamente.
   */
  async findAllSoftDeleted(query: FindAllDto<MetricsCode>) {
    return await this.baseService.findAllSoftDeleted(this.metricsCodeRepository, query);
  }

  /**
   * Obtiene un código de métricas por medio del id.
   * @param id - Uuid del código de métricas.
   * @returns El código de métricas obtenida.
   */
  async findOne(id: string) {
    return await this.baseService.findOne(id, this.metricsCodeRepository);
  }

  /**
   * Actualiza un código de métricas.
   * @param id - Uuid del código de métricas.
   * @param updateCategoryDto - Las variables necesarias para la actualización.
   * @returns El código de métricas actualizada.
   */
  async update(id: string, updateMetricsCodeDto: UpdateMetricsCodeDto) {
    const metricsCode = await this.findOne(id);

    this.metricsCodeRepository.merge(metricsCode, updateMetricsCodeDto);

    return await this.metricsCodeRepository.save(metricsCode);
  }

  /**
   * Elimina el código de métricas categoría lógicamente.
   * @param id - Uuid del código de métricas.
   * @returns El código de métricas eliminada lógicamente.
   */
  async softDelete(id: string) {
    return this.baseService.softDelete(id, this.metricsCodeRepository);
  }

  /**
   * Restaura el código de métricas y le quita la eliminación lógica.
   * @param id - Uuid del código de métricas.
   * @returns El código de métricas recuperada.
   */
  async restore(id: string) {
    return this.baseService.restore(id, this.metricsCodeRepository);
  }

  /**
   * Genera un código a partir de un documento. 
   * @param document - El nombre del documento a buscar.
   * @returns El código generado para ese documento.
   */
  async addMetric(document: string) {
    const metricsCode = await this.metricsCodeRepository.findOne({
      where: {
        document,
      }
    });

    if (!metricsCode) throw new BadRequestException('Metrica no encontrada');

    metricsCode.last_number = String(Number(metricsCode.last_number) + 1);

    const { last_number, prefix, zeros } = metricsCode;

    const paddedNumber = last_number.padStart(zeros, '0');

    const code = `${prefix}-${paddedNumber}`;

    await this.metricsCodeRepository.save(metricsCode);

    return code;
  }
}
