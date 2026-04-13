import http from "http";
import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import dotenv from "dotenv";
import cors from "cors";
import cookePerser from "cookie-parser";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import connectGraphql from "./graphql/graphql.ts";
import path from "path";
import { fileURLToPath } from "url";
import { seedUsers } from "./seedUsers.ts";
import { seedTables } from "./seedTables.ts";
import { seedFoods } from "./seedFoods.ts";
import { seedBookings } from "./seedBookings.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  dotenv.config({
    path: ".env",
  });

  app.use(
    cors({
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    }),
  );

  app.use(function (_, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL || "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS,HEAD,PATCH",
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    next();
  });

  app.set("trust proxy", 1);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(express.static("public"));
  app.use(express.static(path.join(__dirname, "uploads")));
  app.use(cookePerser());
  // seedUsers()
  // seedTables()
  // seedFoods()
  // seedBookings()
  return app;
}

export async function startServer(
  port: number = process.env.PORT ? Number(process.env.PORT) : 8000,
): Promise<http.Server> {
  const app = createApp();

  const graphqlServer = connectGraphql();
  await graphqlServer.start();

  app.use(
    "/graphql",
    graphqlUploadExpress({ maxFileSize: 52428800, maxFiles: 10 }),
    expressMiddleware(graphqlServer, {
      context: async ({ req, res }) => ({ req, res }),
    }),
  );

  const httpServer = http.createServer(app);
  return new Promise<http.Server>((resolve) => {
    httpServer.listen(port, () => {
      console.log(`Server ready at http://localhost:${port}/graphql`);
      resolve(httpServer);
    });
  });
}

// if (import.meta.url === module) {
//   startServer().catch((err) => {
//     console.error("Failed to start server:", err);
//     process.exit(1);
//   });
// }
