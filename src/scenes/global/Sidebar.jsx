import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import CloseIcon from "@mui/icons-material/Close";
import React from "react"

const Item = ({ title, to, icon, selected, setSelected, isMobile, onClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isActive = selected === title;

  const handleClick = () => {
    setSelected(title);
    // Cerrar menú móvil al seleccionar un item
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <MenuItem
      active={isActive}
      onClick={handleClick}
      icon={React.cloneElement(icon, {
        style: {
          color: isActive ? "#ffffff" : colors.grey[100],
          fontSize: isMobile ? '20px' : '16px', // Iconos más grandes en móvil
        },
      })}
      style={{
        color: isActive ? "#ffffff" : colors.grey[100],
        padding: isMobile ? "12px 16px" : "10px 16px", // Más padding en móvil
        margin: "6px 0",
        borderRadius: "15px",
        backgroundColor: isActive ? colors.primary[600] : "transparent",
        transition: "background-color 0.3s ease",
        width: "95%",
        marginLeft: "2%",
        boxSizing: "border-box",
        minHeight: isMobile ? '48px' : 'auto', // Altura mínima para toque fácil
      }}
    >
      <Typography
        sx={{
          color: isActive ? "#ffffff" : colors.grey[100],
          whiteSpace: "normal",
          wordWrap: "break-word",
          fontSize: isMobile ? '14px' : '13px', // Texto más grande en móvil
          fontWeight: isMobile ? 500 : 400,
        }}
      >
        {title}
      </Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ isSidebar, isMobile, onClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(!isSidebar);
  const [selected, setSelected] = useState("Dashboard");
  
  // Auto-detectar si es tablet
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // En móvil, siempre mostrar expandido
  // En tablet/desktop, usar el estado de colapso
  const shouldCollapse = isMobile ? false : isCollapsed;

  const handleToggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        width: shouldCollapse ? "80px" : isMobile ? "280px" : "250px", // Más ancho en móvil
        transition: "width 0.3s ease",
        // Sombra en móvil para efecto overlay
        boxShadow: isMobile ? '2px 0 8px rgba(0,0,0,0.15)' : 'none',
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          height: "100vh",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: isMobile ? "8px 20px 8px 16px !important" : "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={shouldCollapse}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={handleToggleCollapse}
            icon={shouldCollapse ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
              minHeight: isMobile ? '56px' : '48px', // Área de toque más grande en móvil
            }}
          >
            {!shouldCollapse && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography 
                  variant={isMobile ? "h4" : "h3"} 
                  color={colors.grey[100]}
                  sx={{ fontSize: isMobile ? '1.5rem' : '1.875rem' }}
                >
                  ADMIN
                </Typography>
                
                {/* Botón de cerrar para móvil, toggle para desktop */}
                <IconButton 
                  onClick={isMobile ? onClose : handleToggleCollapse}
                  sx={{ 
                    color: colors.grey[100],
                    padding: isMobile ? '12px' : '8px' // Área de toque más grande
                  }}
                >
                  {isMobile ? <CloseIcon /> : <MenuOutlinedIcon />}
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!shouldCollapse && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width={isMobile ? "80px" : "100px"} // Imagen más pequeña en móvil
                  height={isMobile ? "80px" : "100px"}
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant={isMobile ? "h3" : "h2"}
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ 
                    m: "10px 0 0 0",
                    fontSize: isMobile ? '1.25rem' : '1.5rem'
                  }}
                >
                  Lesbiatan
                </Typography>
                <Typography 
                  variant="h5" 
                  color={colors.greenAccent[500]}
                  sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}
                >
                  VP Fancy Admin
                </Typography>
              </Box>
            </Box>
          )}

          <Box 
            paddingLeft={shouldCollapse ? undefined : "0%"}
            sx={{
              // Scroll en móvil si hay muchos items
              ...(isMobile && {
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 200px)',
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: colors.grey[600],
                  borderRadius: '2px',
                },
              })
            }}
          >
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
              onClose={onClose}
            />

            {!shouldCollapse && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ 
                  m: "15px 0 5px 20px",
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}
              >
                Data
              </Typography>
            )}
            
            <Item
              title="Manage Team"
              to="/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
              onClose={onClose}
            />
            <Item
              title="Contacts Information"
              to="/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
              onClose={onClose}
            />
            <Item
              title="Invoices Balances"
              to="/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
              onClose={onClose}
            />

            {!shouldCollapse && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ 
                  m: "15px 0 5px 20px",
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}
              >
                Pages
              </Typography>
            )}
            
            <Item
              title="Profile Form"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
              onClose={onClose}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
              onClose={onClose}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
              onClose={onClose}
            />

            {!shouldCollapse && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ 
                  m: "15px 0 5px 20px",
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}
              >
                Charts
              </Typography>
            )}
            
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
              onClose={onClose}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
              onClose={onClose}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
              onClose={onClose}
            />
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
              onClose={onClose}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;