import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, MessageCircle, RefreshCw, X, Send } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { ttsManager } from '../utils/textToSpeech';
import { ChatMessage, Student } from '../types';

interface RobotEvaProps {
  currentStudent: Student;
  onUpdateTP?: (newTP: number) => void;
  skillFocus?: string;
  initialOpen?: boolean;
}

export const RobotEva: React.FC<RobotEvaProps> = ({
  currentStudent,
  onUpdateTP,
  skillFocus,
  initialOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emotion, setEmotion] = useState<'happy' | 'neutral' | 'curious' | 'celebrate'>('neutral');

  // Input & Message history
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'eva',
      text: `Hai ${currentStudent.name}! 🌟 Saya Sahabat AI, robot pembimbing Bahasa Melayu kamu di Kelas Cikgu Adila! Hari ini mari kita kuasai Kata Pemeri ("ialah" & "adalah") bersama-sama!`,
      timestamp: 'Baru sahaja',
    },
    {
      id: 'welcome-2',
      sender: 'eva',
      text: `Adik tahu tak perbezaan kata pemeri "ialah" dan "adalah" dalam Buku Teks m/s 57? Mari uji kefahaman kamu bersama Sahabat AI!`,
      timestamp: 'Baru sahaja',
    },
  ]);

  // Handle Eva speech triggers
  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    setIsSpeaking(true);
    ttsManager.speak(text, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  // Robot click interaction
  const handleRobotClick = () => {
    soundManager.playRobotChirp();
    setEmotion('happy');
    setTimeout(() => setEmotion('neutral'), 2000);
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  // Send message to server
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isThinking) return;

    soundManager.playPop();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);
    setEmotion('curious');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-5),
          currentStudent,
          targetSkill: skillFocus || 'kata_pemeri',
        }),
      });

      const data = await res.json();
      setIsThinking(false);

      if (data.reply) {
        const evaMsg: ChatMessage = {
          id: `eva-${Date.now()}`,
          sender: 'eva',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          detectedTP: data.detectedTP,
        };

        setMessages((prev) => [...prev, evaMsg]);

        // Evaluate TP change & celebration
        if (data.detectedTP && data.detectedTP > currentStudent.currentTP) {
          setEmotion('celebrate');
          soundManager.playLevelUp();
          onUpdateTP?.(data.detectedTP);
        } else {
          setEmotion('happy');
          soundManager.playSuccess();
        }

        setTimeout(() => setEmotion('neutral'), 3500);

        // Speak response out loud
        speakText(data.reply);
      }
    } catch (err) {
      console.error(err);
      setIsThinking(false);
      setEmotion('neutral');
      const errorMsg: ChatMessage = {
        id: `eva-err-${Date.now()}`,
        sender: 'eva',
        text: 'Maafkan Sahabat AI, sambungan sedikit terganggu. Tapi jangan bimbang, mari kita cuba lagi bersama-sama ya! 🌟',
        timestamp: 'Baru sahaja',
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  // Quick suggestion prompts for BM pupils
  const quickPrompts = [
    'Apa beza ialah dan adalah?',
    'Beri contoh Kata Nama Khas.',
    'Uji saya tentang Penjodoh Bilangan!',
    'Adakah ayat ini betul: "Dia ialah sangat rajin"?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* 3D EVE Robot Head & Body Container */}
      <div className="relative group cursor-pointer" onClick={handleRobotClick}>
        {/* Glow levitation aura */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-cyan-400/30 rounded-full blur-md animate-pulse"></div>

        {/* 3D EVE Head Capsule */}
        <div
          className={`relative w-28 h-36 rounded-[50%/60%_60%_40%_40%] bg-gradient-to-b from-white via-slate-100 to-slate-200 p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.18),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-4px_8px_rgba(148,163,184,0.4)] border border-white/80 transition-transform duration-300 ${
            isSpeaking ? 'animate-float-bob scale-105' : 'animate-float-gentle hover:scale-105'
          }`}
        >
          {/* Pearlescent highlight reflection */}
          <div className="absolute top-2 left-4 w-8 h-4 bg-white/70 rounded-full blur-[1px] rotate-[-25deg] pointer-events-none"></div>

          {/* Deep Obsidian Black Visor Face Screen */}
          <div className="relative w-full h-[78%] mt-2 rounded-[50%/55%_55%_45%_45%] bg-gradient-to-b from-slate-950 via-slate-900 to-black border border-slate-700/60 shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),0_2px_6px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col items-center justify-center">
            {/* Screen glass curved reflection */}
            <div className="absolute -top-6 -left-6 w-32 h-16 bg-gradient-to-b from-white/15 to-transparent rounded-full rotate-[-20deg] pointer-events-none"></div>

            {/* Glowing Cyber Cyan LED Eyes */}
            <div className="flex items-center justify-center gap-4 mt-2">
              {/* Left Eye */}
              <div
                className={`transition-all duration-300 ${
                  emotion === 'happy' || emotion === 'celebrate'
                    ? 'w-4 h-2.5 rounded-t-full border-t-4 border-cyan-300 shadow-[0_0_12px_#22d3ee]'
                    : emotion === 'curious'
                    ? 'w-4 h-5 rounded-[50%] bg-cyan-300 shadow-[0_0_15px_#06b6d4] rotate-[-8deg]'
                    : isThinking
                    ? 'w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-ping'
                    : 'w-4 h-5 rounded-[50%] bg-gradient-to-b from-cyan-200 to-cyan-400 shadow-[0_0_14px_#06b6d4] animate-eye-blink'
                }`}
              ></div>

              {/* Right Eye */}
              <div
                className={`transition-all duration-300 ${
                  emotion === 'happy' || emotion === 'celebrate'
                    ? 'w-4 h-2.5 rounded-t-full border-t-4 border-cyan-300 shadow-[0_0_12px_#22d3ee]'
                    : emotion === 'curious'
                    ? 'w-4 h-5 rounded-[50%] bg-cyan-300 shadow-[0_0_15px_#06b6d4] rotate-[8deg]'
                    : isThinking
                    ? 'w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-ping'
                    : 'w-4 h-5 rounded-[50%] bg-gradient-to-b from-cyan-200 to-cyan-400 shadow-[0_0_14px_#06b6d4] animate-eye-blink'
                }`}
              ></div>
            </div>

            {/* Reactive Voice Mouth Waveform (moves when Eva responds/speaks) */}
            <div className="mt-4 flex items-center justify-center gap-1 h-4">
              {isSpeaking ? (
                <>
                  <span className="w-1 bg-cyan-300 rounded-full animate-mouth-active" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1 bg-cyan-400 rounded-full animate-mouth-active" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1 bg-cyan-200 rounded-full animate-mouth-active" style={{ animationDelay: '300ms' }}></span>
                  <span className="w-1 bg-cyan-400 rounded-full animate-mouth-active" style={{ animationDelay: '100ms' }}></span>
                  <span className="w-1 bg-cyan-300 rounded-full animate-mouth-active" style={{ animationDelay: '200ms' }}></span>
                </>
              ) : isThinking ? (
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              ) : (
                /* Idle soft cyan smile line */
                <div className="w-6 h-1 rounded-full bg-cyan-400/70 shadow-[0_0_6px_#06b6d4] transition-all"></div>
              )}
            </div>
          </div>

          {/* Floating status badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-[10px] font-bold text-white shadow-sm whitespace-nowrap flex items-center gap-1 border border-white">
            <Sparkles className="w-2.5 h-2.5 text-yellow-300 animate-spin" />
            Sahabat AI
          </div>
        </div>

        {/* Speech Bubble when chat is closed */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-3 w-56 p-3 bg-white/95 backdrop-blur-md rounded-2xl rounded-br-sm shadow-xl border-2 border-blue-400/40 text-xs text-slate-800 animate-bounce">
            <p className="font-bold text-blue-600 flex items-center gap-1">
              <span>🤖</span> Sahabat AI sedia membantu!
            </p>
            <p className="mt-1 text-slate-600">Tekan saya untuk bimbingan Kata Pemeri di Kelas Cikgu Adila & semakan TP kamu!</p>
          </div>
        )}
      </div>

      {/* Expanded Interactive Chat Modal / Drawer */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[92vw] sm:w-[420px] max-h-[82vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-blue-200/80 flex flex-col overflow-hidden transition-all duration-300">
          {/* Header with Google Classroom colors */}
          <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-sky-500 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 p-1 flex items-center justify-center border border-white/40">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-fun text-lg font-bold flex items-center gap-1.5 leading-tight">
                  Sahabat AI
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-950 font-sans font-bold">
                    Kelas Cikgu Adila
                  </span>
                </h3>
                <p className="text-[11px] text-blue-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Pakar Kata Pemeri (ialah & adalah)
                </p>
              </div>
            </div>

            {/* Header controls: Voice, Sound, Close */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const state = ttsManager.toggleVoice();
                  setVoiceEnabled(state);
                }}
                className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                  voiceEnabled ? 'bg-white/25 text-white hover:bg-white/35' : 'bg-red-500/40 text-red-100'
                }`}
                title={voiceEnabled ? 'Suara Sahabat AI Aktif' : 'Suara Sahabat AI Dinyahaktif'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
                title="Tutup Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Student current status mini-bar */}
          <div className="bg-blue-50/80 px-4 py-2 border-b border-blue-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Murid: {currentStudent.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Tahap Semasa:</span>
              <span className="font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white">
                TP {currentStudent.currentTP}
              </span>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[360px] bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'eva' && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm mt-1">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-sm shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Detected TP badge if provided */}
                  {msg.detectedTP && (
                    <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                        🏆 Pentaksiran: Tahap Penguasaan TP {msg.detectedTP}
                      </span>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic p-2">
                <span className="text-lg animate-spin">🤖</span> Sahabat AI sedang meneliti ayat kamu...
              </div>
            )}
          </div>

          {/* Quick prompt suggestions */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p)}
                className="whitespace-nowrap px-2.5 py-1 text-xs rounded-full bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 border border-slate-200 transition font-medium"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Tanya soalan tatabahasa atau bina ayat kamu..."
              className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isThinking}
              className="p-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-40 hover:shadow-lg transition cursor-pointer flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
