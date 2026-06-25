import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getItinerary } from '../api/itinerary';
import ItineraryView from '../components/ItineraryView';
import ShareModal from '../components/ShareModal';
import { FiArrowLeft, FiShare2, FiRefreshCw, FiLoader, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ItineraryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);

  const fetchItinerary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getItinerary(id);
      setData(res.data.data.itinerary);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItinerary(); }, [id]);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner spinner-lg spinner-brand" style={{ margin: '0 auto var(--space-md)' }} />
          <p>Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <FiAlertCircle size={48} style={{ color: 'var(--error)', marginBottom: 'var(--space-md)' }} />
          <h3 style={{ marginBottom: 8 }}>Unable to load itinerary</h3>
          <p style={{ marginBottom: 'var(--space-lg)', fontSize: '0.875rem' }}>{error}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={fetchItinerary}><FiRefreshCw /> Retry</button>
            <Link to="/history" className="btn btn-ghost">Back to My Trips</Link>
          </div>
        </div>
      </div>
    );
  }

  const itinerary = data?.itinerary;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>
        {/* Back & Actions */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-xl)', flexWrap: 'wrap', gap: 'var(--space-sm)' }}
        >
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/history')}>
            <FiArrowLeft /> My Trips
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShareOpen(true)}
              disabled={data?.status !== 'ready'}
            >
              <FiShare2 /> Share
            </button>
          </div>
        </motion.div>

        {/* Status banner if not ready */}
        {data?.status !== 'ready' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: 'var(--space-md) var(--space-lg)',
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-xl)',
          }}>
            <div className="spinner spinner-sm" style={{ borderTopColor: 'var(--warning)', borderColor: 'rgba(245,158,11,0.2)' }} />
            <span style={{ color: 'var(--warning)', fontSize: '0.875rem', fontWeight: 500 }}>
              Your itinerary is still being generated. This page will have the full plan once ready.
            </span>
          </div>
        )}

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 'var(--space-xl)' }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>{data?.title}</h1>
          {data?.isPublic && (
            <span className="badge badge-info">🌍 Public · Shared</span>
          )}
        </motion.div>

        {/* Itinerary */}
        {itinerary ? (
          <ItineraryView itinerary={itinerary} />
        ) : (
          <div style={{
            textAlign: 'center', padding: 'var(--space-3xl)',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
          }}>
            <p style={{ color: 'var(--text-muted)' }}>
              {data?.status === 'failed'
                ? '❌ Generation failed. Please upload documents again.'
                : '⏳ Itinerary is being generated...'}
            </p>
            <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 10, justifyContent: 'center' }}>
              {data?.status === 'failed' && (
                <Link to="/dashboard" className="btn btn-primary">Try Again</Link>
              )}
              <button className="btn btn-secondary" onClick={fetchItinerary}><FiRefreshCw /> Refresh</button>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {data && (
        <ShareModal
          itinerary={data}
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          onUpdate={(updated) => setData(updated)}
        />
      )}
    </div>
  );
};

export default ItineraryDetailPage;
