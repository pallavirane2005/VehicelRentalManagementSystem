import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000";

const categories = [
  "All",
  "Sedan",
  "SUV",
  "Luxury",
  "Bike",
  "Sports",
  "Electric",
];

const emptyVehicleForm = {
  name: "",
  category: "Sedan",
  price: "",
  seats: "",
  fuel: "Petrol",
  status: "Available",
  image: "",
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [activeTab, setActiveTab] = useState("Vehicles");
  const [activeCategory, setActiveCategory] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [vehicleForm, setVehicleForm] =
    useState({ ...emptyVehicleForm });

  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [savingVehicle, setSavingVehicle] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(false);

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    fetchVehicles();
    fetchBookings();
  }, []);

  // ==========================================
  // FETCH VEHICLES
  // ==========================================

  const fetchVehicles = async () => {
    try {
      setLoadingVehicles(true);

      const response = await fetch(
        `${API}/api/vehicles`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load vehicles"
        );
      }

      setVehicles(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "FETCH VEHICLES ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to load vehicles."
      );
    } finally {
      setLoadingVehicles(false);
    }
  };

  // ==========================================
  // FETCH BOOKINGS
  // ==========================================

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);

      const response = await fetch(
        `${API}/api/bookings`
      );

      if (!response.ok) {
        setBookings([]);
        return;
      }

      const data = await response.json();

      setBookings(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "FETCH BOOKINGS ERROR:",
        error
      );

      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("data:image")) {
      return image;
    }

    if (image.startsWith("blob:")) {
      return image;
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${API}${image}`;
    }

    return image;
  };

  // ==========================================
  // FILTER VEHICLES
  // ==========================================

  const filteredVehicles =
    activeCategory === "All"
      ? vehicles
      : vehicles.filter(
          (vehicle) =>
            vehicle.category ===
            activeCategory
        );

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalRevenue = bookings
    .filter(
      (booking) =>
        booking.status !== "Cancelled"
    )
    .reduce(
      (sum, booking) =>
        sum +
        Number(
          booking.totalPrice || 0
        ),
      0
    );

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {
    setModalMode("add");
    setSelectedVehicle(null);

    setVehicleForm({
      ...emptyVehicleForm,
    });

    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (vehicle) => {
    setModalMode("edit");
    setSelectedVehicle(vehicle);

    setVehicleForm({
      name: vehicle.name || "",
      category:
        vehicle.category || "Sedan",
      price: vehicle.price || "",
      seats: vehicle.seats || "",
      fuel: vehicle.fuel || "Petrol",
      status:
        vehicle.status || "Available",
      image: vehicle.image || "",
    });

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setShowModal(false);
    setModalMode("add");
    setSelectedVehicle(null);

    setVehicleForm({
      ...emptyVehicleForm,
    });

    setImageProcessing(false);
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleFormChange = (e) => {
    const { name, value, files } =
      e.target;

    // -----------------------------
    // IMAGE
    // -----------------------------

    if (name === "image") {
      if (!files || !files[0]) {
        return;
      }

      const file = files[0];

      if (!file.type.startsWith("image/")) {
        alert(
          "Please select a valid image file."
        );
        return;
      }

      setImageProcessing(true);

      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          const maxWidth = 900;
          const maxHeight = 600;

          let width = img.width;
          let height = img.height;

          const scale = Math.min(
            maxWidth / width,
            maxHeight / height,
            1
          );

          width = Math.round(
            width * scale
          );

          height = Math.round(
            height * scale
          );

          const canvas =
            document.createElement(
              "canvas"
            );

          canvas.width = width;
          canvas.height = height;

          const ctx =
            canvas.getContext("2d");

          if (!ctx) {
            setImageProcessing(false);

            alert(
              "Unable to process image."
            );

            return;
          }

          ctx.drawImage(
            img,
            0,
            0,
            width,
            height
          );

          let compressedImage =
            canvas.toDataURL(
              "image/jpeg",
              0.65
            );

          if (
            compressedImage.length >
            85000
          ) {
            compressedImage =
              canvas.toDataURL(
                "image/jpeg",
                0.5
              );
          }

          setVehicleForm((prev) => ({
            ...prev,
            image: compressedImage,
          }));

          setImageProcessing(false);
        };

        img.onerror = () => {
          setImageProcessing(false);

          alert(
            "Unable to read selected image."
          );
        };

        img.src = event.target.result;
      };

      reader.onerror = () => {
        setImageProcessing(false);

        alert(
          "Unable to read selected image."
        );
      };

      reader.readAsDataURL(file);

      return;
    }

    // -----------------------------
    // OTHER FIELDS
    // -----------------------------

    setVehicleForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // ADD / UPDATE VEHICLE
  // ==========================================

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();

    if (
      !vehicleForm.name ||
      !vehicleForm.price ||
      !vehicleForm.seats
    ) {
      alert(
        "Please fill all required fields."
      );

      return;
    }

    if (imageProcessing) {
      alert(
        "Please wait until the image finishes processing."
      );

      return;
    }

    if (!vehicleForm.image) {
      alert(
        "Please select a vehicle image."
      );

      return;
    }

    try {
      setSavingVehicle(true);

      const vehicleData = {
        name: vehicleForm.name,
        category: vehicleForm.category,
        price: Number(
          vehicleForm.price
        ),
        seats: Number(
          vehicleForm.seats
        ),
        fuel: vehicleForm.fuel,
        status: vehicleForm.status,
        image:
          vehicleForm.image || "",
      };

      console.log(
        "SENDING VEHICLE:",
        vehicleData
      );

      let response;

      // =====================================
      // ADD
      // =====================================

      if (modalMode === "add") {
        response = await fetch(
          `${API}/api/vehicles`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              vehicleData
            ),
          }
        );
      }

      // =====================================
      // UPDATE
      // =====================================

      else {
        response = await fetch(
          `${API}/api/vehicles/${selectedVehicle._id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              vehicleData
            ),
          }
        );
      }

      // =====================================
      // READ RESPONSE SAFELY
      // =====================================

      const responseText =
        await response.text();

      let data = {};

      try {
        data = responseText
          ? JSON.parse(responseText)
          : {};
      } catch (error) {
        console.error(
          "SERVER RESPONSE:",
          responseText
        );

        throw new Error(
          `Server returned invalid response (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save vehicle"
        );
      }

      console.log(
        "VEHICLE SAVED:",
        data
      );

      alert(
        modalMode === "add"
          ? "Vehicle added successfully!"
          : "Vehicle updated successfully!"
      );

      closeModal();

      await fetchVehicles();
    } catch (error) {
      console.error(
        "SAVE VEHICLE ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to save vehicle."
      );
    } finally {
      setSavingVehicle(false);
    }
  };

  // ==========================================
  // DELETE VEHICLE
  // ==========================================

  const deleteVehicle = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/api/vehicles/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete vehicle"
        );
      }

      alert(
        "Vehicle deleted successfully!"
      );

      fetchVehicles();
    } catch (error) {
      console.error(
        "DELETE VEHICLE ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to delete vehicle."
      );
    }
  };

  // ==========================================
  // CHANGE VEHICLE STATUS
  // ==========================================

  const toggleVehicleStatus = async (
    vehicle
  ) => {
    const newStatus =
      vehicle.status === "Available"
        ? "Unavailable"
        : "Available";

    try {
      const response = await fetch(
        `${API}/api/vehicles/${vehicle._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...vehicle,
            status: newStatus,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update status"
        );
      }

      fetchVehicles();
    } catch (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to update vehicle status."
      );
    }
  };

  // ==========================================
  // UPDATE BOOKING STATUS
  // ==========================================

  const updateBookingStatus = async (
    bookingId,
    status
  ) => {
    try {
      const response = await fetch(
        `${API}/api/bookings/${bookingId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update booking"
        );
      }

      fetchBookings();
    } catch (error) {
      console.error(
        "BOOKING STATUS ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to update booking."
      );
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div style={styles.page}>

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div style={styles.topBar}>

        <div>
          <h1 style={styles.heading}>
            Admin Dashboard
          </h1>

          <p style={styles.subHeading}>
            Manage vehicles and customer
            bookings
          </p>
        </div>

        <div style={styles.userInfo}>

          <div style={styles.userBadge}>
            <span style={styles.userAvatar}>
              👨‍💼
            </span>

            <div>
              <div style={styles.userName}>
                {user?.name || "Admin"}
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

      {/* ================================= */}
      {/* STATISTICS */}
      {/* ================================= */}

      <div style={styles.statsGrid}>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            🚗
          </div>

          <div>
            <div style={styles.statValue}>
              {vehicles.length}
            </div>

            <div style={styles.statLabel}>
              Total Vehicles
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            ✅
          </div>

          <div>
            <div style={styles.statValue}>
              {
                vehicles.filter(
                  (v) =>
                    v.status ===
                    "Available"
                ).length
              }
            </div>

            <div style={styles.statLabel}>
              Available
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            📋
          </div>

          <div>
            <div style={styles.statValue}>
              {bookings.length}
            </div>

            <div style={styles.statLabel}>
              Total Bookings
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            💰
          </div>

          <div>
            <div style={styles.statValue}>
              ₹{totalRevenue}
            </div>

            <div style={styles.statLabel}>
              Revenue
            </div>
          </div>
        </div>

      </div>

      {/* ================================= */}
      {/* MAIN TABS */}
      {/* ================================= */}

      <div style={styles.adminTabs}>

        <button
          onClick={() =>
            setActiveTab("Vehicles")
          }
          style={{
            ...styles.adminTab,
            background:
              activeTab === "Vehicles"
                ? "#2563eb"
                : "#e2e8f0",
            color:
              activeTab === "Vehicles"
                ? "white"
                : "#475569",
          }}
        >
          🚗 Vehicles
        </button>

        <button
          onClick={() =>
            setActiveTab("Bookings")
          }
          style={{
            ...styles.adminTab,
            background:
              activeTab === "Bookings"
                ? "#2563eb"
                : "#e2e8f0",
            color:
              activeTab === "Bookings"
                ? "white"
                : "#475569",
          }}
        >
          📋 Customer Bookings
          <span style={styles.tabBadge}>
            {bookings.length}
          </span>
        </button>

      </div>

      {/* ================================= */}
      {/* VEHICLES */}
      {/* ================================= */}

      {activeTab === "Vehicles" && (
        <>

          <div style={styles.sectionHeader}>

            <div>
              <h2 style={styles.sectionTitle}>
                Vehicles
                <span
                  style={styles.countBadge}
                >
                  ({filteredVehicles.length})
                </span>
              </h2>
            </div>

            <button
              onClick={openAddModal}
              style={styles.addBtn}
            >
              ➕ Add New Vehicle
            </button>

          </div>

          {/* CATEGORY TABS */}

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
                        ? "#2563eb"
                        : "#e2e8f0",
                    color:
                      activeCategory ===
                      category
                        ? "white"
                        : "#475569",
                  }}
                >
                  {category}
                </button>
              )
            )}

          </div>

          {/* VEHICLE LIST */}

          {loadingVehicles ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                ⏳
              </div>

              <p>
                Loading vehicles...
              </p>
            </div>
          ) : filteredVehicles.length ===
            0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                🚗
              </div>

              <p style={styles.emptyText}>
                No vehicles found.
              </p>

              <button
                onClick={openAddModal}
                style={styles.addBtn}
              >
                Add Vehicle
              </button>
            </div>
          ) : (
            <div style={styles.grid}>

              {filteredVehicles.map(
                (vehicle) => (
                  <div
                    key={vehicle._id}
                    style={styles.card}
                  >

                    {/* IMAGE */}

                    <div style={styles.image}>

                      {vehicle.image ? (
                        <img
                          src={getImageUrl(
                            vehicle.image
                          )}
                          alt={
                            vehicle.name
                          }
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

                      <span
                        style={{
                          ...styles.statusTag,
                          background:
                            vehicle.status ===
                            "Available"
                              ? "#16a34a"
                              : "#dc2626",
                        }}
                      >
                        {vehicle.status}
                      </span>

                    </div>

                    {/* BODY */}

                    <div
                      style={styles.cardBody}
                    >

                      <h3
                        style={styles.name}
                      >
                        {vehicle.name}
                      </h3>

                      <div
                        style={
                          styles.metaRow
                        }
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
                          👥 {vehicle.seats}
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
                          style={
                            styles.price
                          }
                        >
                          ₹{vehicle.price}
                        </span>

                        <span
                          style={
                            styles.perDay
                          }
                        >
                          /day
                        </span>
                      </div>

                      <div
                        style={
                          styles.actionRow
                        }
                      >

                        <button
                          onClick={() =>
                            openEditModal(
                              vehicle
                            )
                          }
                          style={
                            styles.editBtn
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() =>
                            toggleVehicleStatus(
                              vehicle
                            )
                          }
                          style={{
                            ...styles.statusBtn,
                            background:
                              vehicle.status ===
                              "Available"
                                ? "#fef3c7"
                                : "#dcfce7",
                            color:
                              vehicle.status ===
                              "Available"
                                ? "#92400e"
                                : "#166534",
                          }}
                        >
                          {vehicle.status ===
                          "Available"
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                        <button
                          onClick={() =>
                            deleteVehicle(
                              vehicle._id
                            )
                          }
                          style={
                            styles.deleteBtn
                          }
                        >
                          🗑️
                        </button>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </>
      )}

      {/* ================================= */}
      {/* BOOKINGS */}
      {/* ================================= */}

      {activeTab === "Bookings" && (
        <div>

          <div style={styles.sectionHeader}>

            <h2 style={styles.sectionTitle}>
              Customer Bookings
            </h2>

            <button
              onClick={fetchBookings}
              style={styles.refreshBtn}
            >
              🔄 Refresh
            </button>

          </div>

          {loadingBookings ? (
            <div style={styles.emptyState}>
              ⏳ Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                📋
              </div>

              <p style={styles.emptyText}>
                No customer bookings yet.
              </p>

            </div>
          ) : (
            <div
              style={
                styles.bookingList
              }
            >

              {bookings.map((booking) => {

                const vehicleImage =
                  booking.vehicleImage ||
                  booking.vehicle?.image ||
                  "";

                const vehicleName =
                  booking.vehicleName ||
                  booking.vehicle?.name ||
                  "Vehicle";

                const customerName =
                  booking.userName ||
                  booking.name ||
                  booking.user?.name ||
                  "Customer";

                const customerEmail =
                  booking.userEmail ||
                  booking.email ||
                  booking.user?.email ||
                  "";

                return (
                  <div
                    key={
                      booking._id
                    }
                    style={
                      styles.bookingItem
                    }
                  >

                    <div
                      style={
                        styles.bookingLeft
                      }
                    >

                      <div
                        style={
                          styles.bookingImage
                        }
                      >
                        {vehicleImage ? (
                          <img
                            src={getImageUrl(
                              vehicleImage
                            )}
                            alt={
                              vehicleName
                            }
                            style={
                              styles.smallVehicleImage
                            }
                          />
                        ) : (
                          "🚗"
                        )}
                      </div>

                      <div>

                        <div
                          style={
                            styles.bookingName
                          }
                        >
                          {vehicleName}
                        </div>

                        <div
                          style={
                            styles.bookingInfo
                          }
                        >
                          👤 {customerName}
                        </div>

                        <div
                          style={
                            styles.bookingInfo
                          }
                        >
                          📧 {customerEmail}
                        </div>

                        {booking.phone && (
                          <div
                            style={
                              styles.bookingInfo
                            }
                          >
                            📞 {booking.phone}
                          </div>
                        )}

                        <div
                          style={
                            styles.bookingDate
                          }
                        >
                          📅{" "}
                          {booking.pickupDate ||
                            booking.pickup ||
                            "-"}{" "}
                          →{" "}
                          {booking.dropDate ||
                            booking.drop ||
                            "-"}
                        </div>

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
                        ₹
                        {
                          booking.totalPrice ||
                          0
                        }
                      </div>

                      {booking.totalDays && (
                        <div
                          style={
                            styles.bookingDays
                          }
                        >
                          {
                            booking.totalDays
                          }{" "}
                          days
                        </div>
                      )}

                      <select
                        value={
                          booking.status ||
                          "Pending"
                        }
                        onChange={(e) =>
                          updateBookingStatus(
                            booking._id,
                            e.target.value
                          )
                        }
                        style={
                          styles.statusSelect
                        }
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>
                      </select>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>
      )}

      {/* ================================= */}
      {/* VEHICLE MODAL */}
      {/* ================================= */}

      {showModal && (
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

            <div
              style={styles.modalHeader}
            >

              <h2
                style={styles.modalTitle}
              >
                {modalMode === "add"
                  ? "Add New Vehicle"
                  : "Edit Vehicle"}
              </h2>

              <button
                onClick={closeModal}
                style={styles.closeBtn}
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={
                handleVehicleSubmit
              }
              style={styles.modalForm}
            >

              {/* IMAGE */}

              <div
                style={styles.formGroup}
              >

                <label
                  style={styles.formLabel}
                >
                  Vehicle Image 🖼️ *
                </label>

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={
                    handleFormChange
                  }
                  style={
                    styles.fileInput
                  }
                />

                {/* IMAGE PREVIEW */}

                {vehicleForm.image && (
                  <div
                    style={
                      styles.imagePreview
                    }
                  >

                    <img
                      src={getImageUrl(
                        vehicleForm.image
                      )}
                      alt="Vehicle preview"
                      style={
                        styles.previewImg
                      }
                    />

                    <span
                      style={
                        styles.previewText
                      }
                    >
                      {imageProcessing
                        ? "Processing image..."
                        : "Image ready"}
                    </span>

                  </div>
                )}

              </div>

              {/* NAME */}

              <div
                style={styles.formGroup}
              >

                <label
                  style={styles.formLabel}
                >
                  Vehicle Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    vehicleForm.name
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="BMW X5"
                  style={
                    styles.formInput
                  }
                />

              </div>

              {/* CATEGORY + PRICE */}

              <div style={styles.formRow}>

                <div
                  style={styles.formGroup}
                >

                  <label
                    style={styles.formLabel}
                  >
                    Category *
                  </label>

                  <select
                    name="category"
                    value={
                      vehicleForm.category
                    }
                    onChange={
                      handleFormChange
                    }
                    style={
                      styles.formInput
                    }
                  >
                    <option value="Sedan">
                      Sedan
                    </option>

                    <option value="SUV">
                      SUV
                    </option>

                    <option value="Luxury">
                      Luxury
                    </option>

                    <option value="Bike">
                      Bike
                    </option>

                    <option value="Sports">
                      Sports
                    </option>

                    <option value="Electric">
                      Electric
                    </option>
                  </select>

                </div>

                <div
                  style={styles.formGroup}
                >

                  <label
                    style={styles.formLabel}
                  >
                    Price Per Day ₹ *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={
                      vehicleForm.price
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="500"
                    min="0"
                    style={
                      styles.formInput
                    }
                  />

                </div>

              </div>

              {/* SEATS + FUEL */}

              <div style={styles.formRow}>

                <div
                  style={styles.formGroup}
                >

                  <label
                    style={styles.formLabel}
                  >
                    Seats *
                  </label>

                  <input
                    type="number"
                    name="seats"
                    value={
                      vehicleForm.seats
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="4"
                    min="1"
                    style={
                      styles.formInput
                    }
                  />

                </div>

                <div
                  style={styles.formGroup}
                >

                  <label
                    style={styles.formLabel}
                  >
                    Fuel Type
                  </label>

                  <select
                    name="fuel"
                    value={
                      vehicleForm.fuel
                    }
                    onChange={
                      handleFormChange
                    }
                    style={
                      styles.formInput
                    }
                  >

                    <option value="Petrol">
                      Petrol
                    </option>

                    <option value="Diesel">
                      Diesel
                    </option>

                    <option value="Electric">
                      Electric
                    </option>

                    <option value="Hybrid">
                      Hybrid
                    </option>

                  </select>

                </div>

              </div>

              {/* STATUS */}

              <div
                style={styles.formGroup}
              >

                <label
                  style={styles.formLabel}
                >
                  Status
                </label>

                <select
                  name="status"
                  value={
                    vehicleForm.status
                  }
                  onChange={
                    handleFormChange
                  }
                  style={
                    styles.formInput
                  }
                >

                  <option value="Available">
                    Available
                  </option>

                  <option value="Unavailable">
                    Unavailable
                  </option>

                </select>

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
                  disabled={
                    savingVehicle ||
                    imageProcessing
                  }
                  style={{
                    ...styles.confirmBtn,
                    opacity:
                      savingVehicle ||
                      imageProcessing
                        ? 0.6
                        : 1,
                  }}
                >
                  {imageProcessing
                    ? "Processing Image..."
                    : savingVehicle
                    ? "Saving..."
                    : modalMode === "add"
                    ? "➕ Add Vehicle"
                    : "💾 Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

// ==========================================
// STYLES
// ==========================================

const styles = {
  page: {
    minHeight: "100vh",
    padding: "2rem",
    background: "#f8fafc",
    fontFamily:
      "Inter, Arial, sans-serif",
    boxSizing: "border-box",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
    marginBottom: "2rem",
    paddingBottom: "1.5rem",
    borderBottom:
      "2px solid #e2e8f0",
  },

  heading: {
    margin: 0,
    color: "#1e293b",
    fontSize: "1.8rem",
  },

  subHeading: {
    margin:
      "0.3rem 0 0",
    color: "#64748b",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },

  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "0.7rem",
    padding: "0.6rem 1rem",
    background: "white",
    borderRadius: "12px",
    border:
      "1px solid #e2e8f0",
  },

  userAvatar: {
    fontSize: "1.5rem",
  },

  userName: {
    fontWeight: "700",
    color: "#1e293b",
  },

  userEmail: {
    fontSize: "0.8rem",
    color: "#94a3b8",
  },

  logoutBtn: {
    border: "none",
    background: "#ef4444",
    color: "white",
    padding:
      "0.7rem 1.2rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.25rem",
    borderRadius: "16px",
    border:
      "1px solid #e2e8f0",
    background: "white",
  },

  statIcon: {
    fontSize: "2rem",
  },

  statValue: {
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#1e293b",
  },

  statLabel: {
    color: "#64748b",
    fontSize: "0.85rem",
  },

  adminTabs: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
    marginBottom: "2rem",
  },

  adminTab: {
    border: "none",
    borderRadius: "12px",
    padding:
      "0.75rem 1.3rem",
    cursor: "pointer",
    fontWeight: "700",
  },

  tabBadge: {
    marginLeft: "0.4rem",
    padding:
      "0.15rem 0.5rem",
    borderRadius: "999px",
    background:
      "rgba(255,255,255,0.25)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "1rem",
  },

  sectionTitle: {
    color: "#334155",
    margin: 0,
    fontSize: "1.2rem",
  },

  countBadge: {
    marginLeft: "0.5rem",
    color: "#94a3b8",
  },

  tabs: {
    display: "flex",
    gap: "0.6rem",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
  },

  tab: {
    border: "none",
    borderRadius: "10px",
    padding:
      "0.6rem 1rem",
    cursor: "pointer",
    fontWeight: "600",
  },

  addBtn: {
    border: "none",
    borderRadius: "12px",
    padding:
      "0.75rem 1.3rem",
    background:
      "linear-gradient(135deg,#22c55e,#16a34a)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },

  refreshBtn: {
    border: "none",
    borderRadius: "10px",
    padding:
      "0.65rem 1rem",
    background: "#e0e7ff",
    color: "#3730a3",
    fontWeight: "700",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill,minmax(280px,1fr))",
    gap: "1.5rem",
  },

  card: {
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    border:
      "1px solid #e2e8f0",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.05)",
  },

  image: {
    height: "190px",
    position: "relative",
    background: "#e2e8f0",
    overflow: "hidden",
  },

  vehicleImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  noImage: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "4rem",
  },

  statusTag: {
    position: "absolute",
    top: "10px",
    right: "10px",
    color: "white",
    padding:
      "0.3rem 0.7rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: "700",
  },

  cardBody: {
    padding: "1.2rem",
  },

  name: {
    margin:
      "0 0 0.7rem",
    color: "#1e293b",
    fontSize: "1.15rem",
  },

  metaRow: {
    display: "flex",
    gap: "0.4rem",
    flexWrap: "wrap",
    marginBottom:
      "0.8rem",
  },

  metaBadge: {
    padding:
      "0.3rem 0.55rem",
    background: "#f1f5f9",
    color: "#64748b",
    borderRadius: "7px",
    fontSize: "0.75rem",
  },

  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.3rem",
    marginBottom:
      "0.8rem",
  },

  price: {
    color: "#2563eb",
    fontSize: "1.5rem",
    fontWeight: "800",
  },

  perDay: {
    color: "#94a3b8",
  },

  actionRow: {
    display: "flex",
    gap: "0.5rem",
  },

  editBtn: {
    flex: 1,
    border: "none",
    borderRadius: "9px",
    padding: "0.6rem",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontWeight: "700",
    cursor: "pointer",
  },

  statusBtn: {
    flex: 1.4,
    border: "none",
    borderRadius: "9px",
    padding: "0.6rem",
    fontWeight: "700",
    cursor: "pointer",
  },

  deleteBtn: {
    border: "none",
    borderRadius: "9px",
    padding:
      "0.6rem 0.8rem",
    background: "#fee2e2",
    color: "#dc2626",
    cursor: "pointer",
  },

  emptyState: {
    textAlign: "center",
    padding: "3rem",
    background: "white",
    borderRadius: "16px",
    border:
      "2px dashed #e2e8f0",
    marginTop: "1rem",
  },

  emptyIcon: {
    fontSize: "3rem",
    marginBottom:
      "0.5rem",
  },

  emptyText: {
    color: "#94a3b8",
  },

  bookingList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },

  bookingItem: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
    padding: "1.2rem",
    background: "white",
    border:
      "1px solid #e2e8f0",
    borderRadius: "14px",
  },

  bookingLeft: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
  },

  bookingImage: {
    width: "65px",
    height: "65px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f1f5f9",
    borderRadius: "10px",
    overflow: "hidden",
    fontSize: "2rem",
  },

  smallVehicleImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  bookingName: {
    fontWeight: "800",
    color: "#1e293b",
    marginBottom:
      "0.3rem",
  },

  bookingInfo: {
    color: "#64748b",
    fontSize: "0.85rem",
    marginTop:
      "0.15rem",
  },

  bookingDate: {
    color: "#94a3b8",
    fontSize: "0.8rem",
    marginTop:
      "0.2rem",
  },

  bookingRight: {
    textAlign: "right",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "0.3rem",
  },

  bookingPrice: {
    color: "#2563eb",
    fontSize: "1.4rem",
    fontWeight: "800",
  },

  bookingDays: {
    color: "#94a3b8",
    fontSize: "0.8rem",
  },

  statusSelect: {
    marginTop:
      "0.4rem",
    padding:
      "0.45rem 0.7rem",
    border:
      "1px solid #cbd5e1",
    borderRadius: "8px",
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(15,23,42,0.65)",
    backdropFilter:
      "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  },

  modal: {
    width: "100%",
    maxWidth: "720px",
    maxHeight: "92vh",
    overflowY: "auto",
    background: "white",
    borderRadius: "20px",
    boxShadow:
      "0 25px 50px rgba(0,0,0,0.25)",
  },

  modalHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding:
      "1.4rem 1.8rem",
    borderBottom:
      "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    background: "white",
    zIndex: 5,
  },

  modalTitle: {
    margin: 0,
    color: "#1e293b",
  },

  closeBtn: {
    width: "36px",
    height: "36px",
    border: "none",
    borderRadius: "50%",
    background: "#f1f5f9",
    cursor: "pointer",
    fontSize: "1rem",
  },

  modalForm: {
    padding: "1.8rem",
  },

  formGroup: {
    marginBottom: "1rem",
    flex: 1,
  },

  formRow: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },

  formLabel: {
    display: "block",
    marginBottom:
      "0.5rem",
    color: "#475569",
    fontWeight: "700",
    fontSize: "0.9rem",
  },

  formInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "0.85rem",
    border:
      "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "0.95rem",
    outline: "none",
  },

  fileInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "0.8rem",
    border:
      "1px dashed #cbd5e1",
    borderRadius: "10px",
    background: "#f8fafc",
  },

  imagePreview: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginTop: "0.8rem",
    padding: "0.7rem",
    background: "#f8fafc",
    border:
      "1px solid #e2e8f0",
    borderRadius: "10px",
  },

  previewImg: {
    width: "100px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  previewText: {
    color: "#64748b",
    fontWeight: "600",
  },

  modalActions: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
  },

  cancelBtn: {
    flex: 1,
    border: "none",
    borderRadius: "10px",
    padding: "0.85rem",
    background: "#e2e8f0",
    color: "#475569",
    fontWeight: "700",
    cursor: "pointer",
  },

  confirmBtn: {
    flex: 1,
    border: "none",
    borderRadius: "10px",
    padding: "0.85rem",
    background:
      "linear-gradient(135deg,#22c55e,#16a34a)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default AdminDashboard;