import { startServer } from "./app/app.ts";
import db from "./app/config/db.ts";
import "./app/config/assotiation.ts";

const port = Number(process.env.PORT) || 5000;

// async function dropDatabase(dbName: string) {
//   try {
//     await db.query(`DROP DATABASE IF EXISTS ${dbName};`);
//     console.log(`Database ${dbName} dropped successfully.`);
//   } catch (error) {
//     console.error('Error dropping database:', error);
//   } finally {
//     await db.close();
//   }
// }

// dropDatabase("possystem");

db.sync({ force: false })
  .then(() => {
    console.log("Database synced");
  })
  .catch((error) => {
    console.log("Database not synced:", error);
  });

startServer(port).then(() => {
  console.log(`Server is running on http://localhost:${port}`);
});
