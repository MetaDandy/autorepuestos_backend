import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './guard/jwt-auth/jwt-auth.guard';
import { PermissionGuard } from './guard/permission/permission.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });

  const reflector = new Reflector();
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new PermissionGuard(reflector)
  )
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(process.env.NODE_ENV)
}
bootstrap();
