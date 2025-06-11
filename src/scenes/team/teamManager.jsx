import { useEffect, useState } from "react";
import { Box, Typography, useTheme, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Switch, } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { auth , db } from "../../firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc, } from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ManageTeam = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState("user"); // Valor por defecto

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);

      // Obtener rol del usuario actual desde Firestore por UID (ejemplo simplificado)
      const currentUser = auth.currentUser;
      if (currentUser) {
        const current = usersData.find(u => u.uid === currentUser.uid);
        setCurrentUserRole(current?.rol || "user");
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (currentUserRole !== "admin") return;
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      await deleteDoc(doc(db, "users", id));
      fetchUsers();
    }
  };

  const handleEdit = (user) => {
    if (currentUserRole === "user") return;
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleSave = async () => {
    if (currentUserRole === "user") return;
    try {
      const userRef = doc(db, "users", selectedUser.id);
      const { id, ...userData } = selectedUser;
      await updateDoc(userRef, userData);
      setOpenModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };

  const toggleActivo = async (user) => {
    if (currentUserRole === "user") return;
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { activo: !user.activo });
      fetchUsers();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const columns = [
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "apellido", headerName: "Apellido", flex: 1 },
    { field: "empleadoId", headerName: "ID Empleado", flex: 1 },
    { field: "departamento", headerName: "Departamento", flex: 1 },
    { field: "rol", headerName: "Rol", flex: 1 },
    { field: "email", headerName: "Correo Electrónico", flex: 1.5 },
    {
      field: "activo",
      headerName: "Activo",
      flex: 0.5,
      renderCell: ({ row }) => (
        <Switch
          checked={row.activo ?? true}
          onChange={() => toggleActivo(row)}
          disabled={currentUserRole === "user"}
        />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      renderCell: ({ row }) => (
        <Box>
          <IconButton
            onClick={() => handleEdit(row)}
            disabled={currentUserRole === "user"}
          >
            <EditIcon color="primary" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(row.id)}
            disabled={currentUserRole !== "admin"}
          >
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Equipo"
        subtitle="Gestión de todos los miembros registrados"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
        }}
      >
        <DataGrid rows={users} columns={columns} />
      </Box>

      {/* Modal de edición */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            label="Nombre"
            value={selectedUser?.nombre || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, nombre: e.target.value })
            }
            disabled={currentUserRole === "user"}
          />
          <TextField
            label="Apellido"
            value={selectedUser?.apellido || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, apellido: e.target.value })
            }
            disabled={currentUserRole === "user"}
          />
          <TextField
            label="Departamento"
            value={selectedUser?.departamento || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, departamento: e.target.value })
            }
            disabled={currentUserRole === "user"}
          />
          <TextField
            label="Rol"
            value={selectedUser?.rol || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, rol: e.target.value })
            }
            disabled={currentUserRole !== "admin"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={currentUserRole === "user"}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageTeam;
