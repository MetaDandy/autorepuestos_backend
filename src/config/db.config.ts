import { registerAs } from "@nestjs/config";
import * as path from 'path';
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

//factory function
export default registerAs("dbconfig.dev", (): PostgresConnectionOptions => ({
  //Put the url in .env
  url: process.env.SUPABASE_URL,
  type: "postgres",
  entities: [path.resolve(__dirname, "..") + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  extra: {
    options: `-c timezone=${process.env.TZ || 'America/La_Paz'}`
  },
})
);