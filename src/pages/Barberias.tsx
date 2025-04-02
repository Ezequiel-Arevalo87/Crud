import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Container, Box, Stack,
    TablePagination,
    IconButton,
    Tooltip
} from "@mui/material";
import SwalAlert from "../components/alerts/SwalAlert";
import { useForm } from "react-hook-form";
import ActualizarUsuario from "./ActualizarUsuario";
import { getUserRole } from "../services/authService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Today, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import apiBarberiaService from "../services/apiBarberiaService";
import LoadingScissors from "../components/loading/LoadingScissors";

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

        }
    })

    const [barberias, setBarberias] = useState([]);
    const [actualizarDatosBarberias, setActualizarDatosBarberias] = useState('');
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const rol: any = getUserRole();
    const navigate = useNavigate();


    useEffect(() => {
        fetchBarberias();
    }, []);

    const fetchBarberias = async () => {
        setLoading(true)
        try {
            const data = await apiBarberiaService.getBarberias();
            setBarberias(data);
            setLoading(false)
        } catch (error) {
            console.error("Error al cargar barberias", error);
        }
    };

    const handleEliminarBarberia = async (id: string) => {
        const result = await SwalAlert.confirmDelete("¿Estás seguro?", "Esta acción no se puede deshacer");
        if (result.isConfirmed) {
            try {
                await apiBarberiaService.deleteBarberia(id);
                setBarberias(barberias.filter((user: any) => user.id !== id));
                SwalAlert.success("Barberia eliminado", "La Barneria ha sido eliminado correctamente");
            } catch (error) {
                console.error("Error al eliminar barberia", error);
                SwalAlert.error("Error", "Hubo un problema al eliminar la barberia");
            }
        }
    };
    const handActualizar = async (id: string) => {
        setActualizarDatosBarberias(id)
        setBarberias(barberias.filter((user: any) => user.id === id));
    };

    const abrirFormularioCrearBarberia = () => {
        navigate("/crear-barberia");
        formularioBarberia.reset()
    }

    const handleChangePage = (event: any, newPage: any) => {
        console.log(event)
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
        return (
            <div >
                <LoadingScissors />
            </div>
        );
    }
    return (
        <>

            <Container maxWidth={false} sx={{ p: 3 }}>
                <Typography variant="h2" sx={{ mb: 3, textAlign: "center" }}>
                    Lista de Barberias Admin
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

                        {(rol?.role === "Super_Admin") && <Button variant="contained" color="primary" onClick={abrirFormularioCrearBarberia}>
                            Agregar Barberia
                        </Button>}

                        <Table size="small"> {/* Hace la tabla más compacta */}
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: "4%", textAlign: "center", p: 1 }}>ID</TableCell>
                                    <TableCell sx={{ width: "10%", p: 1 }}>Nombre</TableCell>
                                    <TableCell sx={{ width: "15%", p: 1 }}>Email</TableCell>
                                    <TableCell sx={{ width: "10%", p: 1 }}>Dirección</TableCell>
                                    <TableCell sx={{ width: "8%", p: 1 }}>Teléfono</TableCell>
                                    <TableCell sx={{ width: "5%", textAlign: "center", p: 1 }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {barberias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user: any) => (
                                    <TableRow key={user.id}>
                                        <TableCell sx={{ textAlign: "center", p: 1 }}>{user.id}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.nombre}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.email}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.direccion}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.telefono}</TableCell>
                                        <TableCell sx={{ textAlign: "center", p: 1 }}>
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                            {(rol?.role === "Super_Admin" || rol?.role === "Admin") && (
                                                    <Tooltip title="Agregar Horario">
                                                        <IconButton color="info" onClick={() => handleHorarios(user.id)}>
                                                            <Today fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {(rol?.role === "Super_Admin" || rol?.role === "Admin") && (
                                                    <Tooltip title="Agregar Barbero">
                                                        <IconButton color="success" onClick={() => handleRegistrar(user.id)}>
                                                            <Visibility fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                              
                                                {
                                                    rol?.role === "Super_Admin" &&
                                                    <Tooltip title="Actualizar">
                                                        <IconButton color="warning" onClick={() => handActualizar(user.id)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                }


                                                {rol?.role === "Super_Admin" && (
                                                    <Tooltip title="Eliminar">
                                                        <IconButton color="error" onClick={() => handleEliminarBarberia(user.id)}>
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
                            count={barberias.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Box>
                {
                    actualizarDatosBarberias !== '' ?
                        <ActualizarUsuario
                            barberias={barberias}
                            formularioActualizar={formularioBarberia}
                            fetchUsuarios={fetchBarberias}
                            setActualizarDatosBarberias={setActualizarDatosBarberias}
                        /> : null
                }
            </Container>

        </>
    );
};

export default Barberias;
