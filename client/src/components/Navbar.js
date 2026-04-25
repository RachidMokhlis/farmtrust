import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const LANGUAGES = [
  { code: 'ar', label: 'ع', dir: 'rtl' },
  { code: 'fr', label: 'FR', dir: 'ltr' },
  { code: 'en', label: 'EN', dir: 'ltr' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const switchLang = (code, dir) => {
    i18n.changeLanguage(code);
    document.documentElement.dir = dir;
    document.documentElement.lang = code;
  };

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'linear-gradient(135deg, #1a4a1a 0%, #2d5a1b 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '65px'
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '2rem' }}>🌿</span>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          color: '#f0c040',
          fontSize: '1.3rem',
          fontWeight: 700,
          letterSpacing: '1px'
        }}>
          FarmTrust
          <span style={{ color: '#90ee90', fontSize: '0.8rem', display: 'block', lineHeight: 1 }}>
            by Rashid
          </span>
        </span>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <NavLink to="/">{t('home')}</NavLink>
        <NavLink to="/products">{t('products')}</NavLink>
        {user && <NavLink to="/cart">🛒 {cart.length > 0 && <span style={{ background: '#f0c040', color: '#1a4a1a', borderRadius: '50%', padding: '0 6px', fontSize: '0.75rem', fontWeight: 'bold' }}>{cart.length}</span>}</NavLink>}
        {user && <NavLink to="/chat">💬</NavLink>}
        {user?.role === 'admin' && <NavLink to="/admin">{t('dashboard')}</NavLink>}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {/* Language switcher */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => switchLang(l.code, l.dir)}
              style={{
                background: i18n.language === l.code ? '#f0c040' : 'rgba(255,255,255,0.15)',
                color: i18n.language === l.code ? '#1a4a1a' : '#fff',
                border: 'none', borderRadius: '6px',
                padding: '4px 8px', cursor: 'pointer',
                fontSize: '0.75rem', fontWeight: 700,
                transition: 'all 0.2s'
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#f0c040', fontSize: '0.85rem' }}>⭐ {user.points}</span>
            <button
              onClick={() => { logout(); navigate('/'); }}
              style={{
                background: 'rgba(255,80,80,0.2)', color: '#ff8080',
                border: '1px solid rgba(255,80,80,0.4)', borderRadius: '8px',
                padding: '5px 12px', cursor: 'pointer', fontSize: '0.85rem'
              }}
            >
              {t('logout')}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" style={{
              color: '#fff', textDecoration: 'none',
              background: 'rgba(255,255,255,0.1)', borderRadius: '8px',
              padding: '5px 12px', fontSize: '0.85rem'
            }}>{t('login')}</Link>
            <Link to="/register" style={{
              color: '#1a4a1a', textDecoration: 'none',
              background: '#f0c040', borderRadius: '8px',
              padding: '5px 12px', fontSize: '0.85rem', fontWeight: 700
            }}>{t('register')}</Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} style={{ color: '#d4edda', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}
      onMouseOver={e => e.target.style.color = '#f0c040'}
      onMouseOut={e => e.target.style.color = '#d4edda'}>
      {children}
    </Link>
  );
}
