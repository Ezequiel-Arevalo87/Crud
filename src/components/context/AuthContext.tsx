import { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
  verRegistro: boolean;
  setVerRegistro: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [verRegistro, setVerRegistro] = useState(false);

  return (
    <AuthContext.Provider value={{ verRegistro, setVerRegistro }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
