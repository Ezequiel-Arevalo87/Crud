import { useEffect, useState } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { Snackbar } from "@mui/material";
import { createRoot } from "react-dom/client"; // ✅ React 18 compatible

interface NotificationPayload {
  title: string;
  body: string;
  data?: any;
}

const useNotification = () => {
  const [notification, setNotification] = useState<NotificationPayload | null>(null);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      const title = payload.notification?.title || "Notificación";
      const body = payload.notification?.body || "Nuevo mensaje recibido";
      const data = payload.data || {};

      const audio = new Audio("/sonido-notificacion.mp3");
      audio.play().catch((e) => console.warn("🔇 Error al reproducir sonido", e));

      if (Notification.permission === "granted") {
        new Notification(title, {
          body,
          icon: "/icono-barberia.png",
          requireInteraction: true,
          silent: false,
        });
      }

      mostrarSnackbar(`${title} — ${body}`);
      setNotification({ title, body, data });
    });

    return () => unsubscribe();
  }, []);

  return notification;
};

export default useNotification;

// ✅ Snackbar visual (React 18 compatible)
const mostrarSnackbar = (mensaje: string) => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const root = createRoot(div); // ✅ React 18
  root.render(
    <Snackbar
      open={true}
      autoHideDuration={5000}
      onClose={() => {
        root.unmount(); // ✅ React 18
        div.remove();
      }}
      message={mensaje}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    />
  );
};
