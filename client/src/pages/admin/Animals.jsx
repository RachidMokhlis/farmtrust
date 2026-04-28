import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getAnimals, createAnimal, updateAnimal, deleteAnimal } from '../../services/api';
import { AdminLayout } from './Dashboard';

const EMPTY = { name:'', type:'cow', birth_date:'', description:'', for_sale:false, sale_price:'', sale_age:'', sale_weight:'' };
const TYPES = ['cow','sheep','chicken','rabbit','other'];
const EMOJI = { cow:'🐄', sheep:'🐑', chicken:'🐓', rabbit:'🐇', other:'🐾' };

export default function AdminAnimals() {
  const [animals, setAnimals]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [images, setImages]     = useState([]);
  const [saving, setSaving]     = useState(false);

  const load = () => getAnimals().then(d => Array.isArray(d) && setAnimals(d)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setImages([]); setShowForm(true); };
  const openEdit = (a) => { setEditing(a._id); setForm({ ...a, birth_date: a.birth_date?.slice(0,10) || '' }); setImages([]); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v !== undefined && v !== '' && fd.append(k, v));
      images.forEach(img => fd.append('images', img));

      if (editing) {
        await updateAnimal(editing, fd);
        toast.success('Animal updated!');
      } else {
        await createAnimal(fd);
        toast.success('Animal added!');
      }
      setShowForm(false);
      load();
    } catch { toast.error('Something went wrong'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this animal?')) return;
    await deleteAnimal(id);
    toast.success('Deleted');
    load();
  };

  return (
    <AdminLayout title="Animals Management">
      <div className="flex justify-end mb-6">
        <button onClick={openAdd} className="btn-primary">+ Add Animal</button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-5">{editing ? 'Edit Animal' : 'Add New Animal'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                      {TYPES.map(t => <option key={t} value={t}>{EMOJI[t]} {t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth date</label>
                  <input type="date" className="input" value={form.birth_date} onChange={e => setForm({...form, birth_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea className="input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                  <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files))}
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                </div>
                {/* For sale toggle */}
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
                  <input type="checkbox" id="for_sale" checked={!!form.for_sale} onChange={e => setForm({...form, for_sale: e.target.checked})} className="w-4 h-4 accent-green-600" />
                  <label htmlFor="for_sale" className="font-medium text-amber-800 text-sm">Enable animal sale (full purchase)</label>
                </div>
                {form.for_sale && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Price (MAD)</label>
                      <input type="number" className="input" value={form.sale_price} onChange={e => setForm({...form, sale_price: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Age</label>
                      <input className="input" placeholder="2 years" value={form.sale_age} onChange={e => setForm({...form, sale_age: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Weight (kg)</label>
                      <input type="number" className="input" value={form.sale_weight} onChange={e => setForm({...form, sale_weight: e.target.value})} />
                    </div>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animals grid */}
      {loading
        ? <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"/></div>
        : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {animals.map((a, i) => (
              <motion.div key={a._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
                <div className="h-32 bg-green-50 rounded-xl flex items-center justify-center mb-3 text-5xl">
                  {a.images?.[0]
                    ? <img src={`${process.env.REACT_APP_API_URL?.replace('/api','')}${a.images[0]}`} alt={a.name} className="w-full h-full object-cover rounded-xl" />
                    : EMOJI[a.type]}
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800">{a.name}</h3>
                  <span className={`text-xs ${a.status === 'available' ? 'badge-green' : 'badge-red'}`}>{a.status}</span>
                </div>
                <p className="text-xs text-gray-400 capitalize mb-3">{EMOJI[a.type]} {a.type} {a.for_sale && '• 🏷️ For sale'}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(a)} className="btn-secondary flex-1 py-1.5 text-sm">Edit</button>
                  <button onClick={() => handleDelete(a._id)} className="btn-danger flex-1 py-1.5 text-sm">Delete</button>
                </div>
              </motion.div>
            ))}
          </div>
      }
    </AdminLayout>
  );
}
