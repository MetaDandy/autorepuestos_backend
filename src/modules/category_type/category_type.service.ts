import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCategoryTypeDto } from './dto/create-category_type.dto';
import { UpdateCategoryTypeDto } from './dto/update-category_type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryType } from './entities/category_type.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { FindAllDto } from 'src/dto/findAll.dto';

@Injectable()
export class CategoryTypeService {
  constructor(
    @InjectRepository(CategoryType)
    private readonly categoryTypeRepository: Repository<CategoryType>,
    private readonly categoryService: CategoryService,
  ) { }

  /**
   * Crea un tipo de categoría.
   * @param createCategoryDto - Variables para crear el tipo de categoría.
   * @returns El tipo de categoría creada.
   */
  async create(createCategoryTypeDto: CreateCategoryTypeDto) {
    const { name, description, category_id } = createCategoryTypeDto;

    const category = await this.categoryService.findOne(category_id);

    const categoryType = this.categoryTypeRepository.create({
      name,
      description,
      category
    });


    return await this.categoryTypeRepository.save(categoryType);
  }

  /**
   * Obtiene los tipos de categorías que no fueron eliminadas.
   * @param query - Paginación para la búsqueda.
   * @returns Los tipos de categorías que no han sido eliminadas.
   */
  async findAll(query: FindAllDto<CategoryType>) {
    const { limit, page, orderBy = 'createdAt', orderDirection = 'ASC' } = query;
    const [categoriesTypes, totalCount] = await this.categoryTypeRepository.findAndCount({
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
      data: categoriesTypes
    };
  }

  /**
   * Obtiene los tipos de categorías que fueron eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Los tipos de categorías que han sido eliminadas lógicamente.
   */
  async findAllSoftDeleted(query: FindAllDto<CategoryType>) {
    const { limit, page, orderBy = 'createdAt', orderDirection = 'ASC' } = query;
    const [categoriesTypes, totalCount] = await this.categoryTypeRepository.findAndCount({
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
      data: categoriesTypes
    };
  }

  /**
   * Obtiene un tipo de categoría por medio del id.
   * @param id - Uuid de la categoría.
   * @returns El tipo de categoría obtenida.
   */
  async findOne(id: string) {
    return await this.categoryTypeRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  /**
   * Actualiza un tipo de categoría.
   * @param id - Uuid del tipo de categoría.
   * @param updateCategoryDto - Las variables necesarias para la actualización.
   * @returns El tipo de categoría actualizada.
   */
  async update(id: string, updateCategoryTypeDto: UpdateCategoryTypeDto) {
    const categoryType = await this.findOne(id);

    this.categoryTypeRepository.merge(categoryType, updateCategoryTypeDto);

    return await this.categoryTypeRepository.save(categoryType);
  }

  /**
   * Elimina de forma permanente un tipo de categoría.
   * @param id - Uuid del tipo de categoría.
   * @returns El tipo de categoría eliminada físicamente.
   */
  async hardDelete(id: string) {
    const categoryType = await this.categoryTypeRepository.findOneOrFail({
      where: { id },
      withDeleted: true,
    });

    const hasProducts = await this.categoryTypeRepository
      .createQueryBuilder('categoryType')
      .leftJoin('categoryType.product_type', 'productType')
      .where('categoryType.id = :id', { id })
      .andWhere('productType.id IS NOT NULL')
      .getExists();


    if (hasProducts)
      throw new UnauthorizedException('No se puede borrar un tipo de categoría con tipos de productos asignados');

    return await this.categoryTypeRepository.remove(categoryType);
  }

  /**
   * Elimina el tipo de categoría lógicamente.
   * @param id - Uuid de tipo de categoría.
   * @returns El tipo de categoría eliminada lógicamente.
   */
  async softDelete(id: string) {
    const categoryType = await this.categoryTypeRepository.findOneOrFail({
      where: { id },
      withDeleted: true,
    });

    if (categoryType.deletedAt) {
      throw new UnauthorizedException('La tipo de categoría ya fue eliminado');
    }

    const hasProducts = await this.categoryTypeRepository
      .createQueryBuilder('categoryType')
      .leftJoin('categoryType.product_type', 'productType')
      .where('categoryType.id = :id', { id })
      .andWhere('productType.id IS NOT NULL')
      .getExists();


    if (hasProducts)
      throw new UnauthorizedException('No se puede borrar un tipo de categoría con tipos de productos asignados');

    return await this.categoryTypeRepository.softRemove(categoryType);
  }

  /**
   * Restaura el tipo de categoría y le quita la eliminación lógica.
   * @param id - Uuid del tipo de categoría.
   * @returns El tipo de categoría recuperada.
   */
  async restore(id: string) {
    const categoryType = await this.categoryTypeRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!categoryType) throw new UnauthorizedException('El tipo de categoría no existe');

    if (!categoryType.deletedAt) throw new UnauthorizedException('El tipo de categoría no está eliminado');

    await this.categoryTypeRepository.restore(id);

    return { message: 'Tipo de categoría restaurada correctamente', categoryType };
  }
}
