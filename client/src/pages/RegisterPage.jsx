import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCompass, FiArrowRight, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PasswordStrength = ({ password }) => {
  const checks = [
    { ok: password.length >= 6, label: '6+ characters' },
    { ok: /[A-Z]/.test(password), label: 'Uppercase letter' },
    { ok: /[0-9]/.test(password), label: 'Number' },
  ];
  if (!password) return null;
  const score = checks.filter(c => c.ok).length;
  const colors = ['var(--error)', 'var(--warning)', 'var(--brand-accent)', 'var(--success)'];
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i < score ? colors[score] : 'var(--border-subtle)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {checks.map(c => (
          <span key={c.label} style={{ fontSize: '0.7rem', color: c.ok ? 'var(--success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
            {c.ok && <FiCheck size={10} />} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setErrors({});
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  const change = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(err => ({ ...err, [field]: undefined }));
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-lg)',
      background: 'var(--bg-primary)',
      position: 'relative',
    }}>
      <div className="bg-orb" style={{ width: 400, height: 400, background: 'rgba(139,92,246,0.1)', top: -100, right: -100, animationDelay: '-3s' }} />
      <div className="bg-orb" style={{ width: 300, height: 300, background: 'rgba(99,102,241,0.07)', bottom: 50, left: -50 }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 44, height: 44, background: 'var(--gradient-brand)',
              borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, color: 'white', boxShadow: 'var(--shadow-brand)',
            }}>
              <FiCompass />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem' }}>
              Trip<span className="gradient-text">Smart</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-glass)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-xl)',
          backdropFilter: 'blur(30px)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: 6, fontSize: '1.5rem' }}>Create your account</h2>
          <p style={{ textAlign: 'center', marginBottom: 'var(--space-xl)', fontSize: '0.875rem' }}>
            Start planning smarter trips today
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16 }} />
                <input
                  id="register-name"
                  type="text"
                  className={`form-input${errors.name ? ' error' : ''}`}
                  style={{ paddingLeft: 38 }}
                  placeholder="John Doe"
                  value={form.name}
                  onChange={change('name')}
                  autoComplete="name"
                />
              </div>
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16 }} />
                <input
                  id="register-email"
                  type="email"
                  className={`form-input${errors.email ? ' error' : ''}`}
                  style={{ paddingLeft: 38 }}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={change('email')}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16 }} />
                <input
                  id="register-password"
                  type={showPass ? 'text' : 'password'}
                  className={`form-input${errors.password ? ' error' : ''}`}
                  style={{ paddingLeft: 38, paddingRight: 40 }}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={change('password')}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, padding: 0 }}
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
              <PasswordStrength password={form.password} />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16 }} />
                <input
                  id="register-confirm"
                  type={showPass ? 'text' : 'password'}
                  className={`form-input${errors.confirm ? ' error' : ''}`}
                  style={{ paddingLeft: 38 }}
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={change('confirm')}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirm && <span className="form-error">{errors.confirm}</span>}
            </div>

            {errors.form && (
              <div style={{ padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--error)' }}>
                {errors.form}
              </div>
            )}

            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%', marginTop: 4, padding: '0.75rem' }}
            >
              {loading ? <><div className="spinner spinner-sm" /> Creating account...</> : <>Create Account <FiArrowRight /></>}
            </motion.button>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <div className="divider" style={{ margin: 'var(--space-lg) 0' }}>or</div>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
