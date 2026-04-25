import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function AuthForm({ mode }) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const res = mode === 'login'
        ? await authAPI.login({ email: form.email, password: form.password })
        : await authAPI.register(form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0f1f0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', paddingTop: '80px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #1a3a1a, #1a2a0a)',
          borderRadius: '24px', padding: '2.5rem',
          width: '100%', maxWidth: '400px',
          border: '1px solid rgba(144,238,144,0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem' }}>🌿</div>
          <h2 style={{ color: '#f0c040', fontFamily: "'Playfair Display', serif", marginBottom: '0.25rem' }}>
            FarmTrust by Rashid
          </h2>
          <p style={{ color: '#90ee90', fontSize: '0.9rem' }}>
            {mode === 'login' ? 'مرحبا بعودتك 👋' : 'أهلا وسهلا 🌿'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <input
              placeholder={t('name')}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
          )}
          <input
            type="email"
            placeholder={t('email')}
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder={t('password')}
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={inputStyle}
          />
        </div>

        {error && <p style={{ color: '#ff6b6b', marginTop: '0.75rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', marginTop: '1.5rem',
            background: 'linear-gradient(135deg, #f0c040, #e09800)',
            color: '#1a1a1a', border: 'none', borderRadius: '12px',
            padding: '14px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer'
          }}
        >
          {loading ? '...' : (mode === 'login' ? t('login') : t('register'))}
        </motion.button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#888', fontSize: '0.9rem' }}>
          {mode === 'login' ? (
            <><span>ماعندكش حساب؟ </span><Link to="/register" style={{ color: '#90ee90' }}>{t('register')}</Link></>
          ) : (
            <><span>عندك حساب؟ </span><Link to="/login" style={{ color: '#90ee90' }}>{t('login')}</Link></>
          )}
        </p>
      </motion.div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 16px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '10px', color: '#fff',
  fontSize: '0.95rem', outline: 'none',
  boxSizing: 'border-box'
};

export function Login() { return <AuthForm mode="login" />; }
export function Register() { return <AuthForm mode="register" />; }
