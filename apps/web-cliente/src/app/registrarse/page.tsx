'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registrar } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PaginaRegistrarse() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      await registrar(email, password, nombre, celular);
      router.push(`/verificar-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-slate-900">Registro de Conductor</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input placeholder="Nombre" value={nombre} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)} required />
        <Input placeholder="Email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
        <Input placeholder="Celular" value={celular} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCelular(e.target.value)} required />
        <Input placeholder="Contraseña (mínimo 12 caracteres)" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
        <Button type="submit" disabled={cargando}>{cargando ? 'Registrando...' : 'Registrarse'}</Button>
      </form>
    </div>
  );
}
