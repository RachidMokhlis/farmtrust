import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart, useAuth } from '../../context';
import { createOrder } from '../../services/api';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 review | 2 confirm | 3 done
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    setLoading(true);

    try {
      const items = cart.map((item) => ({
        product_id: item.type === 'product' ? item._id : undefined,
        animal_id: item.type === 'animal' ? item._id : undefined,
        quantity: item.quantity || 1,
        price: item.final_price || item.price,
        item_type: item.type,
      }));

      await createOrder({
        items,
        total_price: total,
        note: note.trim(),
      });

      clearCart();
      setStep(3);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Order failed, please try again'
      );
    } finally {
      setLoading(false);
    }
  };

  // Redirect if empty cart
  if (!cart.length && step !== 3) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Progress */}
      <div className="flex justify-center gap-4 mb-10">
        {['Review', 'Confirm', 'Done'].map((label, i) => {
          const active = step === i + 1;
          const done = step > i + 1;

          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  done
                    ? 'bg-green-500 text-white'
                    : active
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {done ? '✓' : i + 1}
              </div>

              <span className="text-sm hidden sm:block text-gray-500">
                {label}
              </span>

              {i < 2 && (
                <div className="w-8 h-0.5 bg-gray-200 hidden sm:block" />
              )}
            </div>
          );
        })}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xl font-bold mb-5">
            Review your order
          </h2>

          <div className="space-y-3 mb-6">
            {cart.map((item) => (
              <div key={item.key} className="card flex items-center gap-4">
                <div className="text-2xl">
                  {item.type === 'animal' ? '🐄' : '🧴'}
                </div>

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-400">
                    x{item.quantity} • {item.final_price || item.price} MAD
                  </p>
                </div>

                <p className="font-bold text-green-600">
                  {(
                    (item.final_price || item.price) * item.quantity
                  ).toFixed(2)}{' '}
                  MAD
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="card border border-green-100 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-green-600">
                {total.toFixed(2)} MAD
              </span>
            </div>
          </div>

          {/* Note */}
          <textarea
            className="input mb-6"
            rows={3}
            placeholder="Optional note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button
            onClick={() => setStep(2)}
            className="btn-primary w-full py-3"
          >
            Continue →
          </button>
        </motion.div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">📦</div>

          <h2 className="text-xl font-bold mb-2">
            Confirm your order?
          </h2>

          <p className="text-gray-500 mb-2">
            Total:{' '}
            <span className="text-green-600 font-bold">
              {total.toFixed(2)} MAD
            </span>
          </p>

          <p className="text-gray-400 mb-2">
            {cart.length} item(s) • {user?.name}
          </p>

          {note && (
            <p className="text-sm text-gray-400 italic mb-6">
              Note: "{note}"
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="btn-secondary flex-1"
            >
              Back
            </button>

            <button
              onClick={handleOrder}
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10"
        >
          <div className="text-7xl mb-6">🎉</div>

          <h2 className="text-2xl font-bold mb-2">
            Order placed!
          </h2>

          <p className="text-gray-400 mb-8">
            We will contact you soon for confirmation.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/orders')}
              className="btn-primary px-6"
            >
              View Orders
            </button>

            <button
              onClick={() => navigate('/animals')}
              className="btn-secondary px-6"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
