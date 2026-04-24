import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAnimals, getOrders, getProducts, getAllMessages, updateOrderStatus } from '../../services/api';
import toast from 'react-hot-toast';

const NAV = [
  { path: '/admin',            label: 'Dashboard',  icon: '📊' },
  { path: '/admin/animals',    label: 'Animals',    icon: '🐄' },
  { path: '/admin/products',   label: 'Products',   icon: '🧴' },
  { path: '/admin/orders',     label: 'Orders',     icon: '📦' },
  { path: '/admin/promotions', label: 'Promotions', icon: '🎁' },
  { path: '/admin/messages',   label: 'Messages',   icon: '💬' },
];

export function AdminLayout({ children, title }) {
  const location = useLocation();
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 hidden lg:flex flex-col py-6">
        <div className="px-5 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FT</span>
            </div>
            <div>
              <p className="font-bold text-green-700 text-sm">FarmTrust</p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>
        {NAV.map(n => (
          <Link key={n.path} to={n.path}
            className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition ${
              location.pathname === n.path ? 'bg-green-50 text-green-700 border-r-2 border-green-600' : 'text-gray-600 hover:bg-gray-50'
            }`}>
            <span>{n.icon}</span>{n.label}
          </Link>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {title && <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>}
          {children}
        </div>
      </main>
    </div>
  );
}

// ─── Admin Dashboard Home ────────────────────────────────
export function AdminDashboard() {
  const [stats, setStats] = useState({ animals: 0, orders: 0, products: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Promise.all([getAnimals(), getOrders(), getProducts()]).then(([a, o, p]) => {
      const revenue = o.data.filter(ord => ord.status !== 'cancelled').reduce((s, ord) => s + ord.total_price, 0);
      setStats({ animals: a.data.length, orders: o.data.length, products: p.data.length, revenue });
      setOrders(o.data.slice(0, 6));
    });
  }, []);

  const statCards = [
    { label: 'Animals', value: stats.animals, icon: '🐄', color: 'text-green-600' },
    { label: 'Products', value: stats.products, icon: '🧴', color: 'text-blue-600' },
    { label: 'Orders', value: stats.orders, icon: '📦', color: 'text-amber-600' },
    { label: 'Revenue', value: `${stats.revenue.toFixed(0)} MAD`, icon: '💰', color: 'text-purple-600' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card text-center">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-400">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="pb-3">Order ID</th><th className="pb-3">Total</th><th className="pb-3">Status</th><th className="pb-3">Date</th>
            </tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="py-3 font-semibold text-green-600">{o.total_price} MAD</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      o.status === 'delivered' ? 'badge-green' : o.status === 'confirmed' ? 'badge-amber' : o.status === 'cancelled' ? 'badge-red' : 'badge-gray'
                    }`}>{o.status}</span>
                  </td>
                  <td className="py-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/admin/orders" className="text-sm text-green-600 hover:underline mt-3 block">View all orders →</Link>
      </div>
    </AdminLayout>
  );
}

// ─── Admin Orders ────────────────────────────────────────
export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  const STATUSES = ['pending','confirmed','delivered','cancelled'];

  return (
    <AdminLayout title="Orders Management">
      {loading
        ? <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"/></div>
        : <div className="space-y-4">
            {orders.map((o, i) => (
              <motion.div key={o._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-800">#{o._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-gray-400">{o.user_id?.name || 'User'} • {new Date(o.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm font-bold text-green-600 mt-1">{o.total_price} MAD</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={o.status} onChange={e => changeStatus(o._id, e.target.value)}
                      className="input w-auto text-sm py-1.5">
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
      }
    </AdminLayout>
  );
}

export default AdminDashboard;
