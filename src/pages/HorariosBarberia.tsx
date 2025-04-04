import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    TextField,
    Button
} from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiHorariosBarberiaService from "../services/apiHorariosBarberiaService";

const HorariosBarberia = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const idBarberia = location.state?.idBarberia || 0;

    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const [horarios, setHorarios] = useState(
        diasSemana.map((dia) => ({
            barberiaId: idBarberia,
            diaSemana: dia,
            esFestivo: dia === "Domingo", // Domingo es festivo
            abierto: dia !== "Domingo", // Domingo cerrado
            horaInicio: dia === "Sábado" ? "08:00" : "09:00",
            horaFin: dia === "Sábado" ? "13:00" : "18:00",
        }))
    );

    const actualizarHorario = (index: number, campo: string, valor: string | boolean) => {
        setHorarios((prev) =>
            prev.map((h, i) => (i === index ? { ...h, [campo]: valor } : h))
        );
    };

    const guardarHorarios = async () => {
        
        try {
            const horariosAEnviar = horarios.map((h) => ({
                barberiaId: h.barberiaId,
                diaSemana: h.diaSemana,
                esFestivo: h.diaSemana === "Domingo" ? h.esFestivo : h.esFestivo, // Permitir definir festivo en domingo
                abierto: h.diaSemana === "Domingo" ? h.abierto : h.abierto, // Respetar si está abierto o cerrado
                horaInicio: h.abierto ? h.horaInicio : "00:00",
                horaFin: h.abierto ? h.horaFin : "00:00",
            }));
    
            await apiHorariosBarberiaService.postHorarioBarberia(horariosAEnviar);
            alert("Horarios guardados con éxito");
            navigate("/barberias");
        } catch (error) {
            console.error("Error al guardar la barbería", error);
        }
    };
    
    

    return (
        <TableContainer
            component={Paper}
            sx={{
                mt: 10,
                mx: "auto",
                p: 3,
                maxWidth: 600,
                textAlign: "center",
            }}
        >
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Día</TableCell>
                        <TableCell>Abierto</TableCell>
                        <TableCell>Hora Inicio</TableCell>
                        <TableCell>Hora Fin</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {horarios.map((horario, index) => (
                        <TableRow key={index}>
                            <TableCell>{horario.diaSemana}</TableCell>
                            <TableCell>
                                <Checkbox
                                    checked={horario.abierto}
                                    onChange={(e) => actualizarHorario(index, "abierto", e.target.checked)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type="time"
                                    value={horario.horaInicio}
                                    onChange={(e) => actualizarHorario(index, "horaInicio", e.target.value)}
                                    disabled={!horario.abierto}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type="time"
                                    value={horario.horaFin}
                                    onChange={(e) => actualizarHorario(index, "horaFin", e.target.value)}
                                    disabled={!horario.abierto}
                                    size="small"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, width: "100%" }}
                onClick={guardarHorarios}
            >
                Guardar Horarios
            </Button>
        </TableContainer>
    );
};

export default HorariosBarberia;
