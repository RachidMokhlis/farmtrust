import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context';
import { getMyMessages } from '../../services/api';

export default function Chat() {
  const { user, socket } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    getMyMessages()
      .then(d => setMessages(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socket.off('newMessage');
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket) return;
    socket.emit('clientMessage', { userId: user._id, text });
    setMessages(prev => [...prev, { text, sender: 'client', createdAt: new Date(), _id: Date.now() }]);
    setText('');
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"/></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Chat with FarmTrust</h1>
      <p className="text-gray-400 text-sm mb-6">Our team will reply as soon as possible</p>

      {/* Chat window */}
      <div className="card p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-sm">FT</div>
          <div>
            <p className="text-white font-semibold text-sm">FarmTrust Support</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"/>
              <p className="text-green-100 text-xs">Online</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-5 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              <div className="text-4xl mb-2">👋</div>
              <p className="text-sm">Send a message to start the conversation!</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <motion.div key={msg._id || i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                msg.sender === 'client'
                  ? 'bg-green-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
              }`}>
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'client' ? 'text-green-200' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={send} className="p-4 border-t border-gray-100 flex gap-3 bg-white">
          <input className="input flex-1" placeholder="Type a message..." value={text} onChange={e => setText(e.target.value)} />
          <button type="submit" disabled={!text.trim()} className="btn-primary px-5 disabled:opacity-50">Send</button>
        </form>
      </div>
    </div>
  );
}
