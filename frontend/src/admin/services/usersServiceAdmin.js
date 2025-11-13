import API from "../../services/api";

//   Obtener todos los usuarios (sin contraseñas)
export const getUsuarios = async () => {
  try {
    const res = await API.get("/api/usuarios");
    console.log("👥 Datos de usuarios recibidos:", res.data);
    return res.data;
  } catch (error) {
    console.error("  Error al obtener usuarios:", error);
    throw error;
  }
};

//   Crear un nuevo usuario
export const createUsuario = async (data) => {
  try {
    const res = await API.post("/api/usuarios", data);
    return res.data;
  } catch (error) {
    console.error("  Error al crear usuario:", error);
    throw error;
  }
};

//   Actualizar usuario existente
export const updateUsuario = async (id, data) => {
  try {
    const res = await API.put(`/api/usuarios/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("  Error al actualizar usuario:", error);
    throw error;
  }
};

//   Eliminar usuario por ID
export const deleteUsuario = async (id) => {
  try {
    const res = await API.delete(`/api/usuarios/${id}`);
    return res.data;
  } catch (error) {
    console.error("  Error al eliminar usuario:", error);
    throw error;
  }
};
