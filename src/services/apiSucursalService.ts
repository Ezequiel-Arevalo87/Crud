import axios from "axios";
import { getToken} from "./authService";

const apiBarberiaSucursal = axios.create({
  // baseURL:'http://localhost:7238/api',
   baseURL: "https://backend-barberias-1.onrender.com/api", // Reemplaza con tu URL real
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token en cada petición
apiBarberiaSucursal.interceptors.request.use(
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
const apiBarberiaSucursalService = {
  // Obtener lista de usuarios


  async getBarberias() {
    try {
      const response = await apiBarberiaSucursal.get("/barberias");
      return response.data;
    } catch (error) {
      console.error("Error al obtener barberias", error);
      throw error;
    }
  },

  
  async getBarberiaById(id: number) {
    try {
      const response = await apiBarberiaSucursal.get(`/barberias/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener barberia", error);
      throw error;
    }
  },

 

  async postBarberiaSucursal(data: any) {
    try {
      const response = await apiBarberiaSucursal.post("/sucursalBarberia", data);
      return response.data;
    } catch (error) {
      console.error("Error al crear sucursal barberia", error);
      throw error;
    }
  },


  async putBarberia(id: string, data: any) {
    try {
      const response = await apiBarberiaSucursal.put(`/barberias/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar barberia", error);
      throw error;
    }
  },

  
  async deleteBarberia(id: string) {
    try {
      const response = await apiBarberiaSucursal.delete(`/barberias/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar barberia", error);
      throw error;
    }
  },
};

export default apiBarberiaSucursalService;
