import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, CartProvider, useAuth } from './context';

// Public pages
import Landing      from './pages/public/Landing';
import AnimalsPage  from './pages/public/AnimalsPage';
import AnimalDetail from './pages/public/AnimalDetail';
import Login        from './pages/public/Login';
import Register     from './pages/public/Register';

// User pages
import UserDashboard from './pages/user/Dashboard';
import UserOrders    from './pages/user/Orders';
import CartPage      from './pages/user/Cart';
import Checkout      from './pages/user/Checkout';
import ChatPage      from './pages/user/Chat';
import UserNotifs    from './pages/user/Notifications';

// Admin pages
import AdminDashboard  from './pages/admin/Dashboard';
import AdminAnimals    from './pages/admin/Animals';
import AdminProducts   from './pages/admin/Products';
import AdminOrders     from './pages/admin/Orders';
import AdminMessages   from './pages/admin/Messages';
import AdminPromotions from './pages/admin/Promotions';

import Navbar from './components/common/Navbar';

const PrivateRoute = ({ children, admin }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (admin && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/"              element={<Landing />} />
            <Route path="/animals"       element={<AnimalsPage />} />
            <Route path="/animals/:id"   element={<AnimalDetail />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />

            {/* User */}
            <Route path="/dashboard"     element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
            <Route path="/orders"        element={<PrivateRoute><UserOrders /></PrivateRoute>} />
            <Route path="/cart"          element={<PrivateRoute><CartPage /></PrivateRoute>} />
            <Route path="/checkout"      element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/chat"          element={<PrivateRoute><ChatPage /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><UserNotifs /></PrivateRoute>} />

            {/* Admin */}
            <Route path="/admin"            element={<PrivateRoute admin><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/animals"    element={<PrivateRoute admin><AdminAnimals /></PrivateRoute>} />
            <Route path="/admin/products"   element={<PrivateRoute admin><AdminProducts /></PrivateRoute>} />
            <Route path="/admin/orders"     element={<PrivateRoute admin><AdminOrders /></PrivateRoute>} />
            <Route path="/admin/messages"   element={<PrivateRoute admin><AdminMessages /></PrivateRoute>} />
            <Route path="/admin/promotions" element={<PrivateRoute admin><AdminPromotions /></PrivateRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
