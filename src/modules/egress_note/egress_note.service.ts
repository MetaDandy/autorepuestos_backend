import { Injectable } from '@nestjs/common';
import { CreateEgressNoteDto } from './dto/create-egress_note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EgressNote } from './entities/egress_note.entity';
import { DataSource, Repository } from 'typeorm';
import { EgressDetail } from './entities/egress_detail.entity';
import { BaseService } from '../../services/base/base.service';
import { DepositProductService } from '../deposit_product/deposit_product.service';
import { AuthService } from '../../auth/auth.service';
import { FindAllDto } from '../../dto/findAll.dto';
import { MetricsCodeService } from '../metrics_code/metrics_code.service';
import { MetricsCodeEnum } from '../../enum/metrics_code.enum';

@Injectable()
export class EgressNoteService {
  constructor(
    @InjectRepository(EgressNote)
    private readonly egressNoteRepository: Repository<EgressNote>,
    @InjectRepository(EgressDetail)
    private readonly egressDetailRepository: Repository<EgressDetail>,
    private readonly baseService: BaseService,
    private readonly depositProductService: DepositProductService,
    private readonly userService: AuthService,
    private readonly metricsCodeService: MetricsCodeService,
    private readonly dataSource: DataSource,
  ) { }


  /**
   * Crea una nota de egreso.
   * @param createEgressNoteDto - Variables para crear la nota de egreso.
   * @param user_id - Uuid del usuario.
   * @returns Devuelve la nota de egreso creada.
   */
  async create(createEgressNoteDto: CreateEgressNoteDto, user_id: string) {
    const user = await this.userService.findOne(user_id);
    const { description, details } = createEgressNoteDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const egressNote = this.egressNoteRepository.create({
        description,
        user,
        code: await this.metricsCodeService.addMetric(MetricsCodeEnum.EGRESS, queryRunner),
        total: details.reduce((sum, item) => sum + item.total, 0),
      });
      await queryRunner.manager.save<EgressNote>(egressNote);

      const depositProductIds = [...new Set(details.map(detail => detail.deposit_product_id))];
      const depositProducts = await this.depositProductService.findByIds(depositProductIds);
      const depositProductMap = new Map(depositProducts.map(dp => [dp.id, dp]));

      const egressDetails = details.map(detail => {
        const product = depositProductMap.get(detail.deposit_product_id);
        if (!product) throw new Error(`Producto no encontrado para ID: ${detail.deposit_product_id}`);

        const stockBefore = product.stock;
        const stockAfter = stockBefore - detail.quantity;

        if (stockAfter < 0) {
          throw new Error(`Stock insuficiente para producto: ${product.id}`);
        }

        return this.egressDetailRepository.create({
          ...detail,
          egress_note: egressNote,
          deposit_product: product,
          stock_before: stockBefore,
          stock_after: stockAfter,
        });
      });

      await queryRunner.manager.save<EgressDetail>(egressDetails);

      for (let detail of egressDetails) {
        const product = detail.deposit_product;
        if (product) {
          await this.depositProductService.substractStock(queryRunner, product.id, detail.quantity);
        }
      }

      await queryRunner.commitTransaction();

      const egress = await this.findOne(egressNote.id);

      return egress;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Obtiene las notas de egreso.
   * @param query - Paginación para la búsqueda.
   * @returns Las notas de egreso.
   */
  async findAll(query: FindAllDto<EgressNote>) {
    return await this.baseService.findAll(this.egressNoteRepository, query);
  }

  /**
   * Obtiene la nota de egreso por medio del id.
   * @param id - Uuid del deposito.
   * @returns La nota de egreso con deposito obtenido.
   */
  async findOne(id: string) {
    return await this.baseService.findOne(
      id,
      this.egressNoteRepository,
      [
        'egress_detail',
        'egress_detail.deposit_product',
        'egress_detail.deposit_product.deposit',
        'egress_detail.deposit_product.product'
      ]
    );
  }
}
