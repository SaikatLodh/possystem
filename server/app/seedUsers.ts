import bcrypt from "bcryptjs";
import User from "./models/userModel.ts";
import db from "./config/db.ts";

export const seedUsers = async () => {
  try {
    // Authenticate with the database
    await db.authenticate();
    console.log("Database connection has been established successfully.");

    // Hash a generic password for all demo users
    const hashedPassword = await bcrypt.hash("password123", 10);
    const demoUsers = [];

    console.log("Generating 100 demo users...");

    // Create 100 demo users
    for (let i = 1; i <= 100; i++) {
      demoUsers.push({
        // Fullname must be lowercase per userModel validation
        fullname: `demo user ${i}`,
        email: `demo_user_${i}@example.com`,
        password: hashedPassword,
        number: `9000000${i.toString().padStart(3, "0")}`,
        role: "customer",
        isVerified: true,
      });
    }

    // Insert the users into the database
    await User.bulkCreate(demoUsers, { validate: true });

    console.log("Successfully created 100 demo users with isVerified set to true.");
  } catch (error) {
    console.error("Failed to seed users:", error);
  } finally {
    process.exit(0);
  }
};

// Call the function automatically

