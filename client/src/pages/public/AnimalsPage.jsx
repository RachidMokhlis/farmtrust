import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getAnimals } from '../../services/api';
import { useCart } from '../../context';

const TYPES = ['all', 'cow', 'sheep', 'chicken', 'rabbit', 'other'];

const EMOJI = {
  cow: '🐄',
  sheep: '🐑',
  chicken: '🐓',
  rabbit: '🐇',
  other: '🐾'
};

export default function AnimalsPage() {
  const [animals, setAnimals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeType, setActiveType] = useState('all');
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const API_BASE =
    (process.env.REACT_APP_API_URL || '').replace('/api', '');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAnimals();
        const data = res?.data || [];

        setAnimals(data);
        setFiltered(data);
      } catch (err) {
        toast.error('Failed to load animals');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (activeType === 'all') {
      setFiltered(animals);
    } else {
      setFiltered(
        animals.filter(a => a.type === activeType)
      );
    }
  }, [activeType, animals]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-2">
        Our Animals
      </h1>

      <p className="text-gray-400 mb-8">
        Browse available animals
      </p>

      {/* FILTER */}
      <div className="flex gap-2 flex-wrap mb-8">
        {TYPES.map(t => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`px-4 py-2 rounded-xl text-sm ${
              activeType === t
                ? 'bg-green-600 text-white'
                : 'bg-white border text-gray-600'
            }`}
          >
            {t !== 'all' && EMOJI[t]} {t}
          </button>
        ))}
      </div>

      {/* EMPTY */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          🌾 No animals found
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {filtered.map(animal => (
            <motion.div
              key={animal._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >

              {/* IMAGE */}
              <div className="h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden flex items-center justify-center">

                {animal.images?.length > 0 ? (
                  <img
                    src={`${API_BASE}${animal.images[0]}`}
                    alt={animal.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">
                    {EMOJI[animal.type] || '🐾'}
                  </span>
                )}

                {/* STATUS */}
                <span
                  className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${
                    animal.status === 'available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {animal.status}
                </span>

              </div>

              <h3 className="font-semibold text-lg">
                {animal.name}
              </h3>

              <p className="text-sm text-gray-400 capitalize">
                {EMOJI[animal.type]} {animal.type}
              </p>

              {/* SALE INFO */}
              {animal.for_sale && (
                <div className="bg-amber-50 p-3 rounded-xl mt-3">
                  <p className="font-bold text-amber-700">
                    {animal.sale_price} MAD
                  </p>
                  <p className="text-xs text-amber-600">
                    {animal.sale_age} • {animal.sale_weight}kg
                  </p>
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex gap-2 mt-4">

                <Link
                  to={`/animals/${animal._id}`}
                  className="flex-1 btn-secondary text-center py-2 text-sm"
                >
                  Details
                </Link>

                {animal.for_sale && animal.status === 'available' && (
                  <button
                    onClick={() => {
                      addToCart({
                        _id: animal._id,
                        name: animal.name,
                        price: animal.sale_price,
                        type: 'animal'
                      });

                      toast.success('Added to cart');
                    }}
                    className="btn-primary px-3 text-sm"
                  >
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
