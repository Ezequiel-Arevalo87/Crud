
import { Box, Button, Container, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from "react-router-dom";
import { getUserRole } from "../services/authService";
// import apiServiciosService from "../services/apiServiciosService";


const ServiciosBarbero = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const rol: any = getUserRole();

    const idBarbero = location.state?.data === undefined ?location.state?.idBarbero : location.state?.data; 

    const [listaServicios, setListaServicios] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(()=> {
        debugger
      if(!idBarbero){
        navigate('/barberias')
      }
    },[])
    // useEffect(()=> {
    //     obtenerServiciosPorBarbero()
    // },[])


    // const obtenerServiciosPorBarbero = async() => {
    //     try {
    //     const data = await apiServiciosService.getServiciosPorBarbero(idBarbero);
    //     setListaServicios(data)
     
     
    //       } catch (error) {
    //         console.error("Error al obtener barberos por id", error);
    //       }
    // }
    const abrirFormularioCrearServicios = () => {
        navigate("/crear-servicio-barbero", {state:{idBarbero}})
        console.log('sds')
    }

    const handActualizar = (id: any) => {
        console.log('sds', id)
    }

    const handleCambiarEstado = (id: any) => {
        console.log('sds', id)
    }

    const handleChangePage = (event: any, newPage: any) => {
        console.log(event)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <>

            <Container maxWidth={false} sx={{ p: 3 }}>
                <Typography variant="h2" sx={{ mb: 3, textAlign: "center" }}>
                    Lista de servicios prestada por el Barbero
                </Typography>

                <Box sx={{ mt: 3, overflowX: "auto" }}>

                    <TableContainer component={Paper} sx={{
                        width: "80%",
                        minWidth: "1000px",
                        margin: "auto",
                        mt: 2,
                        p: 2,
                        boxShadow: 3,
                    }}>
                       
                      
                        <Button variant="contained" color="primary" onClick={abrirFormularioCrearServicios}>
                            Agregar un servicio
                        </Button>
                        
                        <Table size="small"> {/* Hace la tabla más compacta */}
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: "4%", textAlign: "center", p: 1 }}>ID</TableCell>
                                    <TableCell sx={{ width: "10%", p: 1 }}>Servicios</TableCell>
                                    <TableCell sx={{ width: "10%", p: 1 }}>Descripción</TableCell>
                                    <TableCell sx={{ width: "15%", p: 1 }}>Estado</TableCell>
                                    <TableCell sx={{ width: "10%", p: 1 }}>Iamgen</TableCell>
                                    <TableCell sx={{ width: "8%", p: 1 }}>Observación</TableCell>
                                    <TableCell sx={{ width: "8%", p: 1 }}>Precio</TableCell>
                                    <TableCell sx={{ width: "8%", p: 1 }}>Precio Especial</TableCell>
                                    <TableCell sx={{ width: "8%", p: 1 }}>Servicio</TableCell>
                                    <TableCell sx={{ width: "8%", p: 1 }}>Tiempo</TableCell>
                                    <TableCell sx={{ width: "5%", textAlign: "center", p: 1 }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listaServicios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user: any) => (
                                    <TableRow key={user.id}>
                                        <TableCell sx={{ textAlign: "center", p: 1 }}>{user.id}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.servicio}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.descripcion}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.estado}</TableCell>
                                        <TableCell sx={{ p: 1 }}>
                                            {user.foto ? (
                                                <img
                                                    src={user.foto}
                                                    alt="Foto"
                                                    style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "50%" }}
                                                />
                                            ) : (
                                                "Sin imagen"
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.observacion}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.precio}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.precioEspecial}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.servicio}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.tiempo}</TableCell>
                                        <TableCell sx={{ textAlign: "center", p: 1 }}>
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Tooltip title="Actualizar">
                                                    <IconButton color="warning" onClick={() => handActualizar(user.id)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                {rol?.role === "Super_Admin" && (
                                                    <Tooltip title="Eliminar">
                                                        <IconButton color="error" onClick={() => handleCambiarEstado(user.id)}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
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
                            count={listaServicios.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Box>
                {/* {
                actualizarDatosBarberias !== '' ?
                    <ActualizarUsuario
                        barberias={barberias}
                        formularioActualizar={formularioBarberia}
                        fetchUsuarios={fetchBarberias}
                        setActualizarDatosBarberias={setActualizarDatosBarberias}
                    /> : null
            } */}
            </Container>

        </>
    )
}

export default ServiciosBarbero;
