import { applyDecorators, BadRequestException, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

export function OneFileUploadInterceptor(fieldName: string) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, {
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        console.log('Archivo recibido en el interceptor:', file);
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Solo se permiten imágenes'), false);
        }
        cb(null, true);
      },
    }))
  )
}
