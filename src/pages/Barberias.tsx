import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Typography, Container, Box, Stack,
  TablePagination,
  IconButton,
  Tooltip,
  useMediaQuery
} from "@mui/material";
import SwalAlert from "../components/alerts/SwalAlert";
import { useForm } from "react-hook-form";
import ActualizarUsuario from "./ActualizarUsuario";
import { getUserRole } from "../services/authService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Today, Visibility, Add } from "@mui/icons-material";
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
  const rol: any = getUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (rol?.role === "Admin" || rol?.role === "Barbero") {
      fetchBarberiasById();
    } else {
      fetchBarberias();
    }
  }, []);

  const fetchBarberias = async () => {
    setLoading(true);
    try {
      const data = await apiBarberiaService.getBarberias();
      setBarberias(data);
    } catch (error) {
      console.error("Error al cargar barberias", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBarberiasById = async () => {
    setLoading(true);
    try {
      const data = await apiBarberiaService.getBarberiaById(Number(rol?.nameid));
      setBarberias([data]);
    } catch (error) {
      console.error("Error al cargar barberias", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarBarberia = async (id: string) => {
    const result = await SwalAlert.confirmDelete("¿Estás seguro?", "Esta acción no se puede deshacer");
    if (result.isConfirmed) {
      try {
        await apiBarberiaService.deleteBarberia(id);
        setBarberias(barberias.filter((user: any) => user.id !== id));
        SwalAlert.success("Barbería eliminada", "La barbería ha sido eliminada correctamente");
      } catch (error) {
        console.error("Error al eliminar barbería", error);
        SwalAlert.error("Error", "Hubo un problema al eliminar la barbería");
      }
    }
  };

  const handActualizar = (id: string) => {
    setActualizarDatosBarberias(id);
    setBarberias(barberias.filter((user: any) => user.id === id));
  };

  const abrirFormularioCrearBarberia = () => {
    navigate("/crear-barberia");
    formularioBarberia.reset();
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRegistrar = (id: number) => {
    navigate("/registrar-barbero", { state: { id } });
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
        Lista de Barberías {rol?.role}
      </Typography>

      {(rol?.role === "Super_Admin") && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
            onClick={abrirFormularioCrearBarberia}
          >
            Agregar Barbería
          </Button>
        </Box>
      )}

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
                <TableCell>Barbería</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {barberias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user: any) => (
                <TableRow key={user.id}>
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
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.direccion}</TableCell>
                  <TableCell>{user.telefono}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {(rol?.role === "Super_Admin" || rol?.role === "Admin") && (
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

                      {rol?.role === "Super_Admin" && (
                        <>
                          <Tooltip title="Actualizar">
                            <IconButton color="warning" onClick={() => handActualizar(user.id)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton color="error" onClick={() => handleEliminarBarberia(user.id)}>
                              <DeleteIcon fontSize="small" />
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
