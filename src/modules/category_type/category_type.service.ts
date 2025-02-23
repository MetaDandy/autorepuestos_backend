import { Injectable } from '@nestjs/common';
import { CreateCategoryTypeDto } from './dto/create-category_type.dto';
import { UpdateCategoryTypeDto } from './dto/update-category_type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryType } from './entities/category_type.entity';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { FindAllDto } from 'src/dto/findAll.dto';
import { BaseService } from 'src/services/base/base.service';

@Injectable()
export class CategoryTypeService {
  constructor(
    @InjectRepository(CategoryType)
    private readonly categoryTypeRepository: Repository<CategoryType>,
    private readonly categoryService: CategoryService,
    private readonly baseService: BaseService,
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
    return this.baseService.findAll(this.categoryTypeRepository, query, ['category']);
  }

  /**
   * Obtiene los tipos de categorías que fueron eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Los tipos de categorías que han sido eliminadas lógicamente.
   */
  async findAllSoftDeleted(query: FindAllDto<CategoryType>) {
    return this.baseService.findAllSoftDeleted(this.categoryTypeRepository, query, ['category']);
  }

  /**
   * Obtiene un tipo de categoría por medio del id.
   * @param id - Uuid de la categoría.
   * @returns El tipo de categoría obtenida.
   */
  async findOne(id: string) {
    return await this.baseService.findOne(id, this.categoryTypeRepository, ['category']);
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
    return this.baseService.hardDeleteWithRelationsCheck(
      id,
      this.categoryTypeRepository,
      async (id) => {
        return await this.categoryTypeRepository
          .createQueryBuilder('categoryType')
          .leftJoin('categoryType.product_type', 'productType')
          .where('categoryType.id = :id', { id })
          .andWhere('productType.id IS NOT NULL')
          .getExists();
      }
    );
  }

  /**
   * Elimina el tipo de categoría lógicamente.
   * @param id - Uuid de tipo de categoría.
   * @returns El tipo de categoría eliminada lógicamente.
   */
  async softDelete(id: string) {
    return this.baseService.softDeleteWithRelationsCheck(
      id,
      this.categoryTypeRepository,
      async (id) => {
        return await this.categoryTypeRepository
          .createQueryBuilder('categoryType')
          .leftJoin('categoryType.product_type', 'productType')
          .where('categoryType.id = :id', { id })
          .andWhere('productType.id IS NOT NULL')
          .getExists();
      }
    );
  }

  /**
   * Restaura el tipo de categoría y le quita la eliminación lógica.
   * @param id - Uuid del tipo de categoría.
   * @returns El tipo de categoría recuperada.
   */
  async restore(id: string) {
    return await this.baseService.restore(id, this.categoryTypeRepository);
  }
}
