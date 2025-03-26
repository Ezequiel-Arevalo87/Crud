import { motion } from "framer-motion";
import { FaCut, FaSpinner } from "react-icons/fa";
// import "./LoadingScissors.scss";
import "./LoadingScissors.scss";


const LoadingScissors = () => {
  return (
    <div className="loading-container">
      {/* Icono de las tijeras animado */}
      <motion.div
        className="scissors-icon"
        animate={{ rotate: [0, 30, -30, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
      >
        <FaCut />
      </motion.div>

      {/* Spinner giratorio simulando el poste de barbería */}
      <motion.div
        className="spinner-icon"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      >
        <FaSpinner />
      </motion.div>
    </div>
  );
};

export default LoadingScissors;
