import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaleNoteDto } from './dto/create-sale_note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleNote } from './entities/sale_note.entity';
import { DataSource, Repository } from 'typeorm';
import { SaleDetail } from './entities/sale_detail.entity';
import { BaseService } from '../../services/base/base.service';
import { AuthService } from '../../auth/auth.service';
import { MetricsCodeService } from '../metrics_code/metrics_code.service';
import { DepositProductService } from '../deposit_product/deposit_product.service';
import { MetricsCodeEnum } from 'src/enum/metrics_code.enum';
import { FindAllDto } from 'src/dto/findAll.dto';

@Injectable()
export class SaleNoteService {
  constructor(
    @InjectRepository(SaleNote)
    private readonly saleNoteRepository: Repository<SaleNote>,
    @InjectRepository(SaleDetail)
    private readonly saleDetailRepository: Repository<SaleDetail>,
    private readonly baseService: BaseService,
    private readonly depositProductService: DepositProductService,
    private readonly userService: AuthService,
    private readonly metricsCodeService: MetricsCodeService,
    private readonly dataSource: DataSource,
  ) { }

  /**
   * Crea una nota de venta.
   * @param createSaleNoteDto - Variables para crear la nota de venta.
   * @param user_id - Uuid del cliente.
   * @returns La nota de venta creada.
   */
  async create(createSaleNoteDto: CreateSaleNoteDto, user_id: string) {
    const user = await this.userService.findOne(user_id);
    const { description, details } = createSaleNoteDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let total = 0;

      const depositProductIds = [...new Set(details.map(detail => detail.deposit_product_id))];
      const depositProducts = await this.depositProductService.findByIds(depositProductIds);
      const productMap = new Map(depositProducts.map(dp => [dp.id, dp]));

      const saleDetails = details.map(item => {
        const product = productMap.get(item.deposit_product_id);

        const productTotal = item.price * item.quantity;

        total += productTotal;

        return this.saleDetailRepository.create({
          ...item,
          total: productTotal,
          sale_note: null, // Se asignará después
          deposit_product: product,
        });
      });

      const saleNote = this.saleNoteRepository.create({
        description,
        user,
        code: await this.metricsCodeService.addMetric(MetricsCodeEnum.SALE, queryRunner),
        total,
        sale_detail: saleDetails,
      });

      await queryRunner.manager.save<SaleNote>(saleNote);

      for (const detail of saleDetails) {
        const product = detail.deposit_product;
        detail.sale_note = saleNote;

        detail.stock_before = product.stock;
        detail.stock_after = product.stock - detail.quantity;

        if (detail.stock_after < 0) {
          throw new BadRequestException(`Stock insuficiente para el producto: ${product.id}`);
        }
      }

      await queryRunner.manager.save<SaleDetail>(saleDetails);

      for (const detail of saleDetails) {
        const product = detail.deposit_product;
        if (product) {
          await this.depositProductService.substractStock(queryRunner, product.id, detail.quantity);
        }
      }

      await queryRunner.commitTransaction();

      const sales = await this.findOne(saleNote.id);

      return sales;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Obtiene las notas de venta.
   * @param query - Paginación para la búsqueda.
   * @returns Las notas de venta.
   */
  async findAll(query: FindAllDto<SaleNote>) {
    return await this.baseService.findAll(this.saleNoteRepository, query);
  }

  /**
   * Obtiene la nota de egreso por medio del id.
   * @param id - Uuid del deposito.
   * @returns La nota de egreso con deposito obtenido.
   */
  async findOne(id: string) {
    return await this.baseService.findOne(
      id,
      this.saleNoteRepository,
      [
        'sale_detail',
        'sale_detail.deposit_product',
        'sale_detail.deposit_product.deposit',
        'sale_detail.deposit_product.product'
      ]
    );
  }
}
