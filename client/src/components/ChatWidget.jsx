import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Flame, Crown } from 'lucide-react';
import { aiAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "🐯 ROAR! I'm your fierce tiger coach. Ask me anything about dominating your territory!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const examplePrompts = [
    '🔥 How to dominate sales?',
    '👑 Give me alpha motivation',
    '⚡ Hunting tips for today',
    '🐯 How to handle rejection?',
  ];

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiAPI.sendMessage(text);
      const aiMessage = { role: 'assistant', content: response.data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Tiger coach error:', err);
      const errorMessage = {
        role: 'assistant',
        content: "🐯 The alpha is temporarily away from the den. Try again soon, fierce tiger!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-tiger-gradient hover:shadow-[0_0_40px_rgba(255,140,0,0.8)] text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-all border-2 border-tiger-yellow"
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <span className="text-3xl animate-roar">🐯</span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-dark-card rounded-2xl shadow-[0_0_50px_rgba(255,140,0,0.4)] flex flex-col z-50 overflow-hidden border-2 border-tiger-orange"
          >
            {/* Header */}
            <div className="bg-tiger-gradient p-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-dark-card rounded-full flex items-center justify-center">
                  <span className="text-3xl">🐯</span>
                </div>
                <Crown className="absolute -top-1 -right-1 w-6 h-6 text-tiger-yellow animate-pulse tiger-eyes" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-extrabold text-lg">Tiger Coach</h3>
                <p className="text-xs text-tiger-yellow font-bold">Alpha hunting advisor</p>
              </div>
              <Flame className="w-6 h-6 text-tiger-yellow animate-pulse" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-dark-bg">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-tiger-gradient text-white font-semibold'
                        : 'bg-dark-card text-orange-100 border border-tiger-orange'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-dark-card p-3 rounded-2xl border border-tiger-orange">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-tiger-orange rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-tiger-orange rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-tiger-orange rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Example Prompts */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 bg-dark-bg">
                <p className="text-xs text-tiger-orange font-bold mb-2">🔥 Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(prompt)}
                      className="text-xs bg-dark-card hover:bg-dark-hover text-tiger-orange px-3 py-1 rounded-full transition-colors border border-tiger-orange font-semibold"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-dark-border bg-dark-card">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your tiger coach..."
                  className="flex-1 px-4 py-2 bg-dark-bg border border-tiger-orange rounded-full focus:outline-none focus:ring-2 focus:ring-tiger-orange text-orange-100 placeholder-gray-500"
                  disabled={loading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 bg-tiger-gradient hover:shadow-[0_0_20px_rgba(255,140,0,0.6)] text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;