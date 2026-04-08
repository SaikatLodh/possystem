import { Sequelize } from "sequelize";

export const db = new Sequelize("possystem", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

db.authenticate()
  .then(() =>
    console.log(" Database connection has been established successfully."),
  )
  .catch((error) => console.error("Unable to connect to the database:", error));

export default db;
