import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { FindAllDto } from '../../dto/findAll.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) { }

  /**
   * Crea una categoría.
   * @param createCategoryDto - Variables para crear la categoría.
   * @returns La categoría creada.
   */
  async create(createCategoryDto: CreateCategoryDto) {
    const { description, name } = createCategoryDto;

    const category = await this.categoryRepository.create({
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
    const { limit, page, orderBy = 'createdAt', orderDirection = 'ASC' } = query;
    const [categories, totalCount] = await this.categoryRepository.findAndCount({
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
      data: categories
    };
  }

  /**
   * Obtiene las categorías que fueron eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Las categorías que han sido eliminadas lógicamente.
   */
  async findAllSoftDeleted(query: FindAllDto<Category>) {
    const { limit, page, orderBy = 'createdAt', orderDirection = 'ASC' } = query;
    const [categories, totalCount] = await this.categoryRepository.findAndCount({
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
      data: categories
    };
  }

  /**
   * Obtiene una categoría por medio del id.
   * @param id - Uuid de la categoría.
   * @returns La categoría obtenida.
   */
  async findOne(id: string) {
    return await this.categoryRepository.findOneOrFail({
      where: {
        id,
      },
    });
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
    const category = await this.categoryRepository.findOneOrFail({
      where: { id },
      relations: ['category_type'],
      withDeleted: true,
    });

    if (category.category_type.length > 0)
      throw new UnauthorizedException('No se puede borrar una categoría con tipos de categorías asignados');

    return await this.categoryRepository.remove(category);
  }

  /**
   * Elimina la categoría lógicamente.
   * @param id - Uuid del usuario, no el uuid de supabase.
   * @returns La categoría eliminada lógicamente.
   */
  async softDelete(id: string) {
    const category = await this.categoryRepository.findOneOrFail({
      where: { id },
      relations: ['category_type'],
      withDeleted: true,
    });

    if (category.deletedAt) {
      throw new UnauthorizedException('El usuario ya fue eliminado');
    }

    if (category.category_type.length > 0)
      throw new UnauthorizedException('No se puede borrar una categoría con tipos de categorías asignados');

    return await this.categoryRepository.softRemove(category);
  }

  /**
   * Restaura el categoría y le quita la eliminación lógica.
   * @param id - Uuid de la categoría.
   * @returns La categoría recuperada.
   */
  async restore(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!category) throw new UnauthorizedException('La categoría no existe');

    if (!category.deletedAt) throw new UnauthorizedException('El usuario no está eliminado');

    await this.categoryRepository.restore(id);

    return { message: 'Usuario restaurado correctamente', category };
  }
}
