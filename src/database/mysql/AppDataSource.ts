import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { User } from "../../entities/User";

config();

const databaseConfig: DataSourceOptions = {
  name: "default",
  type: "mysql",
  host: process.env.DB_HOST || "db",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "default_db",
  entities: [User],
  synchronize: true,
};

export const AppDataSource = new DataSource(databaseConfig);
