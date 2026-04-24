import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnimals, getComments, getPromotions } from '../../services/api';
import { useLang } from '../../context';

const FARMER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 140'%3E%3Ccircle cx='60' cy='35' r='28' fill='%23FFCC80'/%3E%3Cellipse cx='60' cy='110' rx='38' ry='32' fill='%234CAF50'/%3E%3Crect x='30' y='58' width='60' height='45' rx='8' fill='%234CAF50'/%3E%3Ccircle cx='60' cy='35' r='20' fill='%23FFB74D'/%3E%3Crect x='20' y='18' width='80' height='22' rx='11' fill='%23795548'/%3E%3Crect x='15' y='14' width='90' height='10' rx='5' fill='%23A1887F'/%3E%3Ccircle cx='52' cy='32' r='3' fill='%23333'/%3E%3Ccircle cx='68' cy='32' r='3' fill='%23333'/%3E%3Cpath d='M52 44 Q60 50 68 44' stroke='%23333' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";

export default function Landing() {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [animals, setAnimals]   = useState({ cow: 0, sheep: 0, chicken: 0, rabbit: 0 });
  const [comments, setComments] = useState([]);
  const [promos, setPromos]     = useState([]);
  const [promoIdx, setPromoIdx] = useState(0);
  const [visible, setVisible]   = useState(false);

  useEffect(() => {
    setVisible(true);
    getAnimals().then(r => {
      const data = r.data;
      setAnimals({
        cow:     data.filter(a => a.type === 'cow').length,
        sheep:   data.filter(a => a.type === 'sheep').length,
        chicken: data.filter(a => a.type === 'chicken').length,
        rabbit:  data.filter(a => a.type === 'rabbit').length,
      });
    }).catch(() => {});
    getPromotions().then(r => setPromos(r.data)).catch(() => {});
    Promise.all([
      fetch(`${process.env.REACT_APP_API_URL}/animals`).then(r => r.json()).catch(() => [])
    ]).then(([animData]) => {
      if (animData?.length) {
        const ids = animData.slice(0,3).map(a => a._id);
        Promise.all(ids.map(id =>
          fetch(`${process.env.REACT_APP_API_URL}/comments/${id}`).then(r => r.json()).catch(() => [])
        )).then(results => {
          const all = results.flat().slice(0, 5);
          setComments(all);
        });
      }
    });
  }, []);

  useEffect(() => {
    if (promos.length < 2) return;
    const timer = setInterval(() => setPromoIdx(i => (i + 1) % promos.length), 3500);
    return () => clearInterval(timer);
  }, [promos]);

  const totalAnimals = animals.cow + animals.sheep + animals.chicken + animals.rabbit;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      <style>{`
        @keyframes floatCloud { from{left:-170px} to{left:110%} }
        @keyframes walkR  { from{left:-90px} to{left:110%} }
        @keyframes walkL  { from{right:-70px} to{right:110%} }
        @keyframes hopR   { 0%{left:-55px;bottom:118px} 4%{bottom:144px} 8%{bottom:118px} 12%{bottom:142px} 16%{bottom:118px} 100%{left:110%;bottom:118px} }
        @keyframes flyB   { from{transform:translateX(-120px)} to{transform:translateX(1300px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        .cloud { position:absolute; background:white; border-radius:50px; opacity:0.88; animation:floatCloud linear infinite; }
        .cloud::before,.cloud::after { content:''; position:absolute; background:white; border-radius:50%; }
        .c1{width:115px;height:33px;top:65px;animation-duration:32s}
        .c1::before{width:58px;height:58px;top:-23px;left:17px} .c1::after{width:40px;height:40px;top:-16px;left:55px}
        .c2{width:88px;height:27px;top:115px;animation-duration:40s;animation-delay:-15s}
        .c2::before{width:44px;height:44px;top:-18px;left:13px} .c2::after{width:33px;height:33px;top:-14px;left:40px}
        .c3{width:135px;height:35px;top:48px;animation-duration:25s;animation-delay:-10s}
        .c3::before{width:60px;height:60px;top:-25px;left:20px} .c3::after{width:46px;height:46px;top:-19px;left:60px}
        .animal{position:absolute;bottom:118px}
        .cow    {animation:walkR 22s linear infinite}
        .sheep  {animation:walkR 28s linear infinite;animation-delay:-12s}
        .chicken{animation:walkL 16s linear infinite;animation-delay:-6s;right:-70px}
        .rabbit {animation:hopR  24s linear infinite;animation-delay:-18s}
        .bird   {width:15px;height:6px;border-top:2px solid #546E7A;border-radius:50% 50% 0 0;display:inline-block;margin:0 4px}
        .birds  {position:absolute;animation:flyB 24s linear infinite}
        .stat-card{background:rgba(255,255,255,0.9);border-radius:16px;padding:18px 24px;text-align:center;backdrop-filter:blur(4px)}
        .comment-card{background:white;border-radius:16px;padding:20px;border:1px solid #e5e7eb;animation:slideIn 0.5s ease}
        .promo-ticker{background:#FF6F00;color:white;padding:12px 24px;text-align:center;cursor:pointer;font-weight:600;font-size:15px;animation:pulse 2s infinite}
        .feature-card{background:white;border-radius:20px;padding:24px;border:1px solid #e5e7eb;transition:all 0.2s;cursor:default}
        .feature-card:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(0,0,0,0.08)}
        .btn-main{background:#2E7D32;color:white;border:none;border-radius:14px;padding:14px 32px;font-size:16px;font-weight:700;cursor:pointer;transition:background 0.2s;font-family:system-ui}
        .btn-main:hover{background:#1B5E20}
        .btn-sec{background:white;color:#2E7D32;border:2.5px solid #2E7D32;border-radius:14px;padding:14px 32px;font-size:16px;font-weight:700;cursor:pointer;font-family:system-ui}
        .btn-sec:hover{background:#f0fdf4}
        .welcome-msg{position:absolute;bottom:-60px;left:50%;transform:translateX(-50%);background:white;border-radius:14px;padding:10px 20px;white-space:nowrap;font-size:12px;color:#1B5E20;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:2px solid #a7f3d0}
        .speech-arrow{position:absolute;top:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:8px solid white}
      `}</style>

      {/* ─── HERO SCENE ─── */}
      <div style={{ position:'relative', width:'100%', height:'100vh', overflow:'hidden', minHeight:500 }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,#FFB347 0%,#87CEEB 38%,#87CEEB 100%)' }} />
        <div style={{ position:'absolute', top:38, left:'50%', transform:'translateX(-50%)', width:85, height:85, background:'#FFD700', borderRadius:'50%' }} />

        <div className="birds" style={{ top:78, left:'12%' }}><div className="bird"/><div className="bird"/><div className="bird"/></div>
        <div className="birds" style={{ top:100, left:'58%', animationDuration:'30s', animationDelay:'-11s' }}><div className="bird"/><div className="bird"/></div>

        <div className="cloud c1"/><div className="cloud c2"/><div className="cloud c3"/>

        {/* Hills */}
        <div style={{ position:'absolute', bottom:95, left:'-5%', width:'55%', height:190, background:'#4CAF50', borderRadius:'50% 50% 0 0' }} />
        <div style={{ position:'absolute', bottom:95, right:'-5%', width:'60%', height:170, background:'#388E3C', borderRadius:'50% 50% 0 0' }} />
        <div style={{ position:'absolute', bottom:95, left:'25%', width:'55%', height:150, background:'#66BB6A', borderRadius:'50% 50% 0 0' }} />

        {/* Trees */}
        {[{ r:215, s:1 }, { l:28, s:0.72 }, { l:160, s:0.6 }].map((tr, i) => (
          <div key={i} style={{ position:'absolute', bottom:112, ...(tr.r ? { right:tr.r } : { left:tr.l }), transform:`scale(${tr.s})`, transformOrigin:'bottom center' }}>
            <div style={{ width:0, height:0, borderLeft:'24px solid transparent', borderRight:'24px solid transparent', borderBottom:'44px solid #388E3C', position:'absolute', top:'-64px', left:'-17px' }} />
            <div style={{ width:0, height:0, borderLeft:'30px solid transparent', borderRight:'30px solid transparent', borderBottom:'55px solid #2E7D32', position:'absolute', top:'-49px', left:'-23px' }} />
            <div style={{ width:14, height:32, background:'#795548', margin:'0 auto', borderRadius:2 }} />
          </div>
        ))}

        {/* Barn */}
        <div style={{ position:'absolute', bottom:112, right:72 }}>
          <div style={{ width:0, height:0, borderLeft:'50px solid transparent', borderRight:'50px solid transparent', borderBottom:'44px solid #B71C1C', position:'absolute', top:-44, left:-6 }} />
          <div style={{ width:90, height:72, background:'#8B2500', border:'2px solid #5D1A00' }}>
            <div style={{ width:20, height:16, background:'#FFF9C4', position:'absolute', top:13, left:10, border:'2px solid #5D1A00' }} />
            <div style={{ width:25, height:40, background:'#5D1A00', position:'absolute', bottom:0, left:33, borderRadius:'12px 12px 0 0' }} />
          </div>
        </div>

        {/* Fence */}
        <div style={{ position:'absolute', bottom:112, left:0, right:0, height:38 }}>
          {[8,22].map(t => <div key={t} style={{ position:'absolute', left:0, right:0, height:5, background:'#A1887F', borderRadius:2, top:t }} />)}
          <div style={{ display:'flex' }}>
            {Array.from({length:24}).map((_,i) => <div key={i} style={{ width:8, height:38, background:'#8D6E63', margin:'0 21px', borderRadius:'2px 2px 0 0', flexShrink:0 }} />)}
          </div>
        </div>

        <div style={{ position:'absolute', bottom:0, width:'100%', height:115, background:'#5D4037' }} />
        <div style={{ position:'absolute', bottom:113, width:'100%', height:16, background:'#2E7D32', borderRadius:'8px 8px 0 0' }} />

        {/* Animals */}
        <div className="animal cow">
          <svg width="74" height="54" viewBox="0 0 74 54" style={{overflow:'visible'}}>
            <ellipse cx="34" cy="32" rx="24" ry="16" fill="#EFEBE9" stroke="#5D4037" strokeWidth="1"/>
            <circle cx="55" cy="23" r="13" fill="#EFEBE9" stroke="#5D4037" strokeWidth="1"/>
            <ellipse cx="30" cy="30" rx="9" ry="5" fill="#5D4037" opacity="0.22"/>
            <line x1="18" y1="46" x2="16" y2="54" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
            <line x1="27" y1="47" x2="25" y2="54" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
            <line x1="41" y1="47" x2="39" y2="54" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
            <line x1="50" y1="46" x2="48" y2="54" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
            <line x1="56" y1="11" x2="60" y2="5" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="52" y1="10" x2="48" y2="5" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="58" cy="23" r="2.2" fill="#333"/>
            <ellipse cx="30" cy="43" rx="7" ry="3.5" fill="#F8BBD0" opacity="0.6"/>
          </svg>
        </div>

        <div className="animal sheep" style={{bottom:122}}>
          <svg width="64" height="48" viewBox="0 0 64 48" style={{overflow:'visible'}}>
            <ellipse cx="30" cy="30" rx="20" ry="14" fill="#F5F5F5" stroke="#9E9E9E" strokeWidth="0.8"/>
            <circle cx="21" cy="23" r="11" fill="#FAFAFA" stroke="#BDBDBD" strokeWidth="0.7"/>
            <circle cx="30" cy="20" r="11" fill="#FAFAFA" stroke="#BDBDBD" strokeWidth="0.7"/>
            <circle cx="39" cy="23" r="10" fill="#FAFAFA" stroke="#BDBDBD" strokeWidth="0.7"/>
            <circle cx="50" cy="28" r="10" fill="#EFEBE9" stroke="#9E9E9E" strokeWidth="0.8"/>
            <circle cx="52" cy="27" r="2" fill="#333"/>
            <line x1="19" y1="43" x2="17" y2="48" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round"/>
            <line x1="27" y1="44" x2="25" y2="48" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round"/>
            <line x1="35" y1="44" x2="33" y2="48" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="animal chicken" style={{bottom:116}}>
          <svg width="44" height="42" viewBox="0 0 44 42" style={{overflow:'visible'}}>
            <ellipse cx="20" cy="28" rx="15" ry="12" fill="#FFF9C4" stroke="#F9A825" strokeWidth="0.8"/>
            <circle cx="31" cy="18" r="11" fill="#FFF9C4" stroke="#F9A825" strokeWidth="0.8"/>
            <path d="M29 10 Q31 6 33 10" fill="#E53935"/>
            <polygon points="36,19 40,20 36,21" fill="#F9A825"/>
            <circle cx="33" cy="17" r="2.2" fill="#212121"/>
            <ellipse cx="13" cy="27" rx="8" ry="5" fill="#F9A825" opacity="0.4"/>
            <line x1="18" y1="38" x2="16" y2="42" stroke="#F9A825" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="24" y1="38" x2="23" y2="42" stroke="#F9A825" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="animal rabbit">
          <svg width="42" height="50" viewBox="0 0 42 50" style={{overflow:'visible'}}>
            <ellipse cx="21" cy="36" rx="14" ry="12" fill="#F8F8F8" stroke="#BDBDBD" strokeWidth="0.8"/>
            <circle cx="27" cy="26" r="10" fill="#F8F8F8" stroke="#BDBDBD" strokeWidth="0.8"/>
            <ellipse cx="23" cy="14" rx="3.8" ry="10" fill="#F8F8F8" stroke="#BDBDBD" strokeWidth="0.7"/>
            <ellipse cx="31" cy="13" rx="3.8" ry="10" fill="#F8F8F8" stroke="#BDBDBD" strokeWidth="0.7"/>
            <ellipse cx="23" cy="14" rx="2" ry="6.5" fill="#F48FB1"/>
            <ellipse cx="31" cy="13" rx="2" ry="6.5" fill="#F48FB1"/>
            <circle cx="29" cy="26" r="2" fill="#333"/>
            <circle cx="31" cy="28" r="1.4" fill="#F48FB1"/>
            <line x1="17" y1="46" x2="15" y2="50" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="24" y1="47" x2="23" y2="50" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Farmer character */}
        <div style={{ position:'absolute', bottom:112, left:'42%', zIndex:10, display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{ position:'relative' }}>
            <img src={FARMER_IMG} alt="farmer" style={{ width:80, height:95, objectFit:'contain' }} />
            <div style={{ position:'absolute', bottom:-52, left:'50%', transform:'translateX(-50%)', background:'white', borderRadius:12, padding:'8px 14px', whiteSpace:'nowrap', fontSize:11, color:'#1B5E20', fontWeight:700, boxShadow:'0 4px 12px rgba(0,0,0,0.15)', border:'2px solid #a7f3d0' }}>
              <div style={{ position:'absolute', top:-7, left:'50%', transform:'translateX(-50%)', width:0, height:0, borderLeft:'7px solid transparent', borderRight:'7px solid transparent', borderBottom:'7px solid white' }} />
              {t.welcome_user} 👋
            </div>
          </div>
        </div>

        {/* Center card */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', paddingBottom:20 }}>
          <div style={{
            background:'rgba(255,255,255,0.92)', borderRadius:24, padding:'32px 44px',
            textAlign:'center', border:'2px solid rgba(255,255,255,0.7)',
            maxWidth:440, width:'90%',
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease'
          }}>
            {/* Logo inside card */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:14 }}>
              <div style={{ width:46, height:46, background:'linear-gradient(135deg,#2E7D32,#66BB6A)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ color:'white', fontWeight:900, fontSize:16 }}>FT</span>
              </div>
              <div style={{ textAlign:'left' }}>
                <div style={{ fontSize:32, fontWeight:900, color:'#1B5E20', lineHeight:1, letterSpacing:'-1px' }}>FarmTrust</div>
                <div style={{ fontSize:11, color:'#A1887F', letterSpacing:4, fontWeight:600 }}>BY RSHD</div>
              </div>
            </div>
            <div style={{ height:3, background:'#FFA726', borderRadius:2, margin:'0 0 12px' }} />
            <div style={{ fontSize:14, color:'#388E3C', fontWeight:600, marginBottom:20 }}>{t.tagline}</div>

            {/* Live animal stats */}
            {totalAnimals > 0 && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:20 }}>
                {[
                  { icon:'🐄', count:animals.cow,     label:lang==='ar'?'أبقار':lang==='fr'?'Vaches':'Cows' },
                  { icon:'🐑', count:animals.sheep,   label:lang==='ar'?'أغنام':lang==='fr'?'Moutons':'Sheep' },
                  { icon:'🐓', count:animals.chicken, label:lang==='ar'?'دجاج':lang==='fr'?'Poulets':'Chickens' },
                  { icon:'🐇', count:animals.rabbit,  label:lang==='ar'?'أرانب':lang==='fr'?'Lapins':'Rabbits' },
                ].map(s => (
                  <div key={s.label} style={{ background:'#f0fdf4', borderRadius:12, padding:'10px 6px', textAlign:'center' }}>
                    <div style={{ fontSize:20 }}>{s.icon}</div>
                    <div style={{ fontWeight:800, color:'#166534', fontSize:18 }}>{s.count}</div>
                    <div style={{ fontSize:10, color:'#4ade80', fontWeight:600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <button className="btn-main" onClick={() => navigate('/animals')}>{t.browse}</button>
              <button className="btn-sec" onClick={() => navigate('/login')}>{t.login}</button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PROMO TICKER ─── */}
      {promos.length > 0 && (
        <div className="promo-ticker" onClick={() => navigate('/animals')}>
          {promos[promoIdx]?.product_id?.name
            ? `🔥 ${promos[promoIdx].product_id.name} — ${promos[promoIdx].discount_percentage}% OFF!`
            : t.promo_banner}
          {' '}<span style={{ textDecoration:'underline', opacity:0.85 }}>{t.promo_check} →</span>
        </div>
      )}

      {/* ─── STATS BAR ─── */}
      <div style={{ background:'#1B5E20', padding:'24px 20px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:16, textAlign:'center' }}>
          {[
            { icon:'🐄', value:totalAnimals || '12+', label:t.stats_animals },
            { icon:'👨‍🌾', value:'5+',  label:t.stats_farmers },
            { icon:'📦', value:'100+', label:t.stats_orders },
            { icon:'🥛', value:'24/7', label:t.stats_fresh },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize:28, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:28, fontWeight:800, color:'white' }}>{s.value}</div>
              <div style={{ fontSize:13, color:'#a7f3d0', fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FEATURES ─── */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'60px 20px' }}>
        <h2 style={{ textAlign:'center', fontSize:28, fontWeight:800, color:'#1B5E20', marginBottom:8 }}>
          {lang==='ar' ? 'كل ما تحتاجه' : lang==='fr' ? 'Tout ce dont vous avez besoin' : 'Everything you need'}
        </h2>
        <p style={{ textAlign:'center', color:'#6b7280', marginBottom:40 }}>
          {lang==='ar' ? 'تجربة مزرعة متكاملة' : lang==='fr' ? 'Une expérience agricole complète' : 'A complete farm-to-table experience'}
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:20 }}>
          {[
            { icon:'🛒', en:'Buy Products',     fr:'Acheter produits',   ar:'شراء المنتجات' },
            { icon:'🐄', en:'Buy Animals',      fr:'Acheter animaux',    ar:'شراء الحيوانات' },
            { icon:'🎁', en:'Promotions',       fr:'Promotions',         ar:'العروض' },
            { icon:'💬', en:'Direct Chat',      fr:'Chat direct',        ar:'دردشة مباشرة' },
            { icon:'⭐', en:'Ratings',          fr:'Évaluations',        ar:'التقييمات' },
            { icon:'📦', en:'Track Orders',     fr:'Suivre commandes',   ar:'تتبع الطلبات' },
          ].map(f => (
            <div key={f.en} className="feature-card" style={{ textAlign:'center' }}>
              <div style={{ fontSize:36, marginBottom:10 }}>{f.icon}</div>
              <div style={{ fontWeight:700, color:'#1B5E20', fontSize:14 }}>{f[lang] || f.en}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── COMMENTS (5 real ones) ─── */}
      <div style={{ background:'#f9fafb', padding:'60px 20px' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <h2 style={{ textAlign:'center', fontSize:26, fontWeight:800, color:'#1B5E20', marginBottom:8 }}>{t.comments_title}</h2>
          <p style={{ textAlign:'center', color:'#9ca3af', marginBottom:36, fontSize:13 }}>{t.comment_login}</p>
          {comments.length === 0 ? (
            <p style={{ textAlign:'center', color:'#d1d5db', padding:40 }}>
              {lang==='ar' ? 'لا توجد تعليقات بعد' : lang==='fr' ? 'Pas encore de commentaires' : 'No reviews yet — be the first!'}
            </p>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16 }}>
              {comments.slice(0,5).map((c, i) => (
                <div key={c._id || i} className="comment-card">
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                    <div style={{ width:38, height:38, background:'#dcfce7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'#166534', fontSize:14 }}>
                      {c.user_id?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:14, color:'#1f2937' }}>{c.user_id?.name || 'Client'}</div>
                      <div style={{ color:'#fbbf24', fontSize:14 }}>{'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}</div>
                    </div>
                  </div>
                  <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.6 }}>{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div style={{ background:'#1a1a2e', padding:'60px 20px', textAlign:'center' }}>
        <h2 style={{ color:'white', fontSize:30, fontWeight:800, marginBottom:12 }}>
          {lang==='ar' ? 'جاهز للبدء؟' : lang==='fr' ? 'Prêt à commencer ?' : 'Ready to get started?'}
        </h2>
        <p style={{ color:'#9ca3af', marginBottom:28, fontSize:15 }}>
          {lang==='ar' ? 'انضم إلى FarmTrust RSHD اليوم' : lang==='fr' ? 'Rejoignez FarmTrust RSHD aujourd\'hui' : 'Join FarmTrust RSHD today'}
        </p>
        <button className="btn-main" style={{ fontSize:16, padding:'14px 40px' }} onClick={() => navigate('/register')}>
          {t.register} →
        </button>
      </div>

      {/* Footer */}
      <div style={{ background:'#111827', color:'#6b7280', textAlign:'center', padding:'20px', fontSize:13 }}>
        © 2024 FarmTrust by RSHD — All rights reserved
      </div>
    </div>
  );
}
