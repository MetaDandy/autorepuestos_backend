// import { Logger } from "@nestjs/common";
// import { DataSource } from "typeorm";
// import { seedRolesAndPermissions } from "./roless_permissions.seed";
// import { config } from "dotenv";

// Logger.warn('Seed running');
// config();

// const dataSource = new DataSource({
//   type: 'postgres',
//   url: process.env.SUPABASE_URL,
//   synchronize: false,
//   extra: {
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   },
//   entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//   logging: false,
// });

// dataSource.initialize().then(async () => {
//   Logger.warn('Database conected');

//   await seedRolesAndPermissions(dataSource);

//   Logger.warn('Seed completed');
//   process.exit();
// }).catch((error) => {
//   Logger.error('Error during inicialization or seeding: ',error);
//   process.exit(1);
// });

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
