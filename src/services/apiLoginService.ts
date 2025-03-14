import axios from "axios";
import { setToken } from "./authService";

const apiLoginService = axios.create({
  baseURL: "https://localhost:7148/api/Auth/login", // Reemplaza con tu URL real
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (correo: string, clave: string) => {
  try {
    const response = await apiLoginService.post("", { correo, clave });
    const token = response.data.token;

    if (token) {
      setToken(token); // Guardamos el token en sessionStorage
    }

    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión", error);
    throw error;
  }
};

export default apiLoginService;
