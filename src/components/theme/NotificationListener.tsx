// src/components/NotificationListener.tsx
import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../firebase";
import { Snackbar } from "@mui/material";
import { createRoot } from "react-dom/client";

const NotificationListener = () => {

useEffect(() => {
  const unsubscribe = onMessage(messaging, (payload) => {
    const title = payload.notification?.title || "Notificación";  
    const body = payload.notification?.body || "Nuevo mensaje recibido";

    const data = payload.data;

    // 🔊 Reproducir sonido
    const audio = new Audio("/sonido-notificacion.mp3");
    audio.play().catch((e) => console.warn("🔇 Error al reproducir sonido", e));

    // 🔔 Mostrar notificación del navegador
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/icono-barberia.png",
        requireInteraction: true,
      });
    }

    // 🧃 Mostrar snackbar
    mostrarSnackbar(`${title} — ${body}`);

    // 🧩 Si es una notificación de tipo "Cancelacion", actualizar los turnos en pantalla
    if (data?.Tipo === "Cancelacion" && data?.TurnoId) {
      const turnoId = parseInt(data.TurnoId);
      const nuevoEstado = parseInt(data.NuevoEstado);

      // ✅ Disparar evento global o usar contexto/estado para actualizar
      window.dispatchEvent(
        new CustomEvent("turno-cancelado", {
          detail: { turnoId, nuevoEstado },
        })
      );
    }
  });

  return () => unsubscribe();
}, []);

  return null; // no renderiza nada visible
};

const mostrarSnackbar = (mensaje: string) => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const root = createRoot(div);
  root.render(
    <Snackbar
      open={true}
      autoHideDuration={5000}
      onClose={() => {
        root.unmount();
        div.remove();
      }}
      message={mensaje}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    />
  );
};

export default NotificationListener;
