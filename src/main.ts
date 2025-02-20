import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './guard/jwt-auth/jwt-auth.guard';
import { PermissionGuard } from './guard/permission/permission.guard';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });

  const reflector = new Reflector();
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new PermissionGuard(reflector)
  );

  app.use(helmet());
  app.use(rateLimit(
    {
      windowMs: 1000, // 1 segundo
      max: 3, // Máximo 3 peticiones por IP en 1 segundo
      message: 'Demasiadas solicitudes, espera un momento.',
    }
  ));

  await app.listen(process.env.PORT ?? 3000);
  console.log(process.env.NODE_ENV)
}
bootstrap();
