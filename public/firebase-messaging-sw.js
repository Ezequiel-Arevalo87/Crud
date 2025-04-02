importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

// 🔥 Inicializar Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDstft2h7ZPSyH36RBrn8gkFk4Q970KRZ8",
  authDomain: "barberapp-notifications.firebaseapp.com",
  projectId: "barberapp-notifications",
  storageBucket: "barberapp-notifications.firebasestorage.app",
  messagingSenderId: "102933081417",
  appId: "1:102933081417:web:44650414da2d862e3cbe98",
  measurementId: "G-0YXR0XDQ6S",
});

const messaging = firebase.messaging();

// 📩 Manejo de notificaciones en segundo plano
messaging.onBackgroundMessage(async (payload) => {
  console.log("🔥 Notificación en segundo plano recibida:", payload);

  try {
    if (!payload.notification) {
      console.warn("⚠️ No se recibió la notificación en el payload.");
      return;
    }

    const { title, body } = payload.notification;

    // 📢 Mostrar la notificación en el navegador
    self.registration.showNotification(title, {
      body,
      icon: "/icon.png", // Asegúrate de que esta imagen exista en public/
    });

    // 🔄 Enviar la notificación a la aplicación React
    const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });

    allClients.forEach((client) => {
      client.postMessage({
        type: "NEW_NOTIFICATION",
        payload,
      });
    });

  } catch (error) {
    console.error("❌ Error al procesar la notificación en segundo plano:", error);
  }
});
