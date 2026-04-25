import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { t } = useTranslation();
  const { cart, removeFromCart, updateQty, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    if (!user) return navigate('/login');
    setLoading(true);
    try {
      const products = cart.map(i => ({ productId: i._id, quantity: i.quantity, price: i.price }));
      await ordersAPI.create({ products, totalPrice: total });
      clearCart();
      setSuccess(true);
    } catch (err) {
      alert('Error creating order');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ background: '#0f1f0f', minHeight: '100vh', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem' }}>✅</div>
        <h2 style={{ color: '#90ee90', marginBottom: '1rem' }}>تم تأكيد طلبك!</h2>
        <p style={{ color: '#f0c040' }}>+{Math.floor(total / 10)} نقاط أضيفت لحسابك 🌟</p>
        <button onClick={() => navigate('/products')} style={{ marginTop: '1.5rem', background: '#f0c040', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}>
          متابعة التسوق
        </button>
      </motion.div>
    </div>
  );

  return (
    <div style={{ background: '#0f1f0f', minHeight: '100vh', paddingTop: '80px', padding: '80px 2rem 2rem' }}>
      <h1 style={{ color: '#f0c040', marginBottom: '2rem', textAlign: 'center' }}>🛒 {t('cart')}</h1>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', marginTop: '3rem' }}>
          <div style={{ fontSize: '3rem' }}>🛒</div>
          <p>السلة فارغة</p>
          <button onClick={() => navigate('/products')} style={{ marginTop: '1rem', background: '#f0c040', border: 'none', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer', fontWeight: 700 }}>
            تسوق الآن
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {cart.map(item => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px', padding: '1rem 1.5rem',
                marginBottom: '1rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div>
                <h4 style={{ color: '#fff', marginBottom: '0.25rem' }}>{item.name}</h4>
                <span style={{ color: '#f0c040' }}>{item.price} DH / {item.unit}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button onClick={() => updateQty(item._id, item.quantity - 1)} style={qBtn}>−</button>
                <span style={{ color: '#fff', fontWeight: 700 }}>{item.quantity}</span>
                <button onClick={() => updateQty(item._id, item.quantity + 1)} style={qBtn}>+</button>
                <span style={{ color: '#90ee90', fontWeight: 700, minWidth: '70px', textAlign: 'right' }}>
                  {(item.price * item.quantity).toFixed(2)} DH
                </span>
                <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '1.2rem' }}>🗑</button>
              </div>
            </motion.div>
          ))}

          <div style={{ background: 'rgba(240,192,64,0.1)', borderRadius: '12px', padding: '1.5rem', marginTop: '1rem', border: '1px solid rgba(240,192,64,0.3)' }}>
            <p style={{ color: '#888', marginBottom: '0.5rem' }}>{t('addMore')}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#fff', fontSize: '1.1rem' }}>{t('total')}:</span>
              <span style={{ color: '#f0c040', fontSize: '1.5rem', fontWeight: 700 }}>{total.toFixed(2)} DH</span>
            </div>
            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>
              ⭐ ستكسب {Math.floor(total / 10)} نقاط من هذا الطلب
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleOrder}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: 'linear-gradient(135deg, #f0c040, #e09800)',
                color: '#1a1a1a', border: 'none', borderRadius: '12px',
                fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer'
              }}
            >
              {loading ? '...' : `✅ ${t('confirmOrder')}`}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

const qBtn = {
  width: '28px', height: '28px', borderRadius: '50%',
  background: 'rgba(255,255,255,0.1)', color: '#fff',
  border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '1rem'
};
