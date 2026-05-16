import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const db = new Sequelize(
  process.env.DB_NAME || "possystem",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: Number(process.env.DB_PORT) || 3306,
    logging: false,
  },
);

db.authenticate()
  .then(() =>
    console.log("Database connection has been established successfully."),
  )
  .catch((error) => console.error("Unable to connect to the database:", error));

export default db;
