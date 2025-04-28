import axios from "axios";
import { getToken } from "./authService";

// ✅ Usa la variable de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL, // 🔥 Se adapta automáticamente a local o producción
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor para agregar el token a cada request
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Todos los métodos de API
const apiService = {
  async getUsuarioById(id: any) {
    try {
      const response = await api.get(`/Barberias/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener usuario:", error);
      throw error;
    }
  },

  async postUsuario(data: any) {
    try {
      const response = await api.post("/usuarios", data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear usuario:", error);
      throw error;
    }
  },

  async putUsuario(id: string, data: any) {
    try {
      const response = await api.put(`/usuarios/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      throw error;
    }
  },

  async deleteUsuario(id: string) {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
      throw error;
    }
  },
};

export default apiService;
