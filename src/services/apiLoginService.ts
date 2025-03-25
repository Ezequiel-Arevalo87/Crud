import axios from "axios";
import { setToken } from "./authService";

const apiLoginService = axios.create({
  baseURL: "https://localhost:7148/api/Auth/login", // Reemplaza con tu URL real
  headers: { "Content-Type": "application/json" },
});

export const login = async (correo: string, clave: string) => {
  try {
    const response = await apiLoginService.post("", { correo, clave });

    if (response.data?.token) {
      setToken(response.data.token); // Guarda el token en sessionStorage
      return response.data;
    } else {
      throw new Error("No se recibió un token");
    }
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error);

    // Extraer el mensaje de error adecuado
    let errorMessage = "Error desconocido al iniciar sesión";
    if (error.response) {
      errorMessage = error.response.data?.message || "Credenciales incorrectas";
    } else if (error.request) {
      errorMessage = "No se recibió respuesta del servidor";
    } else {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};
