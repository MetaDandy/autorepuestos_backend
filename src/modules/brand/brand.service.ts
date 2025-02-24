import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { SupabaseService } from '../../supabase/supabase.service';
import { FindAllDto } from '../../dto/findAll.dto';
import { BaseService } from '../../services/base/base.service';
import { ImageService } from '../../services/image/image.service';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    private readonly imageService: ImageService,
    private readonly supabaseService: SupabaseService,
    private readonly baseService: BaseService,
  ) { }

  /**
   * Crea una marca.
   * @param createBrandDto - Variables para crear la marca.
   * @param file - La imagen si es que se sube.
   * @returns La marca creada.
   */
  async create(createBrandDto: CreateBrandDto, file?: Express.Multer.File) {
    const { name } = createBrandDto;

    let logo = null;

    if (file) {
      const optimizedImage = await this.imageService.optimizeImage(file);
      const fileName = `logos/${Date.now()}-${file.originalname.replace(/\s/g, '_')}.webp`;

      logo = await this.supabaseService
        .uploadFile('brands', fileName, optimizedImage, 'image/webp')
    }

    const brand = this.brandRepository.create({
      name,
      logo,
    });

    return await this.brandRepository.save(brand);
  }

  /**
   * Obtiene las marcas que no han sido eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Las marcas que no han sido eliminadas lógicamente.
   */
  async findAll(query: FindAllDto<Brand>) {
    return await this.baseService.findAll(this.brandRepository, query);
  }

  /**
   * Obtiene las marcas que fueron eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Las marcas que han sido eliminadas lógicamente.
   */
  async findAllSoftDeleted(query: FindAllDto<Brand>) {
    return await this.baseService.findAllSoftDeleted(this.brandRepository, query);
  }

  /**
   * Obtiene una marca por medio del id.
   * @param id - Uuid de la marca.
   * @returns La marca obtenida.
   */
  async findOne(id: string) {
    return await this.baseService.findOne(id, this.brandRepository);
  }

  /**
   * Actualiza una marca.
   * @param id - Uuid de la marca.
   * @param updateBrandDto - Variables necesarias para actualizar una marca.
   * @param file - La imagen si es que se sube.
   * @returns 
   */
  async update(id: string, updateBrandDto: UpdateBrandDto, file?: Express.Multer.File) {
    const brand = await this.findOne(id);

    if (file) {
      if (brand.logo) {
        const oldPath = brand.logo.split('/').pop();
        console.log(`borrar: logos/${oldPath}`);
        await this.supabaseService.deleteFile('brands', `logos/${oldPath}`);
      }

      const optimizedImage = await this.imageService.optimizeImage(file);
      const fileName = `logos/${Date.now()}-${file.originalname.replace(/\s/g, '_')}.webp`;

      brand.logo = await this.supabaseService.uploadFile('brands', fileName, optimizedImage, 'image/webp');
    }

    this.brandRepository.merge(brand, updateBrandDto);

    return await this.brandRepository.save(brand);
  }

  /**
   * Elimina la imagen asociada a la marca.
   * @param id - Uuid de la marca
   * @returns La marca con el logo eliminado si es que tiene.
   */
  async deleteImage(id: string) {
    const brand = await this.findOne(id);

    if (!brand.logo) throw new BadRequestException('No hay logo en la marca');

    const filePath = brand.logo.split('/').pop();
    console.log(`borrar: logos/${filePath}`);
    await this.supabaseService.deleteFile('brands', `logos/${filePath}`);

    brand.logo = null;
    await this.brandRepository.save(brand);

    return { message: 'Imagen eliminada correctamente', data: brand };
  }

  /**
   * Elimina de forma permanente una marca y su imagen del storage.
   * @param id - Uuid de la marca.
   * @returns La marca eliminada físicamente.
   */
  async hardDelete(id: string) {
    // Todo: meter una transaccion
    const brand = await this.findOne(id);

    if (brand.logo) {
      const oldPath = brand.logo.split('/').pop();
      console.log(`borrar: logos/${oldPath}`);
      await this.supabaseService.deleteFile('brands', `logos/${oldPath}`);
    }

    return await this.baseService.hardDeleteWithRelationsCheck(
      id,
      this.brandRepository,
      async (id) => {
        return await this.brandRepository
          .createQueryBuilder('brand')
          .leftJoin('brand.model', 'model')
          .where('category.id = :id', { id })
          .andWhere('model.id IS NOT NULL')
          .getExists();
      }
    );
  }

  /**
   * Elimina la marca lógicamente.
   * @param id - Uuid de la marca.
   * @returns La marca eliminada lógicamente.
   */
  async softDelete(id: string) {
    return await this.baseService.softDeleteWithRelationsCheck(
      id,
      this.brandRepository,
      async (id) => {
        return await this.brandRepository
          .createQueryBuilder('brand')
          .leftJoin('brand.model', 'model')
          .where('category.id = :id', { id })
          .andWhere('model.id IS NOT NULL')
          .getExists();
      }
    );
  }

  /**
   * Restaura la marca y le quita la eliminación lógica.
   * @param id - Uuid de la marca.
   * @returns La marca recuperada.
   */
  async restore(id: string) {
    return await this.baseService.restore(id, this.brandRepository);
  }
}
