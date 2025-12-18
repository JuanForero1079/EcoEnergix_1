import React, { useEffect, useState } from "react";
import APIAdmin from "../admin/services/api";
import { exportTableToPDF } from "../utils/exportPDF";

function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    ID_usuario: null,
    Nombre: "",
    Correo_electronico: "",
    Contrasena: "",
    Rol_usuario: "Cliente",
    Estado_usuario: "activo",
    Tipo_documento: "C.C.",
    Numero_documento: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [sortBy, setSortBy] = useState("ID_usuario");
  const [sortOrder, setSortOrder] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await APIAdmin.get("/admin/usuarios");
      setUsuarios(res.data.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudo obtener la lista de usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validación antes de enviar
  if (!editMode && !formData.Contrasena) {
    alert("La contraseña es obligatoria para crear un usuario");
    return;
  }

  try {
    const payload = { ...formData };

    // Solo enviar Contraseña si tiene valor
    if (formData.Contrasena) {
      payload.Contraseña = formData.Contrasena; // nombre que espera backend
    }
    delete payload.Contrasena; // elimina campo temporal

    if (editMode) {
      await APIAdmin.put(`/admin/usuarios/${formData.ID_usuario}`, payload);
      alert("Usuario actualizado correctamente");
    } else {
      await APIAdmin.post("/admin/usuarios", payload);
      alert("Usuario creado correctamente");
    }

    resetForm();
    setShowModal(false);
    fetchUsuarios();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error al guardar usuario");
  }
};


  const handleEdit = (u) => {
    setFormData({ ...u, Contrasena: "" });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar usuario?")) return;
    try {
      await APIAdmin.delete(`/admin/usuarios/${id}`);
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el usuario");
    }
  };

  const resetForm = () => {
    setFormData({
      ID_usuario: null,
      Nombre: "",
      Correo_electronico: "",
      Contrasena: "",
      Rol_usuario: "Cliente",
      Estado_usuario: "activo",
      Tipo_documento: "C.C.",
      Numero_documento: "",
    });
    setEditMode(false);
  };

  const openNewUserModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const filteredUsuarios = usuarios.filter((u) => {
    const matchesSearch =
      u.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.Correo_electronico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.ID_usuario?.toString().includes(searchTerm);

    const matchesRole =
      roleFilter === "" ||
      u.Rol_usuario?.toLowerCase() === roleFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "" ||
      u.Estado_usuario?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue?.toLowerCase() || "";
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsuarios = sortedUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsuarios.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  const handleExportPDF = () => {
    const columns = ["ID", "Nombre", "Correo", "Rol", "Estado"];
    const rows = sortedUsuarios.map((u) => [
      u.ID_usuario,
      u.Nombre,
      u.Correo_electronico,
      u.Rol_usuario,
      u.Estado_usuario,
    ]);
    exportTableToPDF("Usuarios Registrados", columns, rows);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando usuarios...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 max-w-md mx-auto mt-10">
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 text-red-200">
          {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Barra superior con filtros y botones */}
        <div className="mb-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Buscar por nombre, correo o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Todos los roles</option>
                <option value="administrador">Administrador</option>
                <option value="Cliente">Cliente</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>

              <button
                onClick={handleExportPDF}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition flex items-center gap-2"
              >
                PDF
              </button>

              <button
                onClick={openNewUserModal}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-xl font-medium transition flex items-center gap-2"
              >
                <span className="text-xl">+</span>
                Nuevo Usuario
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Mostrando {currentUsuarios.length} de {sortedUsuarios.length} usuarios
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="5">5 por página</option>
              <option value="10">10 por página</option>
              <option value="20">20 por página</option>
              <option value="50">50 por página</option>
            </select>
          </div>
        </div>

        {/* Lista de usuarios */}
        {currentUsuarios.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/50">
            <div className="text-slate-400 text-lg">
              {searchTerm || roleFilter || statusFilter
                ? "No se encontraron usuarios con los filtros aplicados"
                : "No hay usuarios registrados"}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {currentUsuarios.map((u) => (
              <div
                key={u.ID_usuario}
                className="bg-gradient-to-r from-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold">
                      {u.Nombre?.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Nombre</div>
                        <div className="text-white font-medium">{u.Nombre}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Correo</div>
                        <div className="text-slate-300 text-sm break-all">{u.Correo_electronico}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Rol</div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            u.Rol_usuario?.toLowerCase() === "administrador"
                              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {u.Rol_usuario}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Estado</div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            u.Estado_usuario?.toLowerCase() === "activo"
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : "bg-red-500/20 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {u.Estado_usuario}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg transition text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u.ID_usuario)}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 rounded-lg transition text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === page
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white"
                    : "bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal para crear/editar usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-2xl w-full border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white">
                  {editMode ? "✎" : "+"}
                </span>
                {editMode ? "Editar Usuario" : "Nuevo Usuario"}
              </h2>
              <button
                onClick={closeModal}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="Nombre"
                    placeholder="Ingresa el nombre"
                    value={formData.Nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="Correo_electronico"
                    placeholder="ejemplo@correo.com"
                    value={formData.Correo_electronico}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tipo de documento
                  </label>
                  <select
                    name="Tipo_documento"
                    value={formData.Tipo_documento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="C.C.">Cédula de Ciudadanía</option>
                    <option value="C.E.">Cédula de Extranjería</option>
                    <option value="T.I.">Tarjeta de Identidad</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Número de documento
                  </label>
                  <input
                    type="text"
                    name="Numero_documento"
                    placeholder="Número de documento"
                    value={formData.Numero_documento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Rol del usuario
                  </label>
                  <select
                    name="Rol_usuario"
                    value={formData.Rol_usuario}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="administrador">Administrador</option>
                    <option value="Cliente">Cliente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Estado
                  </label>
                  <select
                    name="Estado_usuario"
                    value={formData.Estado_usuario}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="Contrasena"
                    placeholder={editMode ? "Dejar vacío para no cambiar" : "Contraseña"}
                    value={formData.Contrasena}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required={!editMode}
                  />
                </div>
              </div>

              {/* Botones del modal */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-xl font-semibold transition"
                >
                  {editMode ? "Guardar Cambios" : "Crear Usuario"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white rounded-xl font-semibold transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsuariosList;
