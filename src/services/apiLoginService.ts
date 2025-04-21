import axios from "axios";
import { setToken } from "./authService";

// Endpoints de login para cada tipo de usuario
const loginEndpoints = [
  "https://backend-barberias-1.onrender.com/api/Auth/login",
  "https://backend-barberias-1.onrender.com/api/Auth/loginBarberia",
  "https://backend-barberias-1.onrender.com/api/Auth/loginBarbero"
];

// Login único que prueba todas las rutas
export const login = async (correo: string, clave: string) => {
  const headers = { "Content-Type": "application/json" };

  for (const url of loginEndpoints) {
    try {
      const response = await axios.post(url, { correo, clave }, { headers });

      if (response.data?.token) {
        setToken(response.data.token); // Guarda el token en sessionStorage
        return response.data; // Retorna los datos completos
      }
    } catch (error: any) {
      console.warn(`❌ Falló intento en: ${url}`);
    }
  }

  // Si ninguno funcionó, lanza error genérico
  throw new Error("Correo o contraseña incorrectos");
};
