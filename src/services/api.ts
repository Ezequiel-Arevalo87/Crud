import axios from "axios";
import { getToken } from "./authService";

const api = axios.create({
  baseURL: "https://localhost:7238/api/", // Reemplaza con tu URL real
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token en cada petición
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Métodos API con autenticación
const apiService = {
  // Obtener lista de usuarios
  // async getUsuarios() {
  //   try {
  //     const response = await api.get("/barberias");
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error al obtener barberias", error);
  //     throw error;
  //   }
  // },

  // Obtener un usuario por ID
  async getUsuarioById(id: any) {
    try {
      const response = await api.get(`/Barberias/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuario", error);
      throw error;
    }
  },

  // Crear usuario
  async postUsuario(data: any) {
    try {
      const response = await api.post("/usuarios", data);
      return response.data;
    } catch (error) {
      console.error("Error al crear usuario", error);
      throw error;
    }
  },

  // Actualizar usuario
  async putUsuario(id: string, data: any) {
    try {
      const response = await api.put(`/usuarios/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar usuario", error);
      throw error;
    }
  },

  // Eliminar usuario
  async deleteUsuario(id: string) {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar usuario", error);
      throw error;
    }
  },
};

export default apiService;
