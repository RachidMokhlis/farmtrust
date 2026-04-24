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

  // 🔥 FIXED LOAD (safe + no crash)
  const load = async () => {
    try {
      const r = await getAnimals();
      setAnimals(r?.data || []);
    } catch (err) {
      console.error("getAnimals error:", err);
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd  = () => {
    setEditing(null);
    setForm(EMPTY);
    setImages([]);
    setShowForm(true);
  };

  const openEdit = (a) => {
    setEditing(a._id);
    setForm({ ...a, birth_date: a.birth_date?.slice(0,10) || '' });
    setImages([]);
    setShowForm(true);
  };

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
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this animal?')) return;
    try {
      await deleteAnimal(id);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <AdminLayout title="Animals Management">

      <div className="flex justify-end mb-6">
        <button onClick={openAdd} className="btn-primary">+ Add Animal</button>
      </div>

      {/* FORM */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">

              <h2 className="text-xl font-bold mb-5">
                {editing ? 'Edit Animal' : 'Add New Animal'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">

                <input className="input" placeholder="Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />

                <select className="input"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  {TYPES.map(t => (
                    <option key={t} value={t}>
                      {EMOJI[t]} {t}
                    </option>
                  ))}
                </select>

                <input type="date" className="input"
                  value={form.birth_date}
                  onChange={e => setForm({ ...form, birth_date: e.target.value })}
                />

                <textarea className="input" placeholder="Description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />

                <input type="file" multiple accept="image/*"
                  onChange={e => setImages(Array.from(e.target.files))}
                />

                <label className="flex items-center gap-2">
                  <input type="checkbox"
                    checked={!!form.for_sale}
                    onChange={e => setForm({ ...form, for_sale: e.target.checked })}
                  />
                  For sale
                </label>

                {form.for_sale && (
                  <div className="grid grid-cols-3 gap-2">
                    <input className="input" placeholder="Price"
                      value={form.sale_price}
                      onChange={e => setForm({ ...form, sale_price: e.target.value })}
                    />
                    <input className="input" placeholder="Age"
                      value={form.sale_age}
                      onChange={e => setForm({ ...form, sale_age: e.target.value })}
                    />
                    <input className="input" placeholder="Weight"
                      value={form.sale_weight}
                      onChange={e => setForm({ ...form, sale_weight: e.target.value })}
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {animals?.map((a, i) => (
            <motion.div key={a._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card">

              <div className="h-32 flex items-center justify-center text-5xl">
                {a.images?.[0]
                  ? <img src={a.images[0]} className="w-full h-full object-cover rounded-xl" />
                  : EMOJI[a.type]}
              </div>

              <h3 className="font-bold">{a.name}</h3>

              <div className="flex gap-2 mt-2">
                <button onClick={() => openEdit(a)} className="btn-secondary flex-1">Edit</button>
                <button onClick={() => handleDelete(a._id)} className="btn-danger flex-1">Delete</button>
              </div>

            </motion.div>
          ))}

        </div>
      )}

    </AdminLayout>
  );
}
