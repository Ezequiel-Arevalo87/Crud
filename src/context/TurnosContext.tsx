// src/context/TurnosContext.tsx

import  { createContext, useContext, useState, ReactNode } from 'react';

interface Turno {
  id: number;
  barberoId: number;
  clienteNombre: string;
  clienteApellido: string;
  servicioNombre: string;
  fechaHoraInicio: string;
  duracion: string;
  estado: number;
  motivoCancelacion: string;
}

interface TurnosContextType {
  turnos: Turno[];
  setTurnos: (turnos: Turno[]) => void;
  agregarTurno: (turno: Turno) => void;
}

const TurnosContext = createContext<TurnosContextType | undefined>(undefined);

export const TurnosProvider = ({ children }: { children: ReactNode }) => {
  const [turnos, setTurnos] = useState<Turno[]>([]);

  const agregarTurno = (turno: Turno) => {
    setTurnos(prev => {
      // Verificamos que no exista un turno duplicado
      const existe = prev.some(t => t.id === turno.id);
      if (existe) return prev;
      return [...prev, turno];
    });
  };

  return (
    <TurnosContext.Provider value={{ turnos, setTurnos, agregarTurno }}>
      {children}
    </TurnosContext.Provider>
  );
};

export const useTurnos = () => {
  const context = useContext(TurnosContext);
  if (!context) {
    throw new Error('useTurnos debe usarse dentro de un TurnosProvider');
  }
  return context;
};
