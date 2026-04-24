import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import {
  getProducts,
  createProduct,
  deleteProduct,
  getAnimals,

  getPromotions,
  createPromotion,
  deletePromotion,

  getAllMessages
} from '../../services/api';

import { AdminLayout } from './Dashboard';


// ─────────────────────────────
// 🧴 PRODUCTS
// ─────────────────────────────
export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    animal_id: '',
    name: '',
    price: '',
    unit: 'liter',
    stock: ''
  });

  const load = async () => {
    try {
      const [p, a] = await Promise.all([getProducts(), getAnimals()]);
      setProducts(p?.data || []);
      setAnimals(a?.data || []);
    } catch (err) {
      console.log(err);
      toast.error('Error loading products');
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await createProduct(form);
      toast.success('Product added');
      setShowForm(false);
      load();
    } catch {
      toast.error('Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Products">

      <div className="flex justify-end mb-6">
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add Product
        </button>
      </div>

      {/* FORM */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 rounded-xl w-[400px]">

              <form onSubmit={submit} className="space-y-3">

                <select
                  className="input"
                  value={form.animal_id}
                  onChange={e => setForm({ ...form, animal_id: e.target.value })}
                >
                  <option value="">Select animal</option>
                  {animals.map(a => (
                    <option key={a._id} value={a._id}>
                      {a.name}
                    </option>
                  ))}
                </select>

                <input
                  className="input"
                  placeholder="Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />

                <input
                  className="input"
                  placeholder="Price"
                  type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                />

                <input
                  className="input"
                  placeholder="Stock"
                  type="number"
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                />

                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button disabled={saving} className="btn-primary flex-1">
                    {saving ? '...' : 'Save'}
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIST */}
      <div className="grid grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p._id} className="card">
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-sm text-gray-500">{p.price} MAD</p>

            <button
              onClick={async () => {
                await deleteProduct(p._id);
                toast.success('Deleted');
                load();
              }}
              className="btn-danger mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </AdminLayout>
  );
}


// ─────────────────────────────
// 🎁 PROMOTIONS
// ─────────────────────────────
export function AdminPromotions() {
  const [promos, setPromos] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    product_id: '',
    discount_percentage: '',
    start_date: '',
    end_date: ''
  });

  const load = async () => {
    try {
      const [pr, p] = await Promise.all([getPromotions(), getProducts()]);
      setPromos(pr?.data || []);
      setProducts(p?.data || []);
    } catch {
      toast.error('Error loading promotions');
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await createPromotion(form);
      toast.success('Created');
      setShowForm(false);
      load();
    } catch {
      toast.error('Failed');
    }
  };

  return (
    <AdminLayout title="Promotions">

      <button onClick={() => setShowForm(true)} className="btn-primary mb-4">
        + Add Promotion
      </button>

      {promos.map(p => (
        <div key={p._id} className="card mb-2 flex justify-between">
          <div>
            <b>{p.product_id?.name}</b>
            <p>-{p.discount_percentage}%</p>
          </div>

          <button
            onClick={async () => {
              await deletePromotion(p._id);
              load();
            }}
            className="btn-danger"
          >
            Remove
          </button>
        </div>
      ))}

    </AdminLayout>
  );
}


// ─────────────────────────────
// 💬 MESSAGES
// ─────────────────────────────
export function AdminMessages() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllMessages();

        const map = {};

        (res?.data || []).forEach(m => {
          const uid = m.user_id?._id || m.user_id;

          if (!map[uid]) {
            map[uid] = {
              user: m.user_id,
              messages: []
            };
          }

          map[uid].messages.push(m);
        });

        setConversations(Object.values(map));
      } catch {
        toast.error('Error loading messages');
      }
    };

    load();
  }, []);

  return (
    <AdminLayout title="Messages">

      <div className="space-y-3">
        {conversations.map(c => (
          <div key={c.user?._id} className="card">
            <b>{c.user?.name}</b>
            <p className="text-sm text-gray-500">
              {c.messages?.slice(-1)[0]?.text || 'No messages'}
            </p>
          </div>
        ))}
      </div>

    </AdminLayout>
  );
}

export default AdminProducts;
