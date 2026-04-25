import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { productsAPI, animalsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ANIMAL_ICONS = { cow: '🐄', chicken: '🐓', sheep: '🐑', goat: '🐐', default: '🐾' };
const PRODUCT_ICONS = { milk: '🥛', egg: '🥚', meat: '🥩', smen: '🧈', laban: '🥛' };

export default function Products() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [quantities, setQuantities] = useState({});
  const [added, setAdded] = useState({});

  useEffect(() => {
    productsAPI.getAll().then(r => setProducts(r.data)).catch(() => {});
    animalsAPI.getAll().then(r => setAnimals(r.data)).catch(() => {});
  }, []);

  const handleAdd = (product) => {
    const qty = quantities[product._id] || 1;
    addToCart(product, qty);
    setAdded(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product._id]: false })), 1500);
  };

  const filtered = filter === 'all' ? products : products.filter(p => p.animalId?._id === filter);

  return (
    <div style={{ background: '#0f1f0f', minHeight: '100vh', paddingTop: '80px', padding: '80px 2rem 2rem' }}>
      <h1 style={{ color: '#f0c040', textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem' }}>🛒 {t('products')}</h1>

      {/* Filter by animal */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>🌿 الكل</FilterBtn>
        {animals.map(a => (
          <FilterBtn key={a._id} active={filter === a._id} onClick={() => setFilter(a._id)}>
            {ANIMAL_ICONS[a.type] || ANIMAL_ICONS.default} {a.name}
          </FilterBtn>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        {filtered.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6 }}
            style={{
              background: 'linear-gradient(135deg, #1a3a1a, #1a2a0a)',
              borderRadius: '16px', padding: '1.5rem',
              border: '1px solid rgba(144,238,144,0.15)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ fontSize: '3.5rem', textAlign: 'center', marginBottom: '0.75rem' }}>
              {PRODUCT_ICONS[p.type] || '📦'}
            </div>
            <h3 style={{ color: '#fff', marginBottom: '0.25rem', textAlign: 'center' }}>{p.name}</h3>
            <p style={{ color: '#888', fontSize: '0.8rem', textAlign: 'center', marginBottom: '0.75rem' }}>
              {p.animalId?.name} — {t(p.type)}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#f0c040', fontSize: '1.4rem', fontWeight: 700 }}>{p.price} DH</span>
              <span style={{ color: '#888', fontSize: '0.8rem' }}>/{p.unit}</span>
            </div>

            {/* Quantity selector */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <button onClick={() => setQuantities(q => ({ ...q, [p._id]: Math.max(1, (q[p._id] || 1) - 1) }))}
                style={qBtnStyle}>−</button>
              <span style={{ color: '#fff', fontWeight: 700, minWidth: '30px', textAlign: 'center' }}>
                {quantities[p._id] || 1}
              </span>
              <button onClick={() => setQuantities(q => ({ ...q, [p._id]: (q[p._id] || 1) + 1 }))}
                style={qBtnStyle}>+</button>
              <span style={{ color: '#888', fontSize: '0.8rem' }}>{p.unit}</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAdd(p)}
              style={{
                width: '100%', padding: '10px',
                background: added[p._id]
                  ? 'linear-gradient(135deg, #2d8a2d, #1a6a1a)'
                  : 'linear-gradient(135deg, #f0c040, #e09800)',
                color: added[p._id] ? '#fff' : '#1a1a1a',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.3s'
              }}
            >
              {added[p._id] ? '✅ تمت الإضافة' : `🛒 ${t('addToCart')}`}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '3rem' }}>لا توجد منتجات بعد</p>
      )}
    </div>
  );
}

function FilterBtn({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? '#f0c040' : 'rgba(255,255,255,0.08)',
      color: active ? '#1a1a1a' : '#ddd',
      border: '1px solid ' + (active ? '#f0c040' : 'rgba(255,255,255,0.15)'),
      borderRadius: '20px', padding: '6px 16px', cursor: 'pointer',
      fontSize: '0.9rem', fontWeight: active ? 700 : 400, transition: 'all 0.2s'
    }}>{children}</button>
  );
}

const qBtnStyle = {
  width: '30px', height: '30px', borderRadius: '50%',
  background: 'rgba(255,255,255,0.1)', color: '#fff',
  border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
  fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
};
