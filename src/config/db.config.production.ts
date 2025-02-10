import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import * as path from 'path';

//factory function
export default (): PostgresConnectionOptions => ({
  //Put the url in .env
  url: process.env.SUPABASE_URL,
  type: "postgres",
  port: +process.env.DB_PORT,
  entities: [path.resolve(__dirname,"..") + '/**/*.entity{.ts,.js}'],
  // Only true in developmode
  synchronize: false,
  // logging: true
});