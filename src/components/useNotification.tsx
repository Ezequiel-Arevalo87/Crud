import { useEffect, useState } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

interface NotificationPayload {
  title: string;
  body: string;
  data?: any;
}

const useNotification = () => {
  const [notification, setNotification] = useState<NotificationPayload | null>(null);

  useEffect(() => {
    // 🔓 Solicitar permiso de notificación si no se ha otorgado
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((perm) => {
        if (perm !== "granted") {
          console.warn("🔕 Permiso de notificación denegado");
        }
      });
    }

    // 📩 Notificación en primer plano (mientras la app está abierta)
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 Notificación recibida en primer plano:", payload);

      const title = payload.notification?.title || "Notificación";
      const body = payload.notification?.body || "Nuevo mensaje recibido";
      const data = payload.data || {};

      // 🔊 Reproducir sonido (asegúrate de tener este archivo en public/)
      const audio = new Audio("/sonido-notificacion.mp3");
      audio.play().catch((e) => console.warn("🔇 Error al reproducir sonido", e));

      // 🔔 Mostrar notificación del sistema
      if (Notification.permission === "granted") {
        new Notification(title, {
          body,
          icon: "/icono-barberia.png", // debe estar en public/
          requireInteraction: true,    // no se cierra sola
          silent: false                // permite sonido del sistema
        });
      }

      setNotification({ title, body, data });
    });

    // 🔁 Notificación desde el Service Worker (en segundo plano)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "NEW_NOTIFICATION") {
          const { notification, data } = event.data.payload;

          const title = notification?.title || "Notificación";
          const body = notification?.body || "Nuevo mensaje recibido";

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

          setNotification({ title, body, data });
        }
      });
    }

    return () => unsubscribe();
  }, []);

  return notification;
};

export default useNotification;
