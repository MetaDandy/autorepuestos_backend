import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepositProductDto } from './dto/create-deposit_product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DepositProduct } from './entities/deposit_product.entity';
import { In, QueryRunner, Repository } from 'typeorm';
import { BaseService } from '../../services/base/base.service';
import { ProductService } from '../product/product.service';
import { DepositService } from '../deposit/deposit.service';
import { FindAllDto } from '../../dto/findAll.dto';

@Injectable()
export class DepositProductService {
  constructor(
    @InjectRepository(DepositProduct)
    private readonly depositProductRepository: Repository<DepositProduct>,
    private readonly baseService: BaseService,
    private readonly productService: ProductService,
    private readonly depositService: DepositService,
  ) { }

  /**
   * Crea un inventario en un deposito con stock 0.
   * @param createCategoryDto - Variables para crear el inventario en un deposito.
   * @returns El inventario en un deposito creado con stock 0.
   */
  async create(createDepositProductDto: CreateDepositProductDto) {
    const { deposit_id, product_id } = createDepositProductDto;

    const product = await this.productService.findOneNoRelations(product_id);
    const deposit = await this.depositService.findOne(deposit_id);

    const existingDepositProduct = await this.depositProductRepository.findOne({
      where: { deposit: { id: deposit_id }, product: { id: product_id } },
      withDeleted: true,
    });

    if (existingDepositProduct)
      throw new BadRequestException('El producto ya está registrado en este depósito.');

    return await this.depositProductRepository.save({
      deposit,
      product,
      stock: 0
    });
  }

  /**
   * Obtiene los inventarios con depositos que no fueron eliminados.
   * @param query - Paginación para la búsqueda.
   * @returns Los inventarios con depositos que no han sido eliminados.
   */
  async findAll(query: FindAllDto<DepositProduct>) {
    return await this.baseService.findAll(this.depositProductRepository, query);
  }

  /**
   * Obtiene los inventarios con depositos que fueron eliminads lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Los inventarios con depositos que han sido eliminados lógicamente.
   */
  async findAllSoftDeleted(query: FindAllDto<DepositProduct>) {
    return await this.baseService.findAllSoftDeleted(this.depositProductRepository, query);
  }

  /**
   * Retorna el producto con todos sus inventarios paginados.
   * @param id - Uuid del producto.
   * @param query - Paginación para la búsqueda.
   * @returns Todos los inventarios del producto solicitado.
   */
  async findAllProducts(id: string, query: FindAllDto<DepositProduct>) {
    const product = await this.productService.findOneNoRelations(id);

    const { limit, orderBy, orderDirection, page } = query;

    const [deposit_products, totalCount] = await this.depositProductRepository.findAndCount({
      where: {
        product: {
          id,
        }
      },
      relations: ['deposit'],
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [orderBy]: orderDirection
      }
    });

    return {
      page,
      limit,
      totalCount,
      hasMore: page * limit < totalCount,
      product,
      data: deposit_products,
    }
  }

  /**
   * Retorna el deposito con todos sus inventarios paginados.
   * @param id - Uuid del deposito.
   * @param query - Paginación para la búsqueda.
   * @returns Todas los inventarios del deposito solicitado.
   */
  async findAllDeposits(id: string, query: FindAllDto<DepositProduct>) {
    const deposit = await this.depositService.findOne(id);

    const { limit, orderBy, orderDirection, page } = query;

    const [deposit_products, totalCount] = await this.depositProductRepository.findAndCount({
      where: {
        deposit: {
          id,
        }
      },
      relations: ['product'],
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [orderBy]: orderDirection
      }
    });

    return {
      page,
      limit,
      totalCount,
      hasMore: page * limit < totalCount,
      deposit,
      data: deposit_products,
    }
  }

  /**
   * Obtiene un inventario con deposito por medio del id.
   * @param id - Uuid del deposito.
   * @returns El inventario con deposito obtenido.
   */
  async findOne(id: string) {
    return await this.baseService.findOne(id, this.depositProductRepository, ['product', 'deposit']);
  }

  /**
   * Elimina el inventario con deposito lógicamente.
   * @param id - Uuid del inventario con deposito.
   * @returns El inventario con deposito eliminado lógicamente.
   */
  async softDelete(id: string) {
    const deposit_product = await this.depositProductRepository.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });

    if (!deposit_product) throw new BadRequestException('No se encuentra el inventario solicitado');
    if (deposit_product.deletedAt) throw new BadRequestException('El inventario ya fue eliminado.');
    if (deposit_product.stock > 0) throw new BadRequestException('El inventario debe tener stock 0');

    return await this.depositProductRepository.softRemove(deposit_product);
  }

  /**
   * Restaura el inventario con deposito y le quita la eliminación lógica.
   * @param id - Uuid del inventario con deposito.
   * @returns El inventario con deposito recuperado.
   */
  async restore(id: string) {
    return this.baseService.restore(id, this.depositProductRepository);
  }

  /**
   * Hace un check para saber si hay suficiente stock.
   * @param id - Uuid del inventario con deposito.
   * @param quantity - Cantidad a comparar entre stock y cantidad.
   * @returns Si existe o no el stock.
   */
  async checkInventoryStock(id: string, quantity: number) {
    const deposit_product = await this.findOne(id);

    if (deposit_product.stock > quantity) return true;

    return false;
  }

  /**
   * Aumenta stock a un inventario.
   * @param queryRunner - El QueryRunner de la transacción.
   * @param id - Uuid del inventario con deposito.
   * @param quantity - Cantidad de productos a aumentar.
   * @returns El inventario con mas stock
   */
  async addStock(queryRunner: QueryRunner, id: string, quantity: number) {
    if (quantity <= 0) throw new BadRequestException('La cantidad debe ser mayor a 0');

    const depositProduct = await queryRunner.manager.findOne(DepositProduct, {
      where: { id },
      lock: { mode: 'pessimistic_write' },
    });

    if (!depositProduct) throw new BadRequestException('Producto no encontrado');

    depositProduct.stock += quantity;

    await queryRunner.manager.save<DepositProduct>(depositProduct);

    return depositProduct;
  }

  /**
   * Disminuye stock a un inventario.
   * @param queryRunner - El QueryRunner de la transacción.
   * @param id - Uuid del inventario con deposito.
   * @param quantity - Cantidad de productos a disminuir.
   * @returns El inventario con menos stock
   */
  async substractStock(queryRunner: QueryRunner, id: string, quantity: number) {
    if (quantity <= 0) throw new BadRequestException('La cantidad debe ser mayor a 0');

    const depositProduct = await queryRunner.manager.findOne(DepositProduct, {
      where: { id },
      lock: { mode: 'pessimistic_write' },
    });

    if (!depositProduct) throw new BadRequestException('Producto no encontrado');
    if (depositProduct.stock < quantity) throw new BadRequestException('No hay suficiente stock');

    depositProduct.stock -= quantity;

    await queryRunner.manager.save<DepositProduct>(depositProduct);
    
    return depositProduct;
  }

  /**
   * Devuelve la busqueda de todo los inventarios con deposito.
   * @param ids - Uuids de los inventarios con deposito.
   * @returns Todos los inventarios con deposito.
   */
  async findByIds(ids: string[]): Promise<DepositProduct[]> {
    if (ids.length === 0) return [];

    const products = await this.depositProductRepository.find({
      where: { id: In(ids) },
      relations: ['product']
    });

    if (products.length !== ids.length)
      throw new NotFoundException("Uno o más productos no existen.");

    return products;
  }

}
