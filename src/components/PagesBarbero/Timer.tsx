import { useState, useEffect } from "react";

interface TimerProps {
  fechaHoraInicio: string;
  duracion: string;
}

const Timer: React.FC<TimerProps> = ({ fechaHoraInicio, duracion }) => {
  

  // 🔍 Convertir "HH:MM:SS" a minutos
  const parseDuration = (duracion: string): number => {
    const parts = duracion.split(":").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      console.error("Error: Formato de duración inválido");
      return 0;
    }
    const [hours, minutes, seconds] = parts;
    return hours * 60 + minutes + seconds / 60;
  };

  const duracionEnMinutos = parseDuration(duracion);


  const startTime = new Date(fechaHoraInicio).getTime();
  const currentTime = new Date().getTime();

  if (isNaN(startTime)) {
    console.error("Error: Fecha de inicio no válida");
    return <h2>Error: Fecha no válida</h2>;
  }

  // 📌 Comprobamos si la fecha actual ya alcanzó la fecha de inicio
  const hasStarted = currentTime >= startTime;


  const elapsedTime = hasStarted ? Math.floor((currentTime - startTime) / 1000) : 0;
  const totalDuration = duracionEnMinutos * 60; // Convertir minutos a segundos
  const initialTimeLeft = hasStarted ? Math.max(totalDuration - elapsedTime, 0) : totalDuration;


  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [started, setStarted] = useState(hasStarted);

  useEffect(() => {
    if (!started) {
      // Esperar hasta que la fecha de inicio sea alcanzada
      const checkStart = setInterval(() => {
        const now = new Date().getTime();
        if (now >= startTime) {
          setStarted(true);
          clearInterval(checkStart);
        }
      }, 1000);

      return () => clearInterval(checkStart);
    }

    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, started]);

  // Formatear tiempo a "hh:mm:ss"
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "00:00:00";
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return <h2>{started ? `Tiempo restante: ${formatTime(timeLeft)}` : "Esperando inicio..."}</h2>;
};

export default Timer;
