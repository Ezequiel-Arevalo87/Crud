import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

// Guardar el token en sessionStorage
export const setToken = (token: string) => {
  
  sessionStorage.setItem(TOKEN_KEY, token);
};

// Obtener el token de sessionStorage
export const getToken = () => {
  
  return sessionStorage.getItem(TOKEN_KEY);
};



// Obtener el rol del usuario desde el token
export const getUserRole = (): string | null => {
  
  const token = getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    console.log(decoded.role);
    return decoded || null; // Asegúrate de que el backend envíe el rol con este nombre
  
  } catch (error) {
    console.error("Error al decodificar el token", error);
    return null;
  }
};

