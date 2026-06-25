import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import UploadZone from '../components/UploadZone';
import { uploadDocuments, getUploadStatus, generateItinerary, getItineraryStatus } from '../api/itinerary';
import { FiUploadCloud, FiCpu, FiZap, FiArrowRight, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 'upload', label: 'Upload Documents', icon: <FiUploadCloud />, color: 'var(--brand-primary)' },
  { id: 'extract', label: 'AI Extraction', icon: <FiCpu />, color: 'var(--brand-accent)' },
  { id: 'generate', label: 'Generate Itinerary', icon: <FiZap />, color: 'var(--brand-accent-2)' },
  { id: 'done', label: 'Ready!', icon: <FiCheckCircle />, color: 'var(--success)' },
];

const StepIndicator = ({ currentStep }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 'var(--space-2xl)' }}>
    {STEPS.map((step, i) => {
      const stepIndex = STEPS.findIndex(s => s.id === currentStep);
      const isDone = i < stepIndex;
      const isCurrent = i === stepIndex;
      const isNext = i > stepIndex;
      return (
        <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 64 }}>
            <motion.div
              animate={{
                background: isDone ? 'var(--success)' : isCurrent ? `linear-gradient(135deg, ${step.color}, ${step.color}aa)` : 'var(--bg-tertiary)',
                boxShadow: isCurrent ? `0 0 20px ${step.color}60` : 'none',
              }}
              transition={{ duration: 0.3 }}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${isDone ? 'var(--success)' : isCurrent ? step.color : 'var(--border-glass)'}`,
                color: isDone || isCurrent ? 'white' : 'var(--text-muted)',
                fontSize: 15,
                transition: 'all 0.3s',
              }}
            >
              {isDone ? <FiCheckCircle size={16} /> : step.icon}
            </motion.div>
            <span style={{ fontSize: '0.65rem', color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: isCurrent ? 600 : 400, whiteSpace: 'nowrap', textAlign: 'center' }}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              flex: 1, height: 2, marginBottom: 22,
              background: isDone ? 'var(--success)' : 'var(--border-subtle)',
              transition: 'background 0.5s',
              minWidth: 20,
            }} />
          )}
        </div>
      );
    })}
  </div>
);

const ProcessingCard = ({ status, itineraryId, step }) => {
  const messages = {
    uploading: 'Uploading your documents securely...',
    extracting: '🤖 Gemini AI is reading your booking documents...',
    generating: '✨ Crafting your personalized itinerary...',
    ready: '🎉 Your itinerary is ready!',
    failed: '❌ Something went wrong. Please try again.',
  };

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        textAlign: 'center', padding: 'var(--space-2xl)',
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-xl)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {status === 'failed' ? (
        <FiAlertCircle size={48} style={{ color: 'var(--error)', marginBottom: 'var(--space-md)' }} />
      ) : status === 'ready' ? (
        <FiCheckCircle size={48} style={{ color: 'var(--success)', marginBottom: 'var(--space-md)' }} />
      ) : (
        <div style={{ position: 'relative', width: 64, height: 64, margin: '0 auto var(--space-md)' }}>
          <div className="spinner spinner-lg spinner-brand" style={{ width: 56, height: 56, borderWidth: 3 }} />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: 'var(--brand-primary)',
          }}>
            {step === 'extract' ? <FiCpu /> : <FiZap />}
          </div>
        </div>
      )}
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>
        {messages[status] || 'Processing...'}
      </p>
      {(status === 'extracting' || status === 'generating') && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
          This usually takes 10–30 seconds
        </p>
      )}
    </motion.div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pollRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [step, setStep] = useState('upload'); // upload | extract | generate | done
  const [status, setStatus] = useState(null);
  const [itineraryId, setItineraryId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState('');

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => () => stopPolling(), []);

  const pollStatus = (id, currentStep) => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const endpoint = currentStep === 'extract' ? getUploadStatus : getItineraryStatus;
        const res = await endpoint(id);
        const data = res.data.data;
        const newStatus = data.status;
        setStatus(newStatus);

        if (newStatus === 'ready' && currentStep === 'extract') {
          stopPolling();
          // Auto-generate
          setStep('generate');
          setStatus('generating');
          const genRes = await generateItinerary(id);
          pollStatus(id, 'generate');
        } else if (newStatus === 'ready' && currentStep === 'generate') {
          stopPolling();
          setStep('done');
          toast.success('🎉 Your itinerary is ready!');
          setTimeout(() => navigate(`/itinerary/${id}`), 1500);
        } else if (newStatus === 'failed') {
          stopPolling();
          toast.error('Processing failed. Please try again.');
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    }, 3000);
  };

  const handleUpload = async () => {
    if (!files.length) {
      toast.error('Please select at least one file');
      return;
    }
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append('documents', f));
      if (title) formData.append('title', title);

      const res = await uploadDocuments(formData, (e) => {
        if (e.total) setUploadProgress(Math.round((e.loaded / e.total) * 100));
      });

      const { itineraryId: id } = res.data.data;
      setItineraryId(id);
      setStep('extract');
      setStatus('extracting');
      pollStatus(id, 'extract');
      toast.success('Documents uploaded! AI is extracting data...');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    stopPolling();
    setFiles([]);
    setStep('upload');
    setStatus(null);
    setItineraryId(null);
    setTitle('');
  };

  return (
    <div className="page-wrapper" style={{ position: 'relative' }}>
      <div className="bg-orb" style={{ width: 350, height: 350, background: 'rgba(99,102,241,0.08)', top: 80, right: -80 }} />

      <div className="container" style={{ maxWidth: 700, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 6 }}>
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}!</span>
            </h1>
            <p style={{ margin: 0 }}>Upload your travel documents and let AI craft your perfect itinerary.</p>
          </div>
        </motion.div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Upload Step */}
        {step === 'upload' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {/* Optional Title */}
            <div className="form-group">
              <label className="form-label">Trip Title <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
              <input
                id="trip-title"
                className="form-input"
                placeholder="e.g., Summer Europe Trip 2025"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={80}
              />
            </div>

            <UploadZone files={files} onFilesChange={setFiles} disabled={uploading} />

            {/* Upload Progress */}
            {uploading && uploadProgress > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Uploading...</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}>{uploadProgress}%</span>
                </div>
                <div style={{ height: 4, background: 'var(--border-subtle)', borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    style={{ height: '100%', background: 'var(--gradient-brand)', borderRadius: 2 }}
                  />
                </div>
              </div>
            )}

            <button
              className="btn btn-primary btn-lg"
              onClick={handleUpload}
              disabled={uploading || !files.length}
              style={{ width: '100%' }}
            >
              {uploading ? (
                <><div className="spinner spinner-sm" /> Uploading...</>
              ) : (
                <><FiUploadCloud /> Upload & Generate Itinerary <FiArrowRight /></>
              )}
            </button>

            {/* Tips */}
            <div style={{
              padding: 'var(--space-md)',
              background: 'rgba(99,102,241,0.05)',
              border: '1px solid rgba(99,102,241,0.15)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem', color: 'var(--text-muted)',
              lineHeight: 1.7,
            }}>
              <strong style={{ color: 'var(--brand-tertiary)' }}>💡 Tips for best results:</strong><br />
              Upload clear PDFs or images of flight tickets, hotel confirmations, train tickets, or any booking document.
              The more documents you upload, the more complete your itinerary will be.
            </div>
          </motion.div>
        )}

        {/* Processing Steps */}
        {(step === 'extract' || step === 'generate') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ProcessingCard status={status} itineraryId={itineraryId} step={step} />
            <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
              <button className="btn btn-ghost btn-sm" onClick={handleReset}>
                Cancel & Start Over
              </button>
            </div>
          </motion.div>
        )}

        {/* Done */}
        {step === 'done' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
            <ProcessingCard status="ready" />
            <p style={{ marginTop: 'var(--space-md)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Redirecting to your itinerary...
            </p>
          </motion.div>
        )}

        {/* Status failed */}
        {status === 'failed' && (
          <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
            <button className="btn btn-primary" onClick={handleReset}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
