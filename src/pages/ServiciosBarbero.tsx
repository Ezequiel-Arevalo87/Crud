import {
    Box, Button, Container, IconButton, Paper, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
    TableRow, Tooltip, Typography, useMediaQuery
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import EditIcon from '@mui/icons-material/Edit';
  import { useLocation, useNavigate } from "react-router-dom";
  import theme from "../components/theme/theme";
  import apiServiciosService from "../services/apiServiciosService";
  import { Add } from "@mui/icons-material";
import { formatCurrency } from "../components/maskaras/CurrencyFormatter";
  
  const ServiciosBarbero = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
    const idBarbero =
      location.state?.data === undefined
        ? location.state?.idBarbero
        : location.state?.data;
  
    const [listaServicios, setListaServicios] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    useEffect(() => {
      if (!idBarbero) {
        navigate("/barberias");
      } else {
        obtenerServiciosPorBarbero();
      }
    }, [idBarbero]);
  
    const obtenerServiciosPorBarbero = async () => {
      try {
        const data = await apiServiciosService.getServiciosPorBarbero(idBarbero);
        setListaServicios(data);
      } catch (error) {
        console.error("Error al obtener servicios del barbero", error);
      }
    };
  
    const abrirFormularioCrearServicios = () => {
      navigate("/crear-servicio-barbero", { state: { idBarbero } });
    };
  
    const handActualizar = (idServicio: any) => {
      navigate("/crear-servicio-barbero", {
        state: { idServicio, idBarbero },
      });
    };
  
    const handleChangePage = (_event: any, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: any) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    return (
      <Container maxWidth={false} sx={{ p: 3 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="bold"
          textAlign="center"
          mb={3}
        >
          Lista de servicios prestados por el Barbero
        </Typography>
  
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={abrirFormularioCrearServicios}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
          >
            Agregar un servicio
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
              borderRadius: 2,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell>Imagen</TableCell>
                  <TableCell>Servicio</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Observación</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Precio Especial</TableCell>
                  <TableCell>Servicio</TableCell>
                  <TableCell>Tiempo</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listaServicios
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell align="center">{user.id}</TableCell>
                      <TableCell>
                        {user.foto ? (
                          <img
                            src={user.foto}
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
                      <TableCell>{user.servicio}</TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 200,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Tooltip title={user.descripcion} placement="top">
                          <span>
                            {user.descripcion?.length > 100
                              ? `${user.descripcion.substring(0, 100)}...`
                              : user.descripcion}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {user.estado === 0 ? "Inactivo" : "Activo"}
                      </TableCell>
                    
                      <TableCell>{user.observacion}</TableCell>
                      <TableCell>{`${formatCurrency(user.precio)}`}</TableCell>
                      <TableCell>{`${formatCurrency(user.precioEspecial) }`}</TableCell>
                      <TableCell>{user.servicio}</TableCell>
                      <TableCell>{`${user.tiempo} Min.`}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Actualizar">
                            <IconButton
                              color="warning"
                              onClick={() => handActualizar(user)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
  
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={listaServicios.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>
      </Container>
    );
  };
  
  export default ServiciosBarbero;
  