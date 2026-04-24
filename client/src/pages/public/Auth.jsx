import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth, useLang } from '../../context';

function AuthForm({ mode }) {
  const { login, register } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data =
        mode === 'login'
          ? await login({
              email: form.email,
              password: form.password
            })
          : await register(form);

      if (mode === 'register') {
        setWelcomeName(data.user?.name || form.name);
        setShowWelcome(true);

        setTimeout(() => {
          navigate(
            data.user?.role === 'admin' ? '/admin' : '/dashboard'
          );
        }, 3000);
      } else {
        toast.success(
          lang === 'ar'
            ? 'مرحباً بعودتك!'
            : lang === 'fr'
            ? 'Bon retour !'
            : 'Welcome back!'
        );

        navigate(
          data.user?.role === 'admin' ? '/admin' : '/dashboard'
        );
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          (lang === 'ar'
            ? 'حدث خطأ'
            : lang === 'fr'
            ? 'Erreur'
            : 'Something went wrong')
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= WELCOME SCREEN ================= */
  if (showWelcome) {
    return (
      <div className="welcome-screen">
        <div className="welcome-box">
          <h1>🎉 {t.welcome_user}</h1>
          <p>
            {lang === 'ar'
              ? `أهلاً ${welcomeName}!`
              : lang === 'fr'
              ? `Bonjour ${welcomeName}!`
              : `Hello ${welcomeName}!`}
          </p>
          <span>Redirecting...</span>
        </div>
      </div>
    );
  }

  /* ================= FORM ================= */
  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-card">

        <h1>
          {mode === 'login'
            ? t.login
            : t.register}
        </h1>

        {/* NAME */}
        {mode === 'register' && (
          <input
            name="name"
            placeholder={lang === 'ar' ? 'الاسم' : 'Name'}
            value={form.name}
            onChange={handleChange}
            required
          />
        )}

        {/* EMAIL */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* PASSWORD */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          minLength={6}
          value={form.password}
          onChange={handleChange}
          required
        />

        {/* BUTTON */}
        <button disabled={loading}>
          {loading ? 'Loading...' : mode}
        </button>

        {/* SWITCH */}
        <p>
          {mode === 'login' ? (
            <>
              {t.no_account}{' '}
              <Link to="/register">{t.register}</Link>
            </>
          ) : (
            <>
              {t.have_account}{' '}
              <Link to="/login">{t.login}</Link>
            </>
          )}
        </p>

      </form>

      {/* CSS */}
      <style>{`
        .auth-container{
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#f5f5f5;
        }

        .auth-card{
          width:400px;
          background:white;
          padding:30px;
          border-radius:16px;
          box-shadow:0 4px 20px rgba(0,0,0,0.1);
          display:flex;
          flex-direction:column;
          gap:12px;
        }

        input{
          padding:12px;
          border:1px solid #ddd;
          border-radius:10px;
          outline:none;
        }

        button{
          padding:12px;
          background:#16a34a;
          color:white;
          border:none;
          border-radius:10px;
          cursor:pointer;
        }

        button:disabled{
          opacity:0.6;
        }

        .welcome-screen{
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:linear-gradient(135deg,#16a34a,#86efac);
        }

        .welcome-box{
          background:white;
          padding:40px;
          border-radius:20px;
          text-align:center;
        }
      `}</style>

    </div>
  );
}

export const Login = () => <AuthForm mode="login" />;
export const Register = () => <AuthForm mode="register" />;

export default Login;
