import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiCompass, FiHome, FiList, FiPlusCircle, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = isAuthenticated
    ? [
        { to: '/dashboard', label: 'New Trip', icon: <FiPlusCircle /> },
        { to: '/history', label: 'My Trips', icon: <FiList /> },
      ]
    : [];

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 'var(--navbar-height)',
        display: 'flex',
        alignItems: 'center',
        background: scrolled
          ? 'rgba(8, 12, 20, 0.92)'
          : 'rgba(8, 12, 20, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: scrolled ? 'var(--border-glass)' : 'transparent',
        transition: 'all 0.3s ease',
        padding: '0 var(--space-lg)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <motion.div
            whileHover={{ rotate: 20 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              width: 36, height: 36,
              background: 'var(--gradient-brand)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 18,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            }}
          >
            <FiCompass />
          </motion.div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem' }}>
            Trip<span className="gradient-text">Smart</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }} className="desktop-nav">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem', fontWeight: 500,
                color: isActive(link.to) ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive(link.to) ? 'var(--bg-glass)' : 'transparent',
                border: '1px solid',
                borderColor: isActive(link.to) ? 'var(--border-brand)' : 'transparent',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
              }}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setUserMenuOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 12px 6px 8px',
                  color: 'var(--text-primary)', fontSize: '0.875rem',
                  fontWeight: 500, cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 26, height: 26,
                  background: 'var(--gradient-brand)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: 'white',
                }}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                {user?.name?.split(' ')[0]}
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                      background: 'rgba(13, 20, 33, 0.95)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: 'var(--radius-md)',
                      backdropFilter: 'blur(20px)',
                      minWidth: 180,
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-card)',
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed in as</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                        {user?.email}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 16px', background: 'none', border: 'none',
                        color: 'var(--error)', cursor: 'pointer', fontSize: '0.875rem',
                        fontWeight: 500, transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <FiLogOut /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: 'none',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            padding: 8, cursor: 'pointer', fontSize: 18,
          }}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: 'rgba(8, 12, 20, 0.98)',
              borderBottom: '1px solid var(--border-glass)',
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none',
                  background: isActive(link.to) ? 'var(--bg-glass)' : 'transparent',
                }}>
                  {link.icon} {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <button onClick={handleLogout} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 16px', background: 'none', border: 'none',
                  color: 'var(--error)', cursor: 'pointer', fontWeight: 500, textAlign: 'left',
                  borderRadius: 'var(--radius-sm)', fontSize: '0.95rem',
                }}>
                  <FiLogOut /> Sign Out
                </button>
              ) : (
                <>
                  <Link to="/login" style={{ padding: '12px 16px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
                  <Link to="/register" className="btn btn-primary" style={{ marginTop: 4 }}>Get Started Free</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;
