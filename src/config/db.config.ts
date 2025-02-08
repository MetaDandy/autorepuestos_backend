import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import * as path from 'path';
import { registerAs } from "@nestjs/config";

//factory function
export default registerAs("dbconfig.dev", (): PostgresConnectionOptions => ({
  //Put the url in .env
  url: process.env.URL,
  type: "postgres",
  port: +process.env.DB_PORT,
  entities: [path.resolve(__dirname, "..") + '/**/*.entity{.ts,.js}'],
  // Only true in developmode
  synchronize: true,
  // logging: true
})
)