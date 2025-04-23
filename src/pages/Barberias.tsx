// Barberias.tsx
import { Fragment, useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Typography, Container, Box, Stack,
  TablePagination,
  IconButton,
  Tooltip,
  useMediaQuery
} from "@mui/material";
import { useForm } from "react-hook-form";
import ActualizarUsuario from "./ActualizarUsuario";
import { getDecodedToken } from "../services/authService";
import EditIcon from "@mui/icons-material/Edit";
import { Today, Visibility, Add, Store } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import apiBarberiaService from "../services/apiBarberiaService";
import LoadingScissors from "../components/loading/LoadingScissors";
import theme from "../components/theme/theme";


const Barberias = () => {
  const formularioBarberia = useForm({
    defaultValues: {
      nombreBarberia: '',
      nombre: '',
      descripcion: '',
      direccion: '',
      telefono: '',
      correo: '',
      clave: '',
      fotoBarberia: '',
    }
  });

  const [barberias, setBarberias] = useState<any[]>([]);
  const [actualizarDatosBarberias, setActualizarDatosBarberias] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const decoded = getDecodedToken();
  const role = decoded?.role;
  
  const navigate = useNavigate();

  useEffect(() => {
    
    if (role === "Admin" || role === "Barbero") {
      fetchBarberiasById();
    } else {
      fetchBarberias();
    }
  }, []);

  

  const fetchBarberias = async () => {
    setLoading(true);
    try {
      const data = await apiBarberiaService.getBarberiasPublicas();
      setBarberias(data);
    } catch (error) {
      console.error("Error al cargar barberías", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBarberiasById = async () => {
    setLoading(true);
    try {
      const data = await apiBarberiaService.getMisBarberias();
      setBarberias(data);
    } catch (error) {
      console.error("Error al cargar barbería", error);
    } finally {
      setLoading(false);
    }
  };

  const handActualizar = (id: string) => {
    setActualizarDatosBarberias(id);
    setBarberias(barberias.filter((user: any) => user.id === id));
  };

  const abrirFormularioCrearBarberia = () => {
    
    const tienePrincipal = barberias.length > 0 && role !== "Super_Admin";
    if (tienePrincipal) {
      navigate("/crear-barberia-sucursal", { state: { barberiaId: barberias[0].id } });
    } else {
      navigate("/crear-barberia");
    }
    formularioBarberia.reset();
  };

  const handleChangePage = (_event: any, newPage: number) => {
  
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRegistrar = (id: number) => {
    
    navigate("/registrar-barbero", { state: { id } });
  };
  const handleRegistrarSucursal = (datosBarberia: number) => {
    
    navigate("/registrar-barbero", { state: { datosBarberia } });
  };

  const handleHorarios = (idBarberia: number) => {
    navigate("/horario-barberia", { state: { idBarberia } });
  };

  if (loading) {
    return <LoadingScissors />;
  }

  return (
    <Container maxWidth={false} sx={{ p: 3 }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight="bold"
        textAlign="center"
        mb={3}
      >
        Lista de Barberías {role}
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={barberias.length > 0 ? <Store /> : <Add />}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
          onClick={abrirFormularioCrearBarberia}
        >
          {barberias.length > 0 && role !== "Super_Admin" ? "Agregar Sucursal" : "Agregar Barbería"}
        </Button>
      </Box>

      <Box sx={{ mt: 3, overflowX: "auto" }}>
        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            minWidth: 1000,
            mx: "auto",
            p: 2,
            boxShadow: 3,
            borderRadius: 2
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Imagen</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {barberias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user: any) => (
                <Fragment key={user.id}>
                  {/* Barbería Principal */}
                  <TableRow>
                    <TableCell align="center">{user.id}</TableCell>
                    <TableCell>{user.nombre}</TableCell>
                    <TableCell>
                      {user.fotoBarberia ? (
                        <img
                          src={user.fotoBarberia}
                          alt="Foto"
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "1px solid #ccc"
                          }}
                        />
                      ) : "Sin imagen"}
                    </TableCell>
                    <TableCell>{user.correo}</TableCell>
                    <TableCell>{user.direccion}</TableCell>
                    <TableCell>{user.telefono}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        {(role === "Super_Admin" || role === "Admin") && (
                          <>
                            <Tooltip title="Agregar Horario">
                              <IconButton color="info" onClick={() => handleHorarios(user.id)}>
                                <Today fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Agregar Barbero">
                              <IconButton color="success" onClick={() => handleRegistrar(user.id)}>
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="Actualizar">
                          <IconButton color="warning" onClick={() => handActualizar(user.id)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>

                  {/* Sucursales */}
                  {user.sucursales?.map((sucursal: any) => (
                    <TableRow key={`sucursal-${sucursal.id}`} sx={{ backgroundColor: "#f9f9f9" }}>
                      <TableCell align="center">—</TableCell>
                      <TableCell>{sucursal.nombre}</TableCell>
                      <TableCell>
                        {sucursal.fotoSucursal ? (
                          <img
                            src={sucursal.fotoSucursal}
                            alt="Foto"
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                              borderRadius: "50%",
                              border: "1px solid #ccc"
                            }}
                          />
                        ) : "Sin imagen"}
                      </TableCell>
                      <TableCell>{/* Email vacío para sucursal */}</TableCell>
                      <TableCell>{sucursal.direccion}</TableCell>
                      <TableCell>{sucursal.telefono}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          {(role === "Super_Admin" || role === "Admin") && (
                            <>
                              <Tooltip title="Agregar Horario">
                                <IconButton color="info" onClick={() => handleHorarios(sucursal.id)}>
                                  <Today fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Agregar Barbero">
                                <IconButton color="success" onClick={() => handleRegistrarSucursal(sucursal)}>
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          <Tooltip title="Actualizar Sucursal">
                            <IconButton color="warning" onClick={() => handActualizar(sucursal.id)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>

          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={barberias.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>

      {actualizarDatosBarberias !== '' && (
        <ActualizarUsuario
          barberias={barberias}
          formularioActualizar={formularioBarberia}
          fetchUsuarios={fetchBarberias}
          setActualizarDatosBarberias={setActualizarDatosBarberias}
        />
      )}
    </Container>
  );
};

export default Barberias;
