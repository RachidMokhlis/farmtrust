import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { commentsAPI, statsAPI, promosAPI } from '../services/api';
import AnimatedAnimals from '../animations/AnimatedAnimals';
import Countdown from '../components/Countdown';
import { VideoAdBanner } from '../components/VideoAd';

export default function Home() {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState({ animalsCount: 0, farmersCount: 0 });
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    commentsAPI.getAll().then(r => setComments(r.data)).catch(() => {});
    statsAPI.get().then(r => setStats(r.data)).catch(() => {});
    promosAPI.getAll().then(r => setPromos(r.data)).catch(() => {});
  }, []);

  return (
    <div style={{ background: '#0f1f0f', minHeight: '100vh', color: '#fff', paddingTop: '65px' }}>
      {/* Hero */}
      <section style={{
        position: 'relative', minHeight: '85vh',
        background: 'linear-gradient(135deg, #0f2a0f 0%, #1a4a1a 40%, #0f2a0f 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(144,238,144,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,192,64,0.05) 0%, transparent 70%)' }} />

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ fontSize: '5rem', marginBottom: '1rem' }}
          >🌿</motion.div>
          
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            color: '#f0c040', marginBottom: '0.5rem',
            textShadow: '0 4px 20px rgba(240,192,64,0.3)'
          }}>
            FarmTrust by Rashid
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ fontSize: '1.2rem', color: '#90ee90', marginBottom: '2rem' }}
          >
            {t('tagline')}
          </motion.p>

          <motion.div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(135deg, #f0c040, #e09800)',
                  color: '#1a1a1a', border: 'none', borderRadius: '30px',
                  padding: '14px 32px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(240,192,64,0.4)'
                }}
              >
                🚀 {t('register')}
              </motion.button>
            </Link>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{
                  background: 'transparent', color: '#90ee90',
                  border: '2px solid #90ee90', borderRadius: '30px',
                  padding: '14px 32px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                🛒 {t('products')}
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '3rem' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f0c040' }}>{stats.animalsCount}+</div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>{t('animalsCount')}</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#90ee90' }}>{stats.farmersCount}+</div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>{t('farmersCount')}</div>
            </div>
          </motion.div>
        </motion.div>

        <AnimatedAnimals />
      </section>

      {/* Video Ad Banner */}
      <div style={{ padding: '3rem 1rem 0 1rem' }}>
        <VideoAdBanner />
      </div>

      {/* Promos */}
      {promos.length > 0 && (
        <section style={{ padding: '3rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ color: '#f0c040', textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>🔥 العروض الخاصة</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {promos.map(p => (
              <motion.div
                key={p._id}
                whileHover={{ y: -5 }}
                style={{
                  background: 'linear-gradient(135deg, #1a3a1a, #2a2a0a)',
                  borderRadius: '16px', padding: '1.5rem',
                  border: '1px solid rgba(240,192,64,0.3)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f0c040', marginBottom: '0.5rem' }}>-{p.discount}%</div>
                <div style={{ color: '#fff', marginBottom: '1rem' }}>{p.productId?.name}</div>
                <Countdown endDate={p.endDate} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Comments */}
      {comments.length > 0 && (
        <section style={{ padding: '3rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ color: '#90ee90', textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>💬 آراء الزبناء</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {comments.map(c => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px', padding: '1.5rem',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <div style={{ color: '#f0c040', marginBottom: '0.5rem' }}>
                  {'⭐'.repeat(c.rating)}
                </div>
                <p style={{ color: '#ddd', lineHeight: 1.6 }}>{c.message}</p>
                <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '1rem' }}>— {c.userId?.name}</div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
