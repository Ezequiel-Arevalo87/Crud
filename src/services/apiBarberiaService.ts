import axios from "axios";
import { getToken} from "./authService";

const apiBarberia = axios.create({
  // baseURL:'http://localhost:7238/api',
   baseURL: "https://backend-barberias-1.onrender.com/api", // Reemplaza con tu URL real
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token en cada petición
apiBarberia.interceptors.request.use(
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
const apiBarberiaService = {
  // Obtener lista de usuarios


  async getMisBarberias() {
    try {
      const response = await apiBarberia.get("/Barberias/mis-barberias");
      return response.data;
    } catch (error) {
      console.error("Error al obtener barberias", error);
      throw error;
    }
  },

  // Obtener un usuario por ID
  async getBarberiasPublicas() {
    try {
      const response = await apiBarberia.get(`/Barberias/publicas`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener barberia", error);
      throw error;
    }
  },

 

  // Crear usuario
  async postBarberia(data: any) {
    try {
      const response = await apiBarberia.post("/barberias", data);
      return response.data;
    } catch (error) {
      console.error("Error al crear barberia", error);
      throw error;
    }
  },


  async putBarberia(id: string, data: any) {
    try {
      const response = await apiBarberia.put(`/barberias/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar barberia", error);
      throw error;
    }
  },

  // Eliminar usuario
  async deleteBarberia(id: string) {
    try {
      const response = await apiBarberia.delete(`/barberias/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar barberia", error);
      throw error;
    }
  },
};

export default apiBarberiaService;
