import { Injectable } from '@nestjs/common';
import { CreateCompatibilityDto } from './dto/create-compatibility.dto';
import { UpdateCompatibilityDto } from './dto/update-compatibility.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Compatibility } from './entities/compatibility.entity';
import { Repository } from 'typeorm';
import { BaseService } from '../../services/base/base.service';
import { ProductService } from '../product/product.service';
import { ModelService } from '../model/model.service';
import { FindAllDto } from '../../dto/findAll.dto';

@Injectable()
export class CompatibilityService {
  constructor(
    @InjectRepository(Compatibility)
    private readonly compatibilityReposiroty: Repository<Compatibility>,
    private readonly productService: ProductService,
    private readonly modelService: ModelService,
    private readonly baseService: BaseService,
  ) { }

  /**
   * Crea una compatibilidad.
   * @param createCompatibilityDto - Variables para crear la compatibilidad.
   * @returns La compatibilidad creada.
   */
  async create(createCompatibilityDto: CreateCompatibilityDto) {
    const { model_id, product_id } = createCompatibilityDto;

    const model = await this.modelService.findOne(model_id);
    const product = await this.productService.findOneNoRelations(product_id);

    const compatibility = this.compatibilityReposiroty.create({
      ...createCompatibilityDto,
      model,
      product
    });

    return await this.compatibilityReposiroty.save(compatibility);
  }

  /**
   * Obtiene las compatibilidades que no han sido eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Las compatibilidades que no han sido eliminadas lógicamente.
   */
  async findAll(query: FindAllDto<Compatibility>) {
    return await this.baseService.findAll(this.compatibilityReposiroty, query, ['product', 'model']);
  }

  /**
   * Obtiene las compatibilidades que fueron eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Las compatibilidades que han sido eliminadas lógicamente.
   */
  async findAllSoftDeleted(query: FindAllDto<Compatibility>) {
    return await this.baseService.findAllSoftDeleted(this.compatibilityReposiroty, query, ['product', 'model']);
  }

  /**
   * Retorna el producto con todas sus compatiblidades paginadas.
   * @param id - Uuid del producto.
   * @param query - Paginación para la búsqueda.
   * @returns Todas las compatibilidades del producto solicitado.
   */
  async findAllProducts(id: string, query: FindAllDto<Compatibility>) {
    const product = await this.productService.findOne(id);

    const { limit, orderBy, orderDirection, page } = query;

    const [compatibilities, totalCount] = await this.compatibilityReposiroty.findAndCount({
      where: {
        product: {
          id,
        }
      },
      relations: ['model'],
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
      data: compatibilities,
    }
  }

  /**
   * Retorna el modelo con todas sus compatiblidades paginadas.
   * @param id - Uuid del modelo.
   * @param query - Paginación para la búsqueda.
   * @returns Todas las compatibilidades del modelo solicitado.
   */
  async findAllModels(id: string, query: FindAllDto<Compatibility>) {
    const model = await this.modelService.findOne(id);

    const { limit, orderBy, orderDirection, page } = query;

    const [compatibilities, totalCount] = await this.compatibilityReposiroty.findAndCount({
      where: {
        model: {
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
      model,
      data: compatibilities,
    }
  }

  /**
   * Obtiene la compatibilidad por medio del id.
   * @param id - Uuid de la compatibilidad.
   * @returns La compatibilidad obtenido.
   */
  async findOne(id: string) {
    return await this.baseService.findOne(id, this.compatibilityReposiroty, ['product', 'model']);
  }

  /**
   * Actualiza una compatibilidad.
   * @param id - Uuid del producto.
   * @param updateCompatibilityDto - Variables necesarias para actualizar una compatibilidad.
   * @returns La compatibilidad actualizado.
   */
  async update(id: string, updateCompatibilityDto: UpdateCompatibilityDto) {
    const compatibility = await this.findOne(id);

    const { model_id, product_id } = updateCompatibilityDto;

    if (model_id && model_id !== compatibility.model.id)
      compatibility.model = await this.modelService.findOne(model_id);

    if (product_id && product_id !== compatibility.product.id)
      compatibility.product = await this.productService.findOne(product_id);

    this.compatibilityReposiroty.merge(compatibility, updateCompatibilityDto);

    return await this.compatibilityReposiroty.save(compatibility);
  }

  /**
   * Elimina de forma permanente una compatibilidad.
   * @param id - Uuid de la compatibilidad.
   * @returns La compatibilidad eliminada físicamente.
   */
  async hardDelete(id: string) {
    return await this.baseService.hardDelete(id, this.compatibilityReposiroty);
  }

  /**
   * Elimina la compatibilidad lógicamente.
   * @param id - Uuid de la compatibilidad.
   * @returns La compatibilidad eliminada lógicamente.
   */
  async softDelete(id: string) {
    return await this.baseService.softDelete(id, this.compatibilityReposiroty);
  }

  /**
   * Restaura la compatibilidad y le quita la eliminación lógica.
   * @param id - Uuid de la compatibilidad.
   * @returns La compatibilidad recuperada.
   */
  async restore(id: string) {
    return await this.baseService.restore(id, this.compatibilityReposiroty);
  }
}
