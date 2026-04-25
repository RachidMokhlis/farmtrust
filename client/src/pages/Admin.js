import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { animalsAPI, productsAPI, ordersAPI, commentsAPI, promosAPI, statsAPI } from '../services/api';
import { VideoAdAdmin } from '../components/VideoAd';

const TAB_ICONS = { stats: '📊', animals: '🐄', products: '📦', orders: '🧾', comments: '💬', promos: '🔥', video: '🎬' };

export default function Admin() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('stats');
  const [animals, setAnimals] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [comments, setComments] = useState([]);
  const [promos, setPromos] = useState([]);
  const [stats, setStats] = useState({ animalsCount: 0, farmersCount: 0 });
  const [form, setForm] = useState({});

  const load = () => {
    animalsAPI.getAll().then(r => setAnimals(r.data)).catch(() => {});
    productsAPI.getAll().then(r => setProducts(r.data)).catch(() => {});
    ordersAPI.getAll().then(r => setOrders(r.data)).catch(() => {});
    commentsAPI.getAll().then(r => setComments(r.data)).catch(() => {});
    promosAPI.getAll().then(r => setPromos(r.data)).catch(() => {});
    statsAPI.get().then(r => setStats(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const saveStats = async () => {
    await statsAPI.update(stats);
    alert('تم الحفظ ✅');
  };

  return (
    <div style={{ background: '#0f1f0f', minHeight: '100vh', paddingTop: '80px', padding: '80px 1rem 2rem' }}>
      <h1 style={{ color: '#f0c040', textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
        ⚙️ Admin Dashboard
      </h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {Object.entries(TAB_ICONS).map(([key, icon]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            background: tab === key ? '#f0c040' : 'rgba(255,255,255,0.08)',
            color: tab === key ? '#1a1a1a' : '#ddd',
            border: 'none', borderRadius: '10px', padding: '8px 18px',
            cursor: 'pointer', fontWeight: tab === key ? 700 : 400, fontSize: '0.9rem'
          }}>
            {icon} {t(key)}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* STATS */}
        {tab === 'stats' && (
          <Section title="📊 الإحصائيات">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>{t('animalsCount')}</label>
                <input type="number" value={stats.animalsCount || ''} onChange={e => setStats({ ...stats, animalsCount: +e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t('farmersCount')}</label>
                <input type="number" value={stats.farmersCount || ''} onChange={e => setStats({ ...stats, farmersCount: +e.target.value })} style={inputStyle} />
              </div>
            </div>
            <SaveBtn onClick={saveStats} />
          </Section>
        )}

        {/* VIDEO */}
        {tab === 'video' && (
          <Section title="🎬 الفيديو الإعلاني">
            <VideoAdAdmin />
          </Section>
        )}

        {/* ANIMALS */}
        {tab === 'animals' && (
          <Section title="🐄 الحيوانات">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <input placeholder="الاسم" style={inputStyle} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input placeholder="النوع (cow/chicken/sheep)" style={inputStyle} onChange={e => setForm({ ...form, type: e.target.value })} />
              <input placeholder="الغذاء" style={inputStyle} onChange={e => setForm({ ...form, food: e.target.value })} />
              <input placeholder="الصحة" style={inputStyle} onChange={e => setForm({ ...form, health: e.target.value })} />
            </div>
            <SaveBtn onClick={async () => { await animalsAPI.create(form); load(); }} />
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {animals.map(a => (
                <ItemRow key={a._id} title={`${a.name} (${a.type})`} onDelete={async () => { await animalsAPI.remove(a._id); load(); }} />
              ))}
            </div>
          </Section>
        )}

        {/* PRODUCTS */}
        {tab === 'products' && (
          <Section title="📦 المنتجات">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <input placeholder="الاسم" style={inputStyle} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input placeholder="النوع (milk/egg/meat/smen/laban)" style={inputStyle} onChange={e => setForm({ ...form, type: e.target.value })} />
              <input placeholder="الثمن" type="number" style={inputStyle} onChange={e => setForm({ ...form, price: +e.target.value })} />
              <input placeholder="الوحدة (kg/litre/عدد)" style={inputStyle} onChange={e => setForm({ ...form, unit: e.target.value })} />
              <select style={{ ...inputStyle, gridColumn: 'span 2' }} onChange={e => setForm({ ...form, animalId: e.target.value })}>
                <option value="">اختر الحيوان</option>
                {animals.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
            <SaveBtn onClick={async () => { await productsAPI.create(form); load(); }} />
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {products.map(p => (
                <ItemRow key={p._id} title={`${p.name} — ${p.price} DH`} onDelete={async () => { await productsAPI.remove(p._id); load(); }} />
              ))}
            </div>
          </Section>
        )}

        {/* ORDERS */}
        {tab === 'orders' && (
          <Section title="🧾 الطلبات">
            {orders.map(o => (
              <div key={o._id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#fff' }}>{o.userId?.name || 'مجهول'}</span>
                  <span style={{ color: '#f0c040', fontWeight: 700 }}>{o.totalPrice} DH</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#888', fontSize: '0.85rem' }}>{new Date(o.createdAt).toLocaleDateString()}</span>
                  <select
                    value={o.status}
                    onChange={async e => { await ordersAPI.updateStatus(o._id, e.target.value); load(); }}
                    style={{ ...inputStyle, padding: '4px 8px', fontSize: '0.85rem' }}
                  >
                    {['pending', 'confirmed', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{t(s)}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* COMMENTS */}
        {tab === 'comments' && (
          <Section title="💬 التعليقات">
            {comments.map(c => (
              <div key={c._id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <p style={{ color: '#fff', marginBottom: '0.25rem' }}>{c.message}</p>
                  <span style={{ color: '#f0c040', fontSize: '0.8rem' }}>{'⭐'.repeat(c.rating)} — {c.userId?.name}</span>
                </div>
                <button onClick={async () => { await commentsAPI.remove(c._id); load(); }} style={{ background: 'rgba(255,80,80,0.2)', color: '#ff8080', border: '1px solid #ff6b6b', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer' }}>🗑</button>
              </div>
            ))}
          </Section>
        )}

        {/* PROMOS */}
        {tab === 'promos' && (
          <Section title="🔥 العروض">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <select style={inputStyle} onChange={e => setForm({ ...form, productId: e.target.value })}>
                <option value="">اختر المنتج</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
              <input placeholder="الخصم %" type="number" style={inputStyle} onChange={e => setForm({ ...form, discount: +e.target.value })} />
              <input type="datetime-local" style={{ ...inputStyle, gridColumn: 'span 2' }} onChange={e => setForm({ ...form, endDate: e.target.value })} />
            </div>
            <SaveBtn onClick={async () => { await promosAPI.create(form); load(); }} />
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {promos.map(p => (
                <ItemRow key={p._id} title={`${p.productId?.name} — ${p.discount}%`} onDelete={async () => { await promosAPI.remove(p._id); load(); }} />
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px', padding: '1.5rem',
        border: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <h3 style={{ color: '#90ee90', marginBottom: '1.25rem' }}>{title}</h3>
      {children}
    </motion.div>
  );
}

function ItemRow({ title, onDelete }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px 14px' }}>
      <span style={{ color: '#ddd' }}>{title}</span>
      <button onClick={onDelete} style={{ background: 'rgba(255,80,80,0.2)', color: '#ff8080', border: '1px solid #ff6b6b', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.85rem' }}>🗑</button>
    </div>
  );
}

function SaveBtn({ onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, #f0c040, #e09800)',
        color: '#1a1a1a', border: 'none', borderRadius: '10px',
        padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem'
      }}
    >
      ✅ حفظ
    </motion.button>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px', color: '#fff',
  fontSize: '0.9rem', outline: 'none',
  boxSizing: 'border-box'
};

const labelStyle = { color: '#aaa', fontSize: '0.85rem', display: 'block', marginBottom: '4px' };
