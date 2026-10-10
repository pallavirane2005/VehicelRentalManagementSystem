import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const [captcha, setCaptcha] = useState("");

  const [captchaQuestion, setCaptchaQuestion] = useState({
    num1: 3,
    num2: 10
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const [loading, setLoading] = useState(false);

  // Generate CAPTCHA
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;

    setCaptchaQuestion({
      num1,
      num2
    });

    setCaptcha("");
  };

  // Admin Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    const correctAnswer =
      captchaQuestion.num1 + captchaQuestion.num2;

    // CAPTCHA validation
    if (Number(captcha) !== correctAnswer) {
      alert("Incorrect CAPTCHA. Please try again.");
      generateCaptcha();
      return;
    }

    // Check fields
    if (!email || !password || !secretKey) {
      alert("Please fill all the fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/admin-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password,
            secretKey
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Admin login failed");
        return;
      }

      // Save admin information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      if (rememberMe) {
        localStorage.setItem(
          "rememberAdmin",
          "true"
        );
      }

      alert("Admin login successful!");

      // Go to Admin Dashboard
      navigate("/admin-dashboard");

    } catch (error) {
      console.error(error);

      alert(
        "Cannot connect to server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">

      <div className="admin-container">

        {/* ================= LEFT SIDE ================= */}

        <div className="admin-login-card">

          {/* HEADER */}

          <div className="admin-header">

            <div className="admin-icon">
              🔐
            </div>

            <h1>
              Admin Login
            </h1>

            <p>
              Secure Administrator Access
            </p>

          </div>


          {/* FORM */}

          <div className="admin-form">

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}

              <label>
                Email ID / Username
                <span>*</span>
              </label>

              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />


              {/* PASSWORD */}

              <label>
                Password
                <span>*</span>
              </label>

              <div className="password-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>


              {/* SECRET KEY */}

              <label>
                Admin Secret Key
                <span>*</span>
              </label>

              <div className="password-wrapper">

                <input
                  type={
                    showSecretKey
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter admin secret key"
                  value={secretKey}
                  onChange={(e) =>
                    setSecretKey(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowSecretKey(
                      !showSecretKey
                    )
                  }
                >
                  {showSecretKey ? "🙈" : "🔑"}
                </button>

              </div>

              <small className="secret-hint">
                Authorized administrators only
              </small>


              {/* CAPTCHA */}

              <div className="captcha-container">

                <label>
                  Security Verification (CAPTCHA)
                  <span>*</span>
                </label>

                <div className="captcha-row">

                  <div className="captcha-question">

                    {captchaQuestion.num1}
                    {" + "}
                    {captchaQuestion.num2}
                    {" = ?"}

                  </div>

                  <button
                    type="button"
                    className="refresh-button"
                    onClick={generateCaptcha}
                  >
                    🔄
                  </button>

                </div>

                <input
                  type="number"
                  placeholder="Enter answer"
                  value={captcha}
                  onChange={(e) =>
                    setCaptcha(e.target.value)
                  }
                />

                <p>
                  Enter the answer to the math
                  question above
                </p>

              </div>


              {/* REMEMBER */}

              <div className="remember-row">

                <label className="remember-label">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(
                        e.target.checked
                      )
                    }
                  />

                  Remember me

                </label>

                <button
                  type="button"
                  className="forgot-button"
                  onClick={() =>
                    alert(
                      "Please contact the system administrator to reset the admin password."
                    )
                  }
                >
                  Forgot Password?
                </button>

              </div>


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="admin-login-button"
                disabled={loading}
              >

                {loading
                  ? "Logging in..."
                  : "🔐 Login to Admin Portal"}

              </button>

            </form>

          </div>

        </div>


        {/* ================= RIGHT SIDE ================= */}

        <div className="guidelines-card">

          <h2>
            📋 Guidelines for Admin Login
          </h2>

          <hr />

          <ul>

            <li>
              Use your registered Admin Email
              ID and Password
            </li>

            <li>
              Enter the correct Admin Secret Key
            </li>

            <li>
              CAPTCHA is required for login
            </li>

            <li>
              Do not share your admin
              credentials with anyone
            </li>

            <li>
              Admin access is restricted to
              authorized personnel
            </li>

            <li>
              Ensure you logout after your
              session
            </li>

          </ul>


          {/* NOTICE */}

          <div className="notice">

            <strong>
              🔔 Security Notice:
            </strong>

            <p>
              Keep your admin credentials and
              secret key confidential.
            </p>

          </div>


          {/* ADMIN FEATURES */}

          <div className="admin-features">

            <h3>
              Admin Portal
            </h3>

            <p>🚗 Vehicle Management</p>

            <p>➕ Add Vehicle</p>

            <p>✏️ Edit Vehicle</p>

            <p>🗑️ Delete Vehicle</p>

            <p>📋 View Customer Bookings</p>

            <p>🔄 Manage Booking Status</p>

          </div>

        </div>

      </div>


      {/* ================= CSS ================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .admin-page {
          min-height: 100vh;
          background: #eef3f8;
          font-family: Arial, Helvetica, sans-serif;
          padding: 18px 6px;
        }

        .admin-container {
          max-width: 1125px;
          margin: auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
        }

        /* LEFT CARD */

        .admin-login-card {
          background: white;
          border-radius: 7px;
          overflow: hidden;
          box-shadow: 0 3px 12px rgba(0,0,0,0.10);
        }

        .admin-header {
          background: linear-gradient(
            135deg,
            #214b7d,
            #2f70b7
          );

          color: white;
          text-align: center;
          padding: 28px 20px;
        }

        .admin-icon {
          font-size: 27px;
          margin-bottom: 4px;
        }

        .admin-header h1 {
          margin: 0;
          font-size: 28px;
        }

        .admin-header p {
          margin: 8px 0 0;
          font-size: 17px;
        }

        .admin-form {
          padding: 28px 40px;
        }

        .admin-form label {
          display: block;
          color: #243f62;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          margin-top: 17px;
        }

        .admin-form label span {
          color: red;
        }

        .admin-form input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #c4d2e4;
          border-radius: 7px;
          background: #edf4fd;
          font-size: 16px;
          outline: none;
        }

        .admin-form input:focus {
          border-color: #2871b7;
        }

        /* PASSWORD */

        .password-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid #c4d2e4;
          border-radius: 7px;
          background: #edf4fd;
          overflow: hidden;
        }

        .password-wrapper input {
          border: none;
          background: transparent;
        }

        .password-wrapper button {
          border: none;
          background: transparent;
          font-size: 18px;
          cursor: pointer;
          padding: 10px 14px;
        }

        .secret-hint {
          display: block;
          color: #718096;
          margin-top: 5px;
        }

        /* CAPTCHA */

        .captcha-container {
          margin-top: 20px;
          padding: 20px;
          border: 1px solid #d7e0eb;
          border-radius: 7px;
          background: #f7fafd;
        }

        .captcha-container label {
          margin-top: 0;
        }

        .captcha-row {
          display: flex;
          gap: 10px;
        }

        .captcha-question {
          flex: 1;
          text-align: center;
          padding: 15px;
          border: 1px dashed #9eb3cc;
          border-radius: 7px;
          background: #eaf0f7;
          font-size: 22px;
          font-weight: bold;
          color: #183c68;
        }

        .refresh-button {
          width: 62px;
          border: 1px solid #c5d3e5;
          background: #e7eff9;
          border-radius: 7px;
          cursor: pointer;
          font-size: 18px;
        }

        .captcha-container input {
          width: 65%;
          margin-top: 10px;
        }

        .captcha-container p {
          margin: 8px 0 0;
          color: #70829a;
          font-size: 13px;
        }

        /* REMEMBER */

        .remember-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 22px;
        }

        .remember-label {
          display: flex !important;
          align-items: center;
          gap: 8px;
          margin: 0 !important;
          color: #40536b !important;
          font-weight: normal !important;
        }

        .remember-label input {
          width: 16px;
          height: 16px;
        }

        .forgot-button {
          border: none;
          background: transparent;
          color: #2167b1;
          font-size: 15px;
          cursor: pointer;
        }

        /* LOGIN */

        .admin-login-button {
          width: 100%;
          margin-top: 25px;
          padding: 15px;
          border: none;
          border-radius: 7px;
          background: linear-gradient(
            135deg,
            #1f4778,
            #2d72b9
          );
          color: white;
          font-size: 17px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .admin-login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* RIGHT */

        .guidelines-card {
          background: white;
          border-radius: 7px;
          padding: 28px 40px;
          box-shadow: 0 3px 12px rgba(0,0,0,0.08);
        }

        .guidelines-card h2 {
          margin: 0;
          color: #203f66;
          font-size: 23px;
        }

        .guidelines-card hr {
          border: none;
          border-top: 1px solid #d5dde7;
          margin: 18px 0;
        }

        .guidelines-card ul {
          padding-left: 24px;
          color: #405675;
          line-height: 1.8;
          font-size: 16px;
        }

        .notice {
          margin-top: 28px;
          padding: 18px;
          background: #fffaf0;
          border: 1px solid #f0c36d;
          border-radius: 8px;
          color: #654b18;
        }

        .notice p {
          margin-bottom: 0;
        }

        .admin-features {
          margin-top: 25px;
          padding: 18px;
          background: #f2f7fc;
          border-radius: 8px;
          color: #3e5874;
        }

        .admin-features h3 {
          margin-top: 0;
          color: #24466d;
        }

        .admin-features p {
          margin: 8px 0;
        }

        /* RESPONSIVE */

        @media (max-width: 850px) {

          .admin-container {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

    </div>
  );
};

export default AdminLoginPage;