import axios from "axios";
import { getToken} from "./authService";

const apiBarberia = axios.create({
  baseURL: "http://localhost:7238/api", // Reemplaza con tu URL real
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
const apiTipoDocumentos = {
  // Obtener lista de usuarios
  async getTiposDocumentos() {
    try {
      const response = await apiBarberia.get("/tipoDocumento");
      return response.data;
    } catch (error) {
      console.error("Error al obtener barberias", error);
      throw error;
    }
  },
};

export default apiTipoDocumentos;
