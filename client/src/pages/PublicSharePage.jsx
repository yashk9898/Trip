import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSharedItinerary } from '../api/itinerary';
import ItineraryView from '../components/ItineraryView';
import { FiCompass, FiEye, FiCalendar, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

const PublicSharePage = () => {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getSharedItinerary(token);
        setData(res.data.data.itinerary);
      } catch (err) {
        setError(err.response?.data?.message || 'This itinerary is not available.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner spinner-lg spinner-brand" style={{ margin: '0 auto var(--space-md)' }} />
          <p>Loading shared itinerary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 'var(--space-lg)' }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <FiAlertCircle size={56} style={{ color: 'var(--error)', marginBottom: 'var(--space-md)' }} />
          <h2 style={{ marginBottom: 10 }}>Itinerary Not Found</h2>
          <p style={{ marginBottom: 'var(--space-xl)' }}>{error}</p>
          <Link to="/" className="btn btn-primary">
            <FiCompass /> Go to TripSmart <FiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  const date = new Date(data.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Public Header Bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(8, 12, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px var(--space-lg)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 8,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 30, height: 30, background: 'var(--gradient-brand)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, color: 'white',
          }}>
            <FiCompass />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
            Trip<span className="gradient-text">Smart</span>
          </span>
        </Link>
        <Link to="/register" className="btn btn-primary btn-sm">
          Plan My Trip Free <FiArrowRight />
        </Link>
      </div>

      <div className="container" style={{ maxWidth: 900, padding: 'var(--space-2xl) var(--space-lg)' }}>
        {/* Shared Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
            padding: '12px 20px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-xl)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Shared by <strong style={{ color: 'var(--text-primary)' }}>{data.creator}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <FiEye size={12} /> {data.viewCount} view{data.viewCount !== 1 ? 's' : ''}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <FiCalendar size={12} /> {date}
            </div>
          </div>
          <span className="badge badge-info">🌍 Public Itinerary</span>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 'var(--space-xl)' }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>{data.title}</h1>
        </motion.div>

        {/* Itinerary Content */}
        <ItineraryView itinerary={data.itinerary} isPublic />

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginTop: 'var(--space-3xl)',
            textAlign: 'center',
            padding: 'var(--space-2xl)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(6,182,212,0.06) 100%)',
            border: '1px solid var(--border-brand)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <h3 style={{ marginBottom: 10 }}>Want your own AI-powered itinerary?</h3>
          <p style={{ marginBottom: 'var(--space-lg)', fontSize: '0.9rem' }}>
            Upload your booking documents and get a personalized travel plan in seconds. It's free.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started Free <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicSharePage;
