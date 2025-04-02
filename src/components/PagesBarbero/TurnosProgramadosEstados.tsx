// --- TurnosProgramadosEstados.tsx ---
import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, List, ListItem, ListItemText, Avatar, Button, Typography } from '@mui/material';
import Timer from './Timer';

interface Turno {
  id: number;
  clienteNombre: string;
  clienteApellido: string;
  servicioNombre: string;
  fechaHoraInicio: string;
  duracion: string; // ✅ ahora es string en formato "HH:mm:ss"
  estado: string;
}

interface TurnosProgramadosEstadosProps {
  listaTurnos: Turno[];
  handleOpenModal: (id: number) => void;
}

const TurnosProgramadosEstados: React.FC<TurnosProgramadosEstadosProps> = ({ listaTurnos, handleOpenModal }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [turnos, setTurnos] = useState<Turno[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const actualizados = listaTurnos.map((turno) => {
        const fechaInicio = new Date(turno.fechaHoraInicio);
        const [h, m, s] = turno.duracion.split(":").map(Number);
        const duracionMs = (h * 3600 + m * 60 + s) * 1000;
        const fechaFin = new Date(fechaInicio.getTime() + duracionMs);
  
        let nuevoEstado = turno.estado;
  
        if (turno.estado !== 'CERRADO') {
          if (now >= fechaInicio && now < fechaFin) {
            nuevoEstado = 'EN_PROCESO';
          } else if (now >= fechaFin) {
            nuevoEstado = 'CERRADO';
          } else {
            nuevoEstado = 'Pendiente';
          }
        }
  
        return { ...turno, estado: nuevoEstado };
      });
  
      setTurnos(actualizados);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [listaTurnos]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event)
    setSelectedTab(newValue);
  };

  const turnosFiltrados = {
    enProceso: turnos.filter(turn => turn.estado === 'EN_PROCESO' || turn.estado === 'Pendiente'),
    cerrados: turnos.filter(turn => turn.estado === 'CERRADO'),
    cancelados: turnos.filter(turn => turn.estado === 'CANCELADO')
  };

  const obtenerEstiloTurno = (estado: string) => {
    switch (estado) {
      case 'EN_PROCESO':
        return { backgroundColor: '#ffe082' };
      case 'Pendiente':
        return { backgroundColor: '#e3f2fd' };
      default:
        return {};
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={selectedTab} onChange={handleTabChange} aria-label="turnos programados">
        <Tab label="Pendientes / En Proceso" />
        <Tab label="Cerrados" />
        <Tab label="Cancelados" />
      </Tabs>

      {/* Pendientes / En Proceso */}
      <Box role="tabpanel" hidden={selectedTab !== 0}>
        <List>
          {turnosFiltrados.enProceso.map(turn => (
            <ListItem
              key={turn.id}
              sx={{
                p: 2,
                borderRadius: 2,
                mb: 2,
                ...obtenerEstiloTurno(turn.estado),
              }}
            >
              <Avatar src="https://d1itoeljuz09pk.cloudfront.net/don_juan_barberia_new/gallery/1707023662914.jpeg" alt="Cliente" sx={{ mr: 2 }} />
              <ListItemText
                primary={`${turn.clienteNombre} ${turn.clienteApellido} - ${turn.servicioNombre}`}
                secondary={
                  <>
                    <p>Fecha Inicio: {turn.fechaHoraInicio}</p>
                    <p>Duración: {turn.duracion}</p>
                    <Timer
                      fechaHoraInicio={turn.fechaHoraInicio}
                      duracion={turn.duracion}
                    />
                  </>
                }
              />
              {turn.estado === 'EN_PROCESO' && (
                <Typography variant="body2" color="primary" sx={{ ml: 2 }}>
                  En Proceso
                </Typography>
              )}
              {turn.estado === 'Pendiente' && (
                <Typography variant="body2" color="primary" sx={{ ml: 2 }}>
                  Pendiente
                </Typography>
              )}
              {turn.estado === 'EN_PROCESO' ? null : (
                <Button variant="outlined" color="error" onClick={() => handleOpenModal(turn.id)} sx={{ ml: 2 }}>
                  Cancelar
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Cerrados */}
      <Box role="tabpanel" hidden={selectedTab !== 1}>
        <List>
          {turnosFiltrados.cerrados.map(turn => (
            <ListItem key={turn.id} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
              <Avatar src="https://d1itoeljuz09pk.cloudfront.net/don_juan_barberia_new/gallery/1707023662914.jpeg" alt="Cliente" sx={{ mr: 2 }} />
              <ListItemText
                primary={`${turn.clienteNombre} ${turn.clienteApellido} - ${turn.servicioNombre}`}
                secondary={`${turn.fechaHoraInicio} - ${turn.duracion}`}
              />
              <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                Cerrado
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Cancelados */}
      <Box role="tabpanel" hidden={selectedTab !== 2}>
        <List>
          {turnosFiltrados.cancelados.map(turn => (
            <ListItem key={turn.id} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
              <Avatar src="https://via.placeholder.com/40" alt="Cliente" sx={{ mr: 2 }} />
              <ListItemText
                primary={`${turn.clienteNombre} ${turn.clienteApellido} - ${turn.servicioNombre}`}
                secondary={`${turn.fechaHoraInicio} - ${turn.duracion}`}
              />
              <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                Cancelado
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default TurnosProgramadosEstados;