import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

export const setToken = (token: string) => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

// ✅ Mantener esto así para que las rutas no se rompan
export const getUserRole = (): string | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded?.role || null;
  } catch (error) {
    return null;
  }
};

// ✅ Nueva utilidad para obtener el token completo
export const getDecodedToken = (): any | null => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

// ✅ Para acceder al ID del usuario (barbero)
export const getUserId = (): number | null => {
  const decoded = getDecodedToken();
  console.log(decoded)
  return decoded?.nameid ? parseInt(decoded.nameid) : null;
};

export const getUserEmail = (): string | null => {
  const decoded = getDecodedToken();
  console.log(decoded)
  return decoded?.email || null;
};
