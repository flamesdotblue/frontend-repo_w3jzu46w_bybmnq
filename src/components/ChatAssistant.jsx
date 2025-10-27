import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function TypingDots() {
  return (
    <div className="flex gap-1 items-center">
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
    </div>
  );
}

export default function ChatAssistant({ contextMetrics }) {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your CemAI copilot. I watch live metrics and can suggest safe setpoint changes. Ask about energy, quality, or sustainability." },
  ]);
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const lastAlertRef = useRef(0);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, typing]);

  // Auto-react to metric anomalies, rate-limited to once every 20s
  useEffect(() => {
    if (!contextMetrics) return;
    const now = Date.now();
    if (now - lastAlertRef.current < 20000) return;
    const { energy, quality, efficiency, sustainability } = contextMetrics;
    let alert = '';
    if (energy > 420) {
      alert = `Live alert: Energy at ${energy} kWh/t. Suggest shifting 10-15% grinding to off-peak and +5% separator speed → ~5% kWh/t reduction.`;
    } else if (quality < 95) {
      alert = `Quality dip: Index at ${quality}/100. Recommend holding mill DP at 75 mbar and reducing feed by 3% for stability.`;
    } else if (sustainability < 60) {
      alert = `Sustainability score ${sustainability}. Consider +6% alt fuels (RDF:biomass 60:40) → -17 kcal/kg clinker, lower CO₂.`;
    } else if (efficiency < 75) {
      alert = `Efficiency at ${efficiency}%. Tune recirculation +8% and check fan curves to reduce slip losses.`;
    }
    if (alert) {
      lastAlertRef.current = now;
      setTyping(true);
      setTimeout(() => {
        setMessages((m) => [...m, { role: 'assistant', content: alert }]);
        setTyping(false);
      }, 600);
    }
  }, [contextMetrics]);

  const respond = (q) => {
    const lower = q.toLowerCase();
    let reply = "Here's a cross-process insight: blending raw meal variability with kiln feed stability can shave 2-4% energy while keeping LSF/SM/AM on target.";
    if (lower.includes('energy') || lower.includes('power') || lower.includes('kwh')) {
      reply = 'Live energy tip: Shift 12% of grinding to off-peak hours and increase VRM recirculation by 8% → estimated -5.2% kWh/t cement.';
    } else if (lower.includes('quality') || lower.includes('fineness') || lower.includes('blaine')) {
      reply = 'Quality control: Increase separator speed by 3% and hold mill DP at 75 mbar to stabilize Blaine 3400±50 while reducing overgrinding.';
    } else if (lower.includes('clinker') || lower.includes('kiln') || lower.includes('lsf') || lower.includes('tsr')) {
      reply = 'Kiln advisory: Target LSF 95, SM 2.3, AM 1.6. Raise TSR to 45% using 60:40 RDF:biomass at 11% moisture. Expect -17 kcal/kg clinker.';
    } else if (lower.includes('co2') || lower.includes('sustain')) {
      reply = 'Sustainability: Substitute 5% clinker with fly ash and boost alt fuels by 6% → projected -48 kg CO₂/t cement and +4 ESG score.';
    }

    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
      setTyping(false);
    }, 800);
  };

  const onSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setInput('');
    respond(q);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <button
        onClick={() => setOpen(!open)}
        className="mb-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700"
      >
        <MessageSquare className="w-4 h-4" /> CemAI Copilot
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-[360px] h-[460px] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center gap-2 text-slate-800 font-medium"><Bot className="w-4 h-4" /> AI Insights</div>
              <div className="text-xs text-slate-500">Auto-reacts to live data • Gemini-ready</div>
            </div>
            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
              {messages.map((m, i) => (
                <div key={i} className={`flex items-start gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
                  {m.role === 'assistant' && (
                    <div className="p-2 rounded-full bg-emerald-100 text-emerald-700"><Bot className="w-4 h-4" /></div>
                  )}
                  <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                    m.role === 'user' ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}>
                    {m.content}
                  </div>
                  {m.role === 'user' && (
                    <div className="p-2 rounded-full bg-slate-200 text-slate-700"><User className="w-4 h-4" /></div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <div className="p-2 rounded-full bg-emerald-100 text-emerald-700"><Bot className="w-4 h-4" /></div>
                  <TypingDots />
                </div>
              )}
            </div>
            <form onSubmit={onSend} className="p-3 border-t border-slate-200 flex items-center gap-2">
              <input
                value={input}
                onChange={(e)=>setInput(e.target.value)}
                placeholder="Ask about energy, quality, or fuel mix…"
                className="flex-1 px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button type="submit" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
