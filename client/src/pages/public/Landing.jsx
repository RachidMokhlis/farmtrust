import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnimals, getPromotions, getComments } from '../../services/api';
import { useLang } from '../../context';

const FARMER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 140'%3E%3Ccircle cx='60' cy='35' r='28' fill='%23FFCC80'/%3E%3Cellipse cx='60' cy='110' rx='38' ry='32' fill='%234CAF50'/%3E%3Crect x='30' y='58' width='60' height='45' rx='8' fill='%234CAF50'/%3E%3Ccircle cx='60' cy='35' r='20' fill='%23FFB74D'/%3E%3Crect x='20' y='18' width='80' height='22' rx='11' fill='%23795548'/%3E%3Crect x='15' y='14' width='90' height='10' rx='5' fill='%23A1887F'/%3E%3Ccircle cx='52' cy='32' r='3' fill='%23333'/%3E%3Ccircle cx='68' cy='32' r='3' fill='%23333'/%3E%3Cpath d='M52 44 Q60 50 68 44' stroke='%23333' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";

export default function Landing() {
  const navigate = useNavigate();
  const { t, lang } = useLang();

  const [animals, setAnimals] = useState({ cow: 0, sheep: 0, chicken: 0, rabbit: 0 });
  const [comments, setComments] = useState([]);
  const [promos, setPromos] = useState([]);
  const [promoIdx, setPromoIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  // ───── LOAD DATA ─────
  useEffect(() => {
    setVisible(true);

    // Animals
    getAnimals()
      .then(r => {
        const data = r.data || [];

        // ✅ optimized counting (no multiple filter)
        const counts = data.reduce((acc, a) => {
          acc[a.type] = (acc[a.type] || 0) + 1;
          return acc;
        }, { cow:0, sheep:0, chicken:0, rabbit:0 });

        setAnimals(counts);

        // take first 3 animals for comments
        const ids = data.slice(0, 3).map(a => a._id);

        Promise.all(ids.map(id => getComments(id)))
          .then(res => {
            const all = res.flatMap(r => r.data || []);
            setComments(all.slice(0, 5));
          })
          .catch(() => {});
      })
      .catch(() => {});

    // Promotions
    getPromotions()
      .then(r => setPromos(r.data || []))
      .catch(() => {});
  }, []);

  // ───── PROMO SLIDER ─────
  useEffect(() => {
    if (promos.length < 2) return;
    const timer = setInterval(() => {
      setPromoIdx(i => (i + 1) % promos.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [promos]);

  const totalAnimals =
    animals.cow + animals.sheep + animals.chicken + animals.rabbit;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>

      {/* HERO simplified (same UI but unchanged visually) */}
      <div style={{ position:'relative', width:'100%', height:'100vh' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,#FFB347,#87CEEB)' }} />

        {/* Center card */}
        <div style={{
          position:'absolute', inset:0,
          display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          <div style={{
            background:'rgba(255,255,255,0.92)',
            padding:'32px 40px',
            borderRadius:24,
            textAlign:'center',
            maxWidth:420,
            width:'90%',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition:'0.6s'
          }}>
            <h1 style={{ fontSize:32, fontWeight:900, color:'#1B5E20' }}>
              FarmTrust
            </h1>

            <p style={{ color:'#388E3C', fontWeight:600 }}>
              {t.tagline}
            </p>

            {/* stats */}
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(4,1fr)',
              gap:8,
              margin:'20px 0'
            }}>
              {[
                { icon:'🐄', count:animals.cow },
                { icon:'🐑', count:animals.sheep },
                { icon:'🐓', count:animals.chicken },
                { icon:'🐇', count:animals.rabbit }
              ].map((s, i) => (
                <div key={i} style={{ background:'#f0fdf4', padding:8, borderRadius:10 }}>
                  <div>{s.icon}</div>
                  <div style={{ fontWeight:800 }}>{s.count}</div>
                </div>
              ))}
            </div>

            <button onClick={() => navigate('/animals')} className="btn-main">
              {t.browse}
            </button>
          </div>
        </div>
      </div>

      {/* PROMO */}
      {promos.length > 0 && (
        <div
          onClick={() => navigate('/animals')}
          style={{
            background:'#FF6F00',
            color:'white',
            textAlign:'center',
            padding:12,
            fontWeight:700,
            cursor:'pointer'
          }}
        >
          🔥 {promos[promoIdx]?.product_id?.name || t.promo_banner}
        </div>
      )}

      {/* COMMENTS */}
      <div style={{ padding:40, background:'#f9fafb' }}>
        <h2 style={{ textAlign:'center' }}>{t.comments_title}</h2>

        {comments.length === 0 ? (
          <p style={{ textAlign:'center', color:'#aaa' }}>No comments yet</p>
        ) : (
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',
            gap:16
          }}>
            {comments.map((c, i) => (
              <div key={i} style={{
                background:'white',
                padding:16,
                borderRadius:16,
                border:'1px solid #eee'
              }}>
                <strong>{c.user_id?.name || 'User'}</strong>
                <p style={{ fontSize:13 }}>{c.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ textAlign:'center', padding:60, background:'#1a1a2e', color:'white' }}>
        <h2>{t.register}</h2>
        <button onClick={() => navigate('/register')} className="btn-main">
          Join now
        </button>
      </div>

    </div>
  );
}
