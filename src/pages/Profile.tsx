import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { User, Mail, Phone, Calendar, CreditCard, LogOut, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  dni?: string;
  birthDate?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useApp();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    dni: user?.dni || '',
    birthDate: user?.birthDate || '',
    phone: user?.phone || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'Los apellidos son obligatorios';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El correo no es válido';
    }
    if (!formData.dni.trim()) newErrors.dni = 'El DNI es obligatorio';
    if (!formData.birthDate) newErrors.birthDate = 'La fecha de nacimiento es obligatoria';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateProfile(formData);
    setSaving(false);
    setEditing(false);
    toast({
      title: '¡Perfil actualizado!',
      description: 'Tus datos se han guardado correctamente.',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const resetForm = () => {
    setEditing(false);
    setErrors({});
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      dni: user?.dni || '',
      birthDate: user?.birthDate || '',
      phone: user?.phone || '',
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">Administra tu información personal</p>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4">
          <span className="text-4xl font-bold text-primary-foreground">
            {formData.firstName?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <h2 className="text-xl font-semibold">{formData.firstName} {formData.lastName}</h2>
        <p className="text-muted-foreground">{formData.email}</p>
      </div>

      {/* Form */}
      <div className="bg-card rounded-xl p-4 border border-border shadow-card space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Nombre *
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!editing}
              className={errors.firstName ? 'border-destructive' : ''}
            />
            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos *</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!editing}
              className={errors.lastName ? 'border-destructive' : ''}
            />
            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Correo electrónico *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!editing}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dni" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            DNI *
          </Label>
          <Input
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            disabled={!editing}
            className={errors.dni ? 'border-destructive' : ''}
          />
          {errors.dni && <p className="text-xs text-destructive">{errors.dni}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate" className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            Fecha de nacimiento *
          </Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            disabled={!editing}
            className={errors.birthDate ? 'border-destructive' : ''}
          />
          {errors.birthDate && <p className="text-xs text-destructive">{errors.birthDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Teléfono
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>

        <div className="pt-4 flex gap-3">
          {editing ? (
            <>
              <Button 
                onClick={handleSave} 
                className="flex-1"
                disabled={saving}
              >
                {saving ? (
                  <LoadingSpinner size="sm" className="border-primary-foreground/30 border-t-primary-foreground" />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Guardar
                  </>
                )}
              </Button>
              <Button 
                onClick={resetForm} 
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)} className="w-full">
              Editar Perfil
            </Button>
          )}
        </div>
      </div>

      {/* Logout */}
      <Button 
        onClick={handleLogout} 
        variant="outline" 
        className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Cerrar Sesión
      </Button>
    </div>
  );
};

export default Profile;
