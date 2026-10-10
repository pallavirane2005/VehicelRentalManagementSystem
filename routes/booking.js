const express = require("express");
const Booking = require("../models/booking");

const router = express.Router();


// ======================================
// GET ALL BOOKINGS
// ADMIN USES THIS
// ======================================

router.get("/", async (req, res) => {

  try {

    const bookings = await Booking
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);

  } catch (error) {

    console.error(
      "GET BOOKINGS ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch bookings"
    });

  }

});


// ======================================
// GET BOOKINGS OF ONE USER
// ======================================

router.get("/user/:userId", async (req, res) => {

  try {

    const bookings = await Booking
      .find({
        userId: req.params.userId
      })
      .sort({
        createdAt: -1
      });

    res.status(200).json(bookings);

  } catch (error) {

    console.error(
      "GET USER BOOKINGS ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch user bookings"
    });

  }

});


// ======================================
// CREATE BOOKING
// ======================================

router.post("/", async (req, res) => {

  try {

    console.log(
      "NEW BOOKING:",
      req.body
    );

    const {
      userId,
      userName,
      userEmail,

      vehicleId,
      vehicleName,
      vehicleImage,
      vehiclePrice,

      pickupLocation,
      dropLocation,

      pickupDate,
      pickupTime,

      dropDate,
      dropTime,

      phone,
      licenseNumber,

      driverRequired,
      notes,

      totalDays,
      totalPrice
    } = req.body;


    // ================================
    // VALIDATION
    // ================================

  const missingFields = [];

if (!userId) missingFields.push("User ID");
if (!userName) missingFields.push("User Name");
if (!userEmail) missingFields.push("User Email");
if (!vehicleId) missingFields.push("Vehicle ID");
if (!vehicleName) missingFields.push("Vehicle Name");
if (!pickupLocation) missingFields.push("Pickup Location");
if (!dropLocation) missingFields.push("Drop Location");
if (!pickupDate) missingFields.push("Pickup Date");
if (!pickupTime) missingFields.push("Pickup Time");
if (!dropDate) missingFields.push("Drop Date");
if (!dropTime) missingFields.push("Drop Time");
if (!phone) missingFields.push("Phone");
if (!licenseNumber) missingFields.push("License Number");
if (!totalDays) missingFields.push("Total Days");
if (totalPrice === undefined || totalPrice === null) {
  missingFields.push("Total Price");
}

if (missingFields.length > 0) {
  console.log("MISSING BOOKING FIELDS:", missingFields);

  return res.status(400).json({
    message:
      "Missing booking details: " +
      missingFields.join(", ")
  });
}


    // ================================
    // CREATE BOOKING
    // ================================

    const booking = new Booking({

      userId,
      userName,
      userEmail,

      vehicleId,
      vehicleName,
      vehicleImage: vehicleImage || "",
      vehiclePrice: Number(vehiclePrice || 0),

      pickupLocation,
      dropLocation,

      pickupDate,
      pickupTime,

      dropDate,
      dropTime,

      phone,
      licenseNumber,

      driverRequired:
        Boolean(driverRequired),

      notes: notes || "",

      totalDays:
        Number(totalDays),

      totalPrice:
        Number(totalPrice),

      status: "Pending",

      adminMessage:
        "Your booking is waiting for admin confirmation."

    });


    await booking.save();


    console.log(
      "BOOKING SAVED:",
      booking._id
    );


    res.status(201).json({

      message:
        "Booking submitted successfully",

      booking

    });

  } catch (error) {

    console.error(
      "CREATE BOOKING ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Failed to create booking",

      error:
        error.message

    });

  }

});


// ======================================
// UPDATE BOOKING STATUS
// ADMIN USES THIS
// ======================================

router.put("/:id", async (req, res) => {

  try {

    const {
      status,
      adminMessage
    } = req.body;


    // ================================
    // ACCEPT
    // ================================

    let message =
      adminMessage || "";


    if (status === "Accepted") {

      message =
        "Your booking has been accepted by the admin.";

    }


    // ================================
    // REJECT
    // ================================

    if (status === "Rejected") {

      message =
        adminMessage ||
        "Your booking was rejected because the vehicle or driver is not available.";

    }


    // ================================
    // UPDATE
    // ================================

    const updatedBooking =
      await Booking.findByIdAndUpdate(

        req.params.id,

        {
          status,
          adminMessage: message
        },

        {
          new: true,
          runValidators: true
        }

      );


    if (!updatedBooking) {

      return res.status(404).json({

        message:
          "Booking not found"

      });

    }


    console.log(
      "BOOKING UPDATED:",
      updatedBooking._id,
      updatedBooking.status
    );


    res.status(200).json({

      message:
        "Booking status updated successfully",

      booking:
        updatedBooking

    });

  } catch (error) {

    console.error(
      "UPDATE BOOKING ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Failed to update booking",

      error:
        error.message

    });

  }

});


module.exports = router;