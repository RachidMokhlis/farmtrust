import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../i18n/translations';
import io from 'socket.io-client';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ─── LANG CONTEXT ────────────────────────────────────────
const LangContext = createContext();
export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('ft_lang') || 'fr');
  const t = translations[lang] || translations.fr;
  const changeLang = (l) => { setLang(l); localStorage.setItem('ft_lang', l); };
  return <LangContext.Provider value={{ lang, t, changeLang }}>{children}</LangContext.Provider>;
};
export const useLang = () => useContext(LangContext);

// ─── AUTH CONTEXT ────────────────────────────────────────
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('ft_token');
    if (token) {
      fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(u => { if (u) setUser(u); else localStorage.removeItem('ft_token'); })
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
      const s = io(SOCKET_URL);
      s.emit(user.role === 'admin' ? 'joinAdmin' : 'join', user._id);
      setSocket(s);
      return () => s.disconnect();
    }
  }, [user]);

  const login = async (data) => {
    const res = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    localStorage.setItem('ft_token', json.token);
    setUser(json.user);
    return json;
  };

  const register = async (data) => {
    const res = await fetch(`${API}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    localStorage.setItem('ft_token', json.token);
    setUser(json.user);
    setShowWelcome(true);
    return json;
  };

  const logout = () => { localStorage.removeItem('ft_token'); setUser(null); socket?.disconnect(); };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, socket, showWelcome, setShowWelcome }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);

// ─── CART CONTEXT ────────────────────────────────────────
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('ft_cart')) || []; } catch { return []; } });

  const save = (items) => { setCart(items); localStorage.setItem('ft_cart', JSON.stringify(items)); };

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const key = item.type === 'animal' ? `animal_${item._id}` : `product_${item._id}`;
      const exists = prev.find(i => i.key === key);
      const updated = exists
        ? prev.map(i => i.key === key ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i)
        : [...prev, { ...item, key, quantity: item.quantity || 1 }];
      localStorage.setItem('ft_cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromCart = (key) => save(cart.filter(i => i.key !== key));
  const updateQty = (key, qty) => { if (qty < 1) return removeFromCart(key); save(cart.map(i => i.key === key ? { ...i, quantity: qty } : i)); };
  const clearCart = () => save([]);
  const total = cart.reduce((s, i) => s + (i.final_price || i.price) * i.quantity, 0);

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total }}>{children}</CartContext.Provider>;
};
export const useCart = () => useContext(CartContext);
