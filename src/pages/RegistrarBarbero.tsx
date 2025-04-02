import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiBarberoService from "../services/apiBarberoService";
import { Box, Button, Container, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import DeleteIcon from '@mui/icons-material/Delete';
import { getUserRole } from "../services/authService";
import { Visibility } from "@mui/icons-material";

const RegistrarBarbero = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const rol: any = getUserRole();
    const idBarberia = location.state?.id ; // Obtenemos el ID de `state`

    const [listaBarberos, setListadosBarberos] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
       
        if (!idBarberia) {
            navigate("/barberias"); // Redirige si no hay ID
        }
        obtenerBarberosPorBarberias()
    }, [idBarberia, navigate]);


    const obtenerBarberosPorBarberias = async() => {
        try {
        const data = await apiBarberoService.getBarberoPorBarberia(idBarberia);
        setListadosBarberos(data)
     
     
          } catch (error) {
            console.error("Error al obtener barberos por id", error);
          }
    }

    const handleEliminarBarbero = (id:any) => {
        console.log({id})

    }

    const handleAgregarServicios = (data:any) => {
        
        navigate("/servicios-barbero", {state: {data}})
       
    }

    const handActualizar = (id:any) => {
        console.log({id})

    }

    const abrirFormularioCrearBarbero = () => {
        navigate("/crear-barbero", { state: { idBarberia } } );
        // formularioBarberia.reset()
    }
    
    const handleChangePage = (event: any, newPage: any) => {
        console.log(event)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return idBarberia ? (
        <>
      
        <Container maxWidth={false} sx={{ p: 3 }}>
            <Typography variant="h2" sx={{ mb: 3, textAlign: "center" }}>
                Lista de Barberos Admin
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
                    <br />
                    <br />
                  {  (rol?.role=== "Super_Admin" || rol?.role === "Admin") && <Button variant="contained" color="primary" onClick={abrirFormularioCrearBarbero}>
                        Agregar Barbero
                    </Button>}
                    <br />
                    <br />
                    <Table size="small"> {/* Hace la tabla más compacta */}
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: "4%", textAlign: "center", p: 1 }}>ID</TableCell>
                                <TableCell sx={{ width: "10%", p: 1 }}>Nombre Barberia</TableCell>
                                <TableCell sx={{ width: "10%", p: 1 }}>Nombre</TableCell>
                                <TableCell sx={{ width: "15%", p: 1 }}>Email</TableCell>
                                <TableCell sx={{ width: "10%", p: 1 }}>Dirección</TableCell>
                                <TableCell sx={{ width: "8%", p: 1 }}>Teléfono</TableCell>
                                <TableCell sx={{ width: "5%", textAlign: "center", p: 1 }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listaBarberos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell sx={{ textAlign: "center", p: 1 }}>{user.id}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{user.nombreBarberia}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{user.nombre}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{user.email}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{user.direccion}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{user.telefono}</TableCell>
                                    <TableCell sx={{ textAlign: "center", p: 1 }}>
                                        <Stack direction="row" spacing={1} justifyContent="center">

                                        {(rol?.role === "Super_Admin" || rol?.role === "Admin") && (
                                                <Tooltip title="Agregar Srvicios del Barbero">
                                                    <IconButton color="error" onClick={() => handleAgregarServicios(user.id) }>
                                                        <Visibility fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                          { ( rol?.role=== "Super_Admin" || rol?.role === "Admin") &&  <Tooltip title="Actualizar">
                                                <IconButton color="warning" onClick={() => handActualizar(user.id)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>}
                                         
                                            {rol?.role === "Super_Admin" && (
                                                <Tooltip title="Eliminar">
                                                    <IconButton color="error" onClick={() => handleEliminarBarbero(user.id)}>
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
                        count={listaBarberos.length}
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
    ) : null;
};

export default RegistrarBarbero;
