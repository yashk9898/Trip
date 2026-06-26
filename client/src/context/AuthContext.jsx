import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, login as loginApi, logout as logoutApi, register as registerApi } from '../auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ts_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  // Hydrate user on mount
  useEffect(() => {
    const hydrate = async () => {
      try {
        const res = await getMe();
        const u = res.data.data.user;
        setUser(u);
        localStorage.setItem('ts_user', JSON.stringify(u));
      } catch {
        setUser(null);
        localStorage.removeItem('ts_user');
        localStorage.removeItem('ts_token');
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await loginApi(credentials);
    const { user, token } = res.data.data;
    setUser(user);
    localStorage.setItem('ts_user', JSON.stringify(user));
    if (token) localStorage.setItem('ts_token', token);
    return user;
  }, []);

  const register = useCallback(async (data) => {
    const res = await registerApi(data);
    const { user, token } = res.data.data;
    setUser(user);
    localStorage.setItem('ts_user', JSON.stringify(user));
    if (token) localStorage.setItem('ts_token', token);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch { /* ignore */ }
    setUser(null);
    localStorage.removeItem('ts_user');
    localStorage.removeItem('ts_token');
    toast.success('Logged out. See you soon! 👋');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
