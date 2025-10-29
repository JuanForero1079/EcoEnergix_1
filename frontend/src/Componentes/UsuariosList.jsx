import React, { useEffect, useState } from "react";
import API from "../services/api"; // configuración base de Axios

function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("⚠️ No estás autenticado. Inicia sesión como Administrador.");
          setLoading(false);
          return;
        }

        const res = await API.get("/api/usuarios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("👉 Datos recibidos de la API:", res.data);
        setUsuarios(res.data);
      } catch (err) {
        console.error("❌ Error al obtener usuarios:", err);

        if (err.response) {
          // Error desde el backend
          if (err.response.status === 401) {
            setError("⛔ Sesión no válida. Por favor inicia sesión nuevamente.");
          } else if (err.response.status === 403) {
            setError("🚫 No tienes permisos para ver los usuarios.");
          } else {
            setError("❌ Error del servidor al obtener los usuarios.");
          }
        } else {
          // Error de conexión o red
          setError("⚠️ No se pudo conectar con el servidor.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Mostrar mensaje de carga
  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  // Mostrar mensaje de error si ocurre
  if (error) {
    return (
      <div style={{ color: "red", fontWeight: "bold" }}>
        <p>{error}</p>
      </div>
    );
  }

  // Mostrar lista de usuarios
  return (
    <div style={{ padding: "20px" }}>
      <h2>Lista de usuarios</h2>
      {usuarios.length === 0 ? (
        <p>No hay usuarios registrados</p>
      ) : (
        <ul>
          {usuarios.map((u) => (
            <li key={u.ID_usuario}>
              <strong>{u.Nombre}</strong> ({u.Correo_electronico}) — Rol:{" "}
              {u.Rol_usuario}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UsuariosList;
