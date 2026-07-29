import React, { useState } from 'react';
import { EcoChatMessage } from '../types';
import { Bot, Send, User, Sparkles, BookOpen, TreePine, ShieldCheck, HelpCircle } from 'lucide-react';

export const EcoAiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<EcoChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello! I am **Zamfara Eco-AI**, your specialized environmental assistant and academic research advisor for GreenWatch Zamfara. 

I can assist you with:
- **SDG 15 & Deforestation**: Land degradation, Great Green Wall strategies, and Zamfara LGA environmental profiles.
- **Indigenous Tree Care**: Species selection for Neem, Baobab, Acacia, Mahogany, and Desert Date.
- **Academic Project Documentation**: Formulating research methodology, database schemas, and writing chapter sections.
- **Forestry Regulations**: Zamfara State Forestry Law Cap 55 and ranger enforcement guidelines.

How can I help your project today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleShortcuts = [
    'Which tree species survive best in arid Maru & Anka LGAs?',
    'Outline Chapter Two Literature Review for GreenWatch Zamfara',
    'What are the penalties under Zamfara Forestry Law for charcoal kilns?',
    'How does MongoDB GeoJSON 2dsphere indexing work for deforestation mapping?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg: EcoChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/eco-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      const botReply: EcoChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I am ready to assist with your GreenWatch Zamfara research.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error('Error sending message to Eco AI:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              Zamfara Eco-AI Assistant
              <span className="text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
                Powered by Gemini 3.6 Flash
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive AI advisor for environmental conservation in Zamfara State & academic thesis drafting.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
        {/* Chat Messages Log */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-emerald-600 text-white shadow-sm'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-xl text-xs leading-relaxed space-y-1 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 border-b border-current/10 pb-1 text-[10px] opacity-75">
                  <span className="font-bold">{msg.sender === 'user' ? 'You' : 'Zamfara Eco-AI'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="whitespace-pre-line text-xs font-sans">{msg.text}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 animate-bounce">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span>Zamfara Eco-AI is generating response...</span>
              </div>
            </div>
          )}
        </div>

        {/* Prompt Shortcuts Bar */}
        <div className="p-2.5 bg-slate-100 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 font-bold shrink-0 flex items-center gap-1 pl-1">
            <HelpCircle className="w-3 h-3 text-emerald-600" /> Shortcuts:
          </span>
          {sampleShortcuts.map((sc, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(sc)}
              className="px-2.5 py-1 rounded-full bg-white text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 border border-slate-200 whitespace-nowrap transition-colors font-medium"
            >
              {sc}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about Zamfara indigenous trees, Great Green Wall, or project documentation..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputPrompt.trim()}
            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
