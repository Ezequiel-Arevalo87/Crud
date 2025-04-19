import axios from "axios";
import { setToken } from "./authService";

// Endpoints de login para cada tipo de usuario
const loginEndpoints = [
  "http://localhost:7238/api/Auth/login",
  "http://localhost:7238/api/Auth/loginBarberia",
  "http://localhost:7238/api/Auth/loginBarbero"
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
