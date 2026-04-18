import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, login as apiLogin, register as apiRegister } from '../services/api';
import io from 'socket.io-client';

// ─── AUTH CONTEXT ────────────────────────────────────────
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('ft_token');
    if (token) {
      getMe().then(r => setUser(r.data)).catch(() => localStorage.removeItem('ft_token')).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const s = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
      s.emit(user.role === 'admin' ? 'joinAdmin' : 'join', user._id);
      setSocket(s);
      return () => s.disconnect();
    }
  }, [user]);

  const login = async (data) => {
    const res = await apiLogin(data);
    localStorage.setItem('ft_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (data) => {
    const res = await apiRegister(data);
    localStorage.setItem('ft_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('ft_token');
    setUser(null);
    socket?.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, socket }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// ─── CART CONTEXT ────────────────────────────────────────
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ft_cart')) || []; }
    catch { return []; }
  });

  const save = (items) => {
    setCart(items);
    localStorage.setItem('ft_cart', JSON.stringify(items));
  };

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

  const updateQty = (key, qty) => {
    if (qty < 1) return removeFromCart(key);
    save(cart.map(i => i.key === key ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => save([]);

  const total = cart.reduce((sum, i) => sum + (i.final_price || i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
