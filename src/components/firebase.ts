import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDstft2h7ZPSyH36RBrn8gkFk4Q970KRZ8",
    authDomain: "barberapp-notifications.firebaseapp.com",
    projectId: "barberapp-notifications",
    storageBucket: "barberapp-notifications.firebasestorage.app",
    messagingSenderId: "102933081417",
    appId: "1:102933081417:web:44650414da2d862e3cbe98",
    measurementId: "G-0YXR0XDQ6S"
};

// ⚠️ Verifica si la app ya está inicializada antes de crearla
const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const messaging = getMessaging(firebaseApp);
