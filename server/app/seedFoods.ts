import Food from "./models/foodModel.ts";
import db from "./config/db.ts";

export const seedFoods = async () => {
  try {
    // Authenticate and sync the food model with the database
    await db.authenticate();
    await Food.sync({ alter: true });
    console.log("Database connection established and Food table synced.");

    const demoFoods = [];
    const categories = ["pizza", "burger", "drinks", "dessert"];

    console.log("Generating 100 demo foods...");

    // Create 100 demo foods
    for (let i = 1; i <= 100; i++) {
      const catIndex = Math.floor(Math.random() * categories.length);
      const randomCategory = categories[catIndex] as string;

      demoFoods.push({
        // Model requires name to be min 6, lowercase
        name: `demo tasty food ${i}`,
        // Model requires description to be min 10, lowercase
        description: `this is a tasty demo food item ${i} created for testing purposes`,
        price: 150 + i * 5, // Random-ish prices
        category: randomCategory,
      });
    }

    // Insert the foods into the database
    await Food.bulkCreate(demoFoods, { validate: true });

    console.log("Successfully created 100 demo foods.");
  } catch (error) {
    console.error("Failed to seed foods:", error);
  } finally {
    process.exit(0);
  }
};

// Call the function automatically
