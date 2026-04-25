import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getVideo, setVideo } from '../../services/api';
import { AdminLayout } from './Dashboard';
import { useLang } from '../../context';

export default function AdminVideo() {
  const { t } = useLang();
  const [url, setUrl]         = useState('');
  const [current, setCurrent] = useState('');
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    getVideo().then(d => { if (d?.url) { setUrl(d.url); setCurrent(d.url); } }).catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!url.trim()) return toast.error('URL required');
    setSaving(true);
    try {
      await setVideo({ url: url.trim() });
      setCurrent(url.trim());
      toast.success('✅ Video saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleRemove = async () => {
    setSaving(true);
    try {
      await setVideo({ url: '' });
      setUrl(''); setCurrent('');
      toast.success('Video removed');
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  // Convert YouTube URL to embed
  const toEmbed = (u) => {
    if (!u) return '';
    return u.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/');
  };

  return (
    <AdminLayout title={`${t.admin.video} 🎬`}>
      <div className="max-w-2xl">

        {/* Instructions */}
        <div style={{ background:'#E8F5E9', borderRadius:16, padding:18, marginBottom:24, border:'1px solid #C8E6C9' }}>
          <h3 style={{ fontWeight:700, color:'#1B5E20', marginBottom:8, fontSize:14 }}>📋 Instructions</h3>
          <ul style={{ fontSize:13, color:'#555', lineHeight:2, margin:0, paddingInlineStart:18 }}>
            <li>Format vidéo: <strong>16:9</strong> (YouTube, lien direct mp4)</li>
            <li>Exemple YouTube: <code style={{ background:'#f0f0f0', padding:'1px 6px', borderRadius:4 }}>https://www.youtube.com/watch?v=xxxxx</code></li>
            <li>La vidéo s'affiche sur la page d'accueil pour tous les visiteurs</li>
            <li>Laissez vide pour masquer la section vidéo</li>
          </ul>
        </div>

        {/* Form */}
        <div style={{ background:'white', borderRadius:20, padding:28, border:'1px solid #e8e8e8', boxShadow:'0 4px 16px #0001', marginBottom:24 }}>
          <form onSubmit={handleSave}>
            <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#555', marginBottom:8 }}>
              URL de la vidéo (YouTube ou MP4)
            </label>
            <input
              style={{ width:'100%', border:'1.5px solid #e0e0e0', borderRadius:12, padding:'12px 14px', fontSize:14, outline:'none', boxSizing:'border-box', marginBottom:16 }}
              placeholder="https://www.youtube.com/watch?v=..."
              value={url} onChange={e => setUrl(e.target.value)}
              onFocus={e => e.target.style.borderColor='#2E7D32'}
              onBlur={e => e.target.style.borderColor='#e0e0e0'}
            />
            <div style={{ display:'flex', gap:10 }}>
              <motion.button type="submit" disabled={saving} whileTap={{ scale:0.97 }}
                style={{ flex:1, background:'#1B5E20', color:'white', border:'none', borderRadius:12, padding:'12px', fontWeight:700, fontSize:14, cursor:'pointer', opacity:saving?0.7:1 }}>
                {saving ? 'Saving...' : '💾 Enregistrer la vidéo'}
              </motion.button>
              {current && (
                <button type="button" onClick={handleRemove} disabled={saving}
                  style={{ padding:'12px 16px', background:'#FFF3E0', color:'#E65100', border:'none', borderRadius:12, fontWeight:700, fontSize:13, cursor:'pointer' }}>
                  🗑️ Supprimer
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Preview */}
        {current && (
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            style={{ background:'#111', borderRadius:20, overflow:'hidden', boxShadow:'0 12px 40px #0003' }}>
            <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ color:'white', fontWeight:700, fontSize:14 }}>🎬 Aperçu (16:9)</span>
              <span style={{ fontSize:11, color:'#888', background:'#333', padding:'2px 8px', borderRadius:20 }}>LIVE</span>
            </div>
            {/* 16:9 ratio container */}
            <div style={{ position:'relative', paddingBottom:'56.25%', height:0 }}>
              {current.includes('youtube') || current.includes('youtu.be') ? (
                <iframe
                  src={toEmbed(current)}
                  style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none' }}
                  allowFullScreen title="Video preview"/>
              ) : (
                <video src={current} controls
                  style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover' }}/>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}
