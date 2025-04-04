// --- BarberPage.tsx ---
import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Button, Typography, Badge, List, ListItem, ListItemText,
  IconButton, Modal, TextField, Box, Avatar, Collapse,
  Divider
} from '@mui/material';
import { FaBell, FaClock, FaMinus, FaPlus } from 'react-icons/fa';
import dayjs from 'dayjs';
import apiServiciosService from '../../services/apiServiciosService';
import { getUserRole } from '../../services/authService';
import { formatCurrency } from '../maskaras/CurrencyFormatter';
import apiTurnosService from '../../services/apiTurnosService';
import TurnosProgramadosEstados from './TurnosProgramadosEstados';
import useNotification from '../useNotification';

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

  const role: any = getUserRole();
  const notification = useNotification();



  // Reloj en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(dayjs().format('HH:mm:ss'));
      setDate(dayjs().format('YYYY-MM-DD'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Servicios y turnos iniciales
  useEffect(() => {
    obtenerServiciosBarbero();
    obtenerTurnosBarbero();
  }, []);

  // Recalcular estados cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const actualizados = listaTurnos.map((turno) => {
        const fechaInicio = new Date(turno.fechaHoraInicio);
        const [h, m, s] = turno.duracion.split(":").map(Number);
        const duracionMs = (h * 3600 + m * 60 + s) * 1000;
        const fechaFin = new Date(fechaInicio.getTime() + duracionMs);

        let estado = turno.estado;
        if (estado !== 'CERRADO') {
          if (now >= fechaInicio && now < fechaFin) estado = 'EN_PROCESO';
          else if (now >= fechaFin) estado = 'CERRADO';
          else estado = 'Pendiente';
        }

        return { ...turno, estado };
      });

      setListaTurnos(actualizados);
      const visibles = actualizados.filter(t => t.estado === 'Pendiente' || t.estado === 'EN_PROCESO');
      setTurnosActivos(visibles);
    }, 1000);

    return () => clearInterval(interval);
  }, [listaTurnos]);


  useEffect(() => {
    if (notification?.data) {
      agregarTurnoDesdeNotificacion(notification.data);
    }
  }, [notification]);

  const agregarTurnoDesdeNotificacion = (nuevoTurno: any) => {
    const turnoFormateado = {
      id: Number(nuevoTurno.TurnoId),
      clienteNombre: nuevoTurno.ClienteNombre,
      clienteApellido: nuevoTurno.ClienteApellido,
      servicioNombre: nuevoTurno.ServicioNombre,
      fechaHoraInicio: nuevoTurno.FechaHoraInicio,
      duracion: nuevoTurno.Duracion,
      estado: nuevoTurno.Estado,
    };

    const yaExiste = listaTurnos.some(t => t.id === turnoFormateado.id);
    if (!yaExiste) {
      const nuevos = [...listaTurnos, turnoFormateado];
      setListaTurnos(nuevos);
      localStorage.setItem("turnos_extra", JSON.stringify(nuevos));
      setCampanaActiva(true);
      setTimeout(() => setCampanaActiva(false), 1500);
    }
  };

  const obtenerTurnosBarbero = async () => {
    try {
      const response = await apiTurnosService.getTurnos(Number(role.nameid));
      const turnosExtra = JSON.parse(localStorage.getItem("turnos_extra") || "[]");
      const idsExistentes = new Set(response.map((t: any) => t.id));
      const turnosCombinados = [
        ...response,
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
      const data = await apiServiciosService.getServicios();
      setFiltroServicioPorBarbero(data.filter((b: any) => b.barberoId === Number(role.nameid) && b.estado === 1));
    } catch {
      console.log('Error al obtener los servicios');
    }
  };

  const handleOpenModal = (id: number) => {
    setSelectedTurnId(id);
    setOpenModal(true);
  };

  const handleCancelTurn = () => {
    if (selectedTurnId !== null) {
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
            <IconButton className={campanaActiva ? "campana-activa" : ""}>
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

                {/* Solo agregamos el Divider si no es el último elemento */}
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
