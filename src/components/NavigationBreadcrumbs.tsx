import { useEffect, useState } from 'react';
import {
  Breadcrumbs,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useLocation } from 'react-router-dom';

const NavigationBreadcrumbs = () => {
  const location = useLocation();
  const [history, setHistory] = useState<string[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const currentPath = location.pathname;

    // Limpiar historial si está en Home o Login
    if (currentPath === '/' || currentPath === '/login') {
      setHistory([]);
      return;
    }

    // Ajustar historial según navegación
    setHistory((prev) => {
      const index = prev.findIndex((path) => path === currentPath);
      if (index !== -1) {
        return prev.slice(0, index + 1);
      }
      return [...prev, currentPath];
    });
  }, [location]);

  // Puedes ocultar en móviles si quieres
  if (isMobile && history.length === 0) return null;

  return (
    <Box
      sx={{
        padding: isMobile ? '6px 12px' : '10px 20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        margin: isMobile ? '10px' : '20px',
      }}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          fontSize: isMobile ? '0.8rem' : '1rem',
        }}
      >
        <Typography
          color="inherit"
          component="div"
          fontSize={isMobile ? '0.8rem' : '1rem'}
        >
          Home
        </Typography>
        {history.map((path, index) => {
          const isLast = index === history.length - 1;
          const pathSegments = path.split('/').filter((x) => x);
          const label = pathSegments[pathSegments.length - 1] || 'Home';

          return (
            <Typography
              key={path}
              color={isLast ? 'text.primary' : 'inherit'}
              fontWeight={isLast ? 'bold' : 'normal'}
              fontSize={isMobile ? '0.8rem' : '1rem'}
            >
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default NavigationBreadcrumbs;
