import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useLang } from '../../context';

export default function WelcomePopup() {
  const { showWelcome, setShowWelcome, user } = useAuth();
  const { t } = useLang();

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome, setShowWelcome]);

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
          onClick={() => setShowWelcome(false)}>
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">

            {/* Confetti animation */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: 2 }}
              className="text-6xl mb-4">🎉</motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t.auth.welcomePopup}
            </h2>
            <p className="text-gray-500 mb-2">{t.auth.welcomeMsg}</p>
            {user?.name && (
              <p className="text-green-600 font-semibold text-lg">👋 {user.name}</p>
            )}

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
                <span>🐄</span> <span>FarmTrust by RSHD</span>
              </div>
            </div>

            <button onClick={() => setShowWelcome(false)}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition">
              ابدأ الاستكشاف 🌿
            </button>

            {/* Auto close bar */}
            <motion.div
              initial={{ width: '100%' }} animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="h-1 bg-green-400 rounded-full mt-4"/>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
