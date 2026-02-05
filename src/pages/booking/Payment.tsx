import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { doctors } from '@/data/mockData';
import { ArrowLeft, CreditCard, Calendar, Clock, CheckCircle } from 'lucide-react';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { doctorId, slotId } = useParams<{ doctorId: string; slotId: string }>();
  const { bookAppointment } = useApp();

  const doctor = doctors.find(d => d.id === doctorId);
  const slot = doctor?.availableSlots.find(s => s.id === slotId);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substring(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cardNumber || !expiry || !cvv || !cardName) {
      setError('Por favor completa todos los campos de pago');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 16) {
      setError('Número de tarjeta inválido');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (doctor && slot) {
      bookAppointment(doctor, slot, symptoms);
    }

    setLoading(false);
    setSuccess(true);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-2xl font-bold mb-2">¡Cita Confirmada!</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Tu cita con {doctor?.name} ha sido agendada exitosamente.
        </p>
        <div className="space-y-3 w-full max-w-sm">
          <Button onClick={() => navigate('/appointments')} className="w-full">
            Ver Mis Citas
          </Button>
          <Button onClick={() => navigate('/home')} variant="outline" className="w-full">
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
  }

  if (!doctor || !slot) {
    return <div>Información no encontrada</div>;
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Confirmar y Pagar</h1>
          <p className="text-muted-foreground">Verifica los detalles de tu cita</p>
        </div>
      </div>

      {/* Appointment Summary */}
      <div className="bg-card rounded-xl p-4 border border-border shadow-card">
        <div className="flex gap-4 mb-4">
          <img
            src={doctor.photoUrl}
            alt={doctor.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div>
            <h3 className="font-semibold">{doctor.name}</h3>
            <p className="text-sm text-primary">{doctor.specialty}</p>
          </div>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(slot.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{slot.time}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
          <span className="text-muted-foreground">Total a pagar</span>
          <span className="text-2xl font-bold text-primary">${doctor.price}</span>
        </div>
      </div>

      {/* Symptoms (optional) */}
      <div className="space-y-2">
        <Label htmlFor="symptoms">Describe tus síntomas (opcional)</Label>
        <Textarea
          id="symptoms"
          placeholder="Cuéntanos brevemente el motivo de tu consulta..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={3}
        />
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-card rounded-xl p-4 border border-border shadow-card space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">Datos de la tarjeta</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">Nombre del titular</Label>
            <Input
              id="cardName"
              placeholder="Como aparece en la tarjeta"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número de tarjeta</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Vencimiento</Label>
              <Input
                id="expiry"
                placeholder="MM/AA"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                maxLength={3}
                type="password"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <Button type="submit" className="w-full h-12" disabled={loading}>
          {loading ? (
            <LoadingSpinner size="sm" className="border-primary-foreground/30 border-t-primary-foreground" />
          ) : (
            `Pagar $${doctor.price}`
          )}
        </Button>
      </form>
    </div>
  );
};

export default Payment;
