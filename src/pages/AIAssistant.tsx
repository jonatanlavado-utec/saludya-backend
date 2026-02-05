import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/types';
import { symptomSpecialtyMap, specialties } from '@/data/mockData';
import { cn } from '@/lib/utils';

const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente de salud. Cuéntame tus síntomas y te ayudaré a encontrar la especialidad médica adecuada.',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findSpecialty = (text: string): string[] => {
    const lowerText = text.toLowerCase();
    const matchedSpecialties = new Set<string>();

    for (const [keyword, specs] of Object.entries(symptomSpecialtyMap)) {
      if (lowerText.includes(keyword)) {
        specs.forEach(s => matchedSpecialties.add(s));
      }
    }

    if (matchedSpecialties.size === 0) {
      matchedSpecialties.add('Medicina General');
    }

    return Array.from(matchedSpecialties);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const suggestedSpecialties = findSpecialty(input);
    const specialtyDetails = suggestedSpecialties
      .map(name => specialties.find(s => s.name === name))
      .filter(Boolean);

    let responseText = `Basándome en tus síntomas, te recomiendo consultar con un especialista en:\n\n`;
    suggestedSpecialties.forEach(spec => {
      responseText += `• **${spec}**\n`;
    });
    responseText += `\n¿Te gustaría agendar una cita con alguno de estos especialistas?`;

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: 'ai',
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getFirstSuggestedSpecialtyId = () => {
    const lastAiMessage = [...messages].reverse().find(m => m.sender === 'ai' && m.text.includes('recomiendo'));
    if (lastAiMessage) {
      for (const spec of specialties) {
        if (lastAiMessage.text.includes(spec.name)) {
          return spec.id;
        }
      }
    }
    return '1';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Asistente IA</h1>
          <p className="text-sm text-muted-foreground">Te ayudo a encontrar el especialista adecuado</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3 animate-fade-in',
              message.sender === 'user' ? 'flex-row-reverse' : ''
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                message.sender === 'ai' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary'
              )}
            >
              {message.sender === 'ai' ? (
                <Bot className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3',
                message.sender === 'ai'
                  ? 'bg-card border border-border shadow-card'
                  : 'bg-primary text-primary-foreground'
              )}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-card">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action */}
      {messages.length > 2 && (
        <div className="mb-4">
          <Button 
            onClick={() => navigate(`/book/doctor/${getFirstSuggestedSpecialtyId()}`)}
            className="w-full"
          >
            Agendar Cita con Especialista
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe tus síntomas..."
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIAssistant;
