import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAllItineraries } from '../api/itinerary';
import ItineraryCard from '../components/ItineraryCard';
import { FiPlusCircle, FiSearch, FiFilter, FiInbox } from 'react-icons/fi';

const SkeletonCard = () => (
  <div style={{
    background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)', overflow: 'hidden',
  }}>
    <div style={{ height: 80, background: 'var(--bg-tertiary)' }} />
    <div style={{ padding: 'var(--space-md)' }}>
      <div className="skeleton" style={{ height: 18, width: '70%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 34, borderRadius: 8 }} />
    </div>
  </div>
);

const HistoryPage = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | ready | processing
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchItineraries = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 12 };
      if (filter !== 'all') params.status = filter;
      const res = await getAllItineraries(params);
      const { itineraries: data, pagination: pg } = res.data.data;
      setItineraries(data);
      setPagination(pg);
      setPage(p);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItineraries(1); }, [filter]);

  const handleDelete = (id) => {
    setItineraries(prev => prev.filter(it => it._id !== id));
  };

  const filtered = itineraries.filter(it =>
    it.title?.toLowerCase().includes(search.toLowerCase()) ||
    it.itinerary?.destination?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}
        >
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: 'clamp(1.4rem, 3vw, 1.8rem)' }}>My Trips</h1>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              {pagination ? `${pagination.total} itinerar${pagination.total === 1 ? 'y' : 'ies'}` : 'Your travel itineraries'}
            </p>
          </div>
          <Link to="/dashboard" className="btn btn-primary">
            <FiPlusCircle /> New Trip
          </Link>
        </motion.div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-lg)' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16 }} />
            <input
              id="history-search"
              className="form-input"
              style={{ paddingLeft: 38 }}
              placeholder="Search trips..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'ready', label: 'Ready' },
              { id: 'generating', label: 'Processing' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`btn btn-sm ${filter === f.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid-auto">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center', padding: 'var(--space-3xl)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <FiInbox size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }} />
            <h3 style={{ marginBottom: 8, color: 'var(--text-secondary)' }}>No trips found</h3>
            <p style={{ marginBottom: 'var(--space-lg)', fontSize: '0.875rem' }}>
              {search ? 'Try a different search term.' : 'Create your first AI-powered itinerary!'}
            </p>
            {!search && (
              <Link to="/dashboard" className="btn btn-primary">
                <FiPlusCircle /> Create Your First Trip
              </Link>
            )}
          </motion.div>
        ) : (
          <>
            <div className="grid-auto">
              <AnimatePresence>
                {filtered.map(it => (
                  <ItineraryCard key={it._id} itinerary={it} onDelete={handleDelete} />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 'var(--space-2xl)' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => fetchItineraries(page - 1)}
                >
                  ← Previous
                </button>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0 12px' }}>
                  Page {page} of {pagination.pages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={!pagination.hasNext}
                  onClick={() => fetchItineraries(page + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
