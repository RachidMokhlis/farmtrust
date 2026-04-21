import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <style>{`
        .scene { position: relative; width: 100%; height: 100vh; overflow: hidden; }
        .sky { position: absolute; inset: 0; background: linear-gradient(180deg, #FFB347 0%, #87CEEB 35%, #87CEEB 100%); }
        .sun { position: absolute; top: 40px; left: 50%; transform: translateX(-50%); width: 80px; height: 80px; background: #FFD700; border-radius: 50%; }
        .cloud { position: absolute; background: white; border-radius: 50px; opacity: 0.88; animation: floatCloud linear infinite; }
        .cloud::before, .cloud::after { content: ''; position: absolute; background: white; border-radius: 50%; }
        .c1 { width: 110px; height: 32px; top: 70px; animation-duration: 30s; animation-delay: 0s; }
        .c1::before { width: 55px; height: 55px; top: -22px; left: 16px; }
        .c1::after  { width: 38px; height: 38px; top: -15px; left: 52px; }
        .c2 { width: 85px; height: 26px; top: 120px; animation-duration: 38s; animation-delay: -14s; }
        .c2::before { width: 42px; height: 42px; top: -17px; left: 12px; }
        .c2::after  { width: 32px; height: 32px; top: -13px; left: 38px; }
        .c3 { width: 130px; height: 34px; top: 50px; animation-duration: 24s; animation-delay: -9s; }
        .c3::before { width: 58px; height: 58px; top: -24px; left: 20px; }
        .c3::after  { width: 44px; height: 44px; top: -18px; left: 58px; }
        @keyframes floatCloud { from { left: -160px; } to { left: 110%; } }
        .hill1 { position: absolute; bottom: 100px; left: -5%; width: 55%; height: 180px; background: #4CAF50; border-radius: 50% 50% 0 0; }
        .hill2 { position: absolute; bottom: 100px; right: -5%; width: 60%; height: 160px; background: #388E3C; border-radius: 50% 50% 0 0; }
        .hill3 { position: absolute; bottom: 100px; left: 25%; width: 55%; height: 140px; background: #66BB6A; border-radius: 50% 50% 0 0; }
        .ground { position: absolute; bottom: 0; width: 100%; height: 110px; background: #5D4037; }
        .grass  { position: absolute; bottom: 108px; width: 100%; height: 16px; background: #2E7D32; border-radius: 8px 8px 0 0; }
        .barn-wrap { position: absolute; bottom: 122px; right: 80px; }
        .barn-body { width: 88px; height: 70px; background: #8B2500; border: 2px solid #5D1A00; }
        .barn-roof  { width: 0; height: 0; border-left: 50px solid transparent; border-right: 50px solid transparent; border-bottom: 44px solid #B71C1C; position: absolute; top: -44px; left: -6px; }
        .barn-door  { width: 24px; height: 38px; background: #5D1A00; position: absolute; bottom: 0; left: 32px; border-radius: 12px 12px 0 0; }
        .barn-win   { width: 20px; height: 16px; background: #FFF9C4; position: absolute; top: 13px; left: 10px; border: 2px solid #5D1A00; }
        .tree-wrap { position: absolute; bottom: 122px; }
        .trunk { width: 14px; height: 32px; background: #795548; margin: 0 auto; border-radius: 2px; }
        .treetop  { width: 0; height: 0; border-left: 30px solid transparent; border-right: 30px solid transparent; border-bottom: 55px solid #2E7D32; position: absolute; top: -51px; left: -23px; }
        .treetop2 { width: 0; height: 0; border-left: 24px solid transparent; border-right: 24px solid transparent; border-bottom: 44px solid #388E3C; position: absolute; top: -68px; left: -17px; }
        .fence-wrap { position: absolute; bottom: 122px; left: 0; right: 0; height: 38px; }
        .fence-rail { position: absolute; left: 0; right: 0; height: 5px; background: #A1887F; border-radius: 2px; }
        .fence-posts { position: absolute; left: 0; right: 0; top: 0; display: flex; }
        .fpost { width: 8px; height: 38px; background: #8D6E63; margin: 0 22px; border-radius: 2px 2px 0 0; flex-shrink: 0; }
        .animal { position: absolute; bottom: 128px; }
        .cow     { animation: walkR 20s linear infinite; }
        .sheep   { animation: walkR 26s linear infinite; animation-delay: -11s; }
        .chicken { animation: walkL 15s linear infinite; animation-delay: -5s; right: -60px; }
        .rabbit  { animation: hopR 22s linear infinite; animation-delay: -16s; }
        @keyframes walkR { from { left: -90px; } to { left: 110%; } }
        @keyframes walkL { from { right: -60px; } to { right: 110%; } }
        @keyframes hopR {
          0%{left:-50px;bottom:128px} 3%{bottom:152px} 6%{bottom:128px}
          9%{bottom:150px} 12%{bottom:128px} 100%{left:110%;bottom:128px}
        }
        .birds-wrap { position: absolute; animation: flyB 22s linear infinite; }
        .bird { width: 15px; height: 6px; border-top: 2px solid #37474F; border-radius: 50% 50% 0 0; display: inline-block; margin: 0 4px; }
        @keyframes flyB { from{transform:translateX(-100px)} to{transform:translateX(1200px)} }
        .overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .card-center {
          background: rgba(255,255,255,0.93); border-radius: 24px; padding: 36px 48px;
          text-align: center; border: 2px solid rgba(255,255,255,0.7);
          max-width: 420px; width: 90%;
        }
        .ft-title { font-size: 46px; font-weight: 800; color: #1B5E20; letter-spacing: -2px; line-height: 1; font-family: system-ui; }
        .ft-bar   { width: 100%; height: 4px; background: #FFA726; border-radius: 2px; margin: 10px 0; }
        .ft-rshd  { font-size: 13px; color: #8D6E63; letter-spacing: 5px; font-family: system-ui; font-weight: 500; }
        .ft-tag   { font-size: 14px; color: #388E3C; font-weight: 600; margin-top: 6px; font-family: system-ui; }
        .ft-btns  { display: flex; gap: 12px; margin-top: 22px; justify-content: center; flex-wrap: wrap; }
        .btn-green { background: #2E7D32; color: white; border: none; border-radius: 14px; padding: 12px 28px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: system-ui; }
        .btn-green:hover { background: #1B5E20; }
        .btn-out { background: white; color: #2E7D32; border: 2.5px solid #2E7D32; border-radius: 14px; padding: 12px 28px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: system-ui; }
        .btn-out:hover { background: #f0fdf4; }
      `}</style>

      <div className="scene">
        <div className="sky" />
        <div className="sun" />
        <div className="birds-wrap" style={{ top: 85, left: '15%' }}>
          <div className="bird" /><div className="bird" /><div className="bird" />
        </div>
        <div className="birds-wrap" style={{ top: 105, left: '55%', animationDuration: '28s', animationDelay: '-10s' }}>
          <div className="bird" /><div className="bird" />
        </div>
        <div className="cloud c1" />
        <div className="cloud c2" />
        <div className="cloud c3" />
        <div className="hill1" /><div className="hill2" /><div className="hill3" />
        <div className="tree-wrap" style={{ right: 210 }}>
          <div className="treetop2" /><div className="treetop" /><div className="trunk" />
        </div>
        <div className="tree-wrap" style={{ left: 30, transform: 'scale(0.75)' }}>
          <div className="treetop2" /><div className="treetop" /><div className="trunk" />
        </div>
        <div className="barn-wrap">
          <div className="barn-roof" />
          <div className="barn-body">
            <div className="barn-win" />
            <div className="barn-door" />
          </div>
        </div>
        <div className="fence-wrap">
          <div className="fence-rail" style={{ top: 8 }} />
          <div className="fence-rail" style={{ top: 22 }} />
          <div className="fence-posts">
            {Array.from({ length: 22 }).map((_, i) => <div key={i} className="fpost" />)}
          </div>
        </div>
        <div className="ground" /><div className="grass" />

        {/* COW */}
        <div className="animal cow">
          <svg width="72" height="52" viewBox="0 0 72 52" style={{ overflow: 'visible' }}>
            <ellipse cx="33" cy="31" rx="23" ry="15" fill="#EFEBE9" stroke="#5D4037" strokeWidth="1"/>
            <circle cx="54" cy="22" r="12" fill="#EFEBE9" stroke="#5D4037" strokeWidth="1"/>
            <ellipse cx="29" cy="29" rx="8" ry="5" fill="#5D4037" opacity="0.25"/>
            <line x1="17" y1="45" x2="15" y2="52" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
            <line x1="26" y1="46" x2="24" y2="52" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
            <line x1="40" y1="46" x2="38" y2="52" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
            <line x1="49" y1="45" x2="47" y2="52" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
            <line x1="55" y1="11" x2="59" y2="5" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="51" y1="10" x2="47" y2="5" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="57" cy="22" r="2" fill="#333"/>
            <ellipse cx="29" cy="42" rx="7" ry="3" fill="#F8BBD0" opacity="0.65"/>
          </svg>
        </div>

        {/* SHEEP */}
        <div className="animal sheep" style={{ bottom: 130 }}>
          <svg width="62" height="46" viewBox="0 0 62 46" style={{ overflow: 'visible' }}>
            <ellipse cx="29" cy="29" rx="19" ry="13" fill="#F5F5F5" stroke="#9E9E9E" strokeWidth="0.8"/>
            <circle cx="21" cy="23" r="10" fill="#FAFAFA" stroke="#BDBDBD" strokeWidth="0.6"/>
            <circle cx="29" cy="20" r="10" fill="#FAFAFA" stroke="#BDBDBD" strokeWidth="0.6"/>
            <circle cx="37" cy="23" r="9" fill="#FAFAFA" stroke="#BDBDBD" strokeWidth="0.6"/>
            <circle cx="48" cy="27" r="9" fill="#EFEBE9" stroke="#9E9E9E" strokeWidth="0.8"/>
            <circle cx="50" cy="26" r="2" fill="#333"/>
            <line x1="19" y1="41" x2="17" y2="46" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round"/>
            <line x1="27" y1="42" x2="25" y2="46" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round"/>
            <line x1="35" y1="42" x2="33" y2="46" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* CHICKEN */}
        <div className="animal chicken" style={{ bottom: 124 }}>
          <svg width="42" height="40" viewBox="0 0 42 40" style={{ overflow: 'visible' }}>
            <ellipse cx="19" cy="26" rx="14" ry="11" fill="#FFF9C4" stroke="#F9A825" strokeWidth="0.8"/>
            <circle cx="30" cy="17" r="10" fill="#FFF9C4" stroke="#F9A825" strokeWidth="0.8"/>
            <path d="M28 10 Q30 6 32 10" fill="#E53935"/>
            <polygon points="35,18 39,19 35,20" fill="#F9A825"/>
            <circle cx="32" cy="16" r="2" fill="#212121"/>
            <ellipse cx="13" cy="25" rx="8" ry="5" fill="#F9A825" opacity="0.45"/>
            <line x1="17" y1="36" x2="15" y2="40" stroke="#F9A825" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="23" y1="36" x2="22" y2="40" stroke="#F9A825" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* RABBIT */}
        <div className="animal rabbit">
          <svg width="40" height="48" viewBox="0 0 40 48" style={{ overflow: 'visible' }}>
            <ellipse cx="20" cy="34" rx="13" ry="11" fill="#F8F8F8" stroke="#BDBDBD" strokeWidth="0.8"/>
            <circle cx="25" cy="24" r="9" fill="#F8F8F8" stroke="#BDBDBD" strokeWidth="0.8"/>
            <ellipse cx="22" cy="13" rx="3.5" ry="9" fill="#F8F8F8" stroke="#BDBDBD" strokeWidth="0.7"/>
            <ellipse cx="29" cy="12" rx="3.5" ry="9" fill="#F8F8F8" stroke="#BDBDBD" strokeWidth="0.7"/>
            <ellipse cx="22" cy="13" rx="1.8" ry="6" fill="#F48FB1"/>
            <ellipse cx="29" cy="12" rx="1.8" ry="6" fill="#F48FB1"/>
            <circle cx="27" cy="24" r="1.8" fill="#333"/>
            <circle cx="29" cy="26" r="1.3" fill="#F48FB1"/>
            <line x1="17" y1="44" x2="15" y2="48" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="23" y1="45" x2="22" y2="48" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="overlay">
          <div className="card-center">
            <div className="ft-title">FarmTrust</div>
            <div className="ft-bar" />
            <div className="ft-rshd">BY RSHD</div>
            <div className="ft-tag">Smart Farm Platform</div>
            <div className="ft-btns">
              <button className="btn-green" onClick={() => navigate('/animals')}>Browse Animals</button>
              <button className="btn-out" onClick={() => navigate('/login')}>Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
