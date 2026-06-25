import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiCpu, FiShare2, FiArrowRight, FiStar, FiZap, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const FeatureCard = ({ icon, title, description, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card"
    style={{ padding: 'var(--space-xl)' }}
  >
    <div style={{
      width: 48, height: 48, borderRadius: 14,
      background: `${color}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 22, color, marginBottom: 'var(--space-md)',
      boxShadow: `0 4px 16px ${color}20`,
    }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>{title}</h3>
    <p style={{ fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{description}</p>
  </motion.div>
);

const StepBadge = ({ num }) => (
  <div style={{
    width: 30, height: 30, flexShrink: 0,
    background: 'var(--gradient-brand)',
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.8rem', fontWeight: 800, color: 'white',
  }}>
    {num}
  </div>
);

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', paddingTop: 'var(--navbar-height)', overflow: 'hidden' }}>
      {/* Ambient Background Orbs */}
      <div className="bg-orb" style={{
        width: 500, height: 500,
        background: 'rgba(99, 102, 241, 0.12)',
        top: -100, left: -150,
        animationDelay: '0s',
      }} />
      <div className="bg-orb" style={{
        width: 400, height: 400,
        background: 'rgba(6, 182, 212, 0.08)',
        top: 200, right: -100,
        animationDelay: '-4s',
      }} />
      <div className="bg-orb" style={{
        width: 350, height: 350,
        background: 'rgba(139, 92, 246, 0.1)',
        bottom: 100, left: '30%',
        animationDelay: '-8s',
      }} />

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px, 10vw, 120px) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem', color: 'var(--brand-tertiary)',
                fontWeight: 600, letterSpacing: '0.03em',
                marginBottom: 'var(--space-lg)',
              }}
            >
              <FiZap size={13} /> Powered by Google Gemini AI
            </motion.div>

            <h1 style={{ fontFamily: 'var(--font-display)', lineHeight: 1.1, marginBottom: 'var(--space-lg)', maxWidth: 700, margin: '0 auto var(--space-lg)' }}>
              Turn Your Bookings Into a{' '}
              <span className="gradient-text">Perfect Itinerary</span>
              {' '}Instantly
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', maxWidth: 560, margin: '0 auto var(--space-2xl)', lineHeight: 1.7 }}>
              Upload your flight tickets, hotel confirmations, or travel documents.
              Our AI extracts the details and crafts a personalized day-by-day travel plan in seconds.
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to={isAuthenticated ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
                {isAuthenticated ? 'Go to Dashboard' : 'Start Planning Free'}
                <FiArrowRight />
              </Link>
              {!isAuthenticated && (
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In
                </Link>
              )}
            </div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ marginTop: 'var(--space-2xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {[...Array(5)].map((_, i) => <FiStar key={i} style={{ color: 'var(--warning)', fill: 'var(--warning)' }} size={14} />)}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loved by travelers worldwide</span>
              <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>✨ No credit card required</span>
            </motion.div>
          </motion.div>

          {/* Hero Visual — Mock App Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{ marginTop: 'var(--space-3xl)', position: 'relative' }}
          >
            <div style={{
              maxWidth: 780, margin: '0 auto',
              background: 'rgba(13, 20, 33, 0.8)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-xl)',
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
            }}>
              {/* Window Bar */}
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(0,0,0,0.3)',
              }}>
                {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                ))}
                <div style={{
                  flex: 1, textAlign: 'center', fontSize: '0.75rem',
                  color: 'var(--text-muted)', fontFamily: 'monospace',
                }}>
                  tripsmart.app/dashboard
                </div>
              </div>

              {/* Content Preview */}
              <div style={{ padding: 'var(--space-lg)', textAlign: 'left' }}>
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, fontWeight: 600 }}>
                    AI Generated ✨
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Mumbai → Paris Trip · 7 Days
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                  {[
                    { day: 'Day 1', title: 'Arrival & Eiffel Tower', color: 'var(--brand-primary)' },
                    { day: 'Day 2', title: 'Louvre & Montmartre', color: 'var(--brand-secondary)' },
                    { day: 'Day 3', title: 'Versailles Day Trip', color: 'var(--brand-accent)' },
                    { day: 'Day 4', title: 'Seine River Cruise', color: 'var(--brand-accent-2)' },
                  ].map((d, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      style={{
                        padding: '12px', borderRadius: 10,
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ fontSize: '0.65rem', color: d.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                        {d.day}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>{d.title}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Glow */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%', height: '60%',
              background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none', zIndex: -1,
            }} />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: 'var(--space-3xl) 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Everything You Need for <span className="gradient-text">Stress-Free Travel</span>
            </motion.h2>
          </div>
          <div className="grid-3">
            <FeatureCard
              icon={<FiUploadCloud />}
              title="Smart Document Upload"
              description="Drag & drop flight tickets, hotel bookings, or any travel document. PDF or image — we handle both."
              color="var(--brand-primary)"
              delay={0}
            />
            <FeatureCard
              icon={<FiCpu />}
              title="AI-Powered Extraction"
              description="Gemini AI reads your documents and extracts every booking detail — flights, hotels, dates, passengers."
              color="var(--brand-accent)"
              delay={0.1}
            />
            <FeatureCard
              icon={<FiStar />}
              title="Day-by-Day Itinerary"
              description="Get a personalized itinerary with morning, afternoon, and evening plans, local tips, and meal suggestions."
              color="var(--warning)"
              delay={0.2}
            />
            <FeatureCard
              icon={<FiShare2 />}
              title="Share Anywhere"
              description="Share your itinerary via a unique public link, QR code, Twitter, or WhatsApp. Anyone can view it."
              color="var(--brand-accent-2)"
              delay={0.3}
            />
            <FeatureCard
              icon={<FiShield />}
              title="Secure by Default"
              description="JWT authentication, httpOnly cookies, and private itineraries by default. Your data is always safe."
              color="var(--brand-secondary)"
              delay={0.4}
            />
            <FeatureCard
              icon={<FiZap />}
              title="Instant Results"
              description="Upload, extract, and generate your full itinerary in under 30 seconds. Travel planning has never been faster."
              color="var(--info)"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: 'var(--space-3xl) 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              How It <span className="gradient-text">Works</span>
            </motion.h2>
            <p style={{ marginTop: 8, maxWidth: 400, margin: '8px auto 0' }}>Three simple steps to your perfect trip plan</p>
          </div>

          <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {[
              { step: 1, title: 'Upload Your Documents', desc: 'Drag & drop your flight tickets, hotel confirmations, or any booking PDF/image.', color: 'var(--brand-primary)' },
              { step: 2, title: 'AI Extracts the Details', desc: 'Gemini AI reads everything — dates, destinations, accommodations, passengers.', color: 'var(--brand-accent)' },
              { step: 3, title: 'Get Your Personalized Itinerary', desc: 'Receive a full day-by-day travel plan, packing list, tips, and more. Share it anywhere.', color: 'var(--brand-accent-2)' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{
                  display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start',
                  padding: 'var(--space-lg)',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-lg)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div style={{
                  width: 36, height: 36, flexShrink: 0,
                  background: s.color,
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', fontWeight: 800, color: 'white',
                  boxShadow: `0 4px 12px ${s.color}40`,
                }}>
                  {s.step}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem' }}>{s.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'var(--space-3xl) 0', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              padding: 'var(--space-3xl) var(--space-xl)',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(6,182,212,0.08) 100%)',
              border: '1px solid var(--border-brand)',
              borderRadius: 'var(--radius-2xl)',
              maxWidth: 600, margin: '0 auto',
            }}
          >
            <h2 style={{ marginBottom: 'var(--space-md)' }}>Ready to Plan Your Next Adventure?</h2>
            <p style={{ marginBottom: 'var(--space-xl)' }}>
              Join thousands of travelers who use TripSmart to plan stress-free trips.
            </p>
            <Link to={isAuthenticated ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
              {isAuthenticated ? 'Create New Itinerary' : 'Get Started — It\'s Free'}
              <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
