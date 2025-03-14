import Swal from "sweetalert2";

const SwalAlert = {
  confirmDelete: async (title: string, text: string = "No podrás revertir esto") => {
    return await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
  },

  confirActualizar: async (title: string, text: string = "No podrás revertir esto") => {
    return await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
    });
  },

  success: (title: string, text: string = "") => {
    Swal.fire({
      title,
      text,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  },

  errorInicioSesion : (title: string, text: string = "Algo salió mal, correo o clave erroneas") => {
    Swal.fire({
      title,
      text,
      icon: "error",
    });
  
  },

  error: (title: string, text: string = "Algo salió mal") => {
    Swal.fire({
      title,
      text,
      icon: "error",
    });
  },
};

export default SwalAlert;
