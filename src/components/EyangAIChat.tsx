/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export default function EyangAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Halo Sayang, cucu Eyang yang manis. Selamat datang di warung AyamEyang! Eyang siap membantumu mencari menu paling lezat, promo paling hemat, atau membantu reservasi mejamu. Ada yang ingin kamu tanyakan pada Eyang, Sayang?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;

    if (!textToSend) {
      setInput('');
    }
    setError('');

    // Append user message
    const updatedMessages = [...messages, { role: 'user', text } as ChatMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Send chat history and current message to backend
      const history = updatedMessages.slice(0, -1);
      const res = await api.askGemini(text, history);
      setMessages(prev => [...prev, { role: 'model', text: res.text }]);
    } catch (err: any) {
      console.error(err);
      setError('Eyang sedang sibuk meracik sambal di dapur. Silakan coba sesaat lagi, Sayang.');
    } finally {
      setIsLoading(false);
    }
  };

  const starters = [
    'Rekomendasi Ayam Terlaris',
    'Ada promo hemat apa hari ini?',
    'Cara pesan online & reservasi',
    'Lokasi cabang terdekat'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          id="eyang-ai-trigger"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 bg-primary text-white px-5 py-4 rounded-full shadow-premium-lg hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-secondary"
        >
          <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-medium text-sm tracking-wide">Tanya Eyang AI</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-ping" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          id="eyang-ai-window"
          className="w-80 md:w-96 h-[480px] bg-white rounded-2xl shadow-premium-lg border border-primary/20 flex flex-col overflow-hidden animate-fade-in"
        >
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between border-b-4 border-secondary">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center border-2 border-secondary">
                <span className="text-primary font-bold text-lg font-serif">E</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm font-serif tracking-wide text-secondary">Eyang AI Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-cream/80 font-mono">Resep Warisan Aktif</span>
                </div>
              </div>
            </div>
            <button
              id="eyang-ai-close"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-cream/30 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white text-charcoal shadow-sm border border-primary/10 rounded-tl-none font-sans'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-charcoal shadow-sm border border-primary/10 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[10px] text-muted-text font-mono">Eyang sedang mengetik...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs flex items-center gap-2 border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starters */}
          {messages.length === 1 && !isLoading && (
            <div className="p-3 bg-cream/10 border-t border-primary/5">
              <p className="text-[10px] text-muted-text font-medium mb-1.5 ml-1">Coba tanyakan:</p>
              <div className="flex flex-wrap gap-1.5">
                {starters.map((starter, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(starter)}
                    className="text-[10px] bg-white border border-primary/20 text-primary hover:bg-primary hover:text-white px-2.5 py-1 rounded-full transition-all duration-200 text-left font-sans"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-primary/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan resep, promo, reservasi..."
              disabled={isLoading}
              className="flex-1 bg-cream/20 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-text/60 disabled:opacity-50"
            />
            <button
              id="eyang-ai-send"
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-primary text-white p-2 rounded-xl hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
