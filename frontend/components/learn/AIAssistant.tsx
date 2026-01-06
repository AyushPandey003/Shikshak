import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, MessageSquare } from 'lucide-react';
import axios from 'axios';

interface Module {
  id: string;
  title: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface AIAssistantProps {
  modules: Module[];
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ modules, isOpen, onClose, courseId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hi! I'm your AI learning assistant. Select a module or ask me anything about the course content.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Construct payload with explicit check for selected module
      const payload: { query: string; course_id: string; module_id?: string } = {
        query: inputValue,
        course_id: courseId
      };

      // Only include module_id if a specific module is selected (not the default option)
      if (selectedModule && selectedModule !== "") {
        payload.module_id = selectedModule;
      }

      const response = await axios.post('http://localhost:4000/rag/query', payload, {
        withCredentials: true
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.data.answer || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error querying RAG:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Sorry, I'm having trouble connecting to the knowledge base right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:z-50 lg:absolute lg:inset-auto lg:bottom-20 lg:right-6 flex items-end justify-center lg:block pointer-events-none">
      {/* Mobile Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 lg:hidden pointer-events-auto backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Chat Window */}
      <div className="
        relative w-full lg:w-[380px] h-[85vh] lg:h-auto lg:max-h-[600px] 
        bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl border border-gray-100 
        overflow-hidden flex flex-col pointer-events-auto
        animate-in slide-in-from-bottom-full duration-300
      ">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Learning Assistant</h3>
              <div className="flex items-center gap-1.5 opacity-90">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${msg.sender === 'user' ? 'bg-indigo-100' : 'bg-violet-100'}
              `}>
                {msg.sender === 'user' ? <User className="w-4 h-4 text-indigo-600" /> : <Bot className="w-4 h-4 text-violet-600" />}
              </div>
              <div className={`
                p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'}
              `}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-[85%] self-start">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-violet-600" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1.5 items-center h-[44px]">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0 pb-8 lg:pb-4">
          {/* Module Selector */}
          <div className="mb-3">
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all cursor-pointer hover:bg-white"
            >
              <option value="">✨ Ask generally or select a module context...</option>
              {modules.map(m => (
                <option key={m.id} value={m.id}>📚 {m.title}</option>
              ))}
            </select>
          </div>

          {/* Text Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question here..."
              className="flex-1 text-sm p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm shadow-indigo-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
