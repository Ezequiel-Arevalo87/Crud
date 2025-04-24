import { useState, useEffect } from 'react';
import {
  Box, Tab, Tabs, List, ListItem, ListItemText, Avatar, Button, Typography
} from '@mui/material';
import Timer from './Timer';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/es';
import { groupBy } from 'lodash';

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
  motivoCancelacion:string;
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
    case 'EN PROCESO': return { backgroundColor: '#ffe082' };
    case 'PENDIENTE': return { backgroundColor: '#e3f2fd' };
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
  
      if (estadoOriginal === 2 || estadoOriginal === 4 || estadoOriginal === 3) {
        return turn;
      }
  
      const inicio = dayjs(turn.fechaHoraInicio);
      const [h, m, s] = turn.duracion.split(':').map(Number);
      const minutos = h * 60 + m + Math.floor(s / 60);
      const fin = inicio.add(minutos, 'minute');
  
      if (ahora.isAfter(fin)) {
        return { ...turn, estado: 2 };
      } else if (ahora.isAfter(inicio)) {
        return { ...turn, estado: 1 };
      } else {
        return { ...turn, estado: 0 };
      }
    });
  
    setTurnosActualizados([...actualizados]); // 🔁 asegurar nueva referencia
  }, [JSON.stringify(listaTurnos)]); // 👈 ya estaba bien
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const turnosFiltrados = {
    enProceso: turnosActualizados.filter(turn => {
      const estado = normalizarEstado(turn.estado);
      return estado === 'EN PROCESO' || estado === 'PENDIENTE';
    }),
    cerrados: turnosActualizados.filter(turn => normalizarEstado(turn.estado) === 'CERRADO'),
    cancelados: turnosActualizados.filter(turn => normalizarEstado(turn.estado) === 'CANCELADO' || normalizarEstado(turn.estado) === 'DISPONIBLE')
  };

  const turnosAgrupados = groupBy(turnosFiltrados.enProceso, turno =>
    dayjs(turno.fechaHoraInicio).format('YYYY-MM-DD')
  );

  const fechas = Object.keys(turnosAgrupados).sort();
  const fechasPrincipales = fechas.slice(0, 4);
  const fechasExtras = fechas.slice(4);
  const todasLasFechas = [...fechasPrincipales, ...(fechasExtras.length ? ['OTRAS'] : [])];

  const [fechaTabSeleccionada, setFechaTabSeleccionada] = useState<string>('');
  useEffect(() => {
    if (!fechaTabSeleccionada && todasLasFechas.length > 0) {
      setFechaTabSeleccionada(todasLasFechas[0]); // Selecciona la primera fecha disponible
    }
  }, [todasLasFechas]);
  

  const handleFechaTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setFechaTabSeleccionada(todasLasFechas[newValue]);
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
        <Tabs
          value={todasLasFechas.indexOf(fechaTabSeleccionada)}
          onChange={handleFechaTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}
        >
          {fechasPrincipales.map(fecha => (
            <Tab
              key={fecha}
              label={dayjs(fecha).format('dddd, DD [de] MMMM')}
            />
          ))}
          {fechasExtras.length > 0 && <Tab label="Otras" />}
        </Tabs>

        {todasLasFechas.map((fecha, _index) => (
          <Box key={fecha} role="tabpanel" hidden={fechaTabSeleccionada !== fecha}>
            {(fecha === 'OTRAS' ? fechasExtras : [fecha]).flatMap((f) =>
              turnosAgrupados[f]?.map(turn => (
                <ListItem key={turn.id} sx={{ p: 2, borderRadius: 2, mb: 2, ...obtenerEstiloTurno(turn.estado) }}>
                  <Avatar src="https://d1itoeljuz09pk.cloudfront.net/don_juan_barberia_new/gallery/1707023662914.jpeg" alt="Cliente" sx={{ mr: 2 }} />
                  <ListItemText
                    primary={`${turn.clienteNombre} ${turn.clienteApellido} - ${turn.servicioNombre}`}
                    secondary={
                      <>
                        <p>Fecha Inicio: {turn.fechaHoraInicio}</p>
                        <p>Duración: {turn.duracion}</p>
                        <Timer fechaHoraInicio={turn.fechaHoraInicio} duracion={turn.duracion} />
                      </>
                    }
                  />
                  <Typography variant="body2" color="primary" sx={{ ml: 2 }}>
                    {normalizarEstado(turn.estado)}
                  </Typography>
                  {normalizarEstado(turn.estado) !== 'EN PROCESO' && (
                    <Button variant="outlined" color="error" onClick={() => handleOpenModal(turn.id)} sx={{ ml: 2 }}>
                      Cancelar
                    </Button>
                  )}
                </ListItem>
              ))
            )}
          </Box>
        ))}
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
                CERRADO
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Cancelados */}
      <Box role="tabpanel" hidden={selectedTab !== 2}>
  <List>
    {turnosFiltrados.cancelados.map((turn) => (
      <ListItem
        key={turn.id}
        sx={{
          p: 2,
          borderRadius: 2,
          mb: 2,
          bgcolor: "#f9f9f9",
          boxShadow: 1,
          alignItems: "flex-start",
        }}
      >
        <Avatar
          src="https://d1itoeljuz09pk.cloudfront.net/don_juan_barberia_new/gallery/1707023662914."
          alt="Cliente"
          sx={{ mr: 2 }}
        />
        <ListItemText
          primary={
            <Typography fontWeight="bold">
              {turn.clienteNombre} {turn.clienteApellido} – {turn.servicioNombre}
            </Typography>
          }
          secondary={
            <>
              <Typography variant="body2" color="textSecondary">
                {`${turn.fechaHoraInicio} - ${turn.duracion}`}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                <strong>Motivo:</strong> {turn.motivoCancelacion}
              </Typography>
            </>
          }
        />
        <Typography
          variant="caption"
          color="error"
          sx={{ fontWeight: "bold", ml: 2, mt: 0.5 }}
        >
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