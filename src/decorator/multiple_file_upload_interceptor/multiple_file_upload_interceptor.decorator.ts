import { applyDecorators, BadRequestException, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";

export function MultipleFileUploadInterceptor(fieldName: string, maxFiles: number = 1) {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(fieldName, maxFiles, {
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
  );
}
