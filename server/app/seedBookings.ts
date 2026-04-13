import Booking from "./models/bookingModel.ts";
import db from "./config/db.ts";

export const seedBookings = async () => {
  try {
    // Authenticate and sync the Booking model with the database
    await db.authenticate();
    await Booking.sync({ alter: true });
    console.log("Database connection established and Booking table synced.");

    const tableIds = [
      "0636c88e-d9f1-47af-97c2-dd8adaf6dc1b",
      "07d253d0-2b40-46c9-836c-149a5921abfe",
      "0a0bddd7-093a-49c5-9618-db7d51d74709",
    ];

    const foodIds = [
      "001f2fb5-db98-4cb2-8926-d8b6ad0f96c7",
      "01e17791-0f2c-4c48-b6bb-2fbcf7e261cb",
      "0243845c-2aa6-4713-8523-44847e8b1cb1",
    ];

    const demoBookings = [];

    console.log("Generating 100 demo bookings...");

    // Create 100 demo bookings
    for (let i = 1; i <= 100; i++) {
      const randomTableId = "0636c88e-d9f1-47af-97c2-dd8adaf6dc1b";



      demoBookings.push({
        tableId: randomTableId,
        foodsId: foodIds,
        isDeleted: false,
      });
      
    }

    // Insert the bookings into the database
    await Booking.bulkCreate(demoBookings as any[], { validate: true });

    console.log("Successfully created 100 demo bookings.");
  } catch (error) {
    console.error("Failed to seed bookings:", error);
  } finally {
    process.exit(0);
  }
};

// Call the function automatically

