const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // ===============================
    // USER DETAILS
    // ===============================

    userId: {
      type: String,
      required: true
    },

    userName: {
      type: String,
      required: true
    },

    userEmail: {
      type: String,
      required: true
    },

    // ===============================
    // VEHICLE DETAILS
    // ===============================

    vehicleId: {
      type: String,
      required: true
    },

    vehicleName: {
      type: String,
      required: true
    },

    vehicleImage: {
      type: String,
      default: ""
    },

    vehiclePrice: {
      type: Number,
      required: true
    },

    // ===============================
    // BOOKING DETAILS
    // ===============================

    pickupLocation: {
      type: String,
      required: true
    },

    dropLocation: {
      type: String,
      required: true
    },

    pickupDate: {
      type: String,
      required: true
    },

    pickupTime: {
      type: String,
      required: true
    },

    dropDate: {
      type: String,
      required: true
    },

    dropTime: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    licenseNumber: {
      type: String,
      required: true
    },

    driverRequired: {
      type: Boolean,
      default: false
    },

    notes: {
      type: String,
      default: ""
    },

    // ===============================
    // PAYMENT / PRICE
    // ===============================

    totalDays: {
      type: Number,
      required: true
    },

    totalPrice: {
      type: Number,
      required: true
    },

    // ===============================
    // BOOKING STATUS
    // ===============================

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected",
        "Completed"
      ],
      default: "Pending"
    },

    // ===============================
    // ADMIN MESSAGE
    // ===============================

    adminMessage: {
      type: String,
      default: "Your booking is waiting for admin confirmation."
    }

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Booking",
  bookingSchema
);