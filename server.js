const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({
    extended: true
}));


// Uploaded images
app.use(
    "/uploads",
    express.static("uploads")
);


// MongoDB
mongoose
    .connect("mongodb://localhost:27017/vehicleRentalDB")
    .then(() => {

        console.log(
            "MongoDB Connected Successfully!"
        );

    })
    .catch((error) => {

        console.error(
            "MongoDB Connection Error:",
            error
        );

    });


// Routes
const authRoutes = require("./routes/auth");

const vehicleRoutes = require("./routes/vehicle");

const bookingRoutes = require("./routes/booking");


app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/vehicles",
    vehicleRoutes
);

app.use("/api/bookings", bookingRoutes);


// Test
app.get("/", (req, res) => {

    res.send(
        "Vehicle Rental Backend is Running!"
    );

});


// Server
app.listen(5000, () => {

    console.log(
        "Server running on http://localhost:5000"
    );

});