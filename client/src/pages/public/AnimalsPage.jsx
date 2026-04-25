import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAnimals } from '../../services/api';
import { useCart } from '../../context';
import toast from 'react-hot-toast';

const TYPES = ['all','cow','sheep','chicken','rabbit','other'];
const EMOJI = { cow:'🐄', sheep:'🐑', chicken:'🐓', rabbit:'🐇', other:'🐾' };

export default function AnimalsPage() {
  const [animals, setAnimals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeType, setActiveType] = useState('all');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    getAnimals()
      .then(r => {
  const data = Array.isArray(r?.data) ? r.data : [];
  setAnimals(data);
  setFiltered(data);
})
      .catch(() => toast.error('Failed to load animals'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFiltered(
  activeType === 'all'
    ? animals
    : (animals || []).filter(a => a.type === activeType)
);
  }, [activeType, animals]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Animals</h1>
      <p className="text-gray-400 mb-8">Browse available animals and their products</p>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {TYPES.map(t => (
          <button key={t} onClick={() => setActiveType(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeType === t ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400'
            }`}>
            {t !== 'all' && EMOJI[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {(filtered || []).length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🌾</div>
          <p>No animals found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((animal, i) => (
            <motion.div key={animal._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card hover:shadow-md transition-shadow group">
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-green-50 to-amber-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                {animal.images?.[0] ? (
                  <img src={`${process.env.REACT_APP_API_URL?.replace('/api','')}${animal.images[0]}`}
                    alt={animal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <span className="text-7xl">{EMOJI[animal.type] || '🐾'}</span>
                )}
                {/* Status badge */}
                <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium ${
                  animal.status === 'available' ? 'badge-green' : 'badge-red'
                }`}>
                  {animal.status}
                </span>
                {/* For sale badge */}
                {animal.for_sale && (
                  <span className="absolute top-3 left-3 badge-amber">🏷️ For sale</span>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 text-lg">{animal.name}</h3>
              <p className="text-sm text-gray-400 capitalize mb-1">{EMOJI[animal.type]} {animal.type}</p>
              {animal.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{animal.description}</p>
              )}

              {/* Animal sale info */}
              {animal.for_sale && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                  <p className="text-sm font-semibold text-amber-800">Full animal — {animal.sale_price} MAD</p>
                  <p className="text-xs text-amber-600">Age: {animal.sale_age} • Weight: {animal.sale_weight}kg</p>
                </div>
              )}

              <div className="flex gap-2 mt-auto">
                <Link to={`/animals/${animal._id}`}
                  className="flex-1 text-center btn-secondary py-2 text-sm">
                  View details
                </Link>
                {animal.for_sale && animal.status === 'available' && (
                  <button onClick={() => {
                    addToCart({ _id: animal._id, name: animal.name, price: animal.sale_price, type: 'animal', image: EMOJI[animal.type] });
                    toast.success(`${animal.name} added to cart!`);
                  }} className="btn-primary py-2 text-sm px-3">
                    🛒 Buy
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
