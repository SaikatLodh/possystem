import { startServer } from "./app/app.js";
import db from "./app/config/db.js";
const port = Number(process.env.PORT) || 3000;
db.sync({ force: true })
    .then(() => {
    console.log("Database synced");
})
    .catch((error) => {
    console.log("Database not synced:", error);
});
startServer(port).then(() => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map