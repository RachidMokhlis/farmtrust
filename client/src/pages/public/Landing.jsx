import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const T = {
  fr: {
    wt: 'Bienvenue sur FarmTrust !',
    ws: 'Je suis Rachid, votre guide agricole 🌿',
    n1:'Vaches',    s1:'Lait & beurre',
    n2:'Moutons',   s2:'Viande & laine',
    n3:'Poulets',   s3:'Œufs frais',
    n4:'Lapins',    s4:'Viande premium',
    bl:'Se connecter', br:"S'inscrire",
    e1:'Journaux',     e1s:'Santé & alim.',
    e2:'Promotions',   e2s:'Offres spéciales',
    e3:'Chat',         e3s:'Parler à la ferme',
  },
  en: {
    wt: 'Welcome to FarmTrust!',
    ws: "I'm Rachid, your farm guide 🌿",
    n1:'Cows',     s1:'Milk & butter',
    n2:'Sheep',    s2:'Meat & wool',
    n3:'Chickens', s3:'Fresh eggs',
    n4:'Rabbits',  s4:'Premium meat',
    bl:'Login',    br:'Register',
    e1:'Animal logs', e1s:'Health & feeding',
    e2:'Promotions',  e2s:'Special offers',
    e3:'Live chat',   e3s:'Talk to farm',
  },
  ar: {
    wt: '!مرحباً بكم في FarmTrust',
    ws: 'أنا رشيد، دليلكم في المزرعة 🌿',
    n1:'الأبقار',  s1:'الحليب والزبدة',
    n2:'الأغنام',  s2:'اللحم والصوف',
    n3:'الدجاج',   s3:'البيض الطازج',
    n4:'الأرانب',  s4:'لحم فاخر',
    bl:'تسجيل الدخول', br:'إنشاء حساب',
    e1:'سجل الحيوانات', e1s:'الصحة والتغذية',
    e2:'العروض',        e2s:'خصومات حصرية',
    e3:'الدردشة',       e3s:'تحدث معنا',
  },
};

function Avatar() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <rect width="80" height="80" fill="#87CEEB"/>
      {/* djellaba verte */}
      <ellipse cx="40" cy="95" rx="38" ry="30" fill="#2E7D32"/>
      <path d="M34 64 Q40 71 46 64" fill="none" stroke="#1B5E20" strokeWidth="1.5"/>
      <rect x="38" y="61" width="4" height="12" rx="1" fill="#1B5E20" opacity=".45"/>
      {/* cou */}
      <rect x="34" y="50" width="12" height="14" rx="5" fill="#C8A882"/>
      {/* tête */}
      <ellipse cx="40" cy="40" rx="17" ry="18" fill="#C8A882"/>
      {/* cheveux */}
      <ellipse cx="40" cy="24" rx="17" ry="10" fill="#8D6E63"/>
      <path d="M23 30 Q27 19 40 21 Q53 19 57 30" fill="#8D6E63"/>
      <path d="M33 21 Q38 18 44 20" fill="none" stroke="#D7CCC8" strokeWidth="2.5" strokeLinecap="round"/>
      {/* oreilles */}
      <ellipse cx="23" cy="41" rx="3" ry="4.5" fill="#C8A882"/>
      <ellipse cx="57" cy="41" rx="3" ry="4.5" fill="#C8A882"/>
      {/* lunettes */}
      <rect x="24" y="35" width="13" height="9" rx="3.5" fill="#1a1a1a" opacity=".92"/>
      <rect x="43" y="35" width="13" height="9" rx="3.5" fill="#1a1a1a" opacity=".92"/>
      <line x1="37" y1="39" x2="43" y2="39" stroke="#555" strokeWidth="1.5"/>
      <line x1="24" y1="39" x2="20" y2="38" stroke="#333" strokeWidth="1.5"/>
      <line x1="56" y1="39" x2="60" y2="38" stroke="#333" strokeWidth="1.5"/>
      <ellipse cx="28" cy="38" rx="2" ry="1.5" fill="#555" opacity=".5"/>
      <ellipse cx="47" cy="38" rx="2" ry="1.5" fill="#555" opacity=".5"/>
      {/* sourire + dents */}
      <path d="M31 51 Q40 58 49 51" fill="none" stroke="#7B5E3A" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M33 52 Q40 57 47 52" fill="white" opacity=".9"/>
      {/* barbe légère */}
      <ellipse cx="40" cy="55" rx="7" ry="3.5" fill="#A0826D" opacity=".22"/>
    </svg>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('fr');
  const t = T[lang];
  const isAr = lang === 'ar';

  const animals = [
    { ic: '🐄', n: 'n1', s: 's1' },
    { ic: '🐑', n: 'n2', s: 's2' },
    { ic: '🐓', n: 'n3', s: 's3' },
    { ic: '🐇', n: 'n4', s: 's4' },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <style>{`
        .scene{position:relative;width:100%;height:100vh;overflow:hidden}
        .sky{position:absolute;inset:0;background:linear-gradient(180deg,#FF8C00 0%,#FFB347 12%,#87CEEB 40%,#B0E0FF 100%)}
        .sun{position:absolute;top:28px;left:50%;transform:translateX(-50%);width:68px;height:68px;background:#FFD700;border-radius:50%}
        .cloud{position:absolute;background:white;border-radius:50px;opacity:.85;animation:fc linear infinite}
        .cloud::before,.cloud::after{content:'';position:absolute;background:white;border-radius:50%}
        .c1{width:100px;height:26px;top:60px;animation-duration:34s}
        .c1::before{width:48px;height:48px;top:-19px;left:13px}.c1::after{width:34px;height:34px;top:-13px;left:46px}
        .c2{width:78px;height:22px;top:100px;animation-duration:42s;animation-delay:-16s}
        .c2::before{width:38px;height:38px;top:-15px;left:10px}.c2::after{width:26px;height:26px;top:-10px;left:34px}
        @keyframes fc{from{left:-160px}to{left:110%}}
        .hill1{position:absolute;bottom:90px;left:-5%;width:54%;height:165px;background:#43A047;border-radius:50% 50% 0 0}
        .hill2{position:absolute;bottom:90px;right:-5%;width:57%;height:150px;background:#2E7D32;border-radius:50% 50% 0 0}
        .hill3{position:absolute;bottom:90px;left:23%;width:56%;height:125px;background:#66BB6A;border-radius:50% 50% 0 0}
        .ground{position:absolute;bottom:0;width:100%;height:95px;background:#4E342E}
        .grass{position:absolute;bottom:93px;width:100%;height:13px;background:#1B5E20;border-radius:6px 6px 0 0}
        .barn-w{position:absolute;bottom:105px;right:45px}
        .barn-b{width:80px;height:64px;background:#8B2500;border:2px solid #5D1A00}
        .barn-r{width:0;height:0;border-left:46px solid transparent;border-right:46px solid transparent;border-bottom:42px solid #C62828;position:absolute;top:-42px;left:-6px}
        .barn-d{width:22px;height:36px;background:#5D1A00;position:absolute;bottom:0;left:29px;border-radius:11px 11px 0 0}
        .barn-wn{width:18px;height:14px;background:#FFF9C4;position:absolute;top:11px;left:8px;border:2px solid #5D1A00}
        .tree-w{position:absolute;bottom:105px}
        .trunk{width:12px;height:28px;background:#6D4C41;margin:0 auto;border-radius:2px}
        .tt1{width:0;height:0;border-left:26px solid transparent;border-right:26px solid transparent;border-bottom:48px solid #1B5E20;position:absolute;top:-44px;left:-20px}
        .tt2{width:0;height:0;border-left:20px solid transparent;border-right:20px solid transparent;border-bottom:38px solid #2E7D32;position:absolute;top:-59px;left:-14px}
        .fence-w{position:absolute;bottom:105px;left:0;right:0;height:34px}
        .fr_{position:absolute;left:0;right:0;height:4px;background:#8D6E63;border-radius:2px}
        .fp-row{position:absolute;left:0;right:0;top:0;display:flex}
        .fp{width:7px;height:34px;background:#795548;margin:0 20px;border-radius:2px 2px 0 0;flex-shrink:0}
        .sani{position:absolute;bottom:105px;opacity:.65}
        .wa1{animation:wr 22s linear infinite}
        .wa2{animation:wr 28s linear infinite;animation-delay:-12s}
        @keyframes wr{from{left:-70px}to{left:110%}}
        .overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:12px}
        .card{background:rgba(255,255,255,0.95);border-radius:28px;padding:18px 22px;width:100%;max-width:540px;border:2px solid rgba(255,255,255,0.8)}
        .head-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
        .logo-area{display:flex;align-items:center;gap:9px}
        .logo-ic{width:40px;height:40px;background:#1B5E20;border-radius:11px;display:flex;align-items:center;justify-content:center;color:white;font-size:17px;font-weight:800;flex-shrink:0}
        .logo-t{font-size:22px;font-weight:800;color:#1B5E20;letter-spacing:-0.5px;line-height:1}
        .logo-bar{width:100%;height:2.5px;background:#FFA726;border-radius:2px;margin:3px 0}
        .logo-sub{font-size:10px;color:#8D6E63;letter-spacing:3px;font-weight:600}
        .lang-sw{display:flex;gap:3px;background:#f0f0f0;border-radius:9px;padding:3px}
        .lb{border:none;background:transparent;padding:4px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;color:#666;transition:all .15s}
        .lb.on{background:#1B5E20;color:white}
        .welcome-row{display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,#f0fdf4,#fff8e1);border-radius:18px;padding:12px 16px;margin-bottom:12px;border:1.5px solid #C8E6C9}
        .avatar-ring{width:80px;height:80px;border-radius:50%;border:3px solid #FFA726;overflow:hidden;flex-shrink:0;background:#87CEEB}
        .welcome-t{font-size:16px;font-weight:800;color:#1B5E20;line-height:1.3;margin-bottom:4px}
        .welcome-s{font-size:12px;color:#555}
        .wave{display:inline-block;animation:wv .8s ease-in-out infinite alternate;transform-origin:70% 70%}
        @keyframes wv{from{transform:rotate(-15deg)}to{transform:rotate(15deg)}}
        .opt-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:9px}
        .opt-card{background:#f8fdf8;border:1.5px solid #C8E6C9;border-radius:11px;padding:8px 4px;text-align:center;cursor:pointer;transition:all .18s}
        .opt-card:hover{background:#E8F5E9;border-color:#4CAF50;transform:translateY(-2px)}
        .oi{font-size:22px;margin-bottom:3px}
        .on_{font-size:10px;font-weight:700;color:#1B5E20}
        .os{font-size:9px;color:#888;margin-top:1px}
        .act-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:7px}
        .bg_{background:#1B5E20;color:white;border:none;border-radius:11px;padding:11px;font-size:13px;font-weight:700;cursor:pointer;width:100%;transition:background .15s}
        .bg_:hover{background:#145214}
        .bw_{background:white;color:#1B5E20;border:2px solid #1B5E20;border-radius:11px;padding:11px;font-size:13px;font-weight:700;cursor:pointer;width:100%;transition:background .15s}
        .bw_:hover{background:#f0fdf4}
        .extra-row{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
        .ex_{background:#FFF8E1;border:1.5px solid #FFE082;border-radius:10px;padding:7px 8px;display:flex;align-items:center;gap:6px;cursor:pointer;transition:all .15s}
        .ex_:hover{background:#FFF3CD;transform:translateY(-1px)}
        .ei_{font-size:15px;flex-shrink:0}
        .et_{font-size:10px;font-weight:700;color:#5D4037}
        .es_{font-size:9px;color:#8D6E63}
      `}</style>

      <div className="scene">
        <div className="sky"/><div className="sun"/>
        <div className="cloud c1"/><div className="cloud c2"/>
        <div className="hill1"/><div className="hill2"/><div className="hill3"/>
        <div className="tree-w" style={{right:180}}><div className="tt2"/><div className="tt1"/><div className="trunk"/></div>
        <div className="tree-w" style={{left:22,transform:'scale(.72)'}}><div className="tt2"/><div className="tt1"/><div className="trunk"/></div>
        <div className="barn-w"><div className="barn-r"/><div className="barn-b"><div className="barn-wn"/><div className="barn-d"/></div></div>
        <div className="fence-w">
          <div className="fr_" style={{top:7}}/><div className="fr_" style={{top:19}}/>
          <div className="fp-row">{Array.from({length:26}).map((_,i)=><div key={i} className="fp"/>)}</div>
        </div>
        <div className="ground"/><div className="grass"/>

        {/* cow walking */}
        <div className="sani wa1" style={{bottom:108}}>
          <svg width="50" height="36" viewBox="0 0 50 36" style={{overflow:'visible'}}>
            <ellipse cx="23" cy="21" rx="15" ry="9" fill="#EFEBE9" stroke="#5D4037" strokeWidth=".8"/>
            <circle cx="36" cy="14" r="8" fill="#EFEBE9" stroke="#5D4037" strokeWidth=".8"/>
            <line x1="11" y1="29" x2="9" y2="36" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="19" y1="30" x2="17" y2="36" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="29" y1="30" x2="27" y2="36" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="38" cy="13" r="1.4" fill="#333"/>
          </svg>
        </div>
        {/* sheep walking */}
        <div className="sani wa2" style={{bottom:110}}>
          <svg width="42" height="32" viewBox="0 0 42 32" style={{overflow:'visible'}}>
            <ellipse cx="19" cy="20" rx="13" ry="8" fill="#F5F5F5" stroke="#9E9E9E" strokeWidth=".7"/>
            <circle cx="13" cy="15" r="6.5" fill="#FAFAFA" stroke="#BDBDBD" strokeWidth=".5"/>
            <circle cx="20" cy="13" r="6.5" fill="#FAFAFA" stroke="#BDBDBD" strokeWidth=".5"/>
            <circle cx="27" cy="15" r="6" fill="#FAFAFA" stroke="#BDBDBD" strokeWidth=".5"/>
            <circle cx="33" cy="18" r="6" fill="#EFEBE9" stroke="#9E9E9E" strokeWidth=".7"/>
            <circle cx="35" cy="17" r="1.2" fill="#333"/>
            <line x1="12" y1="27" x2="10" y2="32" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="19" y1="28" x2="17" y2="32" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="overlay">
          <div className="card" style={{direction: isAr ? 'rtl' : 'ltr'}}>

            {/* LOGO + LANG */}
            <div className="head-row">
              <div className="logo-area">
                <div className="logo-ic">FT</div>
                <div>
                  <div className="logo-t">FarmTrust</div>
                  <div className="logo-bar"/>
                  <div className="logo-sub">BY RSHD</div>
                </div>
              </div>
              <div className="lang-sw">
                {['fr','en','ar'].map(l => (
                  <button key={l} className={`lb${lang===l?' on':''}`} onClick={()=>setLang(l)}>
                    {l==='ar'?'ع':l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* AVATAR + WELCOME */}
            <div className="welcome-row">
              <div className="avatar-ring"><Avatar/></div>
              <div style={{flex:1}}>
                <div className="welcome-t">
                  <span className="wave">👋</span> {t.wt}
                </div>
                <div className="welcome-s">{t.ws}</div>
              </div>
            </div>

            {/* ANIMALS */}
            <div className="opt-grid">
              {animals.map(a => (
                <div key={a.n} className="opt-card" onClick={()=>navigate('/animals')}>
                  <div className="oi">{a.ic}</div>
                  <div className="on_">{t[a.n]}</div>
                  <div className="os">{t[a.s]}</div>
                </div>
              ))}
            </div>

            {/* LOGIN / REGISTER */}
            <div className="act-row">
              <button className="bg_" onClick={()=>navigate('/login')}>🔐 {t.bl}</button>
              <button className="bw_" onClick={()=>navigate('/register')}>✨ {t.br}</button>
            </div>

            {/* EXTRA OPTIONS */}
            <div className="extra-row">
              <div className="ex_" onClick={()=>navigate('/animals')}>
                <div className="ei_">📋</div>
                <div><div className="et_">{t.e1}</div><div className="es_">{t.e1s}</div></div>
              </div>
              <div className="ex_" onClick={()=>navigate('/animals')}>
                <div className="ei_">🎁</div>
                <div><div className="et_">{t.e2}</div><div className="es_">{t.e2s}</div></div>
              </div>
              <div className="ex_" onClick={()=>navigate('/chat')}>
                <div className="ei_">💬</div>
                <div><div className="et_">{t.e3}</div><div className="es_">{t.e3s}</div></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
