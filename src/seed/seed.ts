import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module'; // Importa el módulo de seeders
import { MainSeeder } from './main.seed';

async function bootstrap() {
  console.log('🚀 Ejecutando Seeders...');

  const app = await NestFactory.createApplicationContext(SeedModule); // Crea el contexto desde SeedModule
  const mainSeeder = app.get(MainSeeder); // Obtiene el seeder principal

  await mainSeeder.run(); // Ejecuta los seeders

  console.log('✅ Seeders completados.');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('❌ Error ejecutando seeders:', err);
});
