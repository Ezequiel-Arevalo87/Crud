import React from "react";

// Función para formatear a moneda colombiana
export const formatCurrency = (value?: number): string => {
  // Validar que value no sea undefined o null
  if (value === undefined || value === null) return "$0";

  return `$${value.toLocaleString("es-CO")}`;
};

// Función para quitar la máscara de moneda y devolver un número puro
export const unformatCurrency = (value: string): number => {
  return Number(value.replace(/[^0-9]/g, ""));
};

// Componente reutilizable para mostrar moneda
interface CurrencyFormatterProps {
  value?: number;
}

const CurrencyFormatter: React.FC<CurrencyFormatterProps> = ({ value }) => {
  return <span>{formatCurrency(value)}</span>;
};

export default CurrencyFormatter;
