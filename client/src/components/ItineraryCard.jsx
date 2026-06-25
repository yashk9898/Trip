import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiClock, FiShare2, FiTrash2, FiEye, FiLoader } from 'react-icons/fi';
import { deleteItinerary } from '../api/itinerary';
import toast from 'react-hot-toast';

const StatusDot = ({ status }) => {
  const config = {
    ready:      { color: 'var(--success)', label: 'Ready', pulse: false },
    generating: { color: 'var(--warning)', label: 'Generating', pulse: true },
    extracting: { color: 'var(--info)',    label: 'Extracting', pulse: true },
    uploading:  { color: 'var(--info)',    label: 'Uploading', pulse: true },
    failed:     { color: 'var(--error)',   label: 'Failed', pulse: false },
  }[status] || { color: 'var(--text-muted)', label: status, pulse: false };

  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: config.color,
        boxShadow: config.pulse ? `0 0 8px ${config.color}` : 'none',
        animation: config.pulse ? 'status-pulse 1.5s ease-in-out infinite' : 'none',
        flexShrink: 0,
      }} />
      <span style={{ fontSize: '0.72rem', color: config.color, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {config.label}
      </span>
      <style>{`
        @keyframes status-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.4); }
        }
      `}</style>
    </span>
  );
};

const ItineraryCard = ({ itinerary, onDelete }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const { _id, title, status, itinerary: plan, createdAt, isPublic, viewCount } = itinerary;
  const destination = plan?.destination || itinerary.extractedData?.destination || 'Unknown Destination';
  const duration = plan?.duration || '';
  const days = plan?.days?.length || 0;
  const date = new Date(createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this itinerary? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteItinerary(_id);
      toast.success('Itinerary deleted');
      onDelete?.(_id);
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleClick = () => {
    if (status === 'ready') navigate(`/itinerary/${_id}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      onClick={handleClick}
      style={{
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: status === 'ready' ? 'pointer' : 'default',
        backdropFilter: 'blur(20px)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        if (status === 'ready') {
          e.currentTarget.style.borderColor = 'var(--border-brand)';
          e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Card Top / Gradient Header */}
      <div style={{
        height: 80,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(6, 182, 212, 0.08) 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        padding: 'var(--space-md)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -20, top: -20,
          width: 100, height: 100,
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <StatusDot status={status} />
        <div style={{ display: 'flex', gap: 4 }}>
          {isPublic && (
            <span className="badge badge-info" title="Public">
              <FiShare2 size={9} /> Shared
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: 'var(--space-md)' }}>
        <h3 style={{
          fontSize: '0.95rem', fontWeight: 700,
          color: 'var(--text-primary)', margin: '0 0 6px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 12 }}>
          <FiMapPin size={12} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {destination}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 'var(--space-md)' }}>
          {days > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <FiClock size={11} />
              {days} day{days > 1 ? 's' : ''}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <FiCalendar size={11} />
            {date}
          </div>
          {viewCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <FiEye size={11} />
              {viewCount}
            </div>
          )}
        </div>

        {/* Processing state */}
        {(status === 'generating' || status === 'extracting' || status === 'uploading') && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem', color: 'var(--warning)',
            marginBottom: 'var(--space-sm)',
          }}>
            <div className="spinner spinner-sm" style={{ borderTopColor: 'var(--warning)', borderColor: 'rgba(245,158,11,0.2)' }} />
            AI is working on this trip...
          </div>
        )}

        {status === 'failed' && (
          <div style={{
            padding: '8px 12px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem', color: 'var(--error)',
            marginBottom: 'var(--space-sm)',
          }}>
            Processing failed. Please try again.
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6 }}>
          {status === 'ready' && (
            <button
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
              onClick={(e) => { e.stopPropagation(); navigate(`/itinerary/${_id}`); }}
            >
              <FiEye size={13} /> View
            </button>
          )}
          <button
            className="btn btn-danger btn-sm btn-icon"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete"
          >
            {deleting ? <div className="spinner spinner-sm" /> : <FiTrash2 size={13} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ItineraryCard;
