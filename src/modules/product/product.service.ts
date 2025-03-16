import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ILike, Repository } from 'typeorm';
import { ProductImage } from './entities/product_image.entity';
import { ImageService } from '../../services/image/image.service';
import { BaseService } from '../../services/base/base.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { ProductTypeService } from '../product_type/product_type.service';
import { FindAllDto } from '../../dto/findAll.dto';
import { StorageEnum } from '../../enum/storage.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly imageService: ImageService,
    private readonly supabaseService: SupabaseService,
    private readonly baseService: BaseService,
    private readonly productTypeService: ProductTypeService,
  ) { }

  /**
   * Crea un producto.
   * @param createBrandDto - Variables para crear el producto.
   * @param file - La imagen si es que se sube.
   * @returns El producto creado.
   */
  async create(createProductDto: CreateProductDto, file?: Express.Multer.File) {
    const { product_type_id } = createProductDto;

    const product_type = await this.productTypeService.findOne(product_type_id);

    let image = null;

    if (file) {
      const optimizedImage = await this.imageService.optimizeImage(file);
      const fileName =
        `${StorageEnum.PRODUCT_PRODUCT_FOLDER}/${Date.now()}-${file.originalname.replace(/\s/g, '_')}.webp`

      image = await this.supabaseService.
        uploadFile(StorageEnum.PRODUCT_BUCKET, fileName, optimizedImage, 'image/webp');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      image,
      product_type
    });

    return await this.productRepository.save(product);
  }

  /**
   * Obtiene los productos que no han sido eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Los productos que no han sido eliminadas lógicamente.
   */
  async findAll(query: FindAllDto<Product>) {
    const { page, limit, orderBy, orderDirection, search } = query;

    const whereConditions = search
      ? [
        { name: ILike(`%${search}%`) },
        { technology: ILike(`%${search}%`) },
      ]
      : [];

    const [items, total] = await this.productRepository.findAndCount({
      where: whereConditions.length ? whereConditions : undefined,
      take: limit,
      skip: (page - 1) * limit,
      order: { [orderBy]: orderDirection },
      relations: ['product_type'],
    });

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtiene los productos que fueron eliminadas lógicamente.
   * @param query - Paginación para la búsqueda.
   * @returns Los productos que han sido eliminadas lógicamente.
   */
  async findAllSoftDeleted(query: FindAllDto<Product>) {
    return await this.baseService.findAllSoftDeleted(this.productRepository, query, ['product_type']);
  }

  /**
   * Obtiene un producto por medio del id.
   * @param id - Uuid del producto.
   * @returns El producto obtenido.
   */
  async findOne(id: string) {
    return await this.baseService.findOne(id, this.productRepository, ['product_image', 'product_type']);
  }

  /**
   * Obtiene un producto por medio del id sin relaciones.
   * @param id - Uuid del producto.
   * @returns El producto obtenido sin relaciones.
   */
  async findOneNoRelations(id: string) {
    return await this.baseService.findOne(id, this.productRepository);
  }

  /**
   * Actualiza un prodcuto.
   * @param id - Uuid del producto.
   * @param updateBrandDto - Variables necesarias para actualizar un producto.
   * @param file - La imagen si es que se sube.
   * @returns El producto actualizado.
   */
  async update(id: string, updateProductDto: UpdateProductDto, file?: Express.Multer.File) {
    const product = await this.findOne(id);

    if (updateProductDto.product_type_id && updateProductDto.product_type_id !== product.product_type.id)
      product.product_type = await this.productTypeService.findOne(updateProductDto.product_type_id);

    if (file) {
      const optimizedImage = await this.imageService.optimizeImage(file);
      const fileName =
        `${StorageEnum.PRODUCT_PRODUCT_FOLDER}/${Date.now()}-${file.originalname.replace(/\s/g, '_')}.webp`

      if (product.image) {
        const oldPath = product.image.split('/').pop();
        console.log(`borrar: ${StorageEnum.PRODUCT_PRODUCT_FOLDER}/${oldPath}`);
        await this.supabaseService.deleteFile(StorageEnum.PRODUCT_BUCKET, `${StorageEnum.PRODUCT_PRODUCT_FOLDER}/${oldPath}`);
      }

      product.image = await this.supabaseService.uploadFile(StorageEnum.PRODUCT_BUCKET, fileName, optimizedImage, 'image/webp');
    }

    this.productRepository.merge(product, updateProductDto);

    return await this.productRepository.save(product);
  }

  /**
   * Elimina la imagen asociada al producto.
   * @param id - Uuid del producto
   * @returns El producto con la imagen eliminada si es que tiene.
   */
  async deleteImage(id: string) {
    const product = await this.findOne(id);

    if (!product.image) throw new BadRequestException('No hay imagen para eliminar.');

    const filePath = product.image.split('/').pop();
    console.log(`borrar: ${StorageEnum.PRODUCT_PRODUCT_FOLDER}/${filePath}`);
    await this.supabaseService.deleteFile(StorageEnum.PRODUCT_BUCKET, `${StorageEnum.PRODUCT_PRODUCT_FOLDER}/${filePath}`);

    product.image = null;
    await this.productRepository.save(product);

    return { message: 'Imagen eliminada correctamente', data: product };
  }

  /**
   * Elimina de forma permanente un producto y su imagen del storage.
   * @param id - Uuid de la marca.
   * @returns El producto eliminada físicamente.
   */
  async hardDelete(id: string) {
    const product = await this.findOne(id);

    if (product.image) {
      const oldPath = product.image.split('/').pop();
      console.log(`borrar: ${StorageEnum.PRODUCT_PRODUCT_FOLDER}/${oldPath}`);
      await this.supabaseService.deleteFile(StorageEnum.PRODUCT_BUCKET, `${StorageEnum.PRODUCT_PRODUCT_FOLDER}/${oldPath}`);
    }

    return await this.baseService.hardDeleteWithRelationsCheck(
      id,
      this.productRepository,
      async (id) => {
        return await this.productRepository
          .createQueryBuilder('product')
          .leftJoin('product.compatibility', 'compatibility')
          .leftJoin('product.product_image', 'product_image')
          .leftJoin('product.deposit_product', 'deposit_product')
          .where('product.id = :id', { id })
          .andWhere('compatibility.id IS NOT NULL OR product_image.id IS NOT NULL OR deposit_product.id IS NOT NULL')
          .getExists();
      }
    );
  }

  /**
   * Elimina el producto lógicamente.
   * @param id - Uuid del producto.
   * @returns El producto eliminado lógicamente.
   */
  async softDelete(id: string) {
    return await this.baseService.softDeleteWithRelationsCheck(
      id,
      this.productRepository,
      async (id) => {
        return await this.productRepository
          .createQueryBuilder('product')
          .leftJoin('product.compatibility', 'compatibility')
          .leftJoin('product.product_image', 'product_image')
          .leftJoin('product.deposit_product', 'deposit_product')
          .where('product.id = :id', { id })
          .andWhere('compatibility.id IS NOT NULL OR product_image.id IS NOT NULL OR deposit_product.id IS NOT NULL')
          .getExists();
      }
    );
  }

  /**
   * Restaura el producto y le quita la eliminación lógica.
   * @param id - Uuid del producto.
   * @returns El producto recuperado.
   */
  async restore(id: string) {
    return await this.baseService.restore(id, this.productRepository);
  }

  // * Product_Image

  /**
   * Agrega imágenes a un producto.
   * @param productId - UUID del producto.
   * @param files - Archivos de imagen (máximo 4).
   * @returns Las imágenes agregadas.
   */
  async addProductImages(productId: string, files: Express.Multer.File[]) {
    const product = await this.findOne(productId);
    const existingImages = await this.productImageRepository.count({ where: { product } });

    if (existingImages >= 4) {
      throw new BadRequestException("Este producto ya tiene el máximo de 4 imágenes.");
    }

    if (existingImages + files.length > 4) {
      throw new BadRequestException(`Solo puedes agregar ${4 - existingImages} imágenes más.`);
    }

    const imageEntities = await Promise.all(
      files.map(async (file) => {
        const optimizedImage = await this.imageService.optimizeImage(file);
        const fileName = `${StorageEnum.PRODUCT_CATALOG_FOLDER}/${Date.now()}-${file.originalname.replace(/\s/g, '_')}.webp`;

        const imageUrl = await this.supabaseService.uploadFile(StorageEnum.PRODUCT_BUCKET, fileName, optimizedImage, 'image/webp');

        return this.productImageRepository.create({ url: imageUrl, product });
      })
    );

    return await this.productImageRepository.save(imageEntities);
  }

  /**
   * Elimina una imagen de un producto.
   * @param imageId - UUID de la imagen.
   * @returns Mensaje de éxito.
   */
  async deleteProductImage(imageId: string) {
    const image = await this.productImageRepository.findOne({
      where: { id: imageId },
      relations: ['product'],
    });

    if (!image) throw new BadRequestException("Imagen no encontrada.");

    const filePath = image.url.split('/').pop();
    console.log(`Borrar: ${StorageEnum.PRODUCT_CATALOG_FOLDER}/${filePath}`);
    await this.supabaseService.deleteFile(StorageEnum.PRODUCT_BUCKET, `${StorageEnum.PRODUCT_CATALOG_FOLDER}/${filePath}`);

    await this.productImageRepository.remove(image);

    return { message: 'Imagen eliminada correctamente' };
  }

  /**
   * Obtiene todas las imágenes de un producto.
   * @param productId - UUID del producto.
   * @returns Lista de imágenes.
   */
  async getProductImages(productId: string) {
    return await this.productImageRepository.find({
      where: { product: { id: productId } },
      select: ['id', 'url'],
    });
  }
}
