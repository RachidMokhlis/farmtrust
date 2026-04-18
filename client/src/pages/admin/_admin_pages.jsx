// ─── Products.jsx ────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getProducts, createProduct, updateProduct, deleteProduct, getAnimals, createPromotion, getPromotions, deletePromotion } from '../../services/api';
import { AdminLayout } from './Dashboard';

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [animals, setAnimals]   = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ animal_id:'', name:'', price:'', unit:'liter', stock:'' });
  const [saving, setSaving] = useState(false);

  const load = () => Promise.all([getProducts(), getAnimals()]).then(([p, a]) => { setProducts(p.data); setAnimals(a.data); });
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await createProduct(form);
      toast.success('Product added!');
      setShowForm(false); load();
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  return (
    <AdminLayout title="Products Management">
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Add Product</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Add Product</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Animal *</label>
                  <select className="input" value={form.animal_id} onChange={e => setForm({...form, animal_id: e.target.value})} required>
                    <option value="">Select animal</option>
                    {animals.map(a => <option key={a._id} value={a._id}>{a.name} ({a.type})</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input className="input" placeholder="Milk, Eggs..." value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                    <select className="input" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                      <option value="liter">Liter</option>
                      <option value="kg">Kg</option>
                      <option value="unit">Unit</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (MAD) *</label>
                    <input type="number" className="input" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input type="number" className="input" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Add'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((p, i) => (
          <motion.div key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">{p.name}</h3>
                <p className="text-xs text-gray-400">{p.animal_id?.name || '—'} • {p.unit}</p>
              </div>
              {p.discount && <span className="badge-amber">-{p.discount}%</span>}
            </div>
            <div className="flex items-center justify-between">
              <div>
                {p.discount
                  ? <><span className="line-through text-gray-400 text-sm">{p.price}</span> <span className="font-bold text-green-600">{p.final_price} MAD</span></>
                  : <span className="font-bold text-green-600">{p.price} MAD</span>}
              </div>
              <button onClick={async () => { await deleteProduct(p._id); toast.success('Deleted'); load(); }} className="btn-danger py-1 px-3 text-xs">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
}

// ─── Promotions.jsx ──────────────────────────────────────
export function AdminPromotions() {
  const [promos, setPromos]   = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ product_id:'', discount_percentage:'', start_date:'', end_date:'' });
  const [saving, setSaving] = useState(false);

  const load = () => Promise.all([getPromotions(), getProducts()]).then(([pr, p]) => { setPromos(pr.data); setProducts(p.data); });
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await createPromotion(form); toast.success('Promotion created!'); setShowForm(false); load(); }
    catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  return (
    <AdminLayout title="Promotions">
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Add Promotion</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-5">Add Promotion</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
                  <select className="input" value={form.product_id} onChange={e => setForm({...form, product_id: e.target.value})} required>
                    <option value="">Select product</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name} — {p.price} MAD</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount % *</label>
                  <input type="number" min="1" max="99" className="input" value={form.discount_percentage} onChange={e => setForm({...form, discount_percentage: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
                    <input type="date" className="input" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
                    <input type="date" className="input" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} required />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Create'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {promos.map((p, i) => (
          <motion.div key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="card flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">{p.product_id?.name || 'Product'}</p>
              <p className="text-sm text-amber-600 font-medium">-{p.discount_percentage}% off</p>
              <p className="text-xs text-gray-400">{new Date(p.start_date).toLocaleDateString()} → {new Date(p.end_date).toLocaleDateString()}</p>
            </div>
            <button onClick={async () => { await deletePromotion(p._id); toast.success('Removed'); load(); }} className="btn-danger py-1 px-3 text-xs">Remove</button>
          </motion.div>
        ))}
        {promos.length === 0 && <p className="text-gray-400 text-center py-10">No active promotions</p>}
      </div>
    </AdminLayout>
  );
}

// ─── Messages.jsx ────────────────────────────────────────
export function AdminMessages() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const { socket } = { socket: null }; // will come from useAuth in real usage

  useEffect(() => {
    getAllMessages().then(r => {
      // group by user
      const map = {};
      r.data.forEach(m => {
        const uid = m.user_id?._id || m.user_id;
        if (!map[uid]) map[uid] = { user: m.user_id, messages: [] };
        map[uid].messages.push(m);
      });
      setConversations(Object.values(map));
    });
  }, []);

  const openConvo = (convo) => {
    setSelected(convo);
    setMsgs(convo.messages);
  };

  return (
    <AdminLayout title="Messages">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations list */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-600 text-sm mb-3">Conversations</h3>
          {conversations.length === 0 && <p className="text-gray-400 text-sm">No messages yet</p>}
          {conversations.map(c => (
            <button key={c.user?._id} onClick={() => openConvo(c)}
              className={`w-full text-left card py-3 hover:border-green-300 transition ${selected?.user?._id === c.user?._id ? 'border-green-400 bg-green-50' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-sm font-bold">
                  {c.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{c.user?.name || 'User'}</p>
                  <p className="text-xs text-gray-400 truncate">{c.messages.slice(-1)[0]?.text}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="card h-80 flex items-center justify-center text-gray-400">
              <div className="text-center"><div className="text-4xl mb-2">💬</div><p>Select a conversation</p></div>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800">{selected.user?.name}</p>
                <p className="text-xs text-gray-400">{selected.user?.email}</p>
              </div>
              <div className="h-72 overflow-y-auto p-4 space-y-3">
                {msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${m.sender === 'admin' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <form className="p-3 border-t border-gray-100 flex gap-2" onSubmit={e => {
                e.preventDefault();
                if (!text.trim()) return;
                setMsgs(prev => [...prev, { text, sender: 'admin', createdAt: new Date() }]);
                setText('');
                // socket.emit('adminMessage', { userId: selected.user?._id, text });
              }}>
                <input className="input flex-1 text-sm py-2" placeholder="Reply..." value={text} onChange={e => setText(e.target.value)} />
                <button type="submit" className="btn-primary px-4 text-sm">Send</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProducts;
