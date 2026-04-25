import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// VideoAdAdmin: shown in admin panel to upload/manage the video
export function VideoAdAdmin() {
  const { t } = useTranslation();
  const [video, setVideo] = useState(() => localStorage.getItem('farmtrust_video_url') || '');
  const [preview, setPreview] = useState(video);
  const inputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    // In production: upload to server, get real URL
    localStorage.setItem('farmtrust_video_url', url);
    setVideo(url);
  };

  const removeVideo = () => {
    setPreview('');
    setVideo('');
    localStorage.removeItem('farmtrust_video_url');
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(240,192,64,0.3)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      <h3 style={{ color: '#f0c040', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🎬 {t('videoAd')}
      </h3>

      {preview ? (
        <div>
          <video
            src={preview}
            controls
            style={{
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: '10px',
              background: '#000',
              marginBottom: '1rem'
            }}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => inputRef.current.click()}
              style={{
                background: 'rgba(144,238,144,0.2)', color: '#90ee90',
                border: '1px solid #90ee90', borderRadius: '8px',
                padding: '8px 16px', cursor: 'pointer'
              }}
            >
              🔄 {t('edit')}
            </button>
            <button
              onClick={removeVideo}
              style={{
                background: 'rgba(255,100,100,0.2)', color: '#ff8080',
                border: '1px solid #ff6b6b', borderRadius: '8px',
                padding: '8px 16px', cursor: 'pointer'
              }}
            >
              🗑 {t('removeVideo')}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          style={{
            border: '2px dashed rgba(240,192,64,0.4)',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseOver={e => e.currentTarget.style.borderColor = '#f0c040'}
          onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(240,192,64,0.4)'}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎬</div>
          <p style={{ color: '#aaa' }}>{t('uploadVideo')}</p>
          <p style={{ color: '#666', fontSize: '0.8rem' }}>MP4, WebM, MOV — 16:9 format</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </div>
  );
}

// VideoAdBanner: shown on landing page below hero
export function VideoAdBanner() {
  const [video] = useState(() => localStorage.getItem('farmtrust_video_url') || '');
  const [visible, setVisible] = useState(true);

  if (!video || !visible) return null;

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.7 }}
        style={{
          width: '100%',
          maxWidth: '960px',
          margin: '0 auto 3rem auto',
          padding: '0 1rem',
          position: 'relative'
        }}
      >
        {/* Section label */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #f0c040, #e09800)',
              color: '#1a1a1a', borderRadius: '20px',
              padding: '3px 14px', fontSize: '0.8rem', fontWeight: 700
            }}>
              🎬 إعلان
            </span>
          </div>
          <button
            onClick={() => setVisible(false)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#888', fontSize: '1.2rem', lineHeight: 1
            }}
            title="إغلاق"
          >
            ✕
          </button>
        </div>

        {/* 16:9 Video wrapper */}
        <motion.div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 12px 50px rgba(0,0,0,0.5)',
            border: '2px solid rgba(240,192,64,0.3)',
          }}
          whileHover={{ scale: 1.01, boxShadow: '0 16px 60px rgba(0,0,0,0.6)' }}
          transition={{ duration: 0.3 }}
        >
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            controls
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              background: '#000'
            }}
          />

          {/* Gradient overlay at bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '60px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
            pointerEvents: 'none'
          }} />
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
}
