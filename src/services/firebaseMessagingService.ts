import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// 🔥 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDstft2h7ZPSyH36RBrn8gkFk4Q970KRZ8",
  authDomain: "barberapp-notifications.firebaseapp.com",
  projectId: "barberapp-notifications",
  storageBucket: "barberapp-notifications.firebasestorage.app",
  messagingSenderId: "102933081417",
  appId: "1:102933081417:web:44650414da2d862e3cbe98",
  measurementId: "G-0YXR0XDQ6S",
};

// 🔥 Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

// 📌 Obtener Token para notificaciones
export const obtenerToken = async (): Promise<string | null> => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BHUIX2XhHeW0zEvr-7p-VjnWscgyrEnXA5i_mHSxZiY3wPH14xyQhH1sj3IBufOOD36G8qdrGgpNVLDmExRtTBY",
    });

    if (currentToken) {
      console.log("✅ Token obtenido:", currentToken);
      return currentToken;
    } else {
      console.warn("⚠️ No se pudo obtener el token.");
      return null;
    }
  } catch (err) {
    console.error("❌ Error al obtener el token:", err);
    return null;
  }
};

// 📩 Escuchar Notificaciones en Primer Plano
export const escucharNotificaciones = () => {
  onMessage(messaging, (payload) => {
    console.log("📩 Notificación en primer plano:", payload);

    if (payload.notification) {
      alert(`📢 ${payload.notification.title}: ${payload.notification.body}`);
    }
  });
};
