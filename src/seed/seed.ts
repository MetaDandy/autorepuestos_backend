import { Logger } from "@nestjs/common";
import dbConfig from "src/config/db.config";
import { DataSource } from "typeorm";
import { seedRolesAndPermissions } from "./roless_permissions.seed";

const dataSource = new DataSource(dbConfig());

dataSource.initialize().then(async () => {
  Logger.warn('Database conected');

  await seedRolesAndPermissions(dataSource);

  Logger.warn('Seed completed');
  process.exit();
}).catch((error) => {
  Logger.error('Error during inicialization or seeding: ',error);
  process.exit(1);
});

