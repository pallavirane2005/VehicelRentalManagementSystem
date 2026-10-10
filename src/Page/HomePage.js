import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <div style={styles.logoIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
          <span style={styles.logoText}>VehicleRental</span>
        </div>
        <div style={styles.navLinks}>
          <a href="#fleet" style={styles.navLink}>Fleet</a>
          <a href="#services" style={styles.navLink}>Services</a>
          <a href="#why-us" style={styles.navLink}>Why Us</a>
        </div>
        <div style={styles.navButtons}>
          <button onClick={() => navigate('/login/user')} style={styles.userBtn}>
            User Login
          </button>
          <button onClick={() => navigate('/login/admin')} style={styles.adminBtn}>
            Admin Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroGrid}>
          <div style={styles.heroLeft}>
            <div style={styles.badge}>
              <span style={styles.badgeDot}></span>
              Trusted by 10,000+ Riders
            </div>
            <h1 style={styles.title}>
              Your Journey,{' '}
              <span style={styles.gradientText}>Your Vehicle</span>, Your Way
            </h1>
            <p style={styles.subtitle}>
              From sunrise commutes to midnight adventures — premium fleet tailored 
              for every road, every mood, and every mile. Round-the-clock cab services, 
              luxury rides, and budget-friendly rentals.
            </p>
            <div style={styles.buttonGroup}>
              <button onClick={() => navigate('/login/user')} style={styles.primaryBtn}>
                Login to Explore
              </button>
              <button onClick={() => navigate('/login/admin')} style={styles.secondaryBtn}>
                Admin Portal
              </button>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>500+</div>
                <div style={styles.statLabel}>Vehicles Available</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>24/7</div>
                <div style={styles.statLabel}>Live Support</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>50+</div>
                <div style={styles.statLabel}>Cities Covered</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>99%</div>
                <div style={styles.statLabel}>On-Time Rate</div>
              </div>
            </div>
            <div style={styles.trustBadge}>
              <span style={styles.trustText}>TRUSTED BY TEAMS AT</span>
              <div style={styles.trustLogos}>
                <span style={styles.trustLogo}>Ola</span>
                <span style={styles.trustDot}>•</span>
                <span style={styles.trustLogo}>Uber</span>
                <span style={styles.trustDot}>•</span>
                <span style={styles.trustLogo}>+ more</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section id="fleet" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Explore Our Premium Fleet</h2>
          <p style={styles.sectionSubtitle}>
            Choose from a diverse range of well-maintained vehicles — sanitized, serviced, and road-ready.
          </p>
        </div>
        <div style={styles.fleetGrid}>
          {[
            { name: 'Compact Cars', desc: 'Swift, i10, Alto — fuel-efficient city drives.', tag: 'City Rides' },
            { name: 'SUVs & MUVs', desc: 'Creta, Innova Crysta, XUV700 — spacious family trips.', tag: 'Family Trips' },
            { name: 'Two Wheelers', desc: 'Scooters & bikes — beat the traffic solo.', tag: 'Quick Rides' },
            { name: 'Tempo Travellers', desc: '12-20 seater — corporate outings & pilgrimages.', tag: 'Group Travel' },
            { name: 'Luxury Sedans', desc: 'BMW, Mercedes, Audi — chauffeur-driven premium.', tag: 'Premium' },
            { name: 'Electric Vehicles', desc: 'Tata Nexon EV, MG ZS EV — zero emissions.', tag: 'Eco-Friendly' },
          ].map((item, i) => (
            <div key={i} style={styles.fleetCard}>
              <div style={styles.fleetHeader}>
                <h4 style={styles.fleetName}>{item.name}</h4>
                <span style={styles.fleetTag}>{item.tag}</span>
              </div>
              <p style={styles.fleetDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={styles.sectionAlt}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Our Round-the-Clock Services</h2>
          <p style={styles.sectionSubtitle}>
            Early morning flight or late-night party — we've got your back, 24 hours a day.
          </p>
        </div>
        <div style={styles.servicesGrid}>
          {[
            { 
              name: 'Day Cab Service', 
              desc: 'Reliable daytime rides for office commutes, shopping, and business meetings. Transparent pricing with no hidden charges.',
              points: ['On-time pickups guaranteed', 'AC vehicles with GPS tracking', 'Professional verified drivers']
            },
            { 
              name: 'Night Cab Service', 
              desc: 'Safe and secure night rides for airport transfers, late shifts, and emergency travel. Your safety is our top priority after dark.',
              points: ['24/7 live ride tracking', 'SOS alert in every cab', 'Night-vision trained drivers']
            },
            { 
              name: 'Airport Transfers', 
              desc: 'Stress-free pickups and drops with flight monitoring. We adjust for delays at no extra cost.',
              points: ['Flight delay compensation', 'Luggage assistance', 'Meet & greet service']
            },
            { 
              name: 'Corporate Rentals', 
              desc: 'Dedicated fleet for companies. Monthly billing, account managers, and customized employee transport packages.',
              points: ['Bulk booking discounts', 'Monthly GST billing', 'Dedicated fleet allocation']
            },
            { 
              name: 'Outstation Trips', 
              desc: 'Explore nearby cities with one-way and round-trip packages. Flexible halts, experienced route drivers.',
              points: ['One-way & round-trip options', 'Driver allowance included', 'Multi-city route planning']
            },
            { 
              name: 'Wedding & Events', 
              desc: 'Decorated luxury cars, vintage classics, and coordinated guest shuttle management.',
              points: ['Flower decoration & red carpet', 'Uniformed chauffeurs', 'Guest coordination']
            },
          ].map((service, i) => (
            <div key={i} style={styles.serviceCard}>
              <h4 style={styles.serviceName}>{service.name}</h4>
              <p style={styles.serviceDesc}>{service.desc}</p>
              <ul style={styles.serviceList}>
                {service.points.map((pt, j) => (
                  <li key={j} style={styles.serviceListItem}>
                    <span style={styles.checkIcon}>✓</span> {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Why Riders Choose Us</h2>
        </div>
        <div style={styles.featuresGrid}>
          {[
            { title: 'Safety First', desc: 'Every ride insured, every driver background-verified, every vehicle safety-checked.' },
            { title: 'No Hidden Costs', desc: 'What you see is what you pay. Transparent pricing with detailed fare breakdowns.' },
            { title: 'Smart Dashboard', desc: 'Real-time tracking, digital invoices, ride history, instant support at your fingertips.' },
            { title: 'Well-Maintained Fleet', desc: 'Regular servicing, deep cleaning, and sanitization after every single ride.' },
            { title: 'Always Available', desc: 'Operations run 24/7. A reliable ride is just a login away, anytime.' },
            { title: 'Award-Winning Support', desc: '95% of queries resolved within 10 minutes. Your satisfaction drives us.' },
          ].map((feat, i) => (
            <div key={i} style={styles.featureCard}>
              <h4 style={styles.featureTitle}>{feat.title}</h4>
              <p style={styles.featureText}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.sectionAlt}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>Getting on the road is as easy as 1-2-3. No paperwork, no queues.</p>
        </div>
        <div style={styles.stepsContainer}>
          {[
            { num: '1', title: 'Login to Your Account', desc: 'Sign in as a user to browse. Registration takes under 2 minutes.' },
            { num: '2', title: 'Choose Your Ride', desc: 'Filter by type, price, or features to find your perfect match.' },
            { num: '3', title: 'Hit the Road', desc: 'Confirm and get instant booking. Your vehicle arrives ready to go.' },
          ].map((step, i) => (
            <React.Fragment key={i}>
              <div style={styles.step}>
                <div style={styles.stepNumber}>{step.num}</div>
                <h4 style={styles.stepTitle}>{step.title}</h4>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
              {i < 2 && <div style={styles.stepArrow}>→</div>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Hit the Road?</h2>
        <p style={styles.ctaSubtitle}>
          Join thousands of happy riders. Log in now and discover the perfect ride waiting for you.
        </p>
        <div style={styles.ctaButtons}>
          <button onClick={() => navigate('/login/user')} style={styles.ctaPrimaryBtn}>
            Login as User
          </button>
          <button onClick={() => navigate('/login/admin')} style={styles.ctaSecondaryBtn}>
            Admin Login
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerBrand}>
            <div style={styles.footerBrandRow}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}>
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
              </svg>
              <h3 style={styles.footerLogo}>VehicleRental</h3>
            </div>
            <p style={styles.footerTagline}>
              Driving your dreams forward, one mile at a time. Premium rentals for every journey.
            </p>
          </div>
          <div style={styles.footerLinks}>
            <div style={styles.footerCol}>
              <h5 style={styles.footerColTitle}>Services</h5>
              <span style={styles.footerLink}>Day Cabs</span>
              <span style={styles.footerLink}>Night Cabs</span>
              <span style={styles.footerLink}>Airport Transfer</span>
              <span style={styles.footerLink}>Outstation</span>
            </div>
            <div style={styles.footerCol}>
              <h5 style={styles.footerColTitle}>Fleet</h5>
              <span style={styles.footerLink}>Compact Cars</span>
              <span style={styles.footerLink}>SUVs & MUVs</span>
              <span style={styles.footerLink}>Luxury Sedans</span>
              <span style={styles.footerLink}>Electric Vehicles</span>
            </div>
            <div style={styles.footerCol}>
              <h5 style={styles.footerColTitle}>Company</h5>
              <span style={styles.footerLink}>About Us</span>
              <span style={styles.footerLink}>Safety</span>
              <span style={styles.footerLink}>Terms</span>
              <span style={styles.footerLink}>Privacy</span>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2026 VehicleRental Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0b1120',
    fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    color: '#e2e8f0',
    lineHeight: 1.6,
  },

  // Navbar
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.2rem 4rem',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 4px 30px rgba(37, 99, 235, 0.2)',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: '800',
    letterSpacing: '-0.5px',
  },
  navLinks: {
    display: 'flex',
    gap: '2.5rem',
  },
  navLink: {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
  },
  navButtons: {
    display: 'flex',
    gap: '0.75rem',
  },
  userBtn: {
    padding: '0.6rem 1.4rem',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
  },
  adminBtn: {
    padding: '0.6rem 1.4rem',
    background: 'rgba(255,255,255,0.12)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },

  // Hero
  hero: {
    padding: '5rem 4rem',
    background: 'linear-gradient(180deg, #0f172a 0%, #0b1120 100%)',
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    maxWidth: '1300px',
    margin: '0 auto',
    alignItems: 'center',
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(37, 99, 235, 0.15)',
    color: '#60a5fa',
    padding: '0.4rem 1rem',
    borderRadius: '50px',
    fontSize: '0.85rem',
    fontWeight: '600',
    width: 'fit-content',
    border: '1px solid rgba(37, 99, 235, 0.2)',
  },
  badgeDot: {
    width: '8px',
    height: '8px',
    background: '#10b981',
    borderRadius: '50%',
    display: 'inline-block',
  },
  title: {
    fontSize: '3.5rem',
    color: '#f8fafc',
    fontWeight: '800',
    letterSpacing: '-1.5px',
    lineHeight: 1.1,
    margin: 0,
  },
  gradientText: {
    background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#94a3b8',
    lineHeight: 1.7,
    maxWidth: '520px',
    margin: 0,
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  primaryBtn: {
    padding: '0.9rem 2rem',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(37, 99, 235, 0.35)',
  },
  secondaryBtn: {
    padding: '0.9rem 2rem',
    background: 'transparent',
    color: '#e2e8f0',
    border: '1.5px solid #334155',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
  },

  // Hero Right - Stats
  heroRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  statCard: {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '1.5rem',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#60a5fa',
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  trustBadge: {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '1.25rem 1.5rem',
  },
  trustText: {
    fontSize: '0.7rem',
    color: '#64748b',
    fontWeight: '700',
    letterSpacing: '1.5px',
    marginBottom: '0.5rem',
    display: 'block',
  },
  trustLogos: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  trustLogo: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  trustDot: {
    color: '#475569',
  },

  // Sections
  section: {
    padding: '5rem 4rem',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  sectionAlt: {
    padding: '5rem 4rem',
    background: '#0f172a',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '2.2rem',
    color: '#f8fafc',
    fontWeight: '800',
    marginBottom: '0.75rem',
    letterSpacing: '-0.5px',
  },
  sectionSubtitle: {
    fontSize: '1.05rem',
    color: '#64748b',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.6,
  },

  // Fleet
  fleetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.25rem',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  fleetCard: {
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '1.75rem',
    transition: 'transform 0.2s, border-color 0.2s',
  },
  fleetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  fleetName: {
    fontSize: '1.15rem',
    color: '#f1f5f9',
    fontWeight: '700',
    margin: 0,
  },
  fleetTag: {
    background: 'rgba(37, 99, 235, 0.15)',
    color: '#60a5fa',
    padding: '0.25rem 0.75rem',
    borderRadius: '50px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  fleetDesc: {
    color: '#94a3b8',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    margin: 0,
  },

  // Services
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '1.25rem',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  serviceCard: {
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '2rem',
  },
  serviceName: {
    fontSize: '1.15rem',
    color: '#f1f5f9',
    fontWeight: '700',
    marginBottom: '0.75rem',
  },
  serviceDesc: {
    color: '#94a3b8',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    marginBottom: '1.25rem',
  },
  serviceList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  serviceListItem: {
    color: '#cbd5e1',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  checkIcon: {
    color: '#10b981',
    fontWeight: '700',
  },

  // Features
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.25rem',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  featureCard: {
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '1.75rem',
    textAlign: 'center',
  },
  featureTitle: {
    fontSize: '1.1rem',
    color: '#f1f5f9',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  featureText: {
    color: '#94a3b8',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    margin: 0,
  },

  // Steps
  stepsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '1rem',
    flexWrap: 'wrap',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  step: {
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    flex: '1 1 280px',
    maxWidth: '320px',
  },
  stepNumber: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: '800',
    margin: '0 auto 1rem',
  },
  stepTitle: {
    fontSize: '1.1rem',
    color: '#f1f5f9',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  stepDesc: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    margin: 0,
  },
  stepArrow: {
    fontSize: '1.8rem',
    color: '#334155',
    fontWeight: '700',
    alignSelf: 'center',
    marginTop: '2rem',
  },

  // CTA
  ctaSection: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    padding: '5rem 2rem',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '1rem',
    color: 'white',
  },
  ctaSubtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.8)',
    maxWidth: '550px',
    margin: '0 auto 2rem',
    lineHeight: 1.6,
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaPrimaryBtn: {
    padding: '1rem 2.5rem',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.35)',
  },
  ctaSecondaryBtn: {
    padding: '1rem 2.5rem',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
  },

  // Footer
  footer: {
    background: '#020617',
    color: '#64748b',
    padding: '3rem 4rem 1.5rem',
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '3rem',
    maxWidth: '1300px',
    margin: '0 auto 2.5rem',
  },
  footerBrand: {
    flex: '1 1 300px',
  },
  footerBrandRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.75rem',
    color: '#e2e8f0',
  },
  footerLogo: {
    color: '#f8fafc',
    fontSize: '1.3rem',
    margin: 0,
  },
  footerTagline: {
    fontSize: '0.95rem',
    lineHeight: 1.6,
    maxWidth: '320px',
    color: '#64748b',
  },
  footerLinks: {
    display: 'flex',
    gap: '4rem',
    flexWrap: 'wrap',
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  footerColTitle: {
    color: '#94a3b8',
    fontSize: '0.85rem',
    marginBottom: '0.25rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  footerLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  footerBottom: {
    borderTop: '1px solid #1e293b',
    paddingTop: '1.5rem',
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#475569',
    maxWidth: '1300px',
    margin: '0 auto',
  },
};

export default HomePage;