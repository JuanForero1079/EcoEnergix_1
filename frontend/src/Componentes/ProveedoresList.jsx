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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const res = await API.get("/proveedores");
      const data = Array.isArray(res.data) ? res.data : [];
      setProveedores(data);
      setError("");
    } catch (err) {
      console.error("Error al obtener proveedores:", err);
      setError("No se pudo conectar con el servidor.");
      setProveedores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !formData.Nombre_empresa ||
      !formData.Dirección ||
      !formData.Teléfono ||
      !formData.Correo_electronico ||
      !formData.ID_usuario
    ) {
      alert("Todos los campos son obligatorios.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editMode) {
        await API.put(`/proveedores/${formData.ID_proveedor}`, formData);
        alert("Proveedor actualizado correctamente");
      } else {
        await API.post("/proveedores", formData);
        alert("Proveedor creado correctamente");
      }

      setFormData({
        ID_proveedor: null,
        Nombre_empresa: "",
        Dirección: "",
        Teléfono: "",
        Correo_electronico: "",
        ID_usuario: "",
      });

      setEditMode(false);
      fetchProveedores();
    } catch (err) {
      console.error("Error al guardar proveedor:", err);
      alert("Error al guardar proveedor.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este proveedor?")) return;
    try {
      await API.delete(`/proveedores/${id}`);
      alert("Proveedor eliminado correctamente");
      fetchProveedores();
    } catch (err) {
      console.error("Error al eliminar proveedor:", err);
      alert("No se pudo eliminar el proveedor.");
    }
  };

  const handleEdit = (prov) => {
    setFormData(prov);
    setEditMode(true);
  };

  // ---- CARGA MASIVA ----
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
      const res = await API.post("/proveedores/bulk", proveedoresMasivos);
      alert(res.data.message);
      fetchProveedores();
    } catch (err) {
      console.error("Error en carga masiva:", err);
      alert("No se pudieron cargar los proveedores.");
    }
  };

  const filteredProveedores = proveedores.filter((p) => {
    const search = searchTerm.toLowerCase();
    return (
      p.Nombre_empresa?.toLowerCase().includes(search) ||
      p.Correo_electronico?.toLowerCase().includes(search) ||
      p.ID_usuario?.toString().includes(search)
    );
  });

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-full text-white">
        <p>Cargando proveedores...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-red-400 font-semibold text-center mt-10">{error}</div>
    );

  return (
    <div className="p-6 bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4">Gestión de Proveedores</h2>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <input
          type="text"
          name="Nombre_empresa"
          placeholder="Nombre Empresa"
          value={formData.Nombre_empresa}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
        />
        <input
          type="text"
          name="Dirección"
          placeholder="Dirección"
          value={formData.Dirección}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
        />
        <input
          type="text"
          name="Teléfono"
          placeholder="Teléfono"
          value={formData.Teléfono}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
        />
        <input
          type="email"
          name="Correo_electronico"
          placeholder="Correo Electrónico"
          value={formData.Correo_electronico}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
        />
        <input
          type="number"
          name="ID_usuario"
          placeholder="ID Usuario"
          value={formData.ID_usuario}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition"
        >
          {editMode ? "Guardar Cambios" : "Agregar Proveedor"}
        </button>
      </form>

      {/* Busqueda, exportar y carga masiva */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white"
        />

        <button
          onClick={handleExportPDF}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Exportar PDF
        </button>

        <button
          onClick={handleBulkUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Carga Masiva
        </button>
      </div>

      {/* Tabla */}
      {filteredProveedores.length === 0 ? (
        <p>No hay proveedores registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-900 text-gray-100 border border-slate-700 rounded-lg">
            <thead>
              <tr className="bg-blue-700 text-left">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Empresa</th>
                <th className="py-3 px-4">Dirección</th>
                <th className="py-3 px-4">Teléfono</th>
                <th className="py-3 px-4">Correo</th>
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredProveedores.map((p) => (
                <tr
                  key={p.ID_proveedor}
                  className="border-b border-slate-700 hover:bg-slate-800"
                >
                  <td className="py-2 px-4">{p.ID_proveedor}</td>
                  <td className="py-2 px-4">{p.Nombre_empresa}</td>
                  <td className="py-2 px-4">{p.Dirección}</td>
                  <td className="py-2 px-4">{p.Teléfono}</td>
                  <td className="py-2 px-4">{p.Correo_electronico}</td>
                  <td className="py-2 px-4">{p.ID_usuario}</td>

                  <td className="py-2 px-4 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-1 px-3 rounded"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(p.ID_proveedor)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr> 
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProveedoresList;
