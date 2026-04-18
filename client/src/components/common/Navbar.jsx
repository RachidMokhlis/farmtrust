import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useCart } from '../../context';
import { FiShoppingCart, FiBell, FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FT</span>
            </div>
            <span className="font-bold text-green-700 text-lg">FarmTrust</span>
            <span className="text-xs text-gray-400 hidden sm:block">by RSHD</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/animals" className="text-gray-600 hover:text-green-600 transition font-medium">Animals</Link>
            {user && <Link to="/dashboard" className="text-gray-600 hover:text-green-600 transition font-medium">Dashboard</Link>}
            {user?.role === 'admin' && <Link to="/admin" className="text-gray-600 hover:text-green-600 transition font-medium">Admin</Link>}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiShoppingCart className="w-5 h-5 text-gray-600" />
                  {cart.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-green-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
                <Link to="/notifications" className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiBell className="w-5 h-5 text-gray-600" />
                </Link>
                <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg transition">
                  <FiLogOut className="w-5 h-5 text-red-400" />
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary py-2 px-4 text-sm">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Register</Link>
              </div>
            )}
            <button onClick={() => setOpen(!open)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              {open ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            <Link to="/animals" className="block text-gray-700 hover:text-green-600 font-medium py-2" onClick={() => setOpen(false)}>Animals</Link>
            {user && <Link to="/dashboard" className="block text-gray-700 hover:text-green-600 font-medium py-2" onClick={() => setOpen(false)}>Dashboard</Link>}
            {user?.role === 'admin' && <Link to="/admin" className="block text-gray-700 hover:text-green-600 font-medium py-2" onClick={() => setOpen(false)}>Admin</Link>}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
