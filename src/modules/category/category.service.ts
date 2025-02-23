import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { FindAllDto } from '../../dto/findAll.dto';
import { BaseService } from 'src/services/base/base.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly baseService: BaseService,
  ) { }

  /**
   * Crea una categoría.
   * @param createCategoryDto - Variables para crear la categoría.
   * @returns La categoría creada.
   */
  async create(createCategoryDto: CreateCategoryDto) {
    const { description, name } = createCategoryDto;

    const category = this.categoryRepository.create({
      description,
      name
    });

    return await this.categoryRepository.save(category);
  }

  /**
   * Obtiene las categorías que no fueron eliminadas.
   * @param query - Paginación para la búsqueda.
   * @returns Las categorías que no han sido eliminadas.
   */
  async findAll(query: FindAllDto<Category>) {
    return await this.baseService.findAll(this.categoryRepository, query);
  }

  /**
   * Obtiene las categorías que fueron eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Las categorías que han sido eliminadas lógicamente.
   */
  async findAllSoftDeleted(query: FindAllDto<Category>) {
    return await this.baseService.findAllSoftDeleted(this.categoryRepository, query);
  }

  /**
   * Obtiene una categoría por medio del id.
   * @param id - Uuid de la categoría.
   * @returns La categoría obtenida.
   */
  async findOne(id: string) {
    return await this.baseService.findOne(id, this.categoryRepository);
  }

  /**
   * Actualiza una categoría.
   * @param id - Uuid de la categoría.
   * @param updateCategoryDto - Las variables necesarias para la actualización.
   * @returns La categoría actualizada.
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    this.categoryRepository.merge(category, updateCategoryDto);

    return await this.categoryRepository.save(category);
  }

  /**
   * Elimina de forma permanente una categoría.
   * @param id - Uuid de la categoría.
   * @returns La categoría eliminada físicamente.
   */
  async hardDelete(id: string) {
    return this.baseService.hardDeleteWithRelationsCheck(
      id,
      this.categoryRepository,
      async (id) => {
        return await this.categoryRepository
          .createQueryBuilder('category')
          .leftJoin('category.category_type', 'categoryType')
          .where('category.id = :id', { id })
          .andWhere('categoryType.id IS NOT NULL')
          .getExists();
      }
    );
  }

  /**
   * Elimina la categoría lógicamente.
   * @param id - Uuid de la categoría.
   * @returns La categoría eliminada lógicamente.
   */
  async softDelete(id: string) {
    return this.baseService.softDeleteWithRelationsCheck(
      id,
      this.categoryRepository,
      async (id) => {
        return await this.categoryRepository
          .createQueryBuilder('category')
          .leftJoin('category.category_type', 'categoryType')
          .where('category.id = :id', { id })
          .andWhere('categoryType.id IS NOT NULL')
          .getExists();
      }
    );
  }

  /**
   * Restaura la categoría y le quita la eliminación lógica.
   * @param id - Uuid de la categoría.
   * @returns La categoría recuperada.
   */
  async restore(id: string) {
    return this.baseService.restore(id, this.categoryRepository);
  }
}
