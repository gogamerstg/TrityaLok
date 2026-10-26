import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  MapPin,
  Route,
  ArrowRight,
  User,
  Compass,
  CornerDownRight
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { sendAiQuery } from '../../services/api';

export const AiAssistantView: React.FC = () => {
  const {
    building,
    chatMessages,
    addChatMessage,
    isAiThinking,
    setIsAiThinking,
    voiceEnabled,
    setVoiceEnabled,
    setActiveRoute,
    setActiveSection,
    setSelectedPoi,
    startNodeId,
    selectedFloorId,
  } = useAppStore();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAiThinking]);

  // Voice recognition via Web Speech API
  const handleToggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported by your browser. Please use Chrome/Edge or type your question.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputQuery(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  const handleSend = async (queryText?: string) => {
    const text = (queryText || inputQuery).trim();
    if (!text) return;

    // Add user message
    addChatMessage({
      sender: 'user',
      text,
    });
    setInputQuery('');
    setIsAiThinking(true);

    try {
      const response = await sendAiQuery(
        text,
        building,
        startNodeId,
        typeof selectedFloorId === 'number' ? selectedFloorId : 1
      );

      // Add AI reply
      addChatMessage({
        sender: 'nexus',
        text: response.answer,
        suggestedRoute: response.suggested_route,
        poiId: response.matched_poi_ids[0],
      });

      // Voice synthesis if voiceEnabled
      if (voiceEnabled && 'speechSynthesis' in window && response.voice_spoken_text) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(response.voice_spoken_text);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }

      // If route was suggested, update global route
      if (response.suggested_route && response.suggested_route.success) {
        setActiveRoute(response.suggested_route);
      }
    } catch {
      addChatMessage({
        sender: 'nexus',
        text: "I experienced a temporary communication glitch with the spatial index. Please retry your query.",
      });
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleApplyRoute = (suggestedRoute: any, poiId?: string) => {
    if (suggestedRoute) {
      setActiveRoute(suggestedRoute);
      if (poiId) {
        const poi = building.pois.find((p) => p.id === poiId);
        if (poi) setSelectedPoi(poi);
      }
      setActiveSection('navigation');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Autonomous Spatial Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-400" />
            <span>NEXUS Spatial Assistant</span>
          </h1>
        </div>

        {/* Voice Toggle */}
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
            voiceEnabled
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-sm'
              : 'bg-surface-elevated border-surface-border text-slate-400 hover:text-white'
          }`}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          <span>{voiceEnabled ? 'Voice Output ON' : 'Voice Output OFF'}</span>
        </button>
      </div>

      {/* Suggested Quick Queries */}
      <div className="flex flex-wrap gap-2">
        {[
          "I need to reach the computer lab.",
          "Find the nearest washroom.",
          "Where is the Aryabhata Auditorium?",
          "How do I reach the robotics lab?",
          "Find an accessible step-free route to Level 2.",
          "Where can I get coffee or snacks?",
        ].map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1 rounded-full text-xs bg-surface-card hover:bg-surface-elevated text-slate-300 border border-surface-border hover:border-cyan-500/40 transition-all font-sans"
          >
            "{q}"
          </button>
        ))}
      </div>

      {/* Chat Messages Log Area */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xl">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-violet-600 text-white'
                  : 'bg-cyan-500 text-slate-950 shadow-cyan-glow'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-violet-600 text-white rounded-tr-none'
                  : 'bg-surface-elevated border border-surface-border text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Interactive Route Card in Chat */}
              {msg.suggestedRoute && msg.suggestedRoute.success && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span className="font-bold flex items-center gap-1.5">
                      <Route className="w-3.5 h-3.5" />
                      A* Route Ready ({msg.suggestedRoute.total_distance_meters}m)
                    </span>
                    <span>{msg.suggestedRoute.estimated_time_seconds}s walk</span>
                  </div>
                  <button
                    onClick={() => handleApplyRoute(msg.suggestedRoute, msg.poiId)}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Inspect 3D Navigation Path</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="text-[10px] text-slate-400 font-mono mt-1 text-right">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isAiThinking && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-surface-elevated border border-surface-border text-xs text-cyan-300 font-mono flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>NEXUS is querying building graph & spatial coordinates...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleVoiceInput}
          className={`p-3 rounded-xl border transition-all ${
            isListening
              ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
              : 'bg-surface-card border-surface-border text-slate-400 hover:text-cyan-300'
          }`}
          title="Voice Speech Input"
        >
          {isListening ? <Mic className="w-5 h-5 text-rose-400" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask NEXUS (e.g., 'How do I get to Computer Lab 204 without taking stairs?')..."
          className="flex-1 px-4 py-3 rounded-xl bg-surface-card border border-surface-border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />

        <button
          onClick={() => handleSend()}
          className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 hover:brightness-110 shadow-cyan-glow transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
