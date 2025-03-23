import { Injectable } from '@nestjs/common';
import { CreateIncomeNoteDto } from './dto/create-income_note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IncomeNote } from './entities/income_note.entity';
import { DataSource, Repository } from 'typeorm';
import { IncomeDetail } from './entities/income_detail.entity';
import { BaseService } from '../../services/base/base.service';
import { DepositProductService } from '../deposit_product/deposit_product.service';
import { AuthService } from '../../auth/auth.service';
import { FindAllDto } from '../../dto/findAll.dto';
import { MetricsCodeService } from '../metrics_code/metrics_code.service';
import { MetricsCodeEnum } from '../../enum/metrics_code.enum';

@Injectable()
export class IncomeNoteService {
  constructor(
    @InjectRepository(IncomeNote)
    private readonly incomeNoteRepository: Repository<IncomeNote>,
    @InjectRepository(IncomeDetail)
    private readonly incomeDetailRepository: Repository<IncomeDetail>,
    private readonly baseService: BaseService,
    private readonly depositProductService: DepositProductService,
    private readonly userService: AuthService,
    private readonly metricsCodeService: MetricsCodeService,
    private readonly dataSource: DataSource,
  ) { }

  /**
   * Crea una nota de venta
   * @param createIncomeNoteDto - Variables para crear la nota de ingreso.
   * @param user_id - Uuid del usuario.
   * @returns Devuelve la nota de venta creada.
   */
  async create(createIncomeNoteDto: CreateIncomeNoteDto, user_id: string) {
    const user = await this.userService.findOne(user_id);
    const { description, details } = createIncomeNoteDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const incomeNote = this.incomeNoteRepository.create({
        description,
        user,
        code: await this.metricsCodeService.addMetric(MetricsCodeEnum.INCOME, queryRunner),
        total: details.reduce((sum, item) => sum + item.total, 0),
      });
      await queryRunner.manager.save<IncomeNote>(incomeNote);

      const depositProductIds = [...new Set(details.map(detail => detail.deposit_product_id))];
      const depositProducts = await this.depositProductService.findByIds(depositProductIds);
      const depositProductMap = new Map(depositProducts.map(dp => [dp.id, dp]));

      const incomeDetails = details.map(detail => {
        const product = depositProductMap.get(detail.deposit_product_id);
        if (!product) throw new Error(`Producto no encontrado para ID: ${detail.deposit_product_id}`);

        const stockBefore = product.stock;
        const stockAfter = stockBefore + detail.quantity;

        return this.incomeDetailRepository.create({
          ...detail,
          income_note: incomeNote,
          deposit_product: product,
          stock_before: stockBefore,
          stock_after: stockAfter,
        });
      });

      await queryRunner.manager.save<IncomeDetail>(incomeDetails);

      for (let detail of incomeDetails) {
        const product = detail.deposit_product;
        if (product) {
          await this.depositProductService.addStock(queryRunner, product.id, detail.quantity);
        }
      }

      await queryRunner.commitTransaction();

      const income = await this.findOne(incomeNote.id);

      return income;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Obtiene los inventarios con depositos que no fueron eliminados.
   * @param query - Paginación para la búsqueda.
   * @returns Los inventarios con depositos que no han sido eliminados.
   */
  async findAll(query: FindAllDto<IncomeNote>) {
    return await this.baseService.findAll(this.incomeNoteRepository, query);
  }

  /**
   * Obtiene un inventario con deposito por medio del id.
   * @param id - Uuid del deposito.
   * @returns El inventario con deposito obtenido.
   */
  async findOne(id: string) {
    return await this.baseService.findOne(
      id,
      this.incomeNoteRepository,
      [
        'income_detail',
        'income_detail.deposit_product',
        'income_detail.deposit_product.deposit',
        'income_detail.deposit_product.product',
        'income_detail.deposit_product.characteristic',
      ]
    );
  }
}
