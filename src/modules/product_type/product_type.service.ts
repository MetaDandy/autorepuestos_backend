import { Injectable } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product_type.dto';
import { UpdateProductTypeDto } from './dto/update-product_type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductType } from './entities/product_type.entity';
import { Repository } from 'typeorm';
import { FindAllDto } from '../../dto/findAll.dto';
import { CategoryTypeService } from '../category_type/category_type.service';
import { BaseService } from '../../services/base/base.service';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductType)
    private readonly productTypeRepository: Repository<ProductType>,
    private readonly categoryTypeService: CategoryTypeService,
    private readonly baseService: BaseService
  ) { }

  /**
   * Crea un tipo de producto.
   * @param createProductTypeDto - Variables para crear el tipo de producto.
   * @returns El tipo de producto creado.
   */
  async create(createProductTypeDto: CreateProductTypeDto) {
    const { category_type_id, description, name } = createProductTypeDto;

    const categoryType = await this.categoryTypeService.findOne(category_type_id);

    const productType = this.productTypeRepository.create({
      name,
      description,
      category_type: categoryType
    });

    return await this.productTypeRepository.save(productType);
  }

  /**
   * Obtiene los tipos de productos que no fueron eliminadas.
   * @param query - Paginación para la búsqueda.
   * @returns Los tipos de productos que no han sido eliminadas.
   */
  async findAll(query: FindAllDto<ProductType>) {
    return this.baseService.findAll(this.productTypeRepository, query, ['category_type']);
  }

  /**
   * Obtiene los tipos de productos que fueron eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Los tipos de productos que han sido eliminadas lógicamente.
   */
  async findAllSoftDeleted(query: FindAllDto<ProductType>) {
    return this.baseService.findAllSoftDeleted(this.productTypeRepository, query, ['category_type']);
  }

  /**
   * Obtiene un tipo de prodcto por medio del id.
   * @param id - Uuid de la categoría.
   * @returns El tipo de producto obtenida.
   */
  async findOne(id: string) {
    return this.baseService.findOne(id, this.productTypeRepository, ['category_type']);
  }

  /**
   * Actualiza un tipo de producto.
   * @param id - Uuid del tipo de producto.
   * @param updateCategoryDto - Las variables necesarias para la actualización.
   * @returns El tipo de categoría actualizada.
   */
  async update(id: string, updateProductTypeDto: UpdateProductTypeDto) {
    const productType = await this.findOne(id);

    if (updateProductTypeDto.category_type_id &&
      productType.category_type.id !== updateProductTypeDto.category_type_id) {
      productType.category_type = await this.categoryTypeService.findOne(updateProductTypeDto.category_type_id);
    }

    this.productTypeRepository.merge(productType, updateProductTypeDto);

    return await this.productTypeRepository.save(productType);
  }

  /**
   * Elimina de forma permanente un tipo de producto.
   * @param id - Uuid del tipo de producto.
   * @returns El tipo de producto eliminado físicamente.
   */
  async hardDelete(id: string) {
    return await this.baseService.hardDeleteWithRelationsCheck(
      id,
      this.productTypeRepository,
      async (id) => {
        return await this.productTypeRepository
          .createQueryBuilder('product_type')
          .leftJoin('product_type.category_type', 'product')
          .where('product_type.id = :id', { id })
          .andWhere('product.id IS NOT NULL')
          .getExists();
      }
    );
  }

  /**
   * Elimina el tipo de producto lógicamente.
   * @param id - Uuid de tipo de producto.
   * @returns El tipo de producto eliminado lógicamente.
   */
  async softDelete(id: string) {
    return this.baseService.softDeleteWithRelationsCheck(
      id,
      this.productTypeRepository,
      async (id) => {
        return await this.productTypeRepository
          .createQueryBuilder('product_type')
          .leftJoin('product_type.category_type', 'product')
          .where('product_type.id = :id', { id })
          .andWhere('product.id IS NOT NULL')
          .getExists();
      }
    );
  }

  /**
   * Restaura el tipo de producto y le quita la eliminación lógica.
   * @param id - Uuid del tipo de producto.
   * @returns El tipo de producto recuperado.
   */
  async restore(id: string) {
    return await this.baseService.restore(id, this.productTypeRepository);
  }
}
