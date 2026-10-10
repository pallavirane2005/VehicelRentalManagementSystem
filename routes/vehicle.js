const express = require("express");
const Vehicle = require("../models/vehicle");

const router = express.Router();


// ===============================
// GET ALL VEHICLES
// ===============================
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });

    res.status(200).json(vehicles);
  } catch (error) {
    console.error("GET VEHICLES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch vehicles",
    });
  }
});


// ===============================
// GET SINGLE VEHICLE
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    console.error("GET VEHICLE ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch vehicle",
    });
  }
});


// ===============================
// ADD VEHICLE
// ===============================
router.post("/", async (req, res) => {
  try {
    console.log("ADDING VEHICLE...");
    console.log(req.body);

    const {
      name,
      category,
      price,
      image,
      seats,
      fuel,
      status,
    } = req.body;

    if (
      !name ||
      !category ||
      price === undefined ||
      !image ||
      !seats ||
      !fuel
    ) {
      return res.status(400).json({
        message: "Please fill all required vehicle details",
      });
    }

    const vehicle = new Vehicle({
      name,
      category,
      price,
      image,
      seats,
      fuel,
      status: status || "Available",
    });

    await vehicle.save();

    console.log("VEHICLE SAVED:", vehicle._id);

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    console.error("ADD VEHICLE ERROR:", error);

    res.status(500).json({
      message: "Failed to add vehicle",
      error: error.message,
    });
  }
});


// ===============================
// UPDATE VEHICLE
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedVehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle,
    });
  } catch (error) {
    console.error("UPDATE VEHICLE ERROR:", error);

    res.status(500).json({
      message: "Failed to update vehicle",
    });
  }
});


// ===============================
// DELETE VEHICLE
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(
      req.params.id
    );

    if (!deletedVehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("DELETE VEHICLE ERROR:", error);

    res.status(500).json({
      message: "Failed to delete vehicle",
    });
  }
});


module.exports = router;