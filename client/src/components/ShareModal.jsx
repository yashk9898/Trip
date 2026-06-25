import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShare2, FiCopy, FiCheck, FiGlobe, FiLock, FiExternalLink } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { toggleShare } from '../api/itinerary';
import toast from 'react-hot-toast';

const ShareModal = ({ itinerary, isOpen, onClose, onUpdate }) => {
  const [isPublic, setIsPublic] = useState(itinerary?.isPublic || false);
  const [shareToken, setShareToken] = useState(itinerary?.shareToken || null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = shareToken
    ? `${window.location.origin}/share/${shareToken}`
    : null;

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await toggleShare(itinerary._id);
      const { isPublic: newPublic, shareToken: newToken } = res.data.data;
      setIsPublic(newPublic);
      if (newToken) setShareToken(newToken);
      onUpdate?.({ ...itinerary, isPublic: newPublic, shareToken: newToken });
      toast.success(newPublic ? '🌍 Itinerary is now public!' : '🔒 Itinerary is now private');
    } catch {
      toast.error('Failed to update sharing settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out my travel itinerary to ${itinerary?.itinerary?.destination || 'this amazing destination'}! 🌍✈️`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Check out my travel itinerary! 🌍✈️ ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed', zIndex: 2001,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(480px, calc(100vw - 32px))',
              background: 'rgba(13, 20, 33, 0.98)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-xl)',
              backdropFilter: 'blur(30px)',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: 'var(--space-lg) var(--space-lg) var(--space-md)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34,
                  background: 'var(--gradient-brand)',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 16,
                }}>
                  <FiShare2 />
                </div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Share Itinerary</h3>
              </div>
              <button onClick={onClose} style={{
                background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
                borderRadius: 8, width: 30, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16,
              }}>
                <FiX />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {/* Toggle */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'var(--space-md)',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {isPublic
                    ? <FiGlobe style={{ color: 'var(--success)', fontSize: 18 }} />
                    : <FiLock style={{ color: 'var(--text-muted)', fontSize: 18 }} />
                  }
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {isPublic ? 'Public Link' : 'Private'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {isPublic ? 'Anyone with the link can view' : 'Only you can view this itinerary'}
                    </div>
                  </div>
                </div>
                {/* Toggle Switch */}
                <button
                  onClick={handleToggle}
                  disabled={loading}
                  style={{
                    width: 46, height: 26,
                    borderRadius: 13,
                    background: isPublic ? 'var(--success)' : 'var(--bg-tertiary)',
                    border: '1px solid',
                    borderColor: isPublic ? 'var(--success)' : 'var(--border-glass)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    position: 'relative',
                    transition: 'all 0.25s ease',
                    opacity: loading ? 0.7 : 1,
                    flexShrink: 0,
                  }}
                >
                  <motion.div
                    animate={{ x: isPublic ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{
                      position: 'absolute', top: 2,
                      width: 20, height: 20,
                      background: 'white',
                      borderRadius: '50%',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    }}
                  />
                </button>
              </div>

              {/* Share URL */}
              {isPublic && shareUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                >
                  {/* URL Input + Copy */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{
                      flex: 1, padding: '10px 12px',
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem', color: 'var(--text-secondary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {shareUrl}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="btn btn-secondary btn-sm"
                      style={{ flexShrink: 0 }}
                    >
                      {copied ? <FiCheck size={14} style={{ color: 'var(--success)' }} /> : <FiCopy size={14} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  {/* Open Link */}
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'center' }}
                  >
                    <FiExternalLink size={14} /> Open Preview
                  </a>

                  {/* Social Share */}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Share on
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={shareOnTwitter}
                        style={{
                          flex: 1, padding: '8px 12px',
                          background: 'rgba(29,161,242,0.1)',
                          border: '1px solid rgba(29,161,242,0.2)',
                          borderRadius: 'var(--radius-sm)',
                          color: '#1da1f2', cursor: 'pointer',
                          fontSize: '0.8rem', fontWeight: 600,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(29,161,242,0.18)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(29,161,242,0.1)'}
                      >
                        𝕏 Twitter
                      </button>
                      <button
                        onClick={shareOnWhatsApp}
                        style={{
                          flex: 1, padding: '8px 12px',
                          background: 'rgba(37,211,102,0.1)',
                          border: '1px solid rgba(37,211,102,0.2)',
                          borderRadius: 'var(--radius-sm)',
                          color: '#25d366', cursor: 'pointer',
                          fontSize: '0.8rem', fontWeight: 600,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.18)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(37,211,102,0.1)'}
                      >
                        WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    padding: 'var(--space-md)',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Scan QR Code
                    </div>
                    <div style={{
                      padding: 12, background: 'white',
                      borderRadius: 12,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    }}>
                      <QRCodeSVG
                        value={shareUrl}
                        size={140}
                        level="M"
                        includeMargin={false}
                        fgColor="#080c14"
                      />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Scan with your phone camera
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
