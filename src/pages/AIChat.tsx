import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileFrame from '@/components/MobileFrame';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChat = () => {
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello ${userDetails?.fullName?.split(' ')[0] || 'there'}! 👋 I'm your Janani AI assistant. I'm here to help you with your pregnancy journey. How can I assist you today?`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Pregnancy-related responses
    if (lowerMessage.includes('kick') || lowerMessage.includes('movement')) {
      return "Baby movements are a great sign of health! At your stage, you should feel movements regularly. If you notice a decrease in movement, try lying on your side and counting kicks. Contact your doctor if you feel fewer than 10 movements in 2 hours.";
    }
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      return "Sleep is crucial during pregnancy! Try sleeping on your left side with a pillow between your knees. Aim for 7-9 hours per night. Avoid caffeine after noon and create a relaxing bedtime routine. Would you like tips for better sleep?";
    }
    if (lowerMessage.includes('diet') || lowerMessage.includes('eat') || lowerMessage.includes('food')) {
      return "A balanced diet is essential! Focus on: \n• Leafy greens for folic acid\n• Lean proteins\n• Whole grains\n• Fruits and vegetables\n• Dairy for calcium\n\nAvoid raw fish, unpasteurized cheese, and limit caffeine. Stay hydrated with 8-10 glasses of water daily!";
    }
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
      return "Light exercise is beneficial! Walking, swimming, and prenatal yoga are excellent choices. Aim for 30 minutes of moderate activity most days. Always listen to your body and stop if you feel dizzy or uncomfortable. Consult your doctor before starting any new exercise routine.";
    }
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
      return "It's normal to feel anxious during pregnancy. Here are some tips:\n• Practice deep breathing exercises\n• Try prenatal meditation\n• Talk to your partner or friends\n• Keep a pregnancy journal\n• Consider prenatal yoga\n\nIf anxiety persists, please discuss with your healthcare provider. 💙";
    }
    if (lowerMessage.includes('doctor') || lowerMessage.includes('appointment')) {
      return `Your doctor ${userDetails?.doctorName || ''} can be reached at ${userDetails?.doctorNumber || 'your saved number'}. Regular checkups are important - typically every 4 weeks until week 28, then every 2 weeks until week 36, then weekly until delivery.`;
    }
    if (lowerMessage.includes('contraction') || lowerMessage.includes('labor')) {
      return "Early labor signs include:\n• Regular contractions getting closer together\n• Lower back pain\n• Water breaking\n• Bloody show\n\nCall your doctor if contractions are 5 minutes apart for 1 hour, your water breaks, or you have heavy bleeding. At your stage, any concerns should be reported immediately.";
    }
    if (lowerMessage.includes('week') || lowerMessage.includes('stage')) {
      return `You're at ${userDetails?.pregnancyWeeks || 32} weeks! Your baby is now about the size of a squash. They can open their eyes, hear your voice, and are developing more fat under their skin. Keep monitoring your health and stay in touch with your doctor!`;
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello! 😊 I'm here to support you through your pregnancy journey. You can ask me about nutrition, exercise, sleep, symptoms, or any pregnancy-related concerns. How are you feeling today?`;
    }
    if (lowerMessage.includes('thank')) {
      return "You're welcome! 💕 I'm always here to help. Don't hesitate to reach out whenever you have questions. Take care of yourself and your little one!";
    }
    if (lowerMessage.includes('symptom') || lowerMessage.includes('normal')) {
      return "Common symptoms at your stage include:\n• Backache\n• Swelling in ankles/feet\n• Frequent urination\n• Braxton Hicks contractions\n• Heartburn\n\nThese are typically normal, but always report severe or sudden symptoms to your doctor.";
    }
    
    // Default response
    return "I'm here to help with your pregnancy journey! You can ask me about:\n• Baby development & movements\n• Nutrition & diet\n• Exercise & sleep\n• Symptoms & concerns\n• Preparing for labor\n\nWhat would you like to know more about?";
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: getAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <MobileFrame>
      <div className="min-h-[844px] flex flex-col relative" style={{ backgroundColor: '#3B9B8F' }}>
        {/* Header */}
        <div className="pt-14 pb-4 px-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#E8847C' }}
              >
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Janani AI</h1>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Your pregnancy assistant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 rounded-t-[2rem] flex flex-col overflow-hidden" style={{ backgroundColor: '#F8F6F3' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-28">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`flex items-end gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {message.sender === 'ai' && (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#E8847C' }}
                    >
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className="px-4 py-3 rounded-2xl text-sm whitespace-pre-line"
                    style={{
                      backgroundColor: message.sender === 'user' ? '#3B9B8F' : 'white',
                      color: message.sender === 'user' ? 'white' : '#1F2937',
                      borderBottomRightRadius: message.sender === 'user' ? '4px' : '16px',
                      borderBottomLeftRadius: message.sender === 'ai' ? '4px' : '16px',
                    }}
                  >
                    {message.text}
                  </div>
                  {message.sender === 'user' && (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#3B9B8F' }}
                    >
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-end gap-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#E8847C' }}
                  >
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl" style={{ backgroundColor: 'white' }}>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#9CA3AF', animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#9CA3AF', animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#9CA3AF', animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-4 pb-24 pt-3" style={{ backgroundColor: '#F8F6F3' }}>
            <div className="flex items-center gap-2 p-2 rounded-full" style={{ backgroundColor: 'white' }}>
              <input
                type="text"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 bg-transparent border-none outline-none text-sm"
                style={{ color: '#1F2937' }}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-50"
                style={{ backgroundColor: '#3B9B8F' }}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </MobileFrame>
  );
};

export default AIChat;
