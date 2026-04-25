import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
const ADMIN_ID = process.env.REACT_APP_ADMIN_ID || 'admin';

export default function Chat() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    chatAPI.getHistory(ADMIN_ID).then(r => setMessages(r.data)).catch(() => {});

    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('join', user.id);

    socketRef.current.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socketRef.current?.disconnect();
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim() || !socketRef.current) return;
    socketRef.current.emit('sendMessage', {
      senderId: user.id,
      receiverId: ADMIN_ID,
      message: input.trim()
    });
    setInput('');
  };

  return (
    <div style={{ background: '#0f1f0f', minHeight: '100vh', paddingTop: '80px', display: 'flex', flexDirection: 'column', maxWidth: '700px', margin: '0 auto', padding: '80px 1rem 1rem' }}>
      <h2 style={{ color: '#f0c040', marginBottom: '1rem', textAlign: 'center' }}>💬 {t('chat')} — Admin</h2>

      <div style={{
        flex: 1, background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px', padding: '1rem',
        border: '1px solid rgba(255,255,255,0.08)',
        minHeight: '400px', maxHeight: '60vh',
        overflowY: 'auto', marginBottom: '1rem'
      }}>
        {messages.map((m, i) => {
          const isMe = m.senderId === user?.id || m.senderId?._id === user?.id;
          return (
            <motion.div
              key={m._id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start',
                marginBottom: '0.75rem'
              }}
            >
              <div style={{
                maxWidth: '70%', padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: isMe ? 'linear-gradient(135deg, #f0c040, #e09800)' : 'rgba(255,255,255,0.1)',
                color: isMe ? '#1a1a1a' : '#fff', fontSize: '0.95rem'
              }}>
                {m.message}
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={t('typeMessage')}
          style={{
            flex: 1, padding: '12px 16px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px', color: '#fff',
            fontSize: '0.95rem', outline: 'none'
          }}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={send}
          style={{
            background: 'linear-gradient(135deg, #f0c040, #e09800)',
            color: '#1a1a1a', border: 'none', borderRadius: '12px',
            padding: '12px 20px', fontWeight: 700, cursor: 'pointer'
          }}
        >
          {t('send')} 🚀
        </motion.button>
      </div>
    </div>
  );
}
