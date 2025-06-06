import React, { useEffect, useState } from "react";
import axios from "../../services/axios";
import { Button } from "../../components/Button";

type Rol = {
  id: string;
  nombre: string;
};

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  estado: "ACTIVO" | "INACTIVO";
  rol: Rol;
};

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get<Usuario[]>("/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(res.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    obtenerUsuarios();
  }, []);

  const cambiarEstado = async (id: number, estadoActual: "ACTIVO" | "INACTIVO") => {
    const nuevoEstado = estadoActual === "ACTIVO" ? "INACTIVO" : "ACTIVO";

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/usuarios/${id}`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsuarios((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, estado: nuevoEstado } : user
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        Administración de Usuarios
      </h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Correo</th>
            <th style={thStyle}>Rol</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td style={tdStyle}>{usuario.nombre}</td>
              <td style={tdStyle}>{usuario.correo}</td>
              <td style={tdStyle}>{usuario.rol?.nombre || "N/A"}</td>
              <td style={tdStyle}>{usuario.estado}</td>
              <td style={tdStyle}>
                <Button
                  onClick={() => cambiarEstado(usuario.id, usuario.estado)}
                >
                  {usuario.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: "8px",
  border: "1px solid #ccc",
  textAlign: "center",
};

const tdStyle: React.CSSProperties = {
  padding: "8px",
  border: "1px solid #ccc",
  textAlign: "center",
};

export default Usuarios;
