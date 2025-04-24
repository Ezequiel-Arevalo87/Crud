import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Button, Typography, Badge, List, ListItem, ListItemText,
  IconButton, Modal, TextField, Box, Avatar, Collapse, Divider
} from '@mui/material';
import { FaBell, FaClock, FaMinus, FaPlus } from 'react-icons/fa';
import { keyframes } from '@mui/system';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

import apiServiciosService from '../../services/apiServiciosService';
import { getDecodedToken } from '../../services/authService';
import { formatCurrency } from '../maskaras/CurrencyFormatter';
import apiTurnosService from '../../services/apiTurnosService';
import TurnosProgramadosEstados from './TurnosProgramadosEstados';
import useNotification from '../useNotification';
import { agregarTurnoAlHistorial } from '../../components/helper/turnosStorage';

const campanaTemblor = keyframes`
  0% { transform: rotate(0deg); }
  20% { transform: rotate(-10deg); }
  40% { transform: rotate(10deg); }
  60% { transform: rotate(-8deg); }
  80% { transform: rotate(8deg); }
  100% { transform: rotate(0deg); }
`;

const BarberPage: React.FC = () => {
  const [time, setTime] = useState(dayjs().format('HH:mm:ss'));
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [isServiceCollapsed, setIsServiceCollapsed] = useState(true);
  const [filtroServicioPorBarbero, setFiltroServicioPorBarbero] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedTurnId, setSelectedTurnId] = useState<number | null>(null);
  const [listaTurnos, setListaTurnos] = useState<any[]>([]);
  const [turnosActivos, setTurnosActivos] = useState<any[]>([]);
  const [campanaActiva, setCampanaActiva] = useState(false);
  const decoded = getDecodedToken();
  const nameid = decoded?.barberoId;
  const notification = useNotification();

  useEffect(() => {
    const handler = (event: any) => {
      const { turnoId, nuevoEstado } = event.detail;
  
      setListaTurnos((prevTurnos: any[]) =>
        prevTurnos.map((turno: any) =>
          turno.id === turnoId ? { ...turno, estado: nuevoEstado } : turno
        )
      );
    };
  
    window.addEventListener("turno-cancelado", handler);
  
    return () => window.removeEventListener("turno-cancelado", handler);
  }, []);
  

  useEffect(() => {
    setTurnosActivos([]);
    const timer = setInterval(() => {
      setTime(dayjs().format('HH:mm:ss'));
      setDate(dayjs().format('YYYY-MM-DD'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    obtenerServiciosBarbero();
  }, []);

  useEffect(() => {
    if (notification?.data) {
      agregarTurnoDesdeNotificacion(notification.data);
    }
  }, [notification?.data]);

  useEffect(() => {
    if (!listaTurnos.length) {
      obtenerTurnosBarbero();
    }
  }, []);

  const mapEstadoTextoANumero = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 0;
      case 'en_proceso': return 1;
      case 'cerrado': return 2;
      case 'cancelado': return 3;
      case 'disponible': return 4;
      default: return estado;
    }
  };

  const agregarTurnoDesdeNotificacion = (turnoNotificado: any) => {
    const id = Number(turnoNotificado.TurnoId);
    const nuevoTurno = {
      id,
      clienteNombre: turnoNotificado.ClienteNombre,
      clienteApellido: turnoNotificado.ClienteApellido,
      servicioNombre: turnoNotificado.ServicioNombre,
      fechaHoraInicio: dayjs(turnoNotificado.FechaHoraInicio).format('YYYY-MM-DD HH:mm:ss'),
      duracion: turnoNotificado.Duracion,
      estado: typeof turnoNotificado.Estado === 'string'
        ? mapEstadoTextoANumero(turnoNotificado.Estado)
        : turnoNotificado.Estado,
      barberoId: Number(turnoNotificado.BarberoId),
      motivoCancelacion: turnoNotificado.MotivoCancelacion ?? "", // ✅ si lo estás enviando desde backend
    };
  
    if (nuevoTurno.barberoId !== Number(decoded?.barberoId)) return;
  
    setListaTurnos(prev => {
      const existe = prev.find(t => t.id === id);
      if (existe) {
        // ✅ actualiza completamente ese turno
        return prev.map(t => t.id === id ? { ...t, ...nuevoTurno } : t);
      } else {
        agregarTurnoAlHistorial(id);
        setCampanaActiva(true);
        setTimeout(() => setCampanaActiva(false), 1500);
        // ✅ agrega el nuevo turno
        return [...prev, nuevoTurno];
      }
    });
  };
  

  const obtenerTurnosBarbero = async () => {
    
    try {
      const response = await apiTurnosService.getTurnos(Number(nameid));
      console.log({response})
      const turnosExtra = JSON.parse(localStorage.getItem("turnos_extra") || "[]")
        .filter((t: any) => t.barberoId === Number(nameid));
      const idsExistentes = new Set(response.map((t: any) => t.id));
      const turnosCombinados = [
        ...response.map((t: any) => ({
          ...t,
          fechaHoraInicio: dayjs(t.fechaHoraInicio).format('YYYY-MM-DD HH:mm:ss')
        })),
        ...turnosExtra.filter((t: any) => !idsExistentes.has(t.id))
      ];
      setListaTurnos(turnosCombinados);
      limpiarTurnosLocalesYaGuardados(response);
    } catch (error) {
      console.error("Error al obtener turnos");
    }
  };

  const limpiarTurnosLocalesYaGuardados = (turnosBack: any[]) => {
    const turnosExtra = JSON.parse(localStorage.getItem("turnos_extra") || "[]");
    const idsBack = new Set(turnosBack.map(t => t.id));
    const filtrados = turnosExtra.filter((t: any) => !idsBack.has(t.id));
    localStorage.setItem("turnos_extra", JSON.stringify(filtrados));
  };

  const obtenerServiciosBarbero = async () => {
    try {
      const data = await apiServiciosService.getMisServicios();
      setFiltroServicioPorBarbero(data);
    } catch {
      console.log('Error al obtener los servicios');
    }
  };

  const handleOpenModal = (id: number) => {
    setSelectedTurnId(id);
    setOpenModal(true);
  };

  const handleCancelTurn = async () => {
    if (selectedTurnId !== null) {
      try {
        await apiTurnosService.cancelarTurno({
          turnoId: selectedTurnId,
          motivo: cancelReason,
          rol: "Barbero",
          restaurar: true
        });
        await obtenerTurnosBarbero();
      } catch (error) {
        console.error("Error cancelando turno", error);
      }
      setCancelReason("");
      setOpenModal(false);
    }
  };

  const toggleServiceCollapse = () => setIsServiceCollapsed(!isServiceCollapsed);
  return (
    <Box sx={{ backgroundColor: '#f7f7f7', minHeight: '100vh', py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card sx={{ p: 3, boxShadow: 3, maxWidth: '900px', width: '90%', mb: 4 }}>
        <Typography variant="h5" component="div">Barbería</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography><FaClock /> {time}</Typography>
          <Typography>{date}</Typography>
          <Badge badgeContent={turnosActivos.length} color="error">
            <IconButton
              sx={campanaActiva ? {
                animation: `${campanaTemblor} 0.8s ease-in-out`,
                color: 'orange'
              } : {}}
            >
              <FaBell />
            </IconButton>
          </Badge>
        </Box>
      </Card>

      <Card sx={{ p: 3, boxShadow: 3, maxWidth: '900px', width: '90%', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Mis Servicios</Typography>
          <IconButton onClick={toggleServiceCollapse}>
            {isServiceCollapsed ? <FaPlus /> : <FaMinus />}
          </IconButton>
        </Box>
        <Collapse in={!isServiceCollapsed}>
          <List>
            {filtroServicioPorBarbero.map((ser: any, index: number) => (
              <React.Fragment key={ser?.id}>
                <ListItem alignItems="flex-start">
                  <Avatar src={ser?.foto} alt="Cliente" sx={{ mr: 2 }} />
                  <ListItemText
                    primary={ser?.servicio}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.primary">{`${ser?.tiempo} min`}</Typography>
                        <br />
                        <Typography variant="body2" color="text.secondary">{ser?.descripcion}</Typography>
                        <br />
                        <Typography variant="body2" fontWeight="bold">
                          {ser?.precio > 0 && ser?.precioEspecial > 0 ? (
                            <>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textDecoration: "line-through", mr: 1, display: 'inline' }}
                              >
                                {formatCurrency(Math.max(ser.precio, ser.precioEspecial))}
                              </Typography>
                              {formatCurrency(Math.min(ser.precio, ser.precioEspecial))}
                            </>
                          ) : formatCurrency(ser?.precio === 0 ? ser.precioEspecial : ser?.precio)}
                        </Typography>
                        <br />
                        <Typography variant="body2" color="text.disabled">{ser?.observacion}</Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < filtroServicioPorBarbero.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Collapse>
      </Card>

      <Card sx={{ p: 3, boxShadow: 3, maxWidth: '900px', width: '90%', mb: 4 }}>
        <TurnosProgramadosEstados listaTurnos={listaTurnos} handleOpenModal={handleOpenModal} />
      </Card>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Card sx={{ p: 3, m: 'auto', maxWidth: '400px' }}>
          <CardContent>
            <Typography variant="h6">Motivo de Cancelación</Typography>
            <TextField fullWidth value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Escribe tu observación..." sx={{ mb: 2 }} />
            <Button variant="contained" color="error" onClick={handleCancelTurn}>Cancelar Turno</Button>
          </CardContent>
        </Card>
      </Modal>
    </Box>
  );
};

export default BarberPage;
