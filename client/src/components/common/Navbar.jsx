import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useCart, useLang } from '../../context';

const LANGS = [
  { code: 'ar', label: 'العربية', flag: '🇲🇦' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English',  flag: '🇬🇧' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { lang, t, changeLang } = useLang();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const isRTL = lang === 'ar';

  return (
    <nav dir={isRTL ? 'rtl' : 'ltr'}
      className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">FT</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-green-700 text-lg leading-none">FarmTrust</span>
            <span className="block text-xs text-amber-500 font-medium leading-none">by RSHD</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/animals" className="text-gray-600 hover:text-green-600 font-medium transition text-sm">
            {t.nav.animals}
          </Link>
          {user && (
            <Link to="/dashboard" className="text-gray-600 hover:text-green-600 font-medium transition text-sm">
              {t.nav.dashboard}
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-gray-600 hover:text-green-600 font-medium transition text-sm">
              {t.nav.admin}
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Language switcher */}
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-green-400 text-sm font-medium text-gray-600 transition bg-white">
              <span>{LANGS.find(l => l.code === lang)?.flag}</span>
              <span className="hidden sm:block">{LANGS.find(l => l.code === lang)?.label}</span>
              <span className="text-xs text-gray-400">▾</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className={`absolute top-10 ${isRTL ? 'left-0' : 'right-0'} bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50 min-w-[130px]`}>
                  {LANGS.map(l => (
                    <button key={l.code} onClick={() => { changeLang(l.code); setLangOpen(false); }}
                      className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-green-50 transition ${lang === l.code ? 'text-green-700 font-semibold bg-green-50' : 'text-gray-700'}`}>
                      <span>{l.flag}</span> {l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <>
              {/* Cart */}
              <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-xl transition">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.35 2.7A1 1 0 007 17h10M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-green-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </Link>
              {/* Notifs */}
              <Link to="/notifications" className="p-2 hover:bg-gray-100 rounded-xl transition">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
              </Link>
              {/* Avatar + logout */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm hidden sm:flex">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <button onClick={() => { logout(); navigate('/'); }}
                  className="p-2 hover:bg-red-50 rounded-xl transition text-red-400 hover:text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-green-700 border border-green-600 rounded-xl hover:bg-green-50 transition">
                {t.nav.login}
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition">
                {t.nav.register}
              </Link>
            </div>
          )}

          {/* Mobile menu btn */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-xl">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
            <Link to="/animals" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">{t.nav.animals}</Link>
            {user && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">{t.nav.dashboard}</Link>}
            {user?.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">{t.nav.admin}</Link>}
            {!user && (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 text-sm font-medium text-green-700 border border-green-600 rounded-xl">{t.nav.login}</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 text-sm font-medium text-white bg-green-600 rounded-xl">{t.nav.register}</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
