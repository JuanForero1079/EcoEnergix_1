import React, { useEffect, useState } from "react";
import API from "../admin/services/api"; 
import { exportTableToPDF } from "../utils/exportPDF";

function ProveedoresList() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    ID_proveedor: null,
    Nombre_empresa: "",
    Dirección: "",
    Teléfono: "",
    Correo_electronico: "",
    ID_usuario: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= PAGINACIÓN ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchProveedores();
  }, []);

  /* ================= FETCH ================= */
  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/proveedores");
      setProveedores(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar proveedores");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      ID_proveedor: null,
      Nombre_empresa: "",
      Dirección: "",
      Teléfono: "",
      Correo_electronico: "",
      ID_usuario: "",
    });
    setEditMode(false);
  };

  const validateForm = () => {
    if (
      !formData.Nombre_empresa ||
      !formData.Dirección ||
      !formData.Teléfono ||
      !formData.Correo_electronico ||
      !formData.ID_usuario
    ) {
      alert("Todos los campos son obligatorios");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editMode) {
        await API.put(`/admin/proveedores/${formData.ID_proveedor}`, formData);
        alert("Proveedor actualizado correctamente");
      } else {
        await API.post("/admin/proveedores", formData);
        alert("Proveedor creado correctamente");
      }

      resetForm();
      setShowModal(false);
      fetchProveedores();
    } catch (err) {
      console.error(err);
      alert("Error al guardar proveedor");
    }
  };

  const handleEdit = (prov) => {
    setFormData(prov);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar proveedor?")) return;
    await API.delete(`/admin/proveedores/${id}`);
    fetchProveedores();
  };

  /* ================= CARGA MASIVA ================= */
  const handleBulkUpload = async () => {
    const proveedoresMasivos = [
      {
        Nombre_empresa: "SolarTech",
        Dirección: "Calle 123",
        Teléfono: "3001234567",
        Correo_electronico: "contacto@solartech.com",
        ID_usuario: 1,
      },
      {
        Nombre_empresa: "EcoPower",
        Dirección: "Carrera 45",
        Teléfono: "3109876543",
        Correo_electronico: "ventas@ecopower.com",
        ID_usuario: 1,
      },
    ];

    try {
      await API.post("/admin/proveedores/bulk", proveedoresMasivos);
      fetchProveedores();
    } catch (err) {
      alert("Error en carga masiva");
    }
  };

  /* ================= FILTRO ================= */
  const filteredProveedores = proveedores.filter((p) => {
    const s = searchTerm.toLowerCase();
    return (
      p.Nombre_empresa?.toLowerCase().includes(s) ||
      p.Correo_electronico?.toLowerCase().includes(s) ||
      p.ID_usuario?.toString().includes(s)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  /* ================= PAGINACIÓN ================= */
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProveedores = filteredProveedores.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProveedores.length / itemsPerPage);

  const paginate = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  /* ================= PDF ================= */
  const handleExportPDF = () => {
    const columns = ["ID", "Empresa", "Dirección", "Teléfono", "Correo", "Usuario"];
    const rows = filteredProveedores.map((p) => [
      p.ID_proveedor,
      p.Nombre_empresa,
      p.Dirección,
      p.Teléfono,
      p.Correo_electronico,
      p.ID_usuario,
    ]);
    exportTableToPDF("Proveedores Registrados", columns, rows);
  };

  /* ================= RENDER ================= */
  if (loading) return <p className="text-white text-center">Cargando...</p>;
  if (error) return <p className="text-red-400 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Barra superior */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 mb-6 flex flex-wrap gap-3 justify-between">
          <input
            placeholder="Buscar proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 bg-slate-700/50 rounded-xl text-white"
          />

          <div className="flex gap-3">
            <button onClick={handleExportPDF} className="px-5 py-3 bg-green-600 rounded-xl text-white">
              PDF
            </button>
            <button onClick={handleBulkUpload} className="px-5 py-3 bg-blue-600 rounded-xl text-white">
              Carga Masiva
            </button>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl text-white"
            >
              + Nuevo Proveedor
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {currentProveedores.map((p) => (
            <div
              key={p.ID_proveedor}
              className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700/50 flex justify-between items-center"
            >
              <div>
                <p className="text-white font-medium">{p.Nombre_empresa}</p>
                <p className="text-slate-400 text-sm">
                  {p.Correo_electronico} · Usuario {p.ID_usuario}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.ID_proveedor)}
                  className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
              .map((p) => (
                <button
                  key={p}
                  onClick={() => paginate(p)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === p
                      ? "bg-gradient-to-r from-teal-500 to-cyan-600"
                      : "bg-slate-700/50 border border-slate-600"
                  }`}
                >
                  {p}
                </button>
              ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-3xl p-8 max-w-xl w-full border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editMode ? "Editar Proveedor" : "Nuevo Proveedor"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input name="Nombre_empresa" value={formData.Nombre_empresa} onChange={handleChange} placeholder="Empresa" className="p-3 bg-slate-700 rounded-xl text-white" />
              <input name="Dirección" value={formData.Dirección} onChange={handleChange} placeholder="Dirección" className="p-3 bg-slate-700 rounded-xl text-white" />
              <input name="Teléfono" value={formData.Teléfono} onChange={handleChange} placeholder="Teléfono" className="p-3 bg-slate-700 rounded-xl text-white" />
              <input name="Correo_electronico" value={formData.Correo_electronico} onChange={handleChange} placeholder="Correo" className="p-3 bg-slate-700 rounded-xl text-white" />
              <input name="ID_usuario" value={formData.ID_usuario} onChange={handleChange} placeholder="ID Usuario" className="p-3 bg-slate-700 rounded-xl text-white" />

              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-teal-600 py-3 rounded-xl text-white">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700 py-3 rounded-xl text-white"
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

export default ProveedoresList;
