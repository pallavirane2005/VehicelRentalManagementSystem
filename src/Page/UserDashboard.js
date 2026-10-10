import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// ===============================
// API
// ===============================

const API = "http://localhost:5000";

// ===============================
// CATEGORIES
// ===============================

const categories = [
  "All",
  "Sedan",
  "SUV",
  "Luxury",
  "Bike",
  "Sports",
  "Electric"
];

// ===============================
// USER DASHBOARD
// ===============================

const UserDashboard = () => {
  const { logout } = useAuth();

const storedUser = JSON.parse(
  localStorage.getItem("user") || "null"
);

const user = storedUser;

  const [activeCategory, setActiveCategory] = useState("All");
  const [myBookings, setMyBookings] = useState([]);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ===============================
  // BOOKING FORM
  // ===============================

  const [bookingForm, setBookingForm] = useState({
    pickupLocation: "",
    dropLocation: "",
    pickupDate: "",
    pickupTime: "",
    dropDate: "",
    dropTime: "",
    phone: "",
    licenseNumber: "",
    driverRequired: false,
    notes: ""
  });

  // ===============================
  // VEHICLES
  // ===============================

  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  // ===============================
  // FETCH VEHICLES
  // ===============================

  const fetchVehicles = async () => {
    try {
      setLoadingVehicles(true);

      const response = await fetch(`${API}/api/vehicles`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load vehicles"
        );
      }

      console.log("VEHICLES FROM MONGODB:", data);

      setVehicles(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error("Vehicle loading error:", error);

      alert("Unable to load vehicles from MongoDB.");

      setVehicles([]);
    } finally {
      setLoadingVehicles(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // ===============================
  // FETCH MY BOOKINGS
  // ===============================

  const fetchMyBookings = async () => {
    try {
      const userId = user?.id || user?._id;

      if (!userId) {
        console.error("User ID not found.");
        return;
      }

      const response = await fetch(
        `${API}/api/bookings/user/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load bookings"
        );
      }

      setMyBookings(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "MY BOOKINGS ERROR:",
        error
      );
    }
  };

  // ===============================
  // AUTO REFRESH BOOKINGS
  // ===============================

  useEffect(() => {
    if (!user) return;

    fetchMyBookings();

    const interval = setInterval(() => {
      fetchMyBookings();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  // ===============================
  // FILTER VEHICLES
  // ===============================

  const filteredVehicles =
    activeCategory === "All"
      ? vehicles
      : vehicles.filter(
          (vehicle) =>
            vehicle.category === activeCategory
        );

  // ===============================
  // OPEN BOOKING MODAL
  // ===============================

  const openBookingModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  // ===============================
  // CLOSE MODAL
  // ===============================

  const closeModal = () => {
    setShowModal(false);
    setSelectedVehicle(null);

    setBookingForm({
      pickupLocation: "",
      dropLocation: "",
      pickupDate: "",
      pickupTime: "",
      dropDate: "",
      dropTime: "",
      phone: "",
      licenseNumber: "",
      driverRequired: false,
      notes: ""
    });
  };

  // ===============================
  // FORM CHANGE
  // ===============================

  const handleFormChange = (e) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;

    setBookingForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));
  };

  // ===============================
  // CALCULATE DAYS
  // ===============================

  const calculateDays = (start, end) => {
    if (!start || !end) {
      return 1;
    }

    const d1 = new Date(start);
    const d2 = new Date(end);

    const diff = Math.ceil(
      (d2 - d1) /
        (1000 * 60 * 60 * 24)
    );

    return diff > 0 ? diff : 1;
  };

  // ===============================
  // CALCULATE PRICE
  // ===============================

  const calculateTotalPrice = (
    pricePerDay,
    start,
    end
  ) => {
    const days = calculateDays(
      start,
      end
    );

    return Number(pricePerDay || 0) * days;
  };

  // ===============================
  // BOOKING SUBMIT
  // ===============================

  const handleBookingSubmit = async (e) => {
  e.preventDefault();

  // ===============================
  // VALIDATE BOOKING FORM
  // ===============================

  console.log("BOOKING FORM DATA:", bookingForm);

  const pickupLocation = String(
    bookingForm.pickupLocation || ""
  ).trim();

  const dropLocation = String(
    bookingForm.dropLocation || ""
  ).trim();

  const pickupDate = String(
    bookingForm.pickupDate || ""
  ).trim();

  const pickupTime = String(
    bookingForm.pickupTime || ""
  ).trim();

  const dropDate = String(
    bookingForm.dropDate || ""
  ).trim();

  const dropTime = String(
    bookingForm.dropTime || ""
  ).trim();

  const phone = String(
    bookingForm.phone || ""
  ).trim();

  const licenseNumber = String(
    bookingForm.licenseNumber || ""
  ).trim();

  if (!pickupLocation) {
    alert("Please enter Pickup Location.");
    return;
  }

  if (!dropLocation) {
    alert("Please enter Drop Location.");
    return;
  }

  if (!pickupDate) {
    alert("Please select Pickup Date.");
    return;
  }

  if (!pickupTime) {
    alert("Please select Pickup Time.");
    return;
  }

  if (!dropDate) {
    alert("Please select Drop Date.");
    return;
  }

  if (!dropTime) {
    alert("Please select Drop Time.");
    return;
  }

  if (!phone) {
    alert("Please enter Phone Number.");
    return;
  }

  if (!licenseNumber) {
    alert("Please enter License Number.");
    return;
  }

  if (!selectedVehicle) {
    alert("Please select a vehicle.");
    return;
  }

  if (new Date(`${dropDate}T${dropTime}`) <= new Date(`${pickupDate}T${pickupTime}`)) {
    alert("Drop date and time must be after pickup date and time.");
    return;
  }

    const totalDays = calculateDays(
      bookingForm.pickupDate,
      bookingForm.dropDate
    );

    const vehiclePrice =
      calculateTotalPrice(
        selectedVehicle.price,
        bookingForm.pickupDate,
        bookingForm.dropDate
      );

    const driverCharges =
      bookingForm.driverRequired
        ? totalDays * 20
        : 0;

    const totalPrice =
      vehiclePrice + driverCharges;

    const bookingData = {
      userId:
  user?.id ||
  user?._id ||
  user?.userId ||
  user?.user?.id ||
  user?.user?._id ||
  "",

userName:
  user?.name ||
  user?.username ||
  user?.user?.name ||
  "User",

userEmail:
  user?.email ||
  user?.userEmail ||
  user?.user?.email ||
  "",
      vehicleId:
        selectedVehicle._id ||
        selectedVehicle.id,

      vehicleName:
        selectedVehicle.name,

      vehicleImage:
        selectedVehicle.image || "",

      vehiclePrice:
        Number(selectedVehicle.price),

      pickupLocation,

      dropLocation,

      pickupDate,

      pickupTime,

      dropDate,

      dropTime,

      phone,

      licenseNumber,

      driverRequired:
        bookingForm.driverRequired,

      notes:
        bookingForm.notes,

      totalDays,

      totalPrice
    };

    try {
      const response = await fetch(
        `${API}/api/bookings`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(
              bookingData
            )
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create booking"
        );
      }

      alert(
        "✅ Booking submitted successfully!\n\n" +
          "⏳ Your booking is waiting for admin confirmation."
      );

      await fetchMyBookings();

      closeModal();
    } catch (error) {
      console.error(
        "BOOKING ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to submit booking."
      );
    }
  };

  // ===============================
  // RETURN UI
  // ===============================

  return (
    <div style={styles.container}>

      {/* =========================
          TOP BAR
      ========================== */}

      <div style={styles.topBar}>

        <div>
          <h2 style={styles.heading}>
            🚗 User Dashboard
          </h2>

          <p style={styles.subHeading}>
            Browse vehicles by category
            and book instantly
          </p>
        </div>

        <div style={styles.userInfo}>

          <div style={styles.userBadge}>

            <span style={styles.userAvatar}>
              👤
            </span>

            <div>

              <div style={styles.userName}>
                {user?.name || "User"}
              </div>

              <div style={styles.userEmail}>
                {user?.email || ""}
              </div>

            </div>

          </div>

          <button
            onClick={logout}
            style={styles.logoutBtn}
          >
            Logout
          </button>

        </div>

      </div>

      {/* =========================
          CATEGORY SECTION
      ========================== */}

      <div style={styles.categorySection}>

        <h3 style={styles.sectionTitle}>
          Select Category
        </h3>

        <div style={styles.tabs}>

          {categories.map(
            (category) => (

              <button
                key={category}
                onClick={() =>
                  setActiveCategory(
                    category
                  )
                }
                style={{
                  ...styles.tab,

                  background:
                    activeCategory ===
                    category
                      ? "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)"
                      : "#f1f5f9",

                  color:
                    activeCategory ===
                    category
                      ? "white"
                      : "#64748b",

                  boxShadow:
                    activeCategory ===
                    category
                      ? "0 4px 12px rgba(59, 130, 246, 0.3)"
                      : "none"
                }}
              >

                {category === "All"
                  ? "🚗"
                  : category === "Sedan"
                  ? "🚗"
                  : category === "SUV"
                  ? "🚙"
                  : category === "Luxury"
                  ? "🚘"
                  : category === "Bike"
                  ? "🏍️"
                  : category === "Sports"
                  ? "🏎️"
                  : "🔋"}

                {" "}

                {category}

              </button>

            )
          )}

        </div>

      </div>

      {/* =========================
          VEHICLES
      ========================== */}

      <div style={styles.section}>

        <h3 style={styles.sectionTitle}>

          {activeCategory === "All"
            ? "All Vehicles"
            : `${activeCategory} Vehicles`}

          <span
            style={styles.countBadge}
          >
            ({filteredVehicles.length})
          </span>

        </h3>

        {loadingVehicles ? (

          <div style={styles.emptyState}>

            <div style={styles.emptyIcon}>
              ⏳
            </div>

            <p style={styles.emptyText}>
              Loading vehicles from
              MongoDB...
            </p>

          </div>

        ) : filteredVehicles.length ===
          0 ? (

          <div style={styles.emptyState}>

            <div style={styles.emptyIcon}>
              🚗
            </div>

            <p style={styles.emptyText}>
              No vehicles found in
              MongoDB.
            </p>

          </div>

        ) : (

          <div style={styles.grid}>

            {filteredVehicles.map(
              (vehicle) => (

                <div
                  key={
                    vehicle._id ||
                    vehicle.id
                  }
                  style={styles.card}
                >

                  {/* VEHICLE IMAGE */}

                  <div
                    style={styles.image}
                  >

                    {vehicle.image ? (

                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        style={
                          styles.vehicleImage
                        }
                      />

                    ) : (

                      <div
                        style={
                          styles.noImage
                        }
                      >
                        🚗
                      </div>

                    )}

                  </div>

                  {/* VEHICLE DETAILS */}

                  <div
                    style={styles.cardBody}
                  >

                    <h4
                      style={styles.name}
                    >
                      {vehicle.name}
                    </h4>

                    <div
                      style={styles.metaRow}
                    >

                      <span
                        style={
                          styles.metaBadge
                        }
                      >
                        {vehicle.category}
                      </span>

                      <span
                        style={
                          styles.metaBadge
                        }
                      >
                        🪑 {vehicle.seats}
                        {" "}Seats
                      </span>

                      <span
                        style={
                          styles.metaBadge
                        }
                      >
                        ⛽ {vehicle.fuel}
                      </span>

                    </div>

                    <div
                      style={
                        styles.priceRow
                      }
                    >

                      <span
                        style={styles.price}
                      >
                        ₹{vehicle.price}
                      </span>

                      <span
                        style={styles.perDay}
                      >
                        / day
                      </span>

                    </div>

                    <div
                      style={
                        styles.statusRow
                      }
                    >

                      <span
                        style={{
                          ...styles.statusBadge,

                          background:
                            vehicle.status ===
                            "Available"
                              ? "#dcfce7"
                              : "#fee2e2",

                          color:
                            vehicle.status ===
                            "Available"
                              ? "#16a34a"
                              : "#dc2626"
                        }}
                      >
                        {vehicle.status ||
                          "Available"}
                      </span>

                    </div>

                    <button
                      onClick={() =>
                        openBookingModal(
                          vehicle
                        )
                      }

                      disabled={
                        vehicle.status &&
                        vehicle.status !==
                          "Available"
                      }

                      style={{
                        ...styles.bookBtn,

                        opacity:
                          vehicle.status &&
                          vehicle.status !==
                            "Available"
                            ? 0.5
                            : 1,

                        cursor:
                          vehicle.status &&
                          vehicle.status !==
                            "Available"
                            ? "not-allowed"
                            : "pointer"
                      }}
                    >

                      📅{" "}

                      {vehicle.status ===
                      "Available"
                        ? "Book Now"
                        : "Not Available"}

                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* =========================
          MY BOOKINGS
      ========================== */}

      <div style={styles.section}>

        <h3 style={styles.sectionTitle}>
          📋 My Bookings (
          {myBookings.length}
          )
        </h3>

        {myBookings.length === 0 ? (

          <div style={styles.emptyState}>

            <div style={styles.emptyIcon}>
              📭
            </div>

            <p style={styles.emptyText}>
              No bookings yet. Select a
              vehicle and book now!
            </p>

          </div>

        ) : (

          <div
            style={styles.bookingList}
          >

            {myBookings.map(
              (booking) => (

                <div
                  key={booking._id}
                  style={
                    styles.bookingItem
                  }
                >

                  <div
                    style={
                      styles.bookingLeft
                    }
                  >

                    <span
                      style={
                        styles.bookingIcon
                      }
                    >

                      {booking.vehicleImage ? (

                        <img
                          src={
                            booking.vehicleImage
                          }
                          alt={
                            booking.vehicleName
                          }
                          style={
                            styles.smallVehicleImage
                          }
                        />

                      ) : (

                        <span>
                          🚗
                        </span>

                      )}

                    </span>

                    <div>

                      <div
                        style={
                          styles.bookingName
                        }
                      >
                        {booking.vehicleName}
                      </div>

                      <div
                        style={
                          styles.bookingRoute
                        }
                      >
                        📍{" "}
                        {booking.pickupLocation}
                        {" → "}
                        {booking.dropLocation}
                      </div>

                      <div
                        style={
                          styles.bookingDate
                        }
                      >
                        📅{" "}
                        {booking.pickupDate}
                        {" "}
                        {booking.pickupTime}
                        {" → "}
                        {booking.dropDate}
                        {" "}
                        {booking.dropTime}
                      </div>

                      <div
                        style={{
                          ...styles.bookingStatus,

                          color:
                            booking.status ===
                            "Accepted"
                              ? "#16a34a"
                              : booking.status ===
                                "Rejected"
                              ? "#dc2626"
                              : "#d97706"
                        }}
                      >

                        {booking.status ===
                        "Accepted"
                          ? "✅ Booking Accepted"
                          : booking.status ===
                            "Rejected"
                          ? "❌ Booking Rejected"
                          : "⏳ Waiting for Admin Confirmation"}

                      </div>

                      {booking.adminMessage && (

                        <div
                          style={{
                            marginTop: "8px",
                            padding: "8px",
                            borderRadius: "8px",

                            background:
                              booking.status ===
                              "Accepted"
                                ? "#f0fdf4"
                                : booking.status ===
                                  "Rejected"
                                ? "#fef2f2"
                                : "#fffbeb",

                            color:
                              booking.status ===
                              "Accepted"
                                ? "#15803d"
                                : booking.status ===
                                  "Rejected"
                                ? "#b91c1c"
                                : "#92400e",

                            fontSize: "13px",
                            fontWeight: "600"
                          }}
                        >
                          {booking.adminMessage}
                        </div>

                      )}

                    </div>

                  </div>

                  <div
                    style={
                      styles.bookingRight
                    }
                  >

                    <div
                      style={
                        styles.bookingPrice
                      }
                    >
                      ₹{booking.totalPrice}
                    </div>

                    <div
                      style={
                        styles.bookingDays
                      }
                    >
                      {booking.totalDays}
                      {" "}day(s)
                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* =========================
          BOOKING MODAL
      ========================== */}

      {showModal &&
        selectedVehicle && (

          <div
            style={styles.modalOverlay}
            onClick={closeModal}
          >

            <div
              style={styles.modal}
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div
                style={
                  styles.modalHeader
                }
              >

                <h3
                  style={
                    styles.modalTitle
                  }
                >
                  📝 Book{" "}
                  {selectedVehicle.name}
                </h3>

                <button
                  type="button"
                  onClick={closeModal}
                  style={styles.closeBtn}
                >
                  ✕
                </button>

              </div>

              {/* VEHICLE SUMMARY */}

              <div
                style={
                  styles.vehicleSummary
                }
              >

                <span
                  style={
                    styles.summaryIcon
                  }
                >

                  {selectedVehicle.image ? (

                    <img
                      src={
                        selectedVehicle.image
                      }
                      alt={
                        selectedVehicle.name
                      }
                      style={
                        styles.summaryVehicleImage
                      }
                    />

                  ) : (

                    <span>
                      🚗
                    </span>

                  )}

                </span>

                <div>

                  <div
                    style={
                      styles.summaryName
                    }
                  >
                    {selectedVehicle.name}
                  </div>

                  <div
                    style={
                      styles.summaryPrice
                    }
                  >
                    ₹
                    {
                      selectedVehicle.price
                    }
                    {" "}/ day
                    {" • "}
                    {
                      selectedVehicle.seats
                    }
                    {" "}Seats
                    {" • "}
                    {
                      selectedVehicle.fuel
                    }
                  </div>

                </div>

              </div>

              {/* BOOKING FORM */}

              <form
                onSubmit={
                  handleBookingSubmit
                }
                style={styles.modalForm}
              >

                {/* PICKUP / DROP */}

                <div
                  style={styles.formRow}
                >

                  <div
                    style={
                      styles.formGroup
                    }
                  >

                    <label
                      style={
                        styles.formLabel
                      }
                    >
                      Pickup Location 📍 *
                    </label>

                    <input
                      type="text"
                      name="pickupLocation"
                      value={
                        bookingForm.pickupLocation
                      }
                      onChange={
                        handleFormChange
                      }
                      placeholder="Enter pickup address"
                      style={
                        styles.formInput
                      }
                    />

                  </div>

                  <div
                    style={
                      styles.formGroup
                    }
                  >

                    <label
                      style={
                        styles.formLabel
                      }
                    >
                      Drop Location 📍 *
                    </label>

                    <input
                      type="text"
                      name="dropLocation"
                      value={
                        bookingForm.dropLocation
                      }
                      onChange={
                        handleFormChange
                      }
                      placeholder="Enter drop address"
                      style={
                        styles.formInput
                      }
                    />

                  </div>

                </div>

                {/* PICKUP DATE / TIME */}

                <div
                  style={styles.formRow}
                >

                  <div
                    style={
                      styles.formGroup
                    }
                  >

                    <label
                      style={
                        styles.formLabel
                      }
                    >
                      Pickup Date 📅 *
                    </label>

                    <input
                      type="date"
                      name="pickupDate"
                      value={
                        bookingForm.pickupDate
                      }
                      onChange={
                        handleFormChange
                      }
                      style={
                        styles.formInput
                      }
                    />

                  </div>

                  <div
                    style={
                      styles.formGroup
                    }
                  >

                    <label
                      style={
                        styles.formLabel
                      }
                    >
                      Pickup Time 🕐 *
                    </label>

                    <input
                      type="time"
                      name="pickupTime"
                      value={
                        bookingForm.pickupTime
                      }
                      onChange={
                        handleFormChange
                      }
                      style={
                        styles.formInput
                      }
                    />

                  </div>

                </div>

                {/* DROP DATE / TIME */}

                <div
                  style={styles.formRow}
                >

                  <div
                    style={
                      styles.formGroup
                    }
                  >

                    <label
                      style={
                        styles.formLabel
                      }
                    >
                      Drop Date 📅 *
                    </label>

                    <input
                      type="date"
                      name="dropDate"
                      value={
                        bookingForm.dropDate
                      }
                      onChange={
                        handleFormChange
                      }
                      style={
                        styles.formInput
                      }
                    />

                  </div>

                  <div
                    style={
                      styles.formGroup
                    }
                  >

                    <label
                      style={
                        styles.formLabel
                      }
                    >
                      Drop Time 🕐 *
                    </label>

                    <input
                      type="time"
                      name="dropTime"
                      value={
                        bookingForm.dropTime
                      }
                      onChange={
                        handleFormChange
                      }
                      style={
                        styles.formInput
                      }
                    />

                  </div>

                </div>

                {/* PHONE / LICENSE */}

                <div
                  style={styles.formRow}
                >

                  <div
                    style={
                      styles.formGroup
                    }
                  >

                    <label
                      style={
                        styles.formLabel
                      }
                    >
                      Phone Number 📱 *
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={
                        bookingForm.phone
                      }
                      onChange={
                        handleFormChange
                      }
                      placeholder="+91 98765 43210"
                      style={
                        styles.formInput
                      }
                    />

                  </div>

                  <div
                    style={
                      styles.formGroup
                    }
                  >

                    <label
                      style={
                        styles.formLabel
                      }
                    >
                      License Number 🪪 *
                    </label>

                    <input
                      type="text"
                      name="licenseNumber"
                      value={
                        bookingForm.licenseNumber
                      }
                      onChange={
                        handleFormChange
                      }
                      placeholder="KA01 2025 1234567"
                      style={
                        styles.formInput
                      }
                    />

                  </div>

                </div>

                {/* DRIVER */}

                <div
                  style={
                    styles.checkboxRow
                  }
                >

                  <input
                    type="checkbox"
                    name="driverRequired"
                    checked={
                      bookingForm.driverRequired
                    }
                    onChange={
                      handleFormChange
                    }
                    style={
                      styles.checkbox
                    }
                    id="driver"
                  />

                  <label
                    htmlFor="driver"
                    style={
                      styles.checkboxLabel
                    }
                  >
                    🧑‍✈️ Need a Driver?
                    {" "}
                    (Extra ₹20/day)
                  </label>

                </div>

                {/* NOTES */}

                <div
                  style={
                    styles.formGroup
                  }
                >

                  <label
                    style={
                      styles.formLabel
                    }
                  >
                    Additional Notes 📝
                  </label>

                  <textarea
                    name="notes"
                    value={
                      bookingForm.notes
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Any special requests..."
                    style={{
                      ...styles.formInput,
                      minHeight: "80px",
                      resize: "vertical"
                    }}
                  />

                </div>

                {/* PRICE PREVIEW */}

                <div
                  style={
                    styles.pricePreview
                  }
                >

                  <div
                    style={
                      styles.previewRow
                    }
                  >

                    <span>
                      Vehicle Rent (
                      {
                        calculateDays(
                          bookingForm.pickupDate,
                          bookingForm.dropDate
                        )
                      }
                      {" days × ₹"}
                      {
                        selectedVehicle.price
                      }
                      )
                    </span>

                    <span>
                      ₹
                      {
                        calculateTotalPrice(
                          selectedVehicle.price,
                          bookingForm.pickupDate,
                          bookingForm.dropDate
                        )
                      }
                    </span>

                  </div>

                  {bookingForm.driverRequired && (

                    <div
                      style={
                        styles.previewRow
                      }
                    >

                      <span>
                        Driver Charges
                      </span>

                      <span>
                        +₹
                        {
                          calculateDays(
                            bookingForm.pickupDate,
                            bookingForm.dropDate
                          ) * 20
                        }
                      </span>

                    </div>

                  )}

                  <div
                    style={{
                      ...styles.previewRow,
                      ...styles.previewTotal
                    }}
                  >

                    <span>
                      Total Estimated Price
                    </span>

                    <span
                      style={
                        styles.totalAmount
                      }
                    >
                      ₹
                      {
                        calculateTotalPrice(
                          selectedVehicle.price,
                          bookingForm.pickupDate,
                          bookingForm.dropDate
                        ) +
                        (
                          bookingForm.driverRequired
                            ? calculateDays(
                                bookingForm.pickupDate,
                                bookingForm.dropDate
                              ) * 20
                            : 0
                        )
                      }
                    </span>

                  </div>

                </div>

                {/* BUTTONS */}

                <div
                  style={
                    styles.modalActions
                  }
                >

                  <button
                    type="button"
                    onClick={closeModal}
                    style={
                      styles.cancelBtn
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    style={
                      styles.confirmBtn
                    }
                  >
                    ✅ Confirm Booking
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

    </div>
  );
};

// ===============================
// STYLES
// ===============================

const styles = {

  container: {
    padding: "2rem",
    maxWidth: "1300px",
    margin: "0 auto",
    fontFamily:
      "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    background: "#f8fafc",
    minHeight: "100vh"
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    paddingBottom: "1.5rem",
    borderBottom:
      "2px solid #e2e8f0",
    flexWrap: "wrap",
    gap: "1rem"
  },

  heading: {
    margin: 0,
    color: "#1e293b",
    fontSize: "1.75rem"
  },

  subHeading: {
    margin: "0.25rem 0 0 0",
    color: "#64748b",
    fontSize: "0.95rem"
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },

  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    background: "white",
    padding: "0.6rem 1rem",
    borderRadius: "12px",
    border:
      "1px solid #e2e8f0",
    boxShadow:
      "0 2px 4px rgba(0,0,0,0.04)"
  },

  userAvatar: {
    fontSize: "1.5rem"
  },

  userName: {
    fontWeight: "700",
    color: "#1e293b",
    fontSize: "0.95rem"
  },

  userEmail: {
    color: "#94a3b8",
    fontSize: "0.8rem"
  },

  logoutBtn: {
    padding: "0.6rem 1.2rem",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.9rem",
    boxShadow:
      "0 4px 6px rgba(239, 68, 68, 0.2)"
  },

  categorySection: {
    marginBottom: "2rem"
  },

  sectionTitle: {
    color: "#334155",
    marginBottom: "1rem",
    fontSize: "1.1rem",
    fontWeight: "700"
  },

  tabs: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap"
  },

  tab: {
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem"
  },

  countBadge: {
    color: "#94a3b8",
    fontWeight: "500",
    marginLeft: "0.5rem"
  },

  section: {
    marginBottom: "2.5rem"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem"
  },

  card: {
    background: "white",
    borderRadius: "16px",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.05)",
    overflow: "hidden",
    border:
      "1px solid #e2e8f0",
    transition:
      "transform 0.2s, box-shadow 0.2s"
  },

  image: {
    height: "200px",
    width: "100%",
    background:
      "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  vehicleImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block"
  },

  noImage: {
    fontSize: "3rem",
    color: "#94a3b8"
  },

  smallVehicleImage: {
    width: "55px",
    height: "55px",
    objectFit: "cover",
    borderRadius: "10px"
  },

  cardBody: {
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem"
  },

  name: {
    margin: 0,
    color: "#1e293b",
    fontSize: "1.1rem",
    fontWeight: "700"
  },

  metaRow: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap"
  },

  metaBadge: {
    padding: "0.25rem 0.6rem",
    background: "#f1f5f9",
    borderRadius: "6px",
    fontSize: "0.75rem",
    color: "#64748b",
    fontWeight: "500"
  },

  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.3rem",
    marginTop: "0.25rem"
  },

  price: {
    color: "#3b82f6",
    fontWeight: "800",
    fontSize: "1.5rem"
  },

  perDay: {
    color: "#94a3b8",
    fontSize: "0.9rem"
  },

  statusRow: {
    marginTop: "0.2rem"
  },

  statusBadge: {
    display: "inline-block",
    padding: "0.25rem 0.6rem",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: "600"
  },

  bookBtn: {
    marginTop: "0.75rem",
    padding: "0.75rem",
    background:
      "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    boxShadow:
      "0 4px 12px rgba(59, 130, 246, 0.25)"
  },

  emptyState: {
    textAlign: "center",
    padding: "3rem",
    background: "white",
    borderRadius: "16px",
    border:
      "2px dashed #e2e8f0"
  },

  emptyIcon: {
    fontSize: "3rem",
    marginBottom: "0.5rem"
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: "1rem"
  },

  bookingList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem"
  },

  bookingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.25rem",
    background: "white",
    borderRadius: "14px",
    border:
      "1px solid #e2e8f0",
    boxShadow:
      "0 2px 6px rgba(0,0,0,0.03)",
    flexWrap: "wrap",
    gap: "1rem"
  },

  bookingLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },

  bookingIcon: {
    width: "55px",
    height: "55px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "10px"
  },

  bookingName: {
    fontWeight: "700",
    color: "#1e293b",
    fontSize: "1.05rem"
  },

  bookingRoute: {
    color: "#64748b",
    fontSize: "0.85rem",
    marginTop: "0.2rem"
  },

  bookingDate: {
    color: "#94a3b8",
    fontSize: "0.8rem",
    marginTop: "0.15rem"
  },

  bookingStatus: {
    fontSize: "0.8rem",
    fontWeight: "600",
    marginTop: "0.2rem"
  },

  bookingRight: {
    textAlign: "right"
  },

  bookingPrice: {
    color: "#3b82f6",
    fontWeight: "800",
    fontSize: "1.4rem"
  },

  bookingDays: {
    color: "#94a3b8",
    fontSize: "0.8rem"
  },

  // ===============================
  // MODAL
  // ===============================

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem"
  },

  modal: {
    background: "white",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "650px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow:
      "0 25px 50px rgba(0,0,0,0.25)"
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 2rem",
    borderBottom:
      "1px solid #e2e8f0",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    borderRadius:
      "20px 20px 0 0",
    position: "sticky",
    top: 0,
    zIndex: 10
  },

  modalTitle: {
    margin: 0,
    color: "#1e293b",
    fontSize: "1.25rem"
  },

  closeBtn: {
    background: "#f1f5f9",
    border: "none",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "1rem",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  vehicleSummary: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.25rem 2rem",
    background: "#f8fafc",
    borderBottom:
      "1px solid #e2e8f0"
  },

  summaryIcon: {
    width: "75px",
    height: "55px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "10px"
  },

  summaryVehicleImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block"
  },

  summaryName: {
    fontWeight: "700",
    color: "#1e293b",
    fontSize: "1.1rem"
  },

  summaryPrice: {
    color: "#64748b",
    fontSize: "0.9rem",
    marginTop: "0.2rem"
  },

  modalForm: {
    padding:
      "1.5rem 2rem 2rem 2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },

  formRow: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "1rem"
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem"
  },

  formLabel: {
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#475569"
  },

  formInput: {
    padding: "0.75rem 1rem",
    border:
      "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    outline: "none",
    fontFamily: "inherit",
    background: "#fafafa"
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.5rem 0"
  },

  checkbox: {
    width: "1.1rem",
    height: "1.1rem",
    accentColor: "#3b82f6",
    cursor: "pointer"
  },

  checkboxLabel: {
    color: "#475569",
    fontSize: "0.9rem",
    cursor: "pointer",
    fontWeight: "500"
  },

  pricePreview: {
    background:
      "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    padding: "1.25rem",
    borderRadius: "12px",
    border:
      "1px solid #bae6fd",
    marginTop: "0.5rem"
  },

  previewRow: {
    display: "flex",
    justifyContent: "space-between",
    color: "#475569",
    fontSize: "0.9rem",
    marginBottom: "0.5rem"
  },

  previewTotal: {
    borderTop:
      "2px solid #7dd3fc",
    paddingTop: "0.75rem",
    marginTop: "0.5rem",
    fontWeight: "700",
    color: "#1e293b",
    fontSize: "1.05rem"
  },

  totalAmount: {
    color: "#3b82f6",
    fontSize: "1.3rem"
  },

  modalActions: {
    display: "flex",
    gap: "1rem",
    marginTop: "0.5rem"
  },

  cancelBtn: {
    flex: 1,
    padding: "0.875rem",
    background: "#f1f5f9",
    color: "#64748b",
    border:
      "1.5px solid #e2e8f0",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "0.95rem",
    cursor: "pointer"
  },

  confirmBtn: {
    flex: 2,
    padding: "0.875rem",
    background:
      "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    boxShadow:
      "0 4px 12px rgba(34, 197, 94, 0.25)"
  }
};

export default UserDashboard;