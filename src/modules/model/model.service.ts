import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';
import { Repository } from 'typeorm';
import { SupabaseService } from '../../supabase/supabase.service';
import { ImageService } from '../../services/image/image.service';
import { BrandService } from '../brand/brand.service';
import { FindAllDto } from '../../dto/findAll.dto';
import { BaseService } from 'src/services/base/base.service';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    private readonly brandService: BrandService,
    private readonly supabaseService: SupabaseService,
    private readonly imageService: ImageService,
    private readonly baseService: BaseService,
  ) { }

  /**
   * Crea un modelo.
   * @param createBrandDto - Variables para crear el modelo.
   * @param file - La imagen si es que se sube.
   * @returns El modelo creado.
   */
  async create(createModelDto: CreateModelDto, file?: Express.Multer.File) {
    const { name, brand_id } = createModelDto;

    const brand = await this.brandService.findOne(brand_id);

    let image = null;

    if (file) {
      const optimizedImage = await this.imageService.optimizeImage(file);
      const fileName = `models/${Date.now()}-${file.originalname.replace(/\s/g, '_')}.webp`;

      image = await this.supabaseService.
        uploadFile('brands', fileName, optimizedImage, 'image/webp');
    }

    const model = this.modelRepository.create({
      name,
      image,
      brand
    });

    return await this.modelRepository.save(model);
  }

  /**
   * Obtiene los modelos que no han sido eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Los modelos que no han sido eliminadas lógicamente.
   */
  async findAll(query: FindAllDto<Model>) {
    return await this.baseService.findAll(this.modelRepository, query)
  }

  /**
     * Obtiene las marcas que fueron eliminadas lógicamente.
     * @param query - Paginación para la búsqueda.
     * @returns Las marcas que han sido eliminadas lógicamente.
     */
  async findAllSoftDeleted(query: FindAllDto<Model>) {
    return await this.baseService.findAllSoftDeleted(this.modelRepository, query)
  }

  /**
   * Obtiene un modelo por medio del id.
   * @param id - Uuid de la marca.
   * @returns El modelo obtenido.
   */
  async findOne(id: string) {
    return await this.baseService.findOne(id, this.modelRepository);
  }

  /**
   * Actualiza un modelo.
   * @param id - Uuid del modelo.
   * @param updateBrandDto - Variables necesarias para actualizar un modelo.
   * @param file - La imagen si es que se sube.
   * @returns El modelo actualizado.
   */
  async update(id: string, updateModelDto: UpdateModelDto, file?: Express.Multer.File) {
    const model = await this.findOne(id);

    if (updateModelDto.brand_id && updateModelDto.brand_id !== model.brand.id) {
      model.brand = await this.brandService.findOne(updateModelDto.brand_id);
    }

    if (file) {
      const optimizedImage = await this.imageService.optimizeImage(file);
      const fileName = `models/${Date.now()}-${file.originalname.replace(/\s/g, '_')}.webp`;

      if (model.image) {
        const oldPath = model.image.split('/').pop();
        console.log(`borrar: models/${oldPath}`);
        await this.supabaseService.deleteFile('brands', `models/${oldPath}`);
      }

      model.image = await this.supabaseService.uploadFile('brands', fileName, optimizedImage, 'image/webp')
    }

    this.modelRepository.merge(model, updateModelDto);

    return await this.modelRepository.save(model);
  }

  /**
   * Elimina la imagen asociada al modelo.
   * @param id - Uuid del modelo
   * @returns El modelo con la imagen eliminada si es que tiene.
   */
  async deleteImage(id: string) {
    const model = await this.findOne(id);

    if (!model.image) throw new BadRequestException('No hay imagen para eliminar.');

    const filePath = model.image.split('/').pop();
    console.log(`borrar: models/${filePath}`);
    await this.supabaseService.deleteFile('brands', `models/${filePath}`);

    model.image = null;
    await this.modelRepository.save(model);

    return { message: 'Imagen eliminada correctamente', data: model };
  }

  /**
   * Elimina de forma permanente un modelo y su imagen del storage.
   * @param id - Uuid de la marca.
   * @returns La marca eliminada físicamente.
   */
  async hardDelete(id: string) {
    const model = await this.findOne(id);

    if (model.image) {
      const oldPath = model.image.split('/').pop();
      console.log(`borrar: models/${oldPath}`);
      await this.supabaseService.deleteFile('brands', `models/${oldPath}`);
    }

    return await this.modelRepository.remove(model);
  }

  /**
   * Elimina el modelo lógicamente.
   * @param id - Uuid del modelo.
   * @returns El modelo eliminado lógicamente.
   */
  async softDelete(id: string) {
    return await this.baseService.softDelete(id, this.modelRepository);
  }

  /**
   * Restaura el modelo y le quita la eliminación lógica.
   * @param id - Uuid del modelo.
   * @returns El modelo recuperado.
   */
  async restore(id: string) {
    return await this.baseService.restore(id, this.modelRepository);
  }
}
