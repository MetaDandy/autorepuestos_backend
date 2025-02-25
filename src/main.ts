import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './guard/jwt-auth/jwt-auth.guard';
import { PermissionGuard } from './guard/permission/permission.guard';
import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  })

  const reflector = new Reflector();
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new PermissionGuard(reflector)
  );

  app.use(rateLimit(
    {
      windowMs: 1000,
      max: 3,
      message: 'Demasiadas solicitudes, espera un momento.',
    }
  ));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  await app.listen(process.env.PORT ?? 3000);
  console.log(process.env.NODE_ENV)
}
bootstrap();
