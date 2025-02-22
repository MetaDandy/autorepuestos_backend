import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { IsNull, Not, Repository } from 'typeorm';
import * as sharp from 'sharp';
import { SupabaseService } from '../../supabase/supabase.service';
import { FindAllDto } from '../../dto/findAll.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    private readonly supabaseService: SupabaseService,
  ) { }

  // TODO: conectar con model

  /**
   * Crea una marca.
   * @param createBrandDto - Variables para crear la marca.
   * @param file - La imagen si es que se sube.
   * @returns La marca creada.
   */
  async create(createBrandDto: CreateBrandDto, file?: Express.Multer.File) {
    if (createBrandDto.logo && file)
      throw new BadRequestException('No puedes enviar un archivo y una URL al mismo tiempo.');

    let logoUrl = createBrandDto.logo;

    if (file) {
      const optimizedImage = await sharp(file.buffer)
        .resize(500, 500, { fit: 'inside' })
        .toFormat('webp')
        .webp({ quality: 80 })
        .toBuffer();

      const fileName = `logos/${Date.now()}-${file.originalname.replace(/\s/g, '_')}.webp`;
      const { data, error } = await this.supabaseService.getClient().storage
        .from('brands')
        .upload(fileName, optimizedImage, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/webp',
        });

      if (error) throw new Error('Error al subir la imagen');

      logoUrl = await this.supabaseService.getClient().
        storage.from('brands').getPublicUrl(data.path).data.publicUrl;
    }

    const brand = this.brandRepository.create({
      ...createBrandDto,
      logo: logoUrl
    })

    return await this.brandRepository.save(brand);
  }

  /**
   * Obtiene las marcas que no han sido eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Las marcas que no han sido eliminadas lógicamente.
   */
  async findAll(query: FindAllDto<Brand>) {
    const { limit, page, orderBy = 'createdAt', orderDirection = 'ASC' } = query;
    const [brands, totalCount] = await this.brandRepository.findAndCount({
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
      data: brands
    };
  }

  /**
   * Obtiene las marcas que fueron eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Las marcas que han sido eliminadas lógicamente.
   */
  async findAllSoftDeleted(query: FindAllDto<Brand>) {
    const { limit, page, orderBy = 'createdAt', orderDirection = 'ASC' } = query;
    const [brands, totalCount] = await this.brandRepository.findAndCount({
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
      data: brands
    };
  }

  /**
   * Obtiene una marca por medio del id.
   * @param id - Uuid de la marca.
   * @returns La marca obtenida.
   */
  async findOne(id: string) {
    const brand = await this.brandRepository.findOne({
      where: {
        id,
      },
      // relations: [''],
    });

    if (!brand) throw new BadRequestException('No se encontró la marca solicitada.');

    return brand;
  }

  /**
   * Actualiza una marca.
   * @param id - Uuid de la marca.
   * @param updateBrandDto - Variables necesarias para actualizar una marca.
   * @param file - La imagen si es que se sube.
   * @returns 
   */
  async update(id: string, updateBrandDto: UpdateBrandDto, file?: Express.Multer.File) {
    const brand = await this.brandRepository.findOne({ where: { id } });

    if (!brand) throw new BadRequestException('No se encontró la marca.');

    if ('logo' in updateBrandDto && file) {
      throw new BadRequestException('No puedes enviar un archivo y una URL al mismo tiempo.');
    }

    let logoUrl = brand.logo; // Mantener la imagen actual por defecto

    if (file) {
      const optimizedImage = await sharp(file.buffer)
        .resize(500, 500, { fit: 'inside' })
        .toFormat('webp')
        .webp({ quality: 80 })
        .toBuffer();

      const fileName = `logos/${Date.now()}-${file.originalname.replace(/\s/g, '_')}.webp`;

      const { data, error } = await this.supabaseService.getClient().storage
        .from('brands')
        .upload(fileName, optimizedImage, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/webp',
        });

      if (error) throw new Error('Error al subir la imagen');

      logoUrl = this.supabaseService.getClient().storage.from('brands').getPublicUrl(data.path).data.publicUrl;

      if (brand.logo) {
        const oldPath = brand.logo.split('/').pop();
        await this.supabaseService.getClient().storage.from('brands').remove([`logos/${oldPath}`]);
      }
    }

    // Si el usuario envía `logo: null`, eliminar la imagen
    if ('logo' in updateBrandDto && updateBrandDto.logo === null) {
      if (brand.logo) {
        const oldPath = brand.logo.split('/').pop();
        await this.supabaseService.getClient().storage.from('brands').remove([`logos/${oldPath}`]);
      }
      logoUrl = null;
    }

    // Construir solo los datos que se deben actualizar
    const updatedData: Partial<Brand> = { ...updateBrandDto };
    if (file || 'logo' in updateBrandDto) {
      updatedData.logo = logoUrl;
    }

    await this.brandRepository.update(id, updatedData);

    return this.brandRepository.findOne({ where: { id } });
  }

  /**
   * Elimina de forma permanente una marca y su imagen del storage.
   * @param id - Uuid de la marca.
   * @returns La marca eliminada físicamente.
   */
  async hardDelete(id: string) {
    const brand = await this.brandRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!brand) throw new BadRequestException('No se encontró la marca solicitada.')

    if (brand.logo) {
      const oldPath = brand.logo.split('/').pop();
      const { error } = await this.supabaseService
        .getClient()
        .storage.from('brands')
        .remove([`logos/${oldPath}`]);

      if (error) {
        throw new BadRequestException('Error al eliminar la imagen del logo');
      }
    }

    return await this.brandRepository.remove(brand);
  }

  /**
     * Elimina la marca lógicamente.
     * @param id - Uuid de la marca.
     * @returns La marca eliminada lógicamente.
     */
  async softDelete(id: string) {
    const brand = await this.brandRepository.findOne({
      where: { id },
      // relations: ['category_type'],
      withDeleted: true,
    });

    if (!brand) throw new BadRequestException('No se encontró la marca solicitada.')


    if (brand.deletedAt) {
      throw new UnauthorizedException('El usuario ya fue eliminado');
    }

    // if (category.category_type.length > 0)
    //   throw new UnauthorizedException('No se puede borrar una categoría con tipos de categorías asignados');

    return await this.brandRepository.softRemove(brand);
  }

  /**
   * Restaura la marca y le quita la eliminación lógica.
   * @param id - Uuid del tipo de la marca.
   * @returns La marca recuperada.
   */
  async restore(id: string) {
    const brand = await this.brandRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!brand) throw new UnauthorizedException('El tipo de categoría no existe');

    if (!brand.deletedAt) throw new UnauthorizedException('El tipo de categoría no está eliminado');

    await this.brandRepository.restore(id);

    return { message: 'Tipo de categoría restaurada correctamente', brand };
  }
}
