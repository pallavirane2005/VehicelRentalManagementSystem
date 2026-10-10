import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState(0);

  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAdmin = role === 'admin';

  // Generate CAPTCHA
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;

    setCaptchaQuestion(`${num1} + ${num2} = ?`);
    setCaptchaAnswer(num1 + num2);
    setCaptchaInput('');
  };

  // LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check email and password
    if (!email || !password) {
      setError('Please enter both Email and Password.');
      return;
    }

    // Check CAPTCHA
    if (parseInt(captchaInput) !== captchaAnswer) {
      setError('Invalid CAPTCHA. Please try again.');
      generateCaptcha();
      return;
    }

    try {
      setLoading(true);

      // Send login request to backend
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      // Login failed
      if (!response.ok) {
        setError(
          data.message || 'Invalid email or password.'
        );

        generateCaptcha();
        return;
      }

      // Login successful
      console.log('Login successful:', data);

      // Save user information
      // Save logged-in user information
const loggedInUser = data.user || data;

const userData = {
  id:
    loggedInUser.id ||
    loggedInUser._id ||
    loggedInUser.userId ||
    "",
  name:
    loggedInUser.name ||
    loggedInUser.username ||
    "",
  email:
    loggedInUser.email ||
    loggedInUser.userEmail ||
    "",
  role:
    loggedInUser.role ||
    "user"
};

console.log("USER DATA SAVED:", userData);

localStorage.setItem(
  "user",
  JSON.stringify(userData)
);

      // Remember me
      if (rememberMe) {
        localStorage.setItem(
          'rememberMe',
          'true'
        );
      } else {
        localStorage.removeItem(
          'rememberMe'
        );
      }

      alert('Login successful!');

      // Navigate according to role
    if (userData.role === "admin") {
  navigate("/admin-dashboard");
} else {
  navigate("/user-dashboard");
}

    } catch (error) {
      console.error('Login Error:', error);

      setError(
        'Unable to connect to server. Please make sure the backend is running.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* HEADER BAR */}
      <div style={styles.header}>

        <div style={styles.headerContent}>

          <div style={styles.logoSection}>

            <div style={styles.logoIcon}>
              🚗
            </div>

            <div>

              <div style={styles.logoTitle}>
                Vehicle Rental Management System
              </div>

              <div style={styles.logoSub}>
                Government of India / Institutional Portal
              </div>

            </div>

          </div>

          <div style={styles.headerRight}>
            <span style={styles.headerLink}>
              📞 Helpdesk: 1800-123-4567
            </span>
          </div>

        </div>

      </div>


      {/* MAIN CONTENT */}
      <div style={styles.main}>

        {/* LOGIN CARD */}
        <div style={styles.loginCard}>

          {/* CARD HEADER */}
          <div
            style={{
              ...styles.cardHeader,

              background: isAdmin
                ? 'linear-gradient(135deg, #c05621 0%, #dd6b20 100%)'
                : 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)'
            }}
          >

            <h2 style={styles.cardTitle}>

              {isAdmin
                ? '🔐 Administrator Login'
                : '👤 User Login'}

            </h2>

            <p style={styles.cardSubtitle}>
              Secure Portal Access
            </p>

          </div>


          {/* LOGIN FORM */}
          <form
            onSubmit={handleSubmit}
            style={styles.form}
          >

            {/* ERROR */}
            {error && (
              <div style={styles.errorBox}>
                ⚠️ {error}
              </div>
            )}


            {/* EMAIL */}
            <div style={styles.formGroup}>

              <label style={styles.label}>
                Email ID / Username{' '}
                <span style={styles.required}>
                  *
                </span>
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your registered email"
                style={styles.input}
              />

            </div>


            {/* PASSWORD */}
            <div style={styles.formGroup}>

              <label style={styles.label}>
                Password{' '}
                <span style={styles.required}>
                  *
                </span>
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                style={styles.input}
              />

            </div>


            {/* CAPTCHA */}
            <div style={styles.captchaBox}>

              <label style={styles.label}>
                Security Verification (CAPTCHA){' '}
                <span style={styles.required}>
                  *
                </span>
              </label>

              <div style={styles.captchaRow}>

                <div style={styles.captchaDisplay}>
                  {captchaQuestion}
                </div>

                <button
                  type="button"
                  onClick={generateCaptcha}
                  style={styles.refreshBtn}
                  title="Refresh CAPTCHA"
                >
                  🔄
                </button>

              </div>

              <input
                type="text"
                value={captchaInput}
                onChange={(e) =>
                  setCaptchaInput(e.target.value)
                }
                placeholder="Enter answer"
                style={{
                  ...styles.input,
                  marginTop: '0.5rem'
                }}
              />

              <small style={styles.hint}>
                Enter the answer to the math question above
              </small>

            </div>


            {/* REMEMBER ME */}
            <div style={styles.optionsRow}>

              <label style={styles.rememberLabel}>

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  style={styles.checkbox}
                />

                Remember me

              </label>

              <Link
                to="#"
                style={styles.forgotLink}
              >
                Forgot Password?
              </Link>

            </div>


            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.loginBtn,

                background: isAdmin
                  ? 'linear-gradient(135deg, #c05621 0%, #dd6b20 100%)'
                  : 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',

                opacity: loading ? 0.7 : 1
              }}
            >

              {loading
                ? 'Logging in...'
                : isAdmin
                  ? '🔒 Login as Administrator'
                  : '🔓 Login to Portal'}

            </button>


            {/* REGISTER */}
            {!isAdmin && (
              <p
                style={{
                  textAlign: 'center',
                  color: '#718096',
                  fontSize: '0.9rem',
                  marginTop: '1rem'
                }}
              >

                Don't have an account?{' '}

                <Link
                  to="/register"
                  style={{
                    color: '#2b6cb0',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  Register here
                </Link>

              </p>
            )}


            {/* BACK */}
            <div style={styles.backSection}>

              <Link
                to="/"
                style={styles.backLink}
              >
                ← Back to Home Page
              </Link>

            </div>

          </form>

        </div>


        {/* INFO PANEL */}
        <div style={styles.infoPanel}>

          <h3 style={styles.infoTitle}>
            📋 Guidelines for Login
          </h3>

          <ul style={styles.infoList}>

            <li>
              Use your registered Email ID and Password
            </li>

            <li>
              CAPTCHA is case-insensitive
            </li>

            <li>
              Do not share your credentials with anyone
            </li>

            <li>
              For issues, contact
              helpdesk@vehiclerental.gov.in
            </li>

            <li>
              Ensure you logout after your session
            </li>

          </ul>


          <div style={styles.noticeBox}>

            <strong>🔔 Notice:</strong>{' '}
            System maintenance is scheduled every
            Sunday 2:00 AM - 4:00 AM IST.

          </div>

        </div>

      </div>


      {/* FOOTER */}
      <div style={styles.footer}>

        <p>
          © 2026 Vehicle Rental Management System.
          All Rights Reserved.
        </p>

        <p style={styles.footerLinks}>

          <span style={styles.footerLink}>
            Privacy Policy
          </span>

          {' | '}

          <span style={styles.footerLink}>
            Terms of Use
          </span>

          {' | '}

          <span style={styles.footerLink}>
            Disclaimer
          </span>

        </p>

      </div>

    </div>
  );
};


// ================================
// STYLES
// ================================

const styles = {

  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f0f4f8',
    fontFamily:
      "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
  },

  header: {
    background:
      'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
    color: 'white',
    padding: '0.75rem 2rem',
    boxShadow:
      '0 2px 8px rgba(0,0,0,0.15)',
  },

  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },

  logoIcon: {
    fontSize: '2rem',
  },

  logoTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    letterSpacing: '0.3px',
  },

  logoSub: {
    fontSize: '0.75rem',
    opacity: 0.9,
    marginTop: '2px',
  },

  headerRight: {
    fontSize: '0.85rem',
  },

  headerLink: {
    opacity: 0.95,
  },

  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '2rem',
    padding: '3rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    flexWrap: 'wrap',
  },

  loginCard: {
    background: 'white',
    borderRadius: '8px',
    boxShadow:
      '0 4px 20px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '450px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
  },

  cardHeader: {
    padding: '1.5rem 2rem',
    color: 'white',
    textAlign: 'center',
  },

  cardTitle: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: '600',
  },

  cardSubtitle: {
    margin: '0.5rem 0 0 0',
    fontSize: '0.9rem',
    opacity: 0.9,
  },

  form: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },

  errorBox: {
    background: '#fed7d7',
    color: '#c53030',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    border: '1px solid #fc8181',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },

  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2d3748',
  },

  required: {
    color: '#e53e3e',
  },

  input: {
    padding: '0.65rem 0.9rem',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '1rem',
    outline: 'none',
    transition:
      'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
  },

  captchaBox: {
    background: '#f7fafc',
    padding: '1rem',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
  },

  captchaRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    marginTop: '0.5rem',
  },

  captchaDisplay: {
    flex: 1,
    background:
      'linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%)',
    padding: '0.6rem 1rem',
    borderRadius: '6px',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a365d',
    textAlign: 'center',
    letterSpacing: '2px',
    border: '1px dashed #a0aec0',
    userSelect: 'none',
  },

  refreshBtn: {
    padding: '0.6rem 0.8rem',
    background: '#e2e8f0',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
  },

  hint: {
    color: '#718096',
    fontSize: '0.8rem',
    marginTop: '0.4rem',
    display: 'block',
  },

  optionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
  },

  rememberLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: '#4a5568',
    cursor: 'pointer',
  },

  checkbox: {
    cursor: 'pointer',
  },

  forgotLink: {
    color: '#2b6cb0',
    textDecoration: 'none',
    fontWeight: '500',
  },

  loginBtn: {
    padding: '0.85rem',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow:
      '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.1s',
    marginTop: '0.5rem',
  },

  backSection: {
    textAlign: 'center',
    marginTop: '0.5rem',
  },

  backLink: {
    color: '#4a5568',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },

  infoPanel: {
    background: 'white',
    borderRadius: '8px',
    boxShadow:
      '0 4px 20px rgba(0,0,0,0.08)',
    padding: '2rem',
    width: '100%',
    maxWidth: '350px',
    border: '1px solid #e2e8f0',
    height: 'fit-content',
  },

  infoTitle: {
    color: '#1a365d',
    marginTop: 0,
    marginBottom: '1rem',
    fontSize: '1.1rem',
    borderBottom:
      '2px solid #e2e8f0',
    paddingBottom: '0.75rem',
  },

  infoList: {
    color: '#4a5568',
    fontSize: '0.9rem',
    lineHeight: '1.8',
    paddingLeft: '1.2rem',
    margin: 0,
  },

  noticeBox: {
    marginTop: '1.5rem',
    padding: '1rem',
    background: '#fffaf0',
    border: '1px solid #fbd38d',
    borderRadius: '6px',
    fontSize: '0.85rem',
    color: '#744210',
  },

  footer: {
    background: '#1a365d',
    color: 'white',
    textAlign: 'center',
    padding: '1.25rem',
    fontSize: '0.85rem',
  },

  footerLinks: {
    marginTop: '0.5rem',
    opacity: 0.8,
  },

  footerLink: {
    margin: '0 0.5rem',
    cursor: 'pointer',
  },
};

export default LoginPage;