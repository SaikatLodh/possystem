import Table from "./models/tableModel.ts";
import db from "./config/db.ts";

export const seedTables = async () => {
  try {
    // Authenticate and sync model with the database
    await db.authenticate();
    await Table.sync({ alter: true });
    console.log("Database connection has been established and table synced.");

    const demoTables = [];

    console.log("Generating 100 demo tables...");

    // Create 100 demo tables
    for (let i = 1; i <= 100; i++) {
      demoTables.push({
        tableNumber: i,
        // Using a random capacity between 2, 4, 6, and 8 for variety
        capacity: [2, 4, 6, 8][Math.floor(Math.random() * 4)],
        status: "available",

        isDeleted: false,
      });
    }

    // Insert the tables into the database
    await Table.bulkCreate(demoTables);

    console.log("Successfully created 100 demo tables.");
  } catch (error) {
    console.error("Failed to seed tables:", error);
  } finally {
    process.exit(0);
  }
};

// Call the function automatically
