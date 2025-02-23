import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product_type.dto';
import { UpdateProductTypeDto } from './dto/update-product_type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductType } from './entities/product_type.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { CategoryType } from '../category_type/entities/category_type.entity';
import { FindAllDto } from 'src/dto/findAll.dto';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductType)
    private readonly productTypeRepository: Repository<ProductType>,
    @InjectRepository(CategoryType)
    private readonly categoryTypeRepository: Repository<CategoryType>,
  ) { }

  /**
   * Crea un tipo de producto.
   * @param createProductTypeDto - Variables para crear el tipo de producto.
   * @returns El tipo de producto creado.
   */
  async create(createProductTypeDto: CreateProductTypeDto) {
    const { category_type_id, description, name } = createProductTypeDto;

    const categoryType = await this.categoryTypeRepository.findOne({
      where: {
        id: category_type_id,
      }
    });

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
    const { limit, page, orderBy = 'createdAt', orderDirection = 'ASC' } = query;
    const [productsTypes, totalCount] = await this.productTypeRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [orderBy]: orderDirection
      },
      withDeleted: false,
    });

    return {
      page,
      limit,
      totalCount,
      hasMore: page * limit < totalCount,
      data: productsTypes
    };
  }

  /**
   * Obtiene los tipos de productos que fueron eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Los tipos de productos que han sido eliminadas lógicamente.
   */
  async findAllSoftDeleted(query: FindAllDto<ProductType>) {
    const { limit, page, orderBy = 'createdAt', orderDirection = 'ASC' } = query;
    const [productsTypes, totalCount] = await this.productTypeRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [orderBy]: orderDirection
      },
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull())
      }
    });

    return {
      page,
      limit,
      totalCount,
      hasMore: page * limit < totalCount,
      data: productsTypes
    };
  }

  /**
   * Obtiene un tipo de prodcto por medio del id.
   * @param id - Uuid de la categoría.
   * @returns El tipo de producto obtenida.
   */
  async findOne(id: string) {
    const productType = await this.productTypeRepository.findOne({
      where: {
        id,
      }
    });

    if (!productType)
      throw new BadRequestException('No se encontró el tipo de producto solicitado');

    return productType;
  }

  /**
   * Actualiza un tipo de producto.
   * @param id - Uuid del tipo de producto.
   * @param updateCategoryDto - Las variables necesarias para la actualización.
   * @returns El tipo de categoría actualizada.
   */
  async update(id: string, updateProductTypeDto: UpdateProductTypeDto) {
    const productType = await this.findOne(id);

    this.productTypeRepository.merge(productType, updateProductTypeDto);

    return await this.productTypeRepository.save(productType);
  }

  /**
   * Elimina de forma permanente un tipo de producto.
   * @param id - Uuid del tipo de producto.
   * @returns El tipo de producto eliminado físicamente.
   */
  async hardDelete(id: string) {
    const productType = await this.productTypeRepository.findOneOrFail({
      where: { id },
      withDeleted: true,
    });

    // const hasProducts = await this.categoryTypeRepository
    //   .createQueryBuilder('categoryType')
    //   .leftJoin('categoryType.product_type', 'productType')
    //   .where('categoryType.id = :id', { id })
    //   .andWhere('productType.id IS NOT NULL')
    //   .getExists(); 


    // if (hasProducts)
    //   throw new UnauthorizedException('No se puede borrar un tipo de categoría con tipos de productos asignados');

    return await this.productTypeRepository.remove(productType);
  }

  /**
   * Elimina el tipo de producto lógicamente.
   * @param id - Uuid de tipo de producto.
   * @returns El tipo de producto eliminado lógicamente.
   */
  async softDelete(id: string) {
    const productType = await this.productTypeRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!productType)
      throw new BadRequestException('No se encuentra el tipo de producto solicitado.')

    if (productType.deletedAt) {
      throw new BadRequestException('El tipo de producto ya fue eliminado');
    }

    return await this.productTypeRepository.softRemove(productType);
  }

  /**
   * Restaura el tipo de producto y le quita la eliminación lógica.
   * @param id - Uuid del tipo de producto.
   * @returns El tipo de producto recuperado.
   */
  async restore(id: string) {
    const productType = await this.productTypeRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!productType) throw new BadRequestException('El tipo de producto no existe');

    if (!productType.deletedAt) 
      throw new BadRequestException('El tipo de producto no está eliminado');

    await this.productTypeRepository.restore(id);

    return { message: 'Tipo de producto restaurado correctamente', productType };
  }
}
