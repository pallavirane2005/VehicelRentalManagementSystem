import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password validation
  const checks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[@$!%*?&]/.test(formData.password),
  };

  const allValid = Object.values(checks).every(Boolean);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError('');
  };

  // REGISTER USER
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    // Check fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Please fill in all fields.');
      return;
    }

    // Password validation
    if (!allValid) {
      setError('Password does not meet all requirements.');
      return;
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Terms and conditions
    if (!agreed) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }

    try {
      setLoading(true);

      // Send registration data to backend
      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed.');
        return;
      }

      // Registration successful
      alert('Account created successfully! Please login.');

      // Go to login page
      navigate('/login/user');

    } catch (error) {
      console.error('Registration Error:', error);
      setError(
        'Unable to connect to server. Please make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Password checklist item
  const CheckItem = ({ valid, text }) => (
    <div style={styles.checkItem}>
      <span
        style={{
          ...styles.checkIcon,
          color: valid ? '#48bb78' : '#fc8181',
        }}
      >
        {valid ? '✓' : '✕'}
      </span>

      <span
        style={{
          ...styles.checkText,
          color: valid ? '#a0aec0' : '#fc8181',
        }}
      >
        {text}
      </span>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={styles.title}>Create Account</h2>

          <p style={styles.subtitle}>
            Join our Vehicle Rental platform today
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={styles.form}>

          {/* ERROR MESSAGE */}
          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          {/* ACCOUNT DETAILS */}
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>📝</span>

            <span style={styles.sectionTitle}>
              ACCOUNT DETAILS
            </span>
          </div>

          <div style={styles.divider} />

          <div style={styles.row}>

            {/* FULL NAME */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                FULL NAME
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  👤
                </span>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  style={styles.input}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                EMAIL ADDRESS
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  ✉️
                </span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={styles.input}
                />
              </div>
            </div>

          </div>

          {/* SECURITY */}
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>🔒</span>

            <span style={styles.sectionTitle}>
              SECURITY
            </span>
          </div>

          <div style={styles.divider} />

          <div style={styles.row}>

            {/* PASSWORD */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                PASSWORD
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  🔐
                </span>

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  style={{
                    ...styles.input,
                    paddingRight: '2.5rem',
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  style={styles.eyeBtn}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                CONFIRM PASSWORD
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  🔐
                </span>

                <input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  style={{
                    ...styles.input,
                    paddingRight: '2.5rem',
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  style={styles.eyeBtn}
                >
                  {showConfirmPassword
                    ? '🙈'
                    : '👁️'}
                </button>
              </div>
            </div>

          </div>

          {/* PASSWORD CHECKLIST */}
          <div style={styles.checklistBox}>

            <p style={styles.checklistTitle}>
              PASSWORD MUST CONTAIN:
            </p>

            <CheckItem
              valid={checks.length}
              text="At least 8 characters"
            />

            <CheckItem
              valid={checks.uppercase}
              text="1 uppercase letter (A-Z)"
            />

            <CheckItem
              valid={checks.lowercase}
              text="1 lowercase letter (a-z)"
            />

            <CheckItem
              valid={checks.number}
              text="1 number (0-9)"
            />

            <CheckItem
              valid={checks.special}
              text="1 special character (@$!%*?&)"
            />

          </div>

          {/* TERMS */}
          <label style={styles.termsLabel}>

            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) =>
                setAgreed(e.target.checked)
              }
              style={styles.checkbox}
            />

            <span style={styles.termsText}>
              I agree to the{' '}

              <Link
                to="#"
                style={styles.link}
              >
                Terms and Conditions
              </Link>

              {' '}and{' '}

              <Link
                to="#"
                style={styles.link}
              >
                Privacy Policy
              </Link>
            </span>

          </label>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            style={styles.submitBtn}
            disabled={loading}
          >
            <span style={styles.btnIcon}>
              👤
            </span>

            {loading
              ? 'Creating Account...'
              : 'Create Account'}
          </button>

          {/* LOGIN LINK */}
          <p style={styles.loginLink}>
            Already have an account?{' '}

            <Link
              to="/login/user"
              style={styles.link}
            >
              Login here
            </Link>
          </p>

        </form>
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
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    padding: '2rem',
    fontFamily:
      "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
  },

  card: {
    width: '100%',
    maxWidth: '700px',
    background: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border:
      '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow:
      '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },

  header: {
    padding: '2.5rem 2.5rem 1rem 2.5rem',
    textAlign: 'center',
  },

  title: {
    color: '#f1f5f9',
    fontSize: '1.8rem',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '0.5px',
  },

  subtitle: {
    color: '#94a3b8',
    fontSize: '0.95rem',
    marginTop: '0.5rem',
  },

  form: {
    padding: '1.5rem 2.5rem 2.5rem 2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },

  errorBox: {
    background:
      'rgba(229, 62, 62, 0.15)',
    color: '#fc8181',
    padding: '0.875rem 1rem',
    borderRadius: '10px',
    fontSize: '0.9rem',
    border:
      '1px solid rgba(252, 129, 129, 0.3)',
    textAlign: 'center',
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },

  sectionIcon: {
    fontSize: '1rem',
    opacity: 0.8,
  },

  sectionTitle: {
    color: '#93c5fd',
    fontSize: '0.8rem',
    fontWeight: '700',
    letterSpacing: '1.5px',
  },

  divider: {
    height: '1px',
    background:
      'linear-gradient(90deg, transparent, rgba(147, 197, 253, 0.3), transparent)',
    margin: '0.5rem 0 1rem 0',
  },

  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  label: {
    color: '#cbd5e1',
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },

  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  inputIcon: {
    position: 'absolute',
    left: '1rem',
    fontSize: '0.9rem',
    opacity: 0.6,
    zIndex: 1,
  },

  input: {
    width: '100%',
    padding:
      '0.85rem 1rem 0.85rem 2.5rem',
    background:
      'rgba(15, 23, 42, 0.6)',
    border:
      '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '12px',
    color: '#f1f5f9',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },

  eyeBtn: {
    position: 'absolute',
    right: '0.75rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    opacity: 0.6,
    padding: '0.25rem',
  },

  checklistBox: {
    background:
      'rgba(15, 23, 42, 0.5)',
    border:
      '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '12px',
    padding: '1.25rem',
    marginTop: '0.5rem',
  },

  checklistTitle: {
    color: '#94a3b8',
    fontSize: '0.8rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
    margin: '0 0 0.75rem 0',
  },

  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '0.4rem',
  },

  checkIcon: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    width: '1.2rem',
  },

  checkText: {
    fontSize: '0.85rem',
    transition: 'color 0.2s',
  },

  termsLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },

  checkbox: {
    marginTop: '0.15rem',
    width: '1.1rem',
    height: '1.1rem',
    accentColor: '#3b82f6',
    cursor: 'pointer',
  },

  termsText: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    lineHeight: '1.5',
  },

  link: {
    color: '#60a5fa',
    textDecoration: 'none',
    fontWeight: '500',
  },

  submitBtn: {
    width: '100%',
    padding: '1rem',
    background:
      'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow:
      '0 10px 25px rgba(59, 130, 246, 0.3)',
    transition:
      'transform 0.1s, box-shadow 0.2s',
    marginTop: '0.5rem',
  },

  btnIcon: {
    fontSize: '1.1rem',
  },

  loginLink: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '0.9rem',
    margin: 0,
  },
};

export default RegistrationPage;