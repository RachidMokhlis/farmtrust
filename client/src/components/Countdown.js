import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Countdown({ endDate }) {
  const { t } = useTranslation();
  const [time, setTime] = useState({});

  useEffect(() => {
    const tick = () => {
      const diff = new Date(endDate) - new Date();
      if (diff <= 0) return setTime({ expired: true });
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (time.expired) return <span style={{ color: '#ff6b6b' }}>منتهي</span>;

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#90ee90', fontSize: '0.85rem' }}>{t('promoEnds')}:</span>
      {['d', 'h', 'm', 's'].map(unit => (
        <div key={unit} style={{
          background: 'rgba(240,192,64,0.2)', border: '1px solid #f0c040',
          borderRadius: '6px', padding: '2px 8px', minWidth: '36px', textAlign: 'center'
        }}>
          <div style={{ color: '#f0c040', fontWeight: 700, fontSize: '1.1rem' }}>{String(time[unit] || 0).padStart(2, '0')}</div>
          <div style={{ color: '#888', fontSize: '0.6rem' }}>{unit}</div>
        </div>
      ))}
    </div>
  );
}
