const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/admin");

const ADMIN_NAME = "Ajitha";
const ADMIN_EMAIL = "Ajitha2005@gmail.com";
const ADMIN_PASSWORD = "pallavirane2005";
const ADMIN_SECRET_KEY = "pallavirane2005";

async function createAdmin() {
  try {

    await mongoose.connect(
      "mongodb://localhost:27017/vehicleRentalDB"
    );

    console.log("MongoDB Connected Successfully!");

    // Check existing admin
    const existingAdmin = await Admin.findOne({
      email: ADMIN_EMAIL
    });

    if (existingAdmin) {
      console.log("Admin already exists!");

      await mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      ADMIN_PASSWORD,
      10
    );

    // Hash secret key too
    const hashedSecretKey = await bcrypt.hash(
      ADMIN_SECRET_KEY,
      10
    );

    // Create admin
    const admin = new Admin({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      secretKey: hashedSecretKey,
      role: "admin"
    });

    await admin.save();

    console.log("");
    console.log("==============================");
    console.log("ADMIN CREATED SUCCESSFULLY");
    console.log("==============================");
    console.log("Name:", ADMIN_NAME);
    console.log("Email:", ADMIN_EMAIL);
    console.log("Password:", ADMIN_PASSWORD);
    console.log("Secret Key:", ADMIN_SECRET_KEY);
    console.log("Role: admin");
    console.log("==============================");

    await mongoose.connection.close();

  } catch (error) {

    console.error("Error creating admin:", error);

    await mongoose.connection.close();
  }
}

createAdmin();