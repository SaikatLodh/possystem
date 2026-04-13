import { startServer } from "./app/app.ts";
import db from "./app/config/db.ts";
import "./app/config/assotiation.ts";

const port = Number(process.env.PORT) || 5000;

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
