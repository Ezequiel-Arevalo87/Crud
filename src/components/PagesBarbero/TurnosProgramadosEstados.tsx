// src/components/PagesBarbero/TurnosProgramadosEstados.tsx
import { useState, useEffect } from 'react';
import {
  Box, Tab, Tabs, List, ListItem, ListItemText, Avatar, Button, Typography
} from '@mui/material';
import Timer from './Timer';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/es';


dayjs.locale('es');
dayjs.extend(duration);

interface Turno {
  id: number;
  clienteNombre: string;
  clienteApellido: string;
  servicioNombre: string;
  fechaHoraInicio: string;
  duracion: string;
  estado: string | number;
  barberoId: number;
  motivoCancelacion: string;
}

interface TurnosProgramadosEstadosProps {
  listaTurnos: Turno[];
  handleOpenModal: (id: number) => void;
}

const normalizarEstado = (estado: string | number) => {
  if (estado === 0 || estado === '0') return 'PENDIENTE';
  if (estado === 1 || estado === '1') return 'EN PROCESO';
  if (estado === 2 || estado === '2') return 'CERRADO';
  if (estado === 3 || estado === '3') return 'CANCELADO';
  if (estado === 4 || estado === '4') return 'DISPONIBLE';
  return estado;
};

const obtenerEstiloTurno = (estado: string | number) => {
  const est = normalizarEstado(estado);
  switch (est) {
    case 'EN PROCESO': return { backgroundColor: '#fff8e1' };
    case 'PENDIENTE': return { backgroundColor: '#e3f2fd' };
    case 'CERRADO': return { backgroundColor: '#f0f0f0' };
    case 'CANCELADO': return { backgroundColor: '#ffebee' };
    default: return {};
  }
};

const TurnosProgramadosEstados: React.FC<TurnosProgramadosEstadosProps> = ({ listaTurnos, handleOpenModal }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [turnosActualizados, setTurnosActualizados] = useState<Turno[]>([]);

  useEffect(() => {
    const ahora = dayjs();
    const actualizados = listaTurnos.map(turn => {
      const estadoOriginal = Number(turn.estado);
      const inicio = dayjs(turn.fechaHoraInicio);
      const [h, m, s] = turn.duracion.split(':').map(Number);
      const minutos = h * 60 + m + Math.floor(s / 60);
      const fin = inicio.add(minutos, 'minute');

      if (estadoOriginal === 2 || estadoOriginal === 3 || estadoOriginal === 4) {
        return turn;
      }

      if (ahora.isAfter(fin)) {
        return { ...turn, estado: 2 };
      } else if (ahora.isAfter(inicio)) {
        return { ...turn, estado: 1 };
      } else {
        return { ...turn, estado: 0 };
      }
    });

    setTurnosActualizados([...actualizados]);
  }, [JSON.stringify(listaTurnos)]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const turnosFiltrados = {
    enProceso: turnosActualizados.filter(turn => {
      const estado = normalizarEstado(turn.estado);
      return estado === 'EN PROCESO' || estado === 'PENDIENTE';
    }),
    cerrados: turnosActualizados.filter(turn => normalizarEstado(turn.estado) === 'CERRADO'),
    cancelados: turnosActualizados.filter(turn => {
      const est = normalizarEstado(turn.estado);
      return est === 'CANCELADO' || est === 'DISPONIBLE';
    }),
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={selectedTab} onChange={handleTabChange} aria-label="turnos programados">
        <Tab label="Pendientes / En proceso" />
        <Tab label="Cerrados" />
        <Tab label="Cancelados" />
      </Tabs>

      {/* Pendientes / En Proceso */}
      <Box role="tabpanel" hidden={selectedTab !== 0}>
        <List>
          {turnosFiltrados.enProceso.length === 0 && (
            <Typography textAlign="center" mt={2}>No tienes turnos pendientes.</Typography>
          )}
          {turnosFiltrados.enProceso.map(turn => (
            <ListItem
              key={turn.id}
              sx={{ 
                p: 2,
                mb: 2,
                borderRadius: 2,
                boxShadow: 2,
                ...obtenerEstiloTurno(turn.estado)
              }}
            >
              <Avatar
                src="https://d1itoeljuz09pk.cloudfront.net/don_juan_barberia_new/gallery/1707023662914.jpeg"
                alt="Cliente"
                sx={{ mr: 2 }}
              />
              <ListItemText
                primary={<strong>{turn.clienteNombre} {turn.clienteApellido}</strong>}
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {turn.servicioNombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(turn.fechaHoraInicio).format('dddd DD/MM/YYYY HH:mm')}
                    </Typography>
                    <Timer fechaHoraInicio={turn.fechaHoraInicio} duracion={turn.duracion} />
                  </>
                }
              />
              {normalizarEstado(turn.estado) !== 'EN PROCESO' && (
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
          {turnosFiltrados.cerrados.length === 0 && (
            <Typography textAlign="center" mt={2}>No hay turnos cerrados aún.</Typography>
          )}
          {turnosFiltrados.cerrados.map(turn => (
            <ListItem key={turn.id} sx={{ p: 2, borderRadius: 2, mb: 2, bgcolor: '#f0f0f0', boxShadow: 1 }}>
              <ListItemText
                primary={<strong>{turn.clienteNombre} {turn.clienteApellido}</strong>}
                secondary={`${dayjs(turn.fechaHoraInicio).format('dddd DD/MM/YYYY HH:mm')} - ${turn.duracion}`}
              />
              <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                CERRADO
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Cancelados */}
      <Box role="tabpanel" hidden={selectedTab !== 2}>
        <List>
          {turnosFiltrados.cancelados.length === 0 && (
            <Typography textAlign="center" mt={2}>No tienes turnos cancelados.</Typography>
          )}
          {turnosFiltrados.cancelados.map(turn => (
            <ListItem key={turn.id} sx={{ p: 2, borderRadius: 2, mb: 2, bgcolor: '#ffebee', boxShadow: 1 }}>
              <ListItemText
                primary={<strong>{turn.clienteNombre} {turn.clienteApellido}</strong>}
                secondary={
                  <>
                    {dayjs(turn.fechaHoraInicio).format('dddd DD/MM/YYYY HH:mm')} - {turn.duracion}
                    <br />
                    <Typography variant="caption" color="error">
                      Motivo: {turn.motivoCancelacion}
                    </Typography>
                  </>
                }
              />
              <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                CANCELADO
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default TurnosProgramadosEstados;
