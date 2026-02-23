import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DoctorCard } from '@/components/doctor/DoctorCard';
import { ChatMessage } from '@/types';
import { specialties, doctors } from '@/data/mockData';
import { cn } from '@/lib/utils';

type AiState = 'idle' | 'awaiting_doctor_choice';

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
  const [aiState, setAiState] = useState<AiState>('idle');
  const [lastSuggestedSpecialtyIds, setLastSuggestedSpecialtyIds] = useState<string[]>([]);
  const [showDoctors, setShowDoctors] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<typeof doctors>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showDoctors]);

  const addAiMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      text,
      sender: 'ai' as const,
      timestamp: new Date(),
    }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: userText,
      sender: 'user' as const,
      timestamp: new Date(),
    }]);
    setInput('');
    setIsTyping(true);
    setShowDoctors(false);

    if (aiState === 'awaiting_doctor_choice') {
      // Follow-up flow: user deciding whether to see doctors
      await new Promise(resolve => setTimeout(resolve, 600));
      const lower = userText.toLowerCase();
      if (lower.includes('sí') || lower.includes('si') || lower.includes('ver') || lower.includes('mostrar') || lower.includes('ok')) {
        const matched = doctors.filter(d => lastSuggestedSpecialtyIds.includes(d.specialtyId));
        setSuggestedDoctors(matched);
        setShowDoctors(true);
        addAiMessage(
          matched.length > 0
            ? `Aquí tienes los médicos disponibles. Puedes elegir uno para agendar directamente, o también puedes agendar solo por especialidad.`
            : `No encontré médicos disponibles para esa especialidad en este momento. Puedes agendar por especialidad.`
        );
        setAiState('idle');
      } else {
        addAiMessage('Entendido. Si necesitas ayuda con otros síntomas, ¡cuéntame!');
        setAiState('idle');
      }
      setIsTyping(false);
      return;
    }

    // Normal symptom flow: delegate analysis to backend AI Orientation service
    try {
      const AI_API_URL = import.meta.env.VITE_AI_API_URL ?? 'http://localhost:8005';
      const res = await fetch(`${AI_API_URL}/ai/orient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: userText }),
      });

      if (!res.ok) {
        addAiMessage('Ahora mismo no puedo analizar tus síntomas. Inténtalo de nuevo en unos momentos.');
        setAiState('idle');
        setIsTyping(false);
        return;
      }

      const data: {
        recommended_specialty?: string;
        explanation?: string;
        comment?: string;
        inference_method?: string;
      } = await res.json();
      const specialtyName: string = data.recommended_specialty ?? 'Medicina General';

      const spec = specialties.find(s => s.name === specialtyName);
      if (spec) {
        setLastSuggestedSpecialtyIds([spec.id]);
      } else {
        setLastSuggestedSpecialtyIds([]);
      }

      let responseText = `Basándome en tus síntomas, te recomiendo consultar con:\n\n`;
      responseText += `• **${specialtyName}**\n`;
      if (data.explanation) {
        responseText += `\n${data.explanation}\n`;
      }
      if (data.comment) {
        responseText += `\nNota: ${data.comment}\n`;
      }
      responseText += `\n¿Te gustaría ver los médicos disponibles para esta especialidad?`;

      addAiMessage(responseText);
      setAiState('awaiting_doctor_choice');
    } catch {
      addAiMessage('Ha ocurrido un error al conectar con el asistente. Por favor, inténtalo nuevamente.');
      setAiState('idle');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
              message.sender === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            )}>
              {message.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className={cn(
              'max-w-[80%] rounded-2xl px-4 py-3',
              message.sender === 'ai'
                ? 'bg-card border border-border shadow-card'
                : 'bg-primary text-primary-foreground'
            )}>
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

        {/* Doctor cards */}
        {showDoctors && suggestedDoctors.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            {suggestedDoctors.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onClick={() => navigate(`/book/datetime/${doctor.id}`)}
              />
            ))}
            {lastSuggestedSpecialtyIds.length > 0 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/book/doctor/${lastSuggestedSpecialtyIds[0]}`)}
              >
                Ver todos los médicos de esta especialidad
              </Button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={aiState === 'awaiting_doctor_choice' ? 'Escribe "sí" o "no"...' : 'Describe tus síntomas...'}
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
