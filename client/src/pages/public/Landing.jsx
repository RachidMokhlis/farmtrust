import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const animals = [
  { emoji: '🐄', label: 'Cows',     desc: 'Fresh milk & dairy' },
  { emoji: '🐑', label: 'Sheep',    desc: 'Quality meat & wool' },
  { emoji: '🐓', label: 'Chickens', desc: 'Farm fresh eggs' },
  { emoji: '🐇', label: 'Rabbits',  desc: 'Premium rabbit' },
];

const features = [
  { icon: '🛒', title: 'Buy Products',      desc: 'Milk, eggs, meat — direct from the farm' },
  { icon: '🐄', title: 'Buy Full Animals',  desc: 'Purchase entire animals with full details' },
  { icon: '🎁', title: 'Promotions',        desc: 'Exclusive discounts and offers' },
  { icon: '💬', title: 'Direct Chat',       desc: 'Talk to the farm directly' },
  { icon: '⭐', title: 'Ratings',           desc: 'Trusted reviews from real buyers' },
  { icon: '📦', title: 'Track Orders',      desc: 'Follow your order from farm to door' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-amber-50 py-20 px-4 overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-green-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-amber-100 rounded-full opacity-40 blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              🌿 Smart Farm Platform
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to <span className="text-green-600">FarmTrust</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
              Buy fresh farm products and animals directly — transparent, trusted, and delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/animals" className="btn-primary text-base px-8 py-3">Explore Animals →</Link>
              <Link to="/register" className="btn-secondary text-base px-8 py-3">Get Started</Link>
            </div>
          </motion.div>

          {/* Animated animal cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
            {animals.map((a, i) => (
              <motion.div key={a.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="card text-center cursor-default">
                <div className="text-4xl mb-2">{a.emoji}</div>
                <div className="font-semibold text-gray-800">{a.label}</div>
                <div className="text-xs text-gray-400 mt-1">{a.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="bg-green-600 py-5 px-4 text-center text-white">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-lg font-medium">
          🔥 Promotions available — <Link to="/animals" className="underline">Check them now</Link>
        </motion.p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Everything you need</h2>
        <p className="text-center text-gray-400 mb-12">A complete farm-to-table experience</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} viewport={{ once: true }}
              className="card hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to connect with the farm?</h2>
        <p className="text-gray-400 mb-8">Join FarmTrust by RSHD and get access to the freshest products.</p>
        <Link to="/register" className="bg-green-500 hover:bg-green-400 text-white px-10 py-3 rounded-xl font-semibold transition">
          Create free account →
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-sm text-center py-6">
        <p>© 2024 FarmTrust by RSHD — All rights reserved</p>
      </footer>
    </div>
  );
}
