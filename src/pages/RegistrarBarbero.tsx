import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box, Button, Container, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Tooltip, Typography, useMediaQuery
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import { Visibility, Add } from "@mui/icons-material";
import { getUserRole } from "../services/authService";
import apiBarberoService from "../services/apiBarberoService";
import theme from "../components/theme/theme";
import ActualizarBarbero from './ActualizarBarbero';

const RegistrarBarbero = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rol: any = getUserRole();
  const idBarberia = location.state?.id;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [listaBarberos, setListadosBarberos] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [actualizarDatosBarbero, setActualizarDatosBarbero] = useState('');


  useEffect(() => {
    if (!idBarberia) {
      navigate("/barberias");
    } else {
      obtenerBarberosPorBarberias();
    }
  }, [idBarberia, navigate]);

  const obtenerBarberosPorBarberias = async () => {
    try {
      const data = await apiBarberoService.getBarberoPorBarberia(idBarberia);
      setListadosBarberos(data);
    } catch (error) {
      console.error("Error al obtener barberos por id", error);
    }
  };



  const handleAgregarServicios = (data: any) => {
    navigate("/servicios-barbero", { state: { data } });
  };

  const handActualizar = (data: any) => {
    
    setActualizarDatosBarbero(data.id)
    setListadosBarberos([data]);
  };

  const abrirFormularioCrearBarbero = () => {
    navigate("/crear-barbero", { state: { idBarberia } });
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return idBarberia ? (
    <Container maxWidth="xl" sx={{ p: 3 }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight="bold"
        textAlign="center"
        mb={3}
      >
        Lista de Barberos Admin
      </Typography>

      {(rol?.role === "Super_Admin" || rol?.role === "Admin") && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
            onClick={abrirFormularioCrearBarbero}
          >
            Agregar Barbero
          </Button>
        </Box>
      )}


      <Box sx={{ overflowX: "auto" }}>
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell>Foto del Barbero</TableCell>
                <TableCell>Nombre Barbería</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listaBarberos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell align="center">{user.id}</TableCell>
                  <TableCell>
                    {user.fotoBarbero ? (
                      <img
                        src={user.fotoBarbero}
                        alt="Foto"
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: "50%",
                          border: "1px solid #ccc",
                        }}
                      />
                    ) : (
                      "Sin imagen"
                    )}
                  </TableCell>
                  <TableCell>{user.nombreBarberia}</TableCell>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>{user.estado === 0 ? "Inactivo" : "Activo"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.direccion}</TableCell>
                  <TableCell>{user.telefono}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {(rol?.role === "Super_Admin" || rol?.role === "Admin") && (
                        <>
                          <Tooltip title="Agregar Servicios del Barbero">
                            <IconButton color="info" onClick={() => handleAgregarServicios(user.id)}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Actualizar">
                            <IconButton color="warning" onClick={() => handActualizar(user)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}

                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={listaBarberos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
      {actualizarDatosBarbero !== '' && (
        <ActualizarBarbero
          listaBarberos={listaBarberos}
          obtenerBarberosPorBarberias = {obtenerBarberosPorBarberias}
          setActualizarDatosBarbero  = {setActualizarDatosBarbero}
        
        />
      )}
    </Container>
  ) : null;
};

export default RegistrarBarbero;
