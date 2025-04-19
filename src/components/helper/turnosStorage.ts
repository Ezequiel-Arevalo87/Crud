export const getTurnosAgregados = (): number[] => {
    return JSON.parse(localStorage.getItem("turnos_agregados") || "[]");
  };
  
  export const agregarTurnoAlHistorial = (turnoId: number): void => {
    const historial = getTurnosAgregados();
    if (!historial.includes(turnoId)) {
      historial.push(turnoId);
      localStorage.setItem("turnos_agregados", JSON.stringify(historial));
    }
  };
  
  export const yaSeAgregoTurno = (turnoId: number): boolean => {
    const historial = getTurnosAgregados();
    return historial.includes(turnoId);
  };
  