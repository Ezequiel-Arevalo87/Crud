import { useEffect, useState } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

interface NotificationPayload {
  title: string;
  body: string;
  data?: any; // 👈 Aquí llega la info del turno
}

const useNotification = () => {
  const [notification, setNotification] = useState<NotificationPayload | null>(null);

  useEffect(() => {
    // 📩 Escuchar notificaciones en primer plano
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 Notificación en primer plano:", payload);

      setNotification({
        title: payload.notification?.title || "Notificación",
        body: payload.notification?.body || "Nuevo mensaje recibido",
        data: payload.data || {}, // ✅ Aquí llega el turno
      });

      new Notification(payload.notification?.title || "Notificación", {
        body: payload.notification?.body || "Nuevo mensaje recibido",
      });
    });

    // 📩 Escuchar notificaciones en segundo plano desde el Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("📩 Notificación en React desde SW:", event.data);

        if (event.data?.type === "NEW_NOTIFICATION") {
          const { notification, data } = event.data.payload;

          setNotification({
            title: notification?.title || "Notificación",
            body: notification?.body || "Nuevo mensaje recibido",
            data: data || {}, // ✅ Turno llega aquí también
          });

          new Notification(notification?.title || "Notificación", {
            body: notification?.body || "Nuevo mensaje recibido",
          });
        }
      });
    }

    return () => unsubscribe();
  }, []);

  return notification;
};

export default useNotification;
