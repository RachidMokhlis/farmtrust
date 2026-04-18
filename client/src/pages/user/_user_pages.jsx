// ─── Dashboard.jsx ───────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context';
import { getOrders, getNotifications } from '../../services/api';

export function UserDashboard() {
  const { user } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [notifs, setNotifs]   = useState([]);

  useEffect(() => {
    getOrders().then(r => setOrders(r.data)).catch(() => {});
    getNotifications().then(r => setNotifs(r.data)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Orders',           value: orders.length,                                   icon: '📦', link: '/orders' },
    { label: 'Pending',          value: orders.filter(o => o.status === 'pending').length, icon: '⏳', link: '/orders' },
    { label: 'Notifications',    value: notifs.filter(n => !n.read).length,               icon: '🔔', link: '/notifications' },
    { label: 'Messages',         value: '—',                                              icon: '💬', link: '/chat' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {user?.name} 👋</h1>
        <p className="text-gray-400 mb-8">Here's what's happening on your account</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <Link key={s.label} to={s.link}>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="card hover:shadow-md transition text-center cursor-pointer">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4">Recent Orders</h2>
            {orders.slice(0,4).length === 0
              ? <p className="text-gray-400 text-sm">No orders yet</p>
              : orders.slice(0,4).map(o => (
                <div key={o._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">#{o._id.slice(-6)}</span>
                  <span className="text-sm font-medium text-green-600">{o.total_price} MAD</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    o.status === 'delivered' ? 'badge-green' :
                    o.status === 'confirmed' ? 'badge-amber' : 'badge-gray'
                  }`}>{o.status}</span>
                </div>
              ))
            }
            <Link to="/orders" className="text-sm text-green-600 hover:underline mt-3 block">View all →</Link>
          </div>

          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/animals" className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 transition">
                <span className="text-xl">🐄</span>
                <span className="text-sm font-medium text-gray-700">Browse Animals & Products</span>
              </Link>
              <Link to="/cart" className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 transition">
                <span className="text-xl">🛒</span>
                <span className="text-sm font-medium text-gray-700">View Cart</span>
              </Link>
              <Link to="/chat" className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 transition">
                <span className="text-xl">💬</span>
                <span className="text-sm font-medium text-gray-700">Chat with Farm</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Orders.jsx ──────────────────────────────────────────
export function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  const statusStyle = { pending:'badge-gray', confirmed:'badge-amber', delivered:'badge-green', cancelled:'badge-red' };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"/></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
      {orders.length === 0
        ? <div className="text-center py-20 text-gray-400"><div className="text-5xl mb-3">📦</div><p>No orders yet</p><Link to="/animals" className="text-green-600 hover:underline mt-2 block">Start shopping</Link></div>
        : <div className="space-y-4">
            {orders.map((o, i) => (
              <motion.div key={o._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">Order #{o._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{o.total_price} MAD</p>
                    <span className={`text-xs ${statusStyle[o.status] || 'badge-gray'}`}>{o.status}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{o.items?.length} item(s)</p>
                {o.note && <p className="text-xs text-gray-400 italic mt-1">Note: {o.note}</p>}
              </motion.div>
            ))}
          </div>
      }
    </div>
  );
}

// ─── Notifications.jsx ───────────────────────────────────
export function UserNotifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications().then(r => setNotifs(r.data)).finally(() => setLoading(false));
  }, []);

  const icons = { promotion:'🎁', order:'📦', message:'💬' };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"/></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Notifications</h1>
      {notifs.length === 0
        ? <div className="text-center py-20 text-gray-400"><div className="text-5xl mb-3">🔔</div><p>No notifications</p></div>
        : <div className="space-y-3">
            {notifs.map((n, i) => (
              <motion.div key={n._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`card flex gap-3 items-start ${!n.read ? 'border-l-4 border-l-green-400' : ''}`}>
                <span className="text-2xl">{icons[n.type] || '🔔'}</span>
                <div className="flex-1">
                  <p className="text-gray-700 text-sm">{n.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && <div className="w-2 h-2 bg-green-500 rounded-full mt-1 flex-shrink-0" />}
              </motion.div>
            ))}
          </div>
      }
    </div>
  );
}

export default UserDashboard;
