import { motion } from 'framer-motion';

const CreatorBadge = () => {
  return (
    <motion.a
      href="https://yashk9898.github.io/portfolio/"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 1 }}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 16px 8px 8px',
        background: 'rgba(17, 24, 39, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-glass)',
        borderRadius: '99px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        textDecoration: 'none',
        color: 'white',
      }}
    >
      {/* 3D Avatar Container */}
      <div style={{
        position: 'relative',
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'var(--gradient-brand)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -4px 8px rgba(0,0,0,0.3), 0 4px 12px rgba(244, 63, 94, 0.4)',
        overflow: 'hidden'
      }}>
        {/* Placeholder for 3D avatar - using an emoji that looks 3D on most OS, or a stylized initial */}
        <span style={{ fontSize: '1.4rem', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}>
          👨‍💻
        </span>
        {/* Glossy overlay to give a 3D sphere effect */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, transparent 100%)',
          borderRadius: '50% 50% 0 0'
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, lineHeight: 1 }}>
          Designed by
        </span>
        <span style={{ fontSize: '0.9rem', fontWeight: 800, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.2 }}>
          Yash Kava
        </span>
      </div>
    </motion.a>
  );
};

export default CreatorBadge;
