import axios from "axios";
import { setToken } from "./authService";

// ✅ Lee la URL base desde tu archivo .env
const API_URL = import.meta.env.VITE_API_URL;

// ✅ Login endpoints construidos con la baseURL
const loginEndpoints = [
  `${API_URL}/Auth/login`,
  `${API_URL}/Auth/loginBarberia`,
  `${API_URL}/Auth/loginBarbero`
];

// 🔐 Login que prueba todas las rutas disponibles
export const login = async (correo: string, clave: string) => {
  const headers = { "Content-Type": "application/json" };

  for (const url of loginEndpoints) {
    try {
      const response = await axios.post(url, { correo, clave }, { headers });

      if (response.data?.token) {
        setToken(response.data.token); // Guarda token (en sessionStorage u otra lógica tuya)
        return response.data; // Retorna el usuario y token
      }
    } catch (error: any) {
      console.warn(`❌ Falló intento en: ${url}`);
    }
  }

  throw new Error("Correo o contraseña incorrectos");
};
