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
  try {
    if (!payload.notification) {
      console.warn("⚠️ No se recibió la notificación en el payload.");
      return;
    }

    const { title, body } = payload.notification;

    // 📢 Mostrar la notificación en el navegador
    self.registration.showNotification(title, {
      body,
      icon: "/icon.png", // asegúrate que este icono exista en /public
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

// ✅ Agrega esto NUEVO abajo:
self.addEventListener('message', (event) => {
  console.log('💬 Mensaje recibido en Service Worker:', event.data);
});
