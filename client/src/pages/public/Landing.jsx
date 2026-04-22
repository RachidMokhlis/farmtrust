import React, { useState, useEffect, useRef } from 'react';

/* ══════════════════════════════════════════
   TRANSLATIONS
══════════════════════════════════════════ */
const T = {
  fr: {
    nav_animals:'Animaux', nav_promo:'Promotions', nav_comments:'Avis', nav_login:'Connexion', nav_register:"S'inscrire",
    hero_badge:'🌿 Marketplace Agricole #1 au Maroc',
    hero_title:'Achetez & vendez vos',
    hero_title2:"animaux d'élevage",
    hero_sub:'FarmTrust connecte les éleveurs marocains. Vaches, moutons, chèvres, poulets, lapins — trouvez l\'animal parfait près de chez vous.',
    hero_cta1:'Voir les animaux', hero_cta2:'Vendre un animal',
    stats_farmers:'Éleveurs', stats_animals:'Animaux gérés', stats_sold:'Ventes réussies', stats_rating:'Note moyenne',
    animals_title:'Animaux disponibles', animals_sub:'Parcourez notre catalogue et trouvez votre prochain animal',
    cow:'Vache', sheep:'Mouton', goat:'Chèvre', chicken:'Poulet', rabbit:'Lapin',
    cow_d:'Laitière / Viande', sheep_d:'Viande / Laine', goat_d:'Lait / Viande', chicken_d:'Œufs / Chair', rabbit_d:'Viande / Fourrure',
    available:'dispo', view:'Voir annonces',
    promo_title:'Offres du moment', promo_sub:'Promotions limitées sur une sélection d\'animaux',
    flash:'Offre flash',
    comments_title:'Avis de nos éleveurs', comments_sub:'Retours authentiques de notre communauté',
    comment_placeholder:'Partagez votre expérience avec FarmTrust...',
    comment_btn:'Publier mon avis',
    comment_name:'Votre prénom',
    faq_title:'Questions fréquentes',
    faq1_q:'Comment acheter un animal ?',
    faq1_a:'Parcourez le catalogue, choisissez un animal, contactez le vendeur directement via notre messagerie sécurisée.',
    faq2_q:'Est-ce que FarmTrust est gratuit ?',
    faq2_a:"L'inscription et la navigation sont gratuites. Une petite commission est prise sur les ventes réalisées.",
    faq3_q:'Comment signaler un problème ?',
    faq3_a:'Chaque annonce a un bouton "Signaler". Notre équipe répond sous 24h.',
    cta_title:'Rejoignez notre communauté', cta_sub:'20 éleveurs nous font déjà confiance — et vous ?',
    cta_btn:'Créer mon compte gratuit',
    footer:'© 2026 FarmTrust by RSHD · Maroc',
    welcome:'Bienvenue sur FarmTrust !', welcome_sub:'Votre marketplace agricole marocaine 🌿',
    timer_h:'h', timer_m:'min', timer_s:'sec',
    mad:'MAD',
    your_rating:'Votre note',
  },
  en: {
    nav_animals:'Animals', nav_promo:'Promotions', nav_comments:'Reviews', nav_login:'Login', nav_register:'Register',
    hero_badge:'🌿 #1 Agricultural Marketplace in Morocco',
    hero_title:'Buy & sell your',
    hero_title2:'livestock animals',
    hero_sub:'FarmTrust connects Moroccan farmers. Cows, sheep, goats, chickens, rabbits — find the perfect animal near you.',
    hero_cta1:'Browse Animals', hero_cta2:'Sell an Animal',
    stats_farmers:'Farmers', stats_animals:'Animals Managed', stats_sold:'Successful Sales', stats_rating:'Avg Rating',
    animals_title:'Available Animals', animals_sub:'Browse our catalog and find your next animal',
    cow:'Cow', sheep:'Sheep', goat:'Goat', chicken:'Chicken', rabbit:'Rabbit',
    cow_d:'Dairy / Meat', sheep_d:'Meat / Wool', goat_d:'Milk / Meat', chicken_d:'Eggs / Meat', rabbit_d:'Meat / Fur',
    available:'avail.', view:'View listings',
    promo_title:'Current Offers', promo_sub:'Limited promotions on selected animals',
    flash:'Flash Deal',
    comments_title:"Our Farmers' Reviews", comments_sub:'Authentic feedback from our community',
    comment_placeholder:'Share your experience with FarmTrust...',
    comment_btn:'Post my review',
    comment_name:'Your name',
    faq_title:'Frequently Asked Questions',
    faq1_q:'How to buy an animal?',
    faq1_a:'Browse the catalog, choose an animal, contact the seller directly via our secure messaging.',
    faq2_q:'Is FarmTrust free?',
    faq2_a:'Registration and browsing are free. A small commission is taken on completed sales.',
    faq3_q:'How to report an issue?',
    faq3_a:'Each listing has a "Report" button. Our team responds within 24h.',
    cta_title:'Join our community', cta_sub:'20 farmers already trust us — what about you?',
    cta_btn:'Create my free account',
    footer:'© 2026 FarmTrust by RSHD · Morocco',
    welcome:'Welcome to FarmTrust!', welcome_sub:'Your Moroccan agricultural marketplace 🌿',
    timer_h:'h', timer_m:'min', timer_s:'sec',
    mad:'MAD',
    your_rating:'Your rating',
  },
  ar: {
    nav_animals:'الحيوانات', nav_promo:'العروض', nav_comments:'التعليقات', nav_login:'دخول', nav_register:'تسجيل',
    hero_badge:'🌿 سوق الزراعة الأول في المغرب',
    hero_title:'اشترِ وبِع',
    hero_title2:'حيوانات المزرعة',
    hero_sub:'FarmTrust يربط المربين المغاربة. أبقار، أغنام، ماعز، دجاج، أرانب — ابحث عن الحيوان المناسب بالقرب منك.',
    hero_cta1:'تصفح الحيوانات', hero_cta2:'بيع حيوان',
    stats_farmers:'مربٍّ', stats_animals:'حيوان مُدار', stats_sold:'صفقة ناجحة', stats_rating:'متوسط التقييم',
    animals_title:'الحيوانات المتاحة', animals_sub:'تصفح كتالوجنا وابحث عن حيوانك القادم',
    cow:'بقرة', sheep:'خروف', goat:'ماعز', chicken:'دجاجة', rabbit:'أرنب',
    cow_d:'حلوب / لحم', sheep_d:'لحم / صوف', goat_d:'حليب / لحم', chicken_d:'بيض / لحم', rabbit_d:'لحم / فرو',
    available:'متاح', view:'عرض الإعلانات',
    promo_title:'عروض اللحظة', promo_sub:'تخفيضات محدودة على مجموعة مختارة من الحيوانات',
    flash:'عرض سريع',
    comments_title:'آراء مربينا', comments_sub:'تقييمات حقيقية من مجتمعنا',
    comment_placeholder:'شارك تجربتك مع FarmTrust...',
    comment_btn:'نشر تعليقي',
    comment_name:'اسمك',
    faq_title:'أسئلة متكررة',
    faq1_q:'كيف أشتري حيواناً؟',
    faq1_a:'تصفح الكتالوج، اختر حيواناً، تواصل مع البائع مباشرة عبر رسائلنا الآمنة.',
    faq2_q:'هل FarmTrust مجاني؟',
    faq2_a:'التسجيل والتصفح مجانيان. يُؤخذ عمولة صغيرة على الصفقات المكتملة.',
    faq3_q:'كيف أبلّغ عن مشكلة؟',
    faq3_a:'كل إعلان يحتوي على زر الإبلاغ. يرد فريقنا خلال 24 ساعة.',
    cta_title:'انضم إلى مجتمعنا', cta_sub:'20 مربياً يثقون بنا بالفعل — وأنت؟',
    cta_btn:'إنشاء حساب مجاني',
    footer:'.© 2026 FarmTrust by RSHD · المغرب',
    welcome:'!مرحباً بكم في FarmTrust', welcome_sub:'سوقكم الزراعي المغربي 🌿',
    timer_h:'س', timer_m:'د', timer_s:'ث',
    mad:'درهم',
    your_rating:'تقييمك',
  },
};

const INIT_COMMENTS = [
  { id:1, name:'Ahmed Benali', loc:'Meknès', stars:5, text:'اشتريت بقرة من FarmTrust، وصلت بصحة ممتازة والبائع كان صادق في الوصف. شكراً!', time:'منذ يومين', av:'A' },
  { id:2, name:'Fatima Zahra', loc:'Fès', stars:5, text:"Excellente plateforme ! J'ai vendu 3 moutons en moins d'une semaine. Très recommandé.", time:'Il y a 4 jours', av:'F' },
  { id:3, name:'Karim M.', loc:'Khouribga', stars:4, text:'Great marketplace. Found quality rabbits at good prices. Fast communication with sellers.', time:'1 week ago', av:'K' },
  { id:4, name:'Youssef El Idrissi', loc:'Marrakech', stars:5, text:'ماركتبلاص زوينة بزاف، لقيت الغنم اللي كنبغي بثمن معقول. غادي نرجع دايما!', time:'منذ أسبوع', av:'Y' },
  { id:5, name:'Nadia Tazi', loc:'Casablanca', stars:4, text:'Très bonne expérience. Les photos des animaux sont fidèles à la réalité.', time:'Il y a 10 jours', av:'N' },
];

/* ─── SVG LOGO ─── */
function LogoSVG() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#22c55e"/><stop offset="100%" stopColor="#14532d"/></linearGradient></defs>
      <rect width="38" height="38" rx="11" fill="url(#lg)"/>
      <text x="19" y="25" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Georgia,serif">FT</text>
    </svg>
  );
}

/* ─── AVATAR SVG ─── */
function AvatarSVG({ size=64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <defs>
        <radialGradient id="sk"><stop offset="0%" stopColor="#d4a574"/><stop offset="100%" stopColor="#b8895a"/></radialGradient>
        <radialGradient id="dj"><stop offset="0%" stopColor="#16a34a"/><stop offset="100%" stopColor="#14532d"/></radialGradient>
      </defs>
      <rect width="80" height="80" rx="40" fill="#bfdbfe"/>
      <ellipse cx="40" cy="100" rx="40" ry="28" fill="url(#dj)"/>
      <path d="M36 65 Q40 72 44 65" fill="none" stroke="#166534" strokeWidth="1.5"/>
      <rect x="38.5" y="62" width="3" height="14" rx="1" fill="#166534" opacity=".5"/>
      <rect x="33" y="50" width="14" height="16" rx="6" fill="url(#sk)"/>
      <ellipse cx="40" cy="38" rx="18" ry="19" fill="url(#sk)"/>
      <ellipse cx="40" cy="21" rx="18" ry="11" fill="#4a2c17"/>
      <path d="M22 31 Q25 18 40 20 Q55 18 58 31" fill="#4a2c17"/>
      <ellipse cx="22" cy="40" rx="3.5" ry="4.5" fill="url(#sk)"/>
      <ellipse cx="58" cy="40" rx="3.5" ry="4.5" fill="url(#sk)"/>
      <rect x="23" y="33" width="14" height="10" rx="4" fill="#111" opacity=".88"/>
      <rect x="43" y="33" width="14" height="10" rx="4" fill="#111" opacity=".88"/>
      <line x1="37" y1="38" x2="43" y2="38" stroke="#555" strokeWidth="1.5"/>
      <line x1="23" y1="37" x2="19" y2="36" stroke="#333" strokeWidth="1.5"/>
      <line x1="57" y1="37" x2="61" y2="36" stroke="#333" strokeWidth="1.5"/>
      <ellipse cx="40" cy="46" rx="2.5" ry="2" fill="#c49a6c" opacity=".6"/>
      <path d="M32 51 Q40 58 48 51" fill="none" stroke="#8b5e3a" strokeWidth="2" strokeLinecap="round"/>
      <path d="M34 52 Q40 57 46 52" fill="white" opacity=".9"/>
    </svg>
  );
}

/* ─── FARM SCENE ─── */
function FarmScene() {
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
      <style>{`
        @keyframes sunR{from{transform:translateX(-50%) translateY(40px);opacity:.4}to{transform:translateX(-50%) translateY(0);opacity:1}}
        @keyframes cld1{from{left:-210px}to{left:110vw}}
        @keyframes cld2{from{left:-160px}to{left:110vw}}
        @keyframes wCow{from{left:-90px}to{left:110%}}
        @keyframes wSheep{from{left:-70px}to{left:110%}}
        @keyframes wChick{from{left:-50px}to{left:110%}}
        @keyframes bFly{from{right:-80px}to{right:110%}}
        @keyframes bnc{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        .cs{position:absolute;background:rgba(255,255,255,.86);border-radius:50px}
        .cs::before,.cs::after{content:'';position:absolute;background:rgba(255,255,255,.86);border-radius:50%}
        .c1{width:130px;height:32px;top:12%;animation:cld1 36s linear infinite}
        .c1::before{width:62px;height:62px;top:-25px;left:17px}.c1::after{width:45px;height:45px;top:-19px;left:62px}
        .c2{width:96px;height:26px;top:22%;animation:cld2 50s linear infinite;animation-delay:-23s}
        .c2::before{width:46px;height:46px;top:-19px;left:13px}.c2::after{width:33px;height:33px;top:-13px;left:45px}
        .c3{width:72px;height:20px;top:8%;animation:cld1 64s linear infinite;animation-delay:-40s;opacity:.6}
        .c3::before{width:36px;height:36px;top:-15px;left:10px}.c3::after{width:26px;height:26px;top:-10px;left:34px}
        .aCow{position:absolute;bottom:14.5%;animation:wCow 24s linear infinite}
        .aSheep{position:absolute;bottom:14.5%;animation:wSheep 31s linear infinite;animation-delay:-13s}
        .aChick{position:absolute;bottom:14.5%;animation:wChick 18s linear infinite;animation-delay:-7s}
        .aBird{position:absolute;top:20%;animation:bFly 25s linear infinite}
        .aBird2{position:absolute;top:14%;animation:bFly 35s linear infinite;animation-delay:-15s;opacity:.65}
      `}</style>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#0284c7 0%,#38bdf8 28%,#7dd3fc 52%,#bae6fd 70%,#d1fae5 100%)'}}/>
      <div style={{position:'absolute',top:'7%',left:'50%',width:72,height:72,background:'radial-gradient(circle,#fef08a,#facc15)',borderRadius:'50%',boxShadow:'0 0 50px #fbbf2488,0 0 100px #f59e0b44',animation:'sunR 2.2s ease-out forwards'}}/>
      <div className="cs c1"/><div className="cs c2"/><div className="cs c3"/>
      <div style={{position:'absolute',bottom:'12%',left:'-4%',width:'52%',height:'22%',background:'linear-gradient(180deg,#4ade80,#16a34a)',borderRadius:'50% 50% 0 0'}}/>
      <div style={{position:'absolute',bottom:'12%',right:'-4%',width:'56%',height:'20%',background:'linear-gradient(180deg,#22c55e,#15803d)',borderRadius:'50% 50% 0 0'}}/>
      <div style={{position:'absolute',bottom:'12%',left:'20%',width:'62%',height:'17%',background:'linear-gradient(180deg,#86efac,#4ade80)',borderRadius:'50% 50% 0 0'}}/>
      <div style={{position:'absolute',bottom:'14.5%',right:'7%'}}>
        <div style={{width:0,height:0,borderLeft:'48px solid transparent',borderRight:'48px solid transparent',borderBottom:'42px solid #b91c1c',position:'absolute',top:-41,left:-7}}/>
        <div style={{width:82,height:62,background:'#991b1b',border:'2px solid #7f1d1d'}}/>
        <div style={{position:'absolute',bottom:0,left:30,width:22,height:36,background:'#7f1d1d',borderRadius:'11px 11px 0 0'}}/>
        <div style={{position:'absolute',top:10,left:8,width:18,height:14,background:'#fef9c3',border:'2px solid #7f1d1d'}}/>
      </div>
      {[{r:195,sc:1},{l:28,sc:.72},{l:132,sc:.82}].map((tr,i)=>(
        <div key={i} style={{position:'absolute',bottom:'14.5%',right:tr.r,left:tr.l,transform:`scale(${tr.sc})`,transformOrigin:'bottom center'}}>
          <div style={{width:0,height:0,borderLeft:'30px solid transparent',borderRight:'30px solid transparent',borderBottom:'55px solid #14532d',position:'absolute',top:-50,left:-19}}/>
          <div style={{width:0,height:0,borderLeft:'23px solid transparent',borderRight:'23px solid transparent',borderBottom:'42px solid #166534',position:'absolute',top:-66,left:-12}}/>
          <div style={{width:12,height:32,background:'#92400e',borderRadius:3,margin:'0 auto'}}/>
        </div>
      ))}
      <div style={{position:'absolute',bottom:'13%',left:0,right:0,height:40}}>
        <div style={{position:'absolute',top:9,left:0,right:0,height:4,background:'#a16207',borderRadius:2}}/>
        <div style={{position:'absolute',top:22,left:0,right:0,height:4,background:'#92400e',borderRadius:2}}/>
        {Array.from({length:32}).map((_,i)=>(<div key={i} style={{position:'absolute',left:`${i*3.2}%`,top:0,width:7,height:40,background:'#78350f',borderRadius:'2px 2px 0 0'}}/>))}
      </div>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'13%',background:'linear-gradient(180deg,#15803d,#14532d)'}}/>
      <div style={{position:'absolute',bottom:'12%',left:0,right:0,height:10,background:'#166534',borderRadius:'6px 6px 0 0'}}/>
      <div className="aCow">
        <svg width="58" height="40" viewBox="0 0 58 40">
          <ellipse cx="27" cy="25" rx="17" ry="10" fill="#fafaf9" stroke="#78716c" strokeWidth=".9"/>
          <circle cx="42" cy="15" r="10" fill="#fafaf9" stroke="#78716c" strokeWidth=".9"/>
          <ellipse cx="26" cy="23" rx="7" ry="4" fill="#e7e5e4" opacity=".7"/>
          {[[15,35,13,40],[23,36,21,40],[33,36,31,40],[41,35,39,40]].map((l,i)=><line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#78716c" strokeWidth="2.2" strokeLinecap="round"/>)}
          <circle cx="44" cy="14" r="1.8" fill="#1c1917"/>
          <path d="M42 9 Q40 6 37 8" fill="none" stroke="#78716c" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M42 9 Q44 6 47 8" fill="none" stroke="#78716c" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="aSheep">
        <svg width="50" height="38" viewBox="0 0 50 38">
          {[{cx:16,cy:18,r:8},{cx:24,cy:14,r:8.5},{cx:32,cy:16,r:8}].map((c,i)=><circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill="#f9fafb" stroke="#d1d5db" strokeWidth=".6"/>)}
          <ellipse cx="23" cy="25" rx="14" ry="9" fill="#f3f4f6" stroke="#9ca3af" strokeWidth=".7"/>
          <circle cx="38" cy="20" r="7.5" fill="#e5e7eb" stroke="#9ca3af" strokeWidth=".7"/>
          <circle cx="40" cy="19" r="1.5" fill="#1c1917"/>
          {[[13,33,11,38],[21,34,19,38],[29,34,27,38]].map((l,i)=><line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>)}
        </svg>
      </div>
      <div className="aChick">
        <svg width="30" height="32" viewBox="0 0 30 32">
          <ellipse cx="13" cy="21" rx="8" ry="7.5" fill="#fef3c7" stroke="#d97706" strokeWidth=".8"/>
          <circle cx="18" cy="12" r="6.5" fill="#fef9c3" stroke="#d97706" strokeWidth=".8"/>
          <circle cx="20" cy="11" r="1.4" fill="#1c1917"/>
          <path d="M24 12 L28 11 L24 13" fill="#f97316"/>
          <path d="M16 6 Q17 3 18 5.5" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/>
          {[[7,28,5,32],[14,29,12,32]].map((l,i)=><line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>)}
        </svg>
      </div>
      <div className="aBird"><svg width="32" height="14" viewBox="0 0 32 14"><path d="M0 7 Q8 0 16 7 Q24 0 32 7" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round"/></svg></div>
      <div className="aBird2"><svg width="22" height="10" viewBox="0 0 22 10"><path d="M0 5 Q5.5 0 11 5 Q16.5 0 22 5" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
    </div>
  );
}

/* ─── COUNTER ─── */
function Counter({ target, suffix='' }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect();
      const step = target / 55; let cur = 0;
      const ti = setInterval(() => { cur += step; if (cur >= target) { setV(target); clearInterval(ti); } else setV(Math.floor(cur)); }, 16);
    }, {threshold:.3});
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

/* ─── COUNTDOWN ─── */
function useCountdown(init) {
  const [s, setS] = useState(init);
  useEffect(() => { const id = setInterval(() => setS(x => x > 0 ? x-1 : init), 1000); return () => clearInterval(id); }, [init]);
  return { h: Math.floor(s/3600), m: Math.floor((s%3600)/60), s: s%60 };
}

/* ─── STARS ─── */
function Stars({ val, setVal, interactive=false, size=16 }) {
  return (
    <div style={{display:'flex',gap:2}}>
      {[1,2,3,4,5].map(i=>(
        <span key={i} onClick={interactive ? ()=>setVal(i) : undefined}
          style={{fontSize:size,cursor:interactive?'pointer':'default',color:i<=val?'#f59e0b':'#d1d5db',display:'inline-block',transition:'transform .1s'}}
          onMouseOver={interactive ? e=>e.target.style.transform='scale(1.3)' : undefined}
          onMouseOut={interactive ? e=>e.target.style.transform='scale(1)' : undefined}>★</span>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function Landing() {
  const [lang, setLang] = useState('fr');
  const [dark, setDark] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState(INIT_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  const [newStars, setNewStars] = useState(5);
  const [commentErr, setCommentErr] = useState('');
  const [commentOk, setCommentOk] = useState(false);
  const timer = useCountdown(4*3600 + 27*60 + 43);
  const t = T[lang];
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  useEffect(() => { const id = setTimeout(() => setLoading(false), 1300); return () => clearTimeout(id); }, []);

  const bg = dark ? '#0f172a' : '#f8fafc';
  const cardBg = dark ? '#1e293b' : '#ffffff';
  const text1 = dark ? '#f1f5f9' : '#111827';
  const text2 = dark ? '#94a3b8' : '#6b7280';
  const border = dark ? '#334155' : '#e5e7eb';
  const sectionBg = dark ? '#111827' : '#f0fdf4';

  const animals = [
    { icon:'🐄', key:'cow',     count:47,  minPrice:2800, accent:'#16a34a', lightBg:'#dcfce7', darkBg:'rgba(22,163,74,.12)' },
    { icon:'🐑', key:'sheep',   count:83,  minPrice:950,  accent:'#ca8a04', lightBg:'#fef9c3', darkBg:'rgba(202,138,4,.12)' },
    { icon:'🐐', key:'goat',    count:35,  minPrice:1200, accent:'#dc2626', lightBg:'#fee2e2', darkBg:'rgba(220,38,38,.12)' },
    { icon:'🐔', key:'chicken', count:214, minPrice:85,   accent:'#d97706', lightBg:'#fef3c7', darkBg:'rgba(217,119,6,.12)' },
    { icon:'🐇', key:'rabbit',  count:68,  minPrice:120,  accent:'#9333ea', lightBg:'#f3e8ff', darkBg:'rgba(147,51,234,.12)' },
  ];

  const promos = [
    { icon:'🐄', title: lang==='ar'?'أبقار عيد الأضحى':lang==='fr'?'Vaches Aid Al-Adha':'Aid Al-Adha Cows',
      desc: lang==='ar'?'أبقار مختارة بأسعار تنافسية':lang==='fr'?'Sélection de vaches à prix compétitifs':'Selected cows at competitive prices',
      old:'3500', price:'2800', pct:'-20%', gradient:'linear-gradient(135deg,#166534,#22c55e)' },
    { icon:'🐑', title: lang==='ar'?'أغنام الموسم':lang==='fr'?'Moutons de saison':'Seasonal Sheep',
      desc: lang==='ar'?'خروف سمين للبيع المباشر':lang==='fr'?'Mouton engraissé — vente directe':'Fattened sheep — direct sale',
      old:'1400', price:'1100', pct:'-21%', gradient:'linear-gradient(135deg,#92400e,#f59e0b)' },
    { icon:'🐔', title: lang==='ar'?'دجاج إنتاج البيض':lang==='fr'?'Poulets pondeuses':'Laying Chickens',
      desc: lang==='ar'?'دجاج بياض عالي الإنتاجية':lang==='fr'?'Poules à haute productivité':'High-productivity laying hens',
      old:'120', price:'85', pct:'-29%', gradient:'linear-gradient(135deg,#7c3aed,#a855f7)' },
  ];

  function submitComment() {
    setCommentErr('');
    if (!newName.trim()) { setCommentErr(lang==='ar'?'الرجاء كتابة اسمك':lang==='fr'?'Veuillez saisir votre prénom':'Please enter your name'); return; }
    if (newComment.trim().length < 10) { setCommentErr(lang==='ar'?'التعليق قصير جداً (10 أحرف على الأقل)':lang==='fr'?'Commentaire trop court (10 caractères min)':'Comment too short (10 chars min)'); return; }
    const c = { id:Date.now(), name:newName.trim(), loc:'Maroc', stars:newStars, text:newComment.trim(), time:lang==='ar'?'الآن':lang==='fr'?"À l'instant":'Just now', av:newName.trim()[0].toUpperCase() };
    setComments(prev => [c, ...prev]);
    setNewComment(''); setNewName(''); setNewStars(5);
    setCommentOk(true);
    setTimeout(() => setCommentOk(false), 3500);
  }

  /* LOADING */
  if (loading) return (
    <div style={{position:'fixed',inset:0,background:'linear-gradient(135deg,#052e16,#14532d)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <style>{`@keyframes sp{to{transform:rotate(360deg)}}@keyframes pu{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.88)}}`}</style>
      <div style={{fontSize:52,animation:'pu 1s infinite',marginBottom:18}}>🌾</div>
      <div style={{fontFamily:'Georgia,serif',fontSize:30,fontWeight:900,color:'white',letterSpacing:'-1px'}}>FarmTrust</div>
      <div style={{fontSize:10,color:'#4ade80',letterSpacing:'5px',marginTop:5,fontWeight:700}}>BY RSHD</div>
      <div style={{marginTop:30,width:44,height:44,border:'3px solid rgba(255,255,255,.15)',borderTop:'3px solid #4ade80',borderRadius:'50%',animation:'sp .7s linear infinite'}}/>
    </div>
  );

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:bg,color:text1,direction:dir,minHeight:'100vh'}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#22c55e;border-radius:3px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes wv{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}
        @keyframes bnc{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes shim{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes glw{0%,100%{box-shadow:0 0 18px rgba(34,197,94,.5)}50%{box-shadow:0 0 36px rgba(34,197,94,.9)}}
        .fu{animation:fadeUp .55s ease both}
        .ac{transition:all .28s cubic-bezier(.34,1.56,.64,1)}
        .ac:hover{transform:translateY(-10px) scale(1.03)!important;box-shadow:0 24px 48px rgba(0,0,0,.18)!important}
        .pc{transition:all .22s ease}
        .pc:hover{transform:translateY(-5px)!important;filter:brightness(1.07)}
        .btn-g{background:linear-gradient(135deg,#22c55e,#15803d);color:white;border:none;padding:13px 26px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .2s;text-decoration:none}
        .btn-g:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(34,197,94,.45)}
        .btn-o{background:transparent;border:2.5px solid #22c55e;color:#22c55e;padding:11px 24px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .2s}
        .btn-o:hover{background:#22c55e;color:white;transform:translateY(-2px)}
        .nav-a{color:${text2};text-decoration:none;font-size:14px;font-weight:600;padding:6px 13px;border-radius:8px;transition:all .15s;cursor:pointer;display:inline-block}
        .nav-a:hover{color:#22c55e;background:${dark?'rgba(34,197,94,.12)':'#f0fdf4'}}
        .inp{background:${cardBg};border:1.5px solid ${border};color:${text1};border-radius:10px;padding:11px 14px;font-size:14px;width:100%;outline:none;transition:border .2s;font-family:inherit}
        .inp:focus{border-color:#22c55e}
        .txa{background:${cardBg};border:1.5px solid ${border};color:${text1};border-radius:10px;padding:12px 14px;font-size:14px;width:100%;outline:none;transition:border .2s;resize:vertical;font-family:inherit;min-height:90px}
        .txa:focus{border-color:#22c55e}
        .faq-i{border:1.5px solid ${border};border-radius:14px;overflow:hidden;transition:border .2s;margin-bottom:12px}
        .faq-i:hover{border-color:#22c55e}
        .chat-btn{position:fixed;bottom:24px;${isAr?'left':'right'}:24px;z-index:999;background:linear-gradient(135deg,#22c55e,#15803d);width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;animation:glw 2.5s infinite;transition:transform .2s;box-shadow:0 4px 18px rgba(34,197,94,.55)}
        .chat-btn:hover{transform:scale(1.12)}
        .chat-win{position:fixed;bottom:92px;${isAr?'left':'right'}:20px;z-index:999;width:308px;background:${cardBg};border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.22);border:1.5px solid ${border};overflow:hidden;animation:fadeUp .28s ease}
        @media(max-width:680px){
          .ag{grid-template-columns:repeat(2,1fr)!important}
          .pg{grid-template-columns:1fr!important}
          .sg{grid-template-columns:repeat(2,1fr)!important}
          .cg{grid-template-columns:1fr!important}
          .hf{flex-direction:column!important}
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:dark?'rgba(15,23,42,.94)':'rgba(255,255,255,.94)',backdropFilter:'blur(18px)',borderBottom:`1px solid ${border}`,padding:'0 18px',height:62,display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
        <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
          <LogoSVG/>
          <div>
            <div style={{fontFamily:'Georgia,serif',fontSize:17,fontWeight:900,color:'#16a34a',lineHeight:1}}>FarmTrust</div>
            <div style={{fontSize:8,color:text2,letterSpacing:'3px',fontWeight:700}}>BY RSHD</div>
          </div>
        </div>
        <div style={{display:'flex',gap:2}}>
          {[{l:t.nav_animals,h:'#animals'},{l:t.nav_promo,h:'#promo'},{l:t.nav_comments,h:'#comments'}].map(n=>(
            <a key={n.l} href={n.h} className="nav-a">{n.l}</a>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:7,flexShrink:0}}>
          <div style={{display:'flex',background:dark?'#0f172a':'#f1f5f9',borderRadius:10,padding:3,gap:2}}>
            {['fr','en','ar'].map(l=>(
              <button key={l} onClick={()=>setLang(l)} style={{border:'none',background:lang===l?'#16a34a':'transparent',color:lang===l?'white':text2,padding:'4px 9px',borderRadius:7,fontSize:11,fontWeight:700,cursor:'pointer',transition:'all .15s'}}>
                {l==='ar'?'ع':l.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={()=>setDark(!dark)} style={{background:'transparent',border:'none',fontSize:17,cursor:'pointer',padding:6,borderRadius:8}}>{dark?'☀️':'🌙'}</button>
          <div style={{position:'relative'}}>
            <button style={{background:'transparent',border:'none',fontSize:17,cursor:'pointer',padding:6}}>🔔</button>
            <span style={{position:'absolute',top:5,right:5,width:7,height:7,background:'#ef4444',borderRadius:'50%',border:`2px solid ${dark?'#0f172a':'white'}`}}/>
          </div>
          <button className="btn-g" style={{padding:'8px 14px',fontSize:12}}>{t.nav_register}</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{position:'relative',height:'90vh',minHeight:520,overflow:'hidden'}}>
        <FarmScene/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 32%,rgba(0,0,0,.64) 100%)',display:'flex',alignItems:'flex-end',padding:'0 0 56px'}}>
          <div style={{maxWidth:1100,margin:'0 auto',padding:'0 22px',width:'100%',animation:'fadeUp .7s ease both'}}>
            {/* welcome */}
            <div style={{display:'inline-flex',alignItems:'center',gap:12,background:'rgba(255,255,255,.13)',backdropFilter:'blur(14px)',borderRadius:18,padding:'11px 17px',marginBottom:20,border:'1.5px solid rgba(255,255,255,.26)'}}>
              <div style={{width:48,height:48,borderRadius:'50%',border:'2.5px solid #4ade80',overflow:'hidden',flexShrink:0}}><AvatarSVG size={48}/></div>
              <div>
                <div style={{fontWeight:800,color:'white',fontSize:14}}><span style={{display:'inline-block',animation:'wv .9s infinite',transformOrigin:'70% 70%'}}>👋</span> {t.welcome}</div>
                <div style={{fontSize:11,color:'#bbf7d0'}}>{t.welcome_sub}</div>
              </div>
            </div>
            <div style={{display:'inline-block',background:'rgba(34,197,94,.18)',backdropFilter:'blur(8px)',border:'1px solid rgba(34,197,94,.45)',borderRadius:24,padding:'5px 14px',fontSize:12,fontWeight:700,color:'#bbf7d0',marginBottom:13,marginLeft: isAr?0:0}}>
              {t.hero_badge}
            </div>
            <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(28px,5vw,58px)',fontWeight:900,color:'white',lineHeight:1.12,marginBottom:13,textShadow:'0 2px 24px rgba(0,0,0,.35)'}}>
              {t.hero_title}<br/>
              <span style={{color:'#4ade80',textShadow:'0 0 40px rgba(74,222,128,.4)'}}>{t.hero_title2}</span>
            </h1>
            <p style={{fontSize:'clamp(13px,2vw,17px)',color:'rgba(255,255,255,.88)',maxWidth:530,lineHeight:1.7,marginBottom:28}}>{t.hero_sub}</p>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}} className="hf">
              <a href="#animals" className="btn-g">🐄 {t.hero_cta1}</a>
              <button className="btn-o" style={{borderColor:'white',color:'white'}}>🏷️ {t.hero_cta2}</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{background:'linear-gradient(135deg,#052e16,#166534)',padding:'42px 22px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20,textAlign:'center'}} className="sg">
          {[{i:'👨‍🌾',v:20,s:'',l:t.stats_farmers},{i:'🐄',v:247,s:'+',l:t.stats_animals},{i:'🤝',v:138,s:'+',l:t.stats_sold},{i:'⭐',v:4.8,s:'',l:t.stats_rating,fl:true}].map((st,i)=>(
            <div key={i} style={{animation:`fadeUp .5s ${i*.1}s ease both`}}>
              <div style={{fontSize:28,marginBottom:6}}>{st.i}</div>
              <div style={{fontFamily:'Georgia,serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:900,color:'#4ade80'}}>
                {st.fl ? st.v : <Counter target={st.v} suffix={st.s}/>}
              </div>
              <div style={{fontSize:12,color:'#86efac',fontWeight:600,marginTop:3}}>{st.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ANIMALS ── */}
      <section id="animals" style={{padding:'72px 22px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:42}}>
          <span style={{display:'inline-block',background:dark?'rgba(34,197,94,.12)':'#f0fdf4',color:'#16a34a',padding:'5px 15px',borderRadius:24,fontSize:12,fontWeight:700,border:'1px solid #bbf7d0',marginBottom:12}}>🐾 {t.animals_title}</span>
          <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(22px,4vw,38px)',fontWeight:900,marginBottom:10}}>{t.animals_title}</h2>
          <p style={{color:text2,fontSize:15,maxWidth:460,margin:'0 auto'}}>{t.animals_sub}</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:18}} className="ag">
          {animals.map((a,i)=>(
            <div key={a.key} className="ac fu" style={{animationDelay:`${i*.07}s`,background:dark?a.darkBg:a.lightBg,border:`2px solid ${dark?border:'transparent'}`,borderRadius:22,padding:'24px 14px',textAlign:'center',cursor:'pointer',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${a.accent},transparent)`}}/>
              <div style={{position:'absolute',top:11,right:11,background:a.accent,color:'white',fontSize:9,fontWeight:800,padding:'2px 7px',borderRadius:10}}>{a.count} {t.available}</div>
              <div style={{fontSize:44,marginBottom:11,filter:'drop-shadow(0 4px 10px rgba(0,0,0,.1))',animation:`bnc ${2.4+i*.28}s ease-in-out infinite`}}>{a.icon}</div>
              <div style={{fontWeight:800,fontSize:15,color:text1,marginBottom:4}}>{t[a.key]}</div>
              <div style={{fontSize:11,color:text2,marginBottom:6}}>{t[`${a.key}_d`]}</div>
              <div style={{fontFamily:'Georgia,serif',fontSize:15,fontWeight:800,color:a.accent,marginBottom:13}}>
                {isAr ? `من ${a.minPrice} ${t.mad}` : `Dès ${a.minPrice} ${t.mad}`}
              </div>
              <button style={{background:a.accent,color:'white',border:'none',padding:'8px 0',borderRadius:10,fontSize:12,fontWeight:700,cursor:'pointer',width:'100%'}}
                onMouseOver={e=>e.target.style.filter='brightness(1.15)'}
                onMouseOut={e=>e.target.style.filter='none'}>
                {t.view} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROMOTIONS ── */}
      <section id="promo" style={{padding:'72px 22px',background:sectionBg}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:34}}>
            <span style={{display:'inline-block',background:'#fef9c3',color:'#b45309',padding:'5px 15px',borderRadius:24,fontSize:12,fontWeight:700,border:'1px solid #fde68a',marginBottom:12}}>🔥 {t.promo_title}</span>
            <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(22px,4vw,38px)',fontWeight:900,marginBottom:10}}>{t.promo_title}</h2>
            <p style={{color:text2,fontSize:15}}>{t.promo_sub}</p>
          </div>
          {/* countdown */}
          <div style={{textAlign:'center',marginBottom:30}}>
            <div style={{display:'inline-flex',gap:10,alignItems:'center',background:dark?'#1e293b':'#111827',padding:'13px 24px',borderRadius:18}}>
              <span style={{fontSize:13,fontWeight:700,color:'#fbbf24'}}>⏰ {t.flash}</span>
              {[{v:timer.h,l:t.timer_h},{v:timer.m,l:t.timer_m},{v:timer.s,l:t.timer_s}].map((u,i)=>(
                <React.Fragment key={i}>
                  {i>0 && <span style={{color:'#475569',fontSize:20,fontWeight:900}}>:</span>}
                  <div style={{textAlign:'center'}}>
                    <div style={{fontFamily:'Georgia,serif',fontSize:24,fontWeight:900,color:'white',background:'#1e3a5f',borderRadius:9,padding:'5px 9px',minWidth:44,lineHeight:1}}>{String(u.v).padStart(2,'0')}</div>
                    <div style={{fontSize:9,color:'#64748b',marginTop:3,fontWeight:700}}>{u.l}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}} className="pg">
            {promos.map((p,i)=>(
              <div key={i} className="pc" style={{borderRadius:22,padding:24,background:p.gradient,color:'white',position:'relative',overflow:'hidden',cursor:'pointer'}}>
                <div style={{position:'absolute',top:-25,right:-25,width:90,height:90,background:'rgba(255,255,255,.09)',borderRadius:'50%'}}/>
                <div style={{position:'absolute',bottom:-16,left:-16,width:64,height:64,background:'rgba(255,255,255,.07)',borderRadius:'50%'}}/>
                <div style={{position:'absolute',top:13,right:13,background:'rgba(255,255,255,.22)',backdropFilter:'blur(6px)',padding:'4px 11px',borderRadius:18,fontSize:13,fontWeight:900}}>{p.pct}</div>
                <div style={{fontSize:38,marginBottom:11}}>{p.icon}</div>
                <h3 style={{fontFamily:'Georgia,serif',fontSize:19,fontWeight:800,marginBottom:8}}>{p.title}</h3>
                <p style={{opacity:.88,fontSize:13,marginBottom:14,lineHeight:1.55}}>{p.desc}</p>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
                  <span style={{fontFamily:'Georgia,serif',fontSize:26,fontWeight:900}}>{p.price} {t.mad}</span>
                  <span style={{textDecoration:'line-through',opacity:.65,fontSize:13}}>{p.old} {t.mad}</span>
                </div>
                <button style={{background:'rgba(255,255,255,.18)',backdropFilter:'blur(6px)',border:'2px solid rgba(255,255,255,.44)',color:'white',padding:'10px 20px',borderRadius:11,fontSize:13,fontWeight:700,cursor:'pointer',width:'100%',transition:'background .15s'}}
                  onMouseOver={e=>e.target.style.background='rgba(255,255,255,.32)'}
                  onMouseOut={e=>e.target.style.background='rgba(255,255,255,.18)'}>
                  {isAr?'احصل على العرض':lang==='fr'?"Saisir l'offre":'Grab Deal'} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENTS ── */}
      <section id="comments" style={{padding:'72px 22px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:42}}>
          <span style={{display:'inline-block',background:dark?'rgba(34,197,94,.12)':'#f0fdf4',color:'#16a34a',padding:'5px 15px',borderRadius:24,fontSize:12,fontWeight:700,border:'1px solid #bbf7d0',marginBottom:12}}>💬 {t.comments_title}</span>
          <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(22px,4vw,38px)',fontWeight:900,marginBottom:8}}>{t.comments_title}</h2>
          <p style={{color:text2,fontSize:15}}>{t.comments_sub}</p>
        </div>

        {/* comment form */}
        <div style={{background:cardBg,border:`1.5px solid ${border}`,borderRadius:20,padding:24,marginBottom:34,boxShadow:'0 4px 20px rgba(0,0,0,.06)'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
            <div>
              <label style={{display:'block',fontSize:12,fontWeight:700,color:text2,marginBottom:6}}>{t.comment_name}</label>
              <input className="inp" value={newName} onChange={e=>setNewName(e.target.value)} placeholder={isAr?'رشيد...':'Ahmed...'}/>
            </div>
            <div>
              <label style={{display:'block',fontSize:12,fontWeight:700,color:text2,marginBottom:6}}>{t.your_rating}</label>
              <div style={{paddingTop:8}}><Stars val={newStars} setVal={setNewStars} interactive={true} size={26}/></div>
            </div>
          </div>
          <textarea className="txa" value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder={t.comment_placeholder} style={{marginBottom:12}}/>
          {commentErr && <div style={{color:'#ef4444',fontSize:13,marginBottom:10,fontWeight:600}}>⚠️ {commentErr}</div>}
          {commentOk && <div style={{color:'#22c55e',fontSize:13,marginBottom:10,fontWeight:700,animation:'fadeIn .3s ease'}}>✅ {isAr?'تم نشر تعليقك!':lang==='fr'?'Avis publié avec succès !':'Review posted successfully!'}</div>}
          <button className="btn-g" onClick={submitComment}>💬 {t.comment_btn}</button>
        </div>

        {/* comments grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:16}} className="cg">
          {comments.map((c,i)=>(
            <div key={c.id} className="fu" style={{animationDelay:`${Math.min(i,.7)*.08}s`,background:cardBg,border:`1.5px solid ${border}`,borderRadius:18,padding:20,boxShadow:'0 2px 12px rgba(0,0,0,.05)'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#22c55e,#16a34a)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:800,fontSize:15,flexShrink:0}}>{c.av}</div>
                <div>
                  <div style={{fontWeight:800,fontSize:14,color:text1}}>{c.name}</div>
                  <div style={{fontSize:11,color:text2}}>📍 {c.loc} · {c.time}</div>
                </div>
              </div>
              <Stars val={c.stars} size={14}/>
              <p style={{color:text2,fontSize:13,lineHeight:1.65,marginTop:8}}>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{padding:'72px 22px',background:sectionBg}}>
        <div style={{maxWidth:660,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:42}}>
            <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(22px,4vw,36px)',fontWeight:900}}>{t.faq_title}</h2>
          </div>
          {[{q:t.faq1_q,a:t.faq1_a},{q:t.faq2_q,a:t.faq2_a},{q:t.faq3_q,a:t.faq3_a}].map((f,i)=>(
            <div key={i} className="faq-i">
              <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{width:'100%',padding:'16px 18px',background:'transparent',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',color:text1,fontSize:14,fontWeight:700,textAlign:isAr?'right':'left',gap:12}}>
                <span>{f.q}</span>
                <span style={{fontSize:20,color:'#22c55e',transition:'transform .2s',transform:faqOpen===i?'rotate(45deg)':'rotate(0)',flexShrink:0}}>+</span>
              </button>
              {faqOpen===i && (
                <div style={{padding:'0 18px 15px',color:text2,fontSize:14,lineHeight:1.7,borderTop:`1px solid ${border}`,animation:'fadeIn .2s ease'}}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{padding:'76px 22px',background:'linear-gradient(135deg,#052e16,#14532d,#166534)',textAlign:'center'}}>
        <div style={{maxWidth:560,margin:'0 auto'}}>
          <div style={{fontSize:48,marginBottom:14,animation:'bnc 1.8s ease-in-out infinite'}}>🌾</div>
          <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(22px,4vw,40px)',fontWeight:900,color:'white',marginBottom:12}}>{t.cta_title}</h2>
          <p style={{color:'#86efac',fontSize:15,marginBottom:30,lineHeight:1.65}}>{t.cta_sub}</p>
          <button style={{background:'linear-gradient(90deg,#22c55e 0%,#4ade80 50%,#22c55e 100%)',backgroundSize:'200% 100%',animation:'shim 2.2s linear infinite',color:'white',border:'none',padding:'15px 38px',borderRadius:14,fontSize:17,fontWeight:800,cursor:'pointer',transition:'transform .2s'}}
            onMouseOver={e=>e.currentTarget.style.transform='translateY(-3px) scale(1.03)'}
            onMouseOut={e=>e.currentTarget.style.transform='none'}>
            {t.cta_btn} →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{background:dark?'#020617':'#0f172a',color:'#475569',textAlign:'center',padding:'20px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:6}}>
          <LogoSVG/>
          <span style={{color:'#4ade80',fontWeight:800,fontSize:14}}>FarmTrust</span>
          <span style={{fontSize:12}}>by RSHD</span>
        </div>
        <p style={{fontSize:12}}>{t.footer}</p>
      </footer>

      {/* ── CHAT FLOAT ── */}
      <div className="chat-btn" onClick={()=>setChatOpen(!chatOpen)}>
        <span style={{fontSize:24}}>{chatOpen?'✕':'💬'}</span>
      </div>
      {chatOpen && (
        <div className="chat-win">
          <div style={{background:'linear-gradient(135deg,#16a34a,#22c55e)',padding:'13px 17px',display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:32,height:32,borderRadius:'50%',overflow:'hidden',border:'2px solid rgba(255,255,255,.4)',flexShrink:0}}><AvatarSVG size={32}/></div>
            <div>
              <div style={{color:'white',fontWeight:800,fontSize:13}}>FarmTrust</div>
              <div style={{color:'#bbf7d0',fontSize:11,display:'flex',alignItems:'center',gap:5}}>
                <span style={{width:6,height:6,background:'#4ade80',borderRadius:'50%',display:'inline-block'}}/>
                {isAr?'متصل':lang==='fr'?'En ligne':'Online'}
              </div>
            </div>
          </div>
          <div style={{padding:14}}>
            <div style={{background:dark?'#334155':'#f0fdf4',borderRadius:'12px 12px 12px 4px',padding:'10px 13px',fontSize:13,color:text1,marginBottom:12,lineHeight:1.55,direction:dir}}>
              {isAr?'👋 مرحباً! كيف يمكنني مساعدتك في شراء أو بيع حيوان؟':lang==='fr'?'👋 Bonjour ! Comment puis-je vous aider pour acheter ou vendre un animal ?':'👋 Hello! How can I help you buy or sell an animal?'}
            </div>
            <div style={{display:'flex',gap:8}}>
              <input placeholder={isAr?'اكتب رسالة...':lang==='fr'?'Votre message...':'Your message...'} style={{flex:1,padding:'9px 12px',border:`1.5px solid ${border}`,borderRadius:10,background:cardBg,color:text1,fontSize:13,outline:'none',fontFamily:'inherit'}}/>
              <button style={{background:'#22c55e',border:'none',color:'white',width:36,height:36,borderRadius:10,cursor:'pointer',fontSize:15,flexShrink:0}}>➤</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
