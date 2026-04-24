import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context';
import {
  getOrders,
  getNotifications
} from '../../services/api';

/* ─────────────────────────────
   DASHBOARD
───────────────────────────── */
export function UserDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [o, n] = await Promise.all([
          getOrders(),
          getNotifications()
        ]);

        setOrders(o.data || []);
        setNotifs(n.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, []);

  const pending = orders.filter(o => o.status === 'pending').length;
  const unread = notifs.filter(n => !n.read).length;

  const stats = [
    { label: 'Orders', value: orders.length, icon: '📦', link: '/orders' },
    { label: 'Pending', value: pending, icon: '⏳', link: '/orders' },
    { label: 'Notifications', value: unread, icon: '🔔', link: '/notifications' },
    { label: 'Chat', value: '→', icon: '💬', link: '/chat' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">
        Welcome back, {user?.name} 👋
      </h1>

      <p className="text-gray-400 mb-8">
        Overview of your activity
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Link key={i} to={s.link}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="card text-center"
            >
              <div className="text-3xl">{s.icon}</div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────
   ORDERS
───────────────────────────── */
export function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(res => setOrders(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const statusStyle = {
    pending: 'text-gray-500',
    confirmed: 'text-yellow-500',
    delivered: 'text-green-600',
    cancelled: 'text-red-500'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">No orders yet</p>
      ) : (
        orders.map((o) => (
          <motion.div key={o._id} className="card mb-3">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">
                  Order #{o._id.slice(-6)}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(o.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-green-600">
                  {o.total_price} MAD
                </p>
                <span className={`text-xs ${statusStyle[o.status]}`}>
                  {o.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

/* ─────────────────────────────
   NOTIFICATIONS
───────────────────────────── */
export function UserNotifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then(res => setNotifs(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold mb-6">Notifications</h1>

      {notifs.length === 0 ? (
        <p className="text-gray-400">No notifications</p>
      ) : (
        notifs.map((n) => (
          <div key={n._id} className="card mb-2">
            <p className="text-sm">{n.text}</p>
            <p className="text-xs text-gray-400">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default UserDashboard;
