import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ImageService {
  /**
   * 📸 Optimiza una imagen con Sharp.
   * @param file - Archivo original subido por el usuario
   * @returns Buffer de la imagen optimizada
   */
  async optimizeImage(file: Express.Multer.File): Promise<Buffer> {
    return await sharp(file.buffer)
      .resize(500, 500, { fit: 'inside' })
      .toFormat('webp')
      .webp({ quality: 80 })
      .toBuffer();
  }
}
