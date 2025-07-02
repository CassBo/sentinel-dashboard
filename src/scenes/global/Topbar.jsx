import { Box, IconButton, useTheme, InputBase } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";

const Topbar = ({ isMobile, onMobileMenuToggle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* LADO IZQUIERDO */}
      <Box display="flex" alignItems="center" gap={1}>
        {/* Botón menú - solo en móviles */}
        {isMobile && (
          <IconButton
            onClick={onMobileMenuToggle}
            sx={{
              color: colors.grey[100],
              padding: '12px',
              marginRight: '8px'
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Barra de búsqueda - se oculta en pantallas XS */}
        <Box
          display={{ xs: 'none', sm: 'flex' }}
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          padding= "10px"
        >
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      {/* LADO DERECHO */}
      <Box display="flex" alignItems="center">
        {/* Ícono de búsqueda visible solo en XS */}
        <IconButton
          sx={{
            display: { xs: 'block', sm: 'none' }
          }}
        >
          <SearchIcon />
        </IconButton>

        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        {/* Íconos opcionalmente responsivos */}
        <IconButton sx={{ display: { xs: 'none', sm: 'block' } }}>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton sx={{ display: { xs: 'none', md: 'block' } }}>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar; 