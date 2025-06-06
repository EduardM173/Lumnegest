import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import "../styles/usuarios.css";
import { Button } from "@mui/material";
import UserAdminModal, { Usuario as AdminUsuario } from "../components/UserAdminModal";

// Reusamos el tipo de AdminUsuario
export type Usuario = AdminUsuario;

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[] | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get<Usuario[]>("/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setUsuarios(res.data);
        setErrorMsg("");
      } else {
        setErrorMsg("Respuesta inesperada del servidor");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("No se pudo obtener la lista de usuarios");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const openModal = (u: Usuario) => {
    setSelectedUser(u);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  if (errorMsg) {
    return (
      <div className="usuarios-container">
        <p className="usuarios-error">{errorMsg}</p>
      </div>
    );
  }
  if (!usuarios) {
    return (
      <div className="usuarios-container">
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="usuarios-container">
      <h1 className="usuarios-title">Administración de Usuarios</h1>
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
              <td>{u.estado}</td>
              <td>
                <Button variant="outlined" onClick={() => openModal(u)}>
                  Administrar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UserAdminModal
        open={modalOpen}
        onClose={closeModal}
        user={selectedUser}
        onSaved={fetchUsuarios}
      />
    </div>
  );
}
