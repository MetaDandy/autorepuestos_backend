import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { FindAllDto } from '../../dto/findAll.dto';
import { FindManyOptions, IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class BaseService {

  // TODO: en un futuro hacerlo una clase extendible.

  /**
   * 📄 Pagina los resultados de una entidad.
   * @param repository - Repositorio de TypeORM de la entidad.
   * @param query - Parámetros de paginación (límite, página, ordenamiento).
   * @param options - Opciones adicionales de búsqueda y relaciones.
   * @returns Un objeto con los datos paginados y metadatos.
   */
  async findAll<T>(repository: Repository<T>, query: FindAllDto<T>, options?: FindManyOptions<T>) {
    const { limit, page, orderBy, orderDirection } = query;

    const [data, totalCount] = await repository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [orderBy]: orderDirection || 'ASC'
      } as any,
      ...options,
    });

    return {
      page,
      limit,
      totalCount,
      hasMore: page * limit < totalCount,
      data,
    }
  }

  /**
   * 🗑️ Pagina los registros eliminados lógicamente de una entidad.
   * @param repository - Repositorio de TypeORM de la entidad.
   * @param query - Parámetros de paginación (límite, página, ordenamiento).
   * @returns Un objeto con los datos paginados de registros eliminados lógicamente.
   */
  async findAllSoftDeleted<T>(repository: Repository<T>, query: FindAllDto<T>) {
    return this.findAll(repository, query, {
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) } as any,
    });
  }

  /**
   * 🔍 Obtiene un registro por su ID.
   * @param id - UUID del registro.
   * @param relations - Relaciones opcionales a incluir.
   * @returns El registro encontrado o una excepción si no existe.
   */
  async findOne<T>(id: string, repository: Repository<T>, relations: string[] = []) {
    const entity = await repository.findOne({
      where: { id } as any,
      relations: relations.length > 0 ? relations : undefined,
    });

    if (!entity) throw new BadRequestException(`No se encontró el registro solicitado.`);

    return entity;
  }

  /**
   * 🗑️ Elimina físicamente un registro.
   * @param id - UUID del registro.
   * @param repository - Repositorio de TypeORM de la entidad.
   * @returns El registro eliminado.
   */
  async hardDelete<T>(id: string, repository: Repository<T>) {
    const entity = await repository.findOne({
      where: { id } as any,
      withDeleted: true,
    });

    if (!entity) throw new BadRequestException('El registro no existe');

    return repository.remove(entity);
  }

  /**
   * 🚫 Elimina lógicamente un registro.
   * @param id - UUID del registro.
   * @param repository - Repositorio de TypeORM de la entidad.
   * @returns El registro eliminado lógicamente.
   */
  async softDelete<T>(id: string, repository: Repository<T>) {
    const entity = await repository.findOne({
      where: { id } as any,
    });

    if (!entity) throw new BadRequestException('El registro no existe');
    if ((entity as any).deletedAt) {
      throw new UnauthorizedException('El registro ya fue eliminado');
    }

    return repository.softRemove(entity);
  }

  /**
   * 📌 Verifica si un registro tiene relaciones antes de eliminar físicamente.
   * @param id - UUID del registro.
   * @param repository - Repositorio de TypeORM de la entidad.
   * @param relationCheck - Función que verifica relaciones y retorna un booleano.
   * @returns El registro eliminado si no tiene relaciones.
   */
  async hardDeleteWithRelationsCheck<T>(
    id: string, 
    repository: Repository<T>, 
    relationCheck: (id: string) => Promise<boolean>
  ) {
    const hasRelations = await relationCheck(id);
    if (hasRelations) {
      throw new UnauthorizedException('No se puede eliminar el registro porque tiene dependencias');
    }

    return this.hardDelete(id, repository);
  }

  /**
   * 🛑 Verifica si un registro tiene relaciones antes de eliminar lógicamente.
   * @param id - UUID del registro.
   * @param repository - Repositorio de TypeORM de la entidad.
   * @param relationCheck - Función que verifica relaciones y retorna un booleano.
   * @returns El registro eliminado lógicamente si no tiene relaciones.
   */
  async softDeleteWithRelationsCheck<T>(
    id: string, 
    repository: Repository<T>, 
    relationCheck: (id: string) => Promise<boolean>
  ) {
    const hasRelations = await relationCheck(id);
    if (hasRelations) {
      throw new UnauthorizedException('No se puede eliminar el registro porque tiene dependencias');
    }

    return this.softDelete(id, repository);
  }

  /**
   * 🔄 Restaura un registro eliminado lógicamente.
   * @param id - UUID del registro.
   * @param repository - Repositorio de TypeORM de la entidad.
   * @returns Mensaje de éxito con el registro restaurado.
   */
  async restore<T>(id: string, repository: Repository<T>) {
    const entity = await repository.findOne({
      where: { id } as any,
      withDeleted: true,
    });

    if (!entity) throw new BadRequestException('El registro no existe');
    if (!(entity as any).deletedAt) {
      throw new UnauthorizedException('El registro no está eliminado');
    }

    await repository.restore(id);

    return { message: 'Registro restaurado correctamente', entity };
  }
}
