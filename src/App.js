import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, Box, useTheme, useMediaQuery } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

// Componentes globales
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";

// Vistas
import Dashboard from "./scenes/dashboard";
import Invoices from "./scenes/invoices";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar";

// Componentes de gestión
import AddUsers from "./scenes/contacts/addUsers";
import ManageTeam from "./scenes/team/teamManager";

// Login y autenticación
import Login from "./log/Login";
import SignUp from "./log/SignUp";
import ForgotPassword from "./log/ForgotPassword";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  
  // Detectar tamaño de pantalla
  const currentTheme = useTheme();
  const isMobile = useMediaQuery(currentTheme.breakpoints.down('md')); // < 900px
  const isTablet = useMediaQuery(currentTheme.breakpoints.between('md', 'lg')); // 900px - 1200px
  const isDesktop = useMediaQuery(currentTheme.breakpoints.up('lg')); // > 1200px

  // Detectar si es una pantalla pública
  const publicRoutes = ["/", "/signup", "/forgot-password"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Auto-colapsar sidebar en dispositivos móviles
  useEffect(() => {
    if (isMobile) {
      setIsSidebar(false);
      setIsMobileMenuOpen(false);
    } else if (isTablet) {
      setIsSidebar(false); // Colapsar en tablets por defecto
    } else {
      setIsSidebar(true); // Expandir en desktop
    }
  }, [isMobile, isTablet]);

  // Detectar usuario autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Cerrar menú móvil al navegar
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {/* Layout para rutas públicas */}
        {isPublicRoute ? (
          <Box 
            sx={{ 
              width: '100%', 
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: { xs: '16px', sm: '24px', md: '32px' }
            }}
          >
            <Routes>
              <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/dashboard" />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
        ) : (
          /* Layout para rutas privadas con Sidebar y Topbar */
          <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            
            {/* Sidebar - Comportamiento responsivo */}
            <Box
              sx={{
                // En móvil: overlay con backdrop
                ...(isMobile && {
                  position: 'fixed',
                  top: 0,
                  left: isMobileMenuOpen ? 0 : '-100%',
                  height: '100vh',
                  zIndex: 1300,
                  transition: 'left 0.3s ease-in-out',
                  '&::before': isMobileMenuOpen ? {
                    content: '""',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: -1,
                  } : {},
                }),
                // En tablet y desktop: comportamiento normal
                ...(!isMobile && {
                  position: 'relative',
                  transition: 'width 0.3s ease-in-out',
                }),
              }}
              onClick={(e) => {
                // Cerrar menú móvil al hacer click en el backdrop
                if (isMobile && e.target === e.currentTarget) {
                  setIsMobileMenuOpen(false);
                }
              }}
            >
              <Sidebar 
                isSidebar={isMobile ? true : isSidebar}
                isMobile={isMobile}
                onClose={() => setIsMobileMenuOpen(false)}
              />
            </Box>
            
            {/* Contenido principal */}
            <Box 
              sx={{ 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                // En móvil, ocupar toda la pantalla
                width: isMobile ? '100%' : 'auto',
                minWidth: 0, // Previene overflow en flex
              }}
            >
              {/* Topbar */}
              <Topbar 
                setIsSidebar={setIsSidebar}
                isMobile={isMobile}
                onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                isMobileMenuOpen={isMobileMenuOpen}
              />
              
              {/* Contenido de las rutas */}
              <Box 
                sx={{ 
                  flexGrow: 1,
                  overflow: 'auto',
                  backgroundColor: theme.palette.background.default,
                  // Padding responsivo
                  padding: {
                    xs: '12px 8px',     // Móvil: padding mínimo
                    sm: '16px 12px',    // Móvil grande: padding pequeño
                    md: '20px 16px',    // Tablet: padding medio
                    lg: '24px 20px',    // Desktop: padding completo
                    xl: '32px 24px'     // Desktop grande: padding máximo
                  },
                  // Ancho máximo para evitar líneas de texto muy largas
                  maxWidth: '100%',
                }}
              >
                <Box
                  sx={{
                    maxWidth: { xl: '1400px' }, // Limitar ancho en pantallas muy grandes
                    margin: '0 auto', // Centrar contenido
                    width: '100%'
                  }}
                >
                  <Routes>
                    {/* Rutas protegidas */}
                    <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
                    <Route path="/team" element={user ? <ManageTeam /> : <Navigate to="/" />} />
                    <Route path="/contacts" element={user ? <AddUsers /> : <Navigate to="/" />} />
                    <Route path="/add-users" element={user ? <AddUsers /> : <Navigate to="/" />} />
                    <Route path="/manage-team" element={user ? <ManageTeam /> : <Navigate to="/" />} />
                    <Route path="/invoices" element={user ? <Invoices /> : <Navigate to="/" />} />
                    <Route path="/form" element={user ? <Form /> : <Navigate to="/" />} />
                    <Route path="/bar" element={user ? <Bar /> : <Navigate to="/" />} />
                    <Route path="/pie" element={user ? <Pie /> : <Navigate to="/" />} />
                    <Route path="/line" element={user ? <Line /> : <Navigate to="/" />} />
                    <Route path="/faq" element={user ? <FAQ /> : <Navigate to="/" />} />
                    <Route path="/calendar" element={user ? <Calendar /> : <Navigate to="/" />} />
                    <Route path="/geography" element={user ? <Geography /> : <Navigate to="/" />} />
                    
                    {/* Ruta no encontrada - Redirige al dashboard si está autenticado, sino al login */}
                    <Route path="*" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/" />} />
                  </Routes>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;