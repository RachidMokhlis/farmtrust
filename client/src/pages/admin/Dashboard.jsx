import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  getAnimals,
  getOrders,
  getProducts,
  updateOrderStatus
} from '../../services/api';
import toast from 'react-hot-toast';

// ───────────────────────── NAV ─────────────────────────
const NAV = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/animals', label: 'Animals', icon: '🐄' },
  { path: '/admin/products', label: 'Products', icon: '🧴' },
  { path: '/admin/orders', label: 'Orders', icon: '📦' },
  { path: '/admin/promotions', label: 'Promotions', icon: '🎁' },
  { path: '/admin/messages', label: 'Messages', icon: '💬' },
];

// ───────────────────────── LAYOUT ─────────────────────────
export function AdminLayout({ children, title }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="w-56 bg-white border-r hidden lg:flex flex-col py-6">
        <div className="px-5 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
              FT
            </div>
            <div>
              <p className="font-bold text-green-700 text-sm">FarmTrust</p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {NAV.map(n => (
          <Link
            key={n.path}
            to={n.path}
            className={`flex items-center gap-3 px-5 py-3 text-sm font-medium ${
              location.pathname === n.path
                ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
          {children}
        </div>
      </main>
    </div>
  );
}

// ───────────────────────── DASHBOARD ─────────────────────────
export function AdminDashboard() {
  const [stats, setStats] = useState({
    animals: 0,
    orders: 0,
    products: 0,
    revenue: 0
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [a, o, p] = await Promise.all([
          getAnimals().catch(() => ({ data: [] })),
          getOrders().catch(() => ({ data: [] })),
          getProducts().catch(() => ({ data: [] })),
        ]);

        const ordersData = o?.data || [];

        const revenue = ordersData
          .filter(x => x?.status !== 'cancelled')
          .reduce((s, x) => s + (Number(x?.total_price) || 0), 0);

        setStats({
          animals: a?.data?.length || 0,
          orders: ordersData.length,
          products: p?.data?.length || 0,
          revenue
        });

        setOrders(ordersData.slice(0, 6));
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return (
    <AdminLayout title="Dashboard">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Animals', value: stats.animals, icon: '🐄' },
          { label: 'Products', value: stats.products, icon: '🧴' },
          { label: 'Orders', value: stats.orders, icon: '📦' },
          { label: 'Revenue', value: `${stats.revenue} MAD`, icon: '💰' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-xl shadow text-center"
          >
            <div className="text-3xl">{s.icon}</div>
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-sm text-gray-400">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Recent Orders</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400">
              <th>ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o._id} className="border-t">
                <td>#{o._id?.slice(-6)}</td>
                <td className="text-green-600 font-semibold">
                  {Number(o?.total_price) || 0} MAD
                </td>
                <td>{o?.status}</td>
                <td>
                  {o?.createdAt
                    ? new Date(o.createdAt).toLocaleDateString()
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </AdminLayout>
  );
}

// ───────────────────────── ORDERS ─────────────────────────
export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await getOrders();
        setOrders(r?.data || []);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(prev =>
        prev.map(o => o._id === id ? { ...o, status } : o)
      );
      toast.success('Updated');
    } catch {
      toast.error('Failed');
    }
  };

  const STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled'];

  return (
    <AdminLayout title="Orders">

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="space-y-3">

          {orders.map(o => (
            <div key={o._id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">

              <div>
                <p className="font-bold">#{o._id?.slice(-6)}</p>
                <p className="text-sm text-gray-400">
                  {Number(o?.total_price) || 0} MAD
                </p>
              </div>

              <select
                value={o.status}
                onChange={e => changeStatus(o._id, e.target.value)}
                className="border p-1 rounded"
              >
                {STATUSES.map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>

            </div>
          ))}

        </div>
      )}

    </AdminLayout>
  );
}

export default AdminDashboard;
