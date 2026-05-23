import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getOrders, getNotifications, markAllRead, getProducts, getPromotions, getAnimals, getComments, addComment, deleteComment } from '../../services/api';
import { useAuth, useLang, useCart } from '../../context';
import toast from 'react-hot-toast';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api','');
const EMOJI = { cow:'🐄', sheep:'🐑', chicken:'🐓', rabbit:'🐇', other:'🐾' };

const Stars = ({ value, onChange }) => (
  <div style={{ display:'flex', gap:2 }}>
    {[1,2,3,4,5].map(s => (
      <span key={s} onClick={() => onChange?.(s)}
        style={{ fontSize:22, color:s<=value?'#FFA726':'#e0e0e0', cursor:onChange?'pointer':'default' }}>★</span>
    ))}
  </div>
);

// ─── User Dashboard ──────────────────────────────────────
export function UserDashboard() {
  const { user } = useAuth();
  const { lang } = useLang();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [orders,   setOrders]   = useState([]);
  const [products, setProducts] = useState([]);
  const [promos,   setPromos]   = useState([]);
  const [animals,  setAnimals]  = useState([]);

  useEffect(() => {
    getOrders().then(d => Array.isArray(d) && setOrders(d)).catch(()=>{});
    getProducts().then(d => Array.isArray(d) && setProducts(d)).catch(()=>{});
    getPromotions().then(d => Array.isArray(d) && setPromos(d)).catch(()=>{});
    getAnimals().then(d => Array.isArray(d) && setAnimals(d)).catch(()=>{});
  }, []);

  const productsWithPromo = products.map(p => {
    const promo = promos.find(pr => pr.product_id?._id === p._id || pr.product_id === p._id);
    if (promo) return { ...p, discount: promo.discount_percentage, final_price: +(p.price*(1-promo.discount_percentage/100)).toFixed(2) };
    return p;
  });

  const animalsForSale = animals.filter(a => a.for_sale && a.status === 'available');

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 12px' }}>
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:'#1a1a1a', marginBottom:2 }}>
          {lang==='ar'?'مرحباً':lang==='fr'?'Bonjour':'Welcome'}, {user?.name} 👋
        </h1>
        <p style={{ color:'#888', fontSize:13, marginBottom:20 }}>FarmTrust by RSHD</p>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:24 }}>
          {[
            { icon:'📦', label:lang==='ar'?'طلباتي':lang==='fr'?'Commandes':'Orders',    value:orders.length,   link:'/orders' },
            { icon:'⏳', label:lang==='ar'?'قيد الانتظار':lang==='fr'?'En attente':'Pending', value:orders.filter(o=>o.status==='pending').length, link:'/orders' },
            { icon:'🧴', label:lang==='ar'?'المنتجات':lang==='fr'?'Produits':'Products',  value:products.length, link:'#products' },
            { icon:'🎁', label:lang==='ar'?'العروض':lang==='fr'?'Promos':'Promos',        value:promos.length,   link:'#promos' },
          ].map((s,i) => (
            <a key={i} href={s.link} style={{ textDecoration:'none' }}>
              <motion.div whileHover={{ y:-2 }}
                style={{ background:'white', borderRadius:16, padding:'14px', textAlign:'center', border:'1px solid #f0f0f0', boxShadow:'0 2px 8px #0001' }}>
                <div style={{ fontSize:26, marginBottom:3 }}>{s.icon}</div>
                <div style={{ fontSize:22, fontWeight:900, color:'#1B5E20' }}>{s.value}</div>
                <div style={{ fontSize:11, color:'#888', fontWeight:600 }}>{s.label}</div>
              </motion.div>
            </a>
          ))}
        </div>

        {/* ── PROMOTIONS ─────────────────────────────── */}
        {promos.length > 0 && (
          <div id="promos" style={{ marginBottom:28 }}>
            <h2 style={{ fontSize:17, fontWeight:800, color:'#1a1a1a', marginBottom:14 }}>
              🔥 {lang==='ar'?'العروض الحالية':lang==='fr'?'Promotions en cours':'Current Promotions'}
            </h2>
            <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:8, WebkitOverflowScrolling:'touch' }}>
              {promos.map((pr,i) => (
                <motion.div key={pr._id} initial={{ opacity:0,x:16 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.07 }}
                  style={{ flexShrink:0, background:'linear-gradient(135deg,#FFF8E1,#FFFDE7)', borderRadius:16, padding:'16px', minWidth:150, border:'1.5px solid #FFE082', textAlign:'center' }}>
                  <div style={{ fontSize:30, marginBottom:6 }}>🎁</div>
                  <div style={{ fontWeight:700, color:'#333', fontSize:13, marginBottom:4 }}>{pr.product_id?.name||'Produit'}</div>
                  <div style={{ background:'#FF6F00', color:'white', borderRadius:20, padding:'3px 12px', fontWeight:900, fontSize:18, display:'inline-block', marginBottom:4 }}>
                    -{pr.discount_percentage}%
                  </div>
                  <div style={{ fontSize:10, color:'#888' }}>→ {new Date(pr.end_date).toLocaleDateString()}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ─────────────────────────────── */}
        <div id="products" style={{ marginBottom:28 }}>
          <h2 style={{ fontSize:17, fontWeight:800, color:'#1a1a1a', marginBottom:14 }}>
            🧴 {lang==='ar'?'منتجاتنا':lang==='fr'?'Nos Produits':'Our Products'}
          </h2>
          {productsWithPromo.length === 0 ? (
            <div style={{ textAlign:'center', padding:'28px', color:'#aaa', background:'white', borderRadius:16, border:'1px solid #f0f0f0' }}>
              <div style={{ fontSize:36, marginBottom:6 }}>🧴</div>
              <p style={{ fontSize:13 }}>{lang==='ar'?'لا توجد منتجات':lang==='fr'?'Aucun produit':'No products yet'}</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(190px,45%),1fr))', gap:12 }}>
              {productsWithPromo.map((p,i) => (
                <motion.div key={p._id} initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
                  whileHover={{ y:-3 }}
                  style={{ background:'white', borderRadius:16, padding:'14px', border:'1px solid #f0f0f0', boxShadow:'0 2px 8px #0001' }}>
                  <div style={{ fontSize:32, textAlign:'center', marginBottom:8 }}>
                    {p.name?.toLowerCase().includes('lait')||p.name?.toLowerCase().includes('milk')?'🥛'
                    :p.name?.toLowerCase().includes('oeuf')||p.name?.toLowerCase().includes('egg')?'🥚'
                    :p.name?.toLowerCase().includes('viande')||p.name?.toLowerCase().includes('meat')?'🥩'
                    :'🧴'}
                  </div>
                  <div style={{ fontWeight:700, color:'#1a1a1a', fontSize:14, marginBottom:2 }}>{p.name}</div>
                  <div style={{ fontSize:11, color:'#888', marginBottom:8 }}>
                    {p.animal_id?.name||'—'} • {p.unit}
                    {p.discount && <span style={{ marginLeft:6, background:'#FFEB3B', color:'#E65100', padding:'1px 6px', borderRadius:10, fontWeight:700, fontSize:10 }}>-{p.discount}%</span>}
                  </div>
                  <div style={{ marginBottom:10 }}>
                    {p.discount ? (
                      <>
                        <span style={{ textDecoration:'line-through', color:'#bbb', fontSize:11 }}>{p.price} MAD</span>
                        <span style={{ fontWeight:900, color:'#1B5E20', fontSize:16, marginLeft:4 }}>{p.final_price} MAD</span>
                      </>
                    ) : (
                      <span style={{ fontWeight:900, color:'#1B5E20', fontSize:16 }}>{p.price} MAD</span>
                    )}
                  </div>
                  <button onClick={() => {
                    addToCart({ _id:p._id, name:p.name, price:p.final_price||p.price, unit:p.unit, type:'product' });
                    toast.success(`${p.name} ajouté! 🛒`);
                  }} style={{ width:'100%', background:'#1B5E20', color:'white', border:'none', borderRadius:10, padding:'9px', fontWeight:700, fontSize:12, cursor:'pointer' }}>
                    🛒 {lang==='ar'?'أضف للسلة':lang==='fr'?'Ajouter':'Add to cart'}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ── ANIMALS FOR SALE ─────────────────────── */}
        {animalsForSale.length > 0 && (
          <div style={{ marginBottom:28 }}>
            <h2 style={{ fontSize:17, fontWeight:800, color:'#1a1a1a', marginBottom:14 }}>
              🐄 {lang==='ar'?'حيوانات للبيع':lang==='fr'?'Animaux à vendre':'Animals for sale'}
            </h2>
            <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:8, WebkitOverflowScrolling:'touch' }}>
              {animalsForSale.map((a,i) => (
                <motion.div key={a._id} initial={{ opacity:0,x:16 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.07 }}
                  style={{ flexShrink:0, background:'white', borderRadius:16, overflow:'hidden', border:'1px solid #f0f0f0', minWidth:170, boxShadow:'0 2px 8px #0001' }}>
                  <div style={{ height:110, background:'linear-gradient(135deg,#E8F5E9,#FFF8E1)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                    {a.images?.[0]
                      ? <img src={a.images[0].startsWith('data:')?a.images[0]:`${API_BASE}${a.images[0]}`} alt={a.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                      : <span style={{ fontSize:52 }}>{EMOJI[a.type]||'🐾'}</span>
                    }
                  </div>
                  <div style={{ padding:'10px 12px' }}>
                    <div style={{ fontWeight:700, fontSize:14, color:'#1a1a1a' }}>{a.name}</div>
                    <div style={{ fontSize:11, color:'#888', marginBottom:6 }}>{EMOJI[a.type]} {a.type}</div>
                    <div style={{ fontWeight:900, color:'#E65100', fontSize:15, marginBottom:8 }}>{a.sale_price} MAD</div>
                    <Link to={`/animals/${a._id}`}
                      style={{ display:'block', textAlign:'center', background:'#FFF3E0', color:'#E65100', borderRadius:10, padding:'7px', fontSize:12, fontWeight:700, textDecoration:'none' }}>
                      {lang==='ar'?'تفاصيل':lang==='fr'?'Détails':'Details'} →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── RECENT ORDERS ────────────────────────── */}
        <div style={{ marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <h2 style={{ fontSize:17, fontWeight:800, color:'#1a1a1a' }}>
              📦 {lang==='ar'?'آخر الطلبات':lang==='fr'?'Dernières commandes':'Recent orders'}
            </h2>
            <Link to="/orders" style={{ fontSize:12, color:'#1B5E20', fontWeight:700, textDecoration:'none' }}>
              {lang==='ar'?'الكل':lang==='fr'?'Voir tout':'View all'} →
            </Link>
          </div>
          {orders.length === 0 ? (
            <div style={{ textAlign:'center', padding:'22px', color:'#aaa', background:'white', borderRadius:16, border:'1px solid #f0f0f0' }}>
              <p style={{ fontSize:13 }}>{lang==='ar'?'لا طلبات بعد':lang==='fr'?'Aucune commande':'No orders yet'}</p>
              <Link to="/animals" style={{ color:'#1B5E20', fontWeight:700, textDecoration:'none', fontSize:13, marginTop:6, display:'block' }}>
                {lang==='ar'?'تسوق الآن':lang==='fr'?'Commencer':'Start shopping'} →
              </Link>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {orders.slice(0,3).map(o => (
                <div key={o._id} style={{ background:'white', borderRadius:14, padding:'12px 16px', border:'1px solid #f0f0f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontWeight:700, color:'#333', fontSize:13 }}>#{o._id.slice(-6).toUpperCase()}</div>
                    <div style={{ fontSize:11, color:'#aaa' }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontWeight:800, color:'#1B5E20', fontSize:14 }}>{o.total_price} MAD</div>
                    <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, fontWeight:700,
                      background:o.status==='delivered'?'#E8F5E9':o.status==='confirmed'?'#FFF8E1':o.status==='cancelled'?'#FFEBEE':'#F5F5F5',
                      color:o.status==='delivered'?'#1B5E20':o.status==='confirmed'?'#E65100':o.status==='cancelled'?'#C62828':'#888' }}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── QUICK ACTIONS ────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
          {[
            { icon:'🐄', label:lang==='ar'?'الحيوانات':lang==='fr'?'Animaux':'Animals', to:'/animals' },
            { icon:'🛒', label:lang==='ar'?'السلة':lang==='fr'?'Panier':'Cart', to:'/cart' },
            { icon:'💬', label:'Chat', to:'/chat' },
            { icon:'🔔', label:lang==='ar'?'الإشعارات':lang==='fr'?'Notifications':'Notifs', to:'/notifications' },
          ].map(a => (
            <Link key={a.to} to={a.to}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:14, textDecoration:'none', color:'#555', background:'white', border:'1px solid #f0f0f0' }}
              onMouseEnter={e=>e.currentTarget.style.background='#E8F5E9'}
              onMouseLeave={e=>e.currentTarget.style.background='white'}>
              <span style={{ fontSize:22 }}>{a.icon}</span>
              <span style={{ fontSize:13, fontWeight:600 }}>{a.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── User Orders ─────────────────────────────────────────
export function UserOrders() {
  const { lang } = useLang();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(d => Array.isArray(d) && setOrders(d)).finally(()=>setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth:800, margin:'0 auto', padding:'24px 12px' }}>
      <h1 style={{ fontSize:22, fontWeight:800, color:'#1a1a1a', marginBottom:20 }}>
        📦 {lang==='ar'?'طلباتي':lang==='fr'?'Mes commandes':'My Orders'}
      </h1>
      {loading ? <div style={{ textAlign:'center', padding:60, color:'#888' }}>Loading...</div>
        : orders.length === 0
          ? <div style={{ textAlign:'center', padding:60 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📦</div>
              <p style={{ color:'#888', fontSize:14 }}>{lang==='ar'?'لا طلبات':lang==='fr'?'Aucune commande':'No orders yet'}</p>
              <Link to="/animals" style={{ color:'#1B5E20', fontWeight:700, textDecoration:'none', marginTop:8, display:'block' }}>
                {lang==='ar'?'تسوق الآن':lang==='fr'?'Commencer':'Start shopping'} →
              </Link>
            </div>
          : <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {orders.map((o,i) => (
                <motion.div key={o._id} initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
                  style={{ background:'white', borderRadius:16, padding:'16px 18px', border:'1px solid #f0f0f0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                  <div>
                    <div style={{ fontWeight:700, color:'#333' }}>#{o._id.slice(-8).toUpperCase()}</div>
                    <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                    {o.note && <div style={{ fontSize:11, color:'#aaa', fontStyle:'italic' }}>"{o.note}"</div>}
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:18, fontWeight:900, color:'#1B5E20' }}>{o.total_price} MAD</div>
                    <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:700,
                      background:o.status==='delivered'?'#E8F5E9':o.status==='confirmed'?'#FFF8E1':o.status==='cancelled'?'#FFEBEE':'#F5F5F5',
                      color:o.status==='delivered'?'#1B5E20':o.status==='confirmed'?'#E65100':o.status==='cancelled'?'#C62828':'#888' }}>
                      {o.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
      }
    </div>
  );
}

// ─── User Notifications ──────────────────────────────────
export function UserNotifications() {
  const { lang } = useLang();
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications().then(d => Array.isArray(d) && setNotifs(d)).finally(()=>setLoading(false));
  }, []);

  const icons = { promotion:'🎁', order:'📦', message:'💬' };

  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'24px 12px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:'#1a1a1a' }}>
          🔔 {lang==='ar'?'الإشعارات':lang==='fr'?'Notifications':'Notifications'}
        </h1>
        {notifs.some(n=>!n.read) && (
          <button onClick={async()=>{ try { await markAllRead(); setNotifs(prev=>prev.map(n=>({...n,read:true}))); } catch {} }}
            style={{ fontSize:12, color:'#1B5E20', fontWeight:700, background:'#E8F5E9', border:'none', borderRadius:10, padding:'7px 14px', cursor:'pointer' }}>
            {lang==='ar'?'قراءة الكل':lang==='fr'?'Tout lire':'Mark all read'}
          </button>
        )}
      </div>
      {loading ? <div style={{ textAlign:'center', padding:60, color:'#888' }}>Loading...</div>
        : notifs.length === 0
          ? <div style={{ textAlign:'center', padding:60 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🔔</div>
              <p style={{ color:'#888', fontSize:14 }}>{lang==='ar'?'لا إشعارات':lang==='fr'?'Aucune notification':'No notifications'}</p>
            </div>
          : <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {notifs.map((n,i) => (
                <motion.div key={n._id} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.04 }}
                  style={{ background:'white', borderRadius:14, padding:'14px 16px', border:`1.5px solid ${!n.read?'#A5D6A7':'#f0f0f0'}`, display:'flex', gap:12, alignItems:'flex-start' }}>
                  <span style={{ fontSize:22, flexShrink:0 }}>{icons[n.type]||'🔔'}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, color:'#333', margin:0 }}>{n.text}</p>
                    <p style={{ fontSize:11, color:'#aaa', marginTop:4 }}>{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.read && <div style={{ width:8, height:8, background:'#4CAF50', borderRadius:'50%', flexShrink:0, marginTop:4 }}/>}
                </motion.div>
              ))}
            </div>
      }
    </div>
  );
}

export default UserDashboard;
