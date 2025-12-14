import React, { useEffect, useState } from "react";
import API from "../admin/services/api";
import { exportTableToPDF } from "../utils/exportPDF";

function EntregasList() {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    ID_entrega: null,
    ID_usuario: "",
    ID_producto: "",
    Cantidad: "",
    Fecha_entrega: "",
    ID_domiciliario: "",
  });

  const [editMode, setEditMode] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterFechaInicio, setFilterFechaInicio] = useState("");
  const [filterFechaFin, setFilterFechaFin] = useState("");

  useEffect(() => {
    fetchEntregas();
  }, []);

  // =========================
  // GET ENTREGAS (ADMIN)
  // =========================
  const fetchEntregas = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/entregas");
      setEntregas(res.data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar las entregas.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORM HANDLERS
  // =========================
  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.ID_usuario ||
      !formData.ID_producto ||
      !formData.Cantidad ||
      !formData.Fecha_entrega
    ) {
      alert("Todos los campos obligatorios deben estar completos");
      return;
    }

    try {
      if (editMode) {
        // UPDATE
        await API.put(
          `/admin/entregas/${formData.ID_entrega}`,
          formData
        );
        alert("Entrega actualizada correctamente");
      } else {
        // CREATE
        await API.post("/admin/entregas", formData);
        alert("Entrega creada correctamente");
      }

      setFormData({
        ID_entrega: null,
        ID_usuario: "",
        ID_producto: "",
        Cantidad: "",
        Fecha_entrega: "",
        ID_domiciliario: "",
      });

      setEditMode(false);
      fetchEntregas();
    } catch (err) {
      console.error(err);
      alert("Error al guardar la entrega");
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta entrega?")) return;

    try {
      await API.delete(`/admin/entregas/${id}`);
      alert("Entrega eliminada correctamente");
      fetchEntregas();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la entrega");
    }
  };

  // =========================
  // EDIT MODE
  // =========================
  const handleEdit = (entrega) => {
    setFormData({
      ID_entrega: entrega.ID_entrega,
      ID_usuario: entrega.ID_usuario,
      ID_producto: entrega.ID_producto,
      Cantidad: entrega.Cantidad,
      Fecha_entrega: entrega.Fecha_entrega?.split("T")[0] || "",
      ID_domiciliario: entrega.ID_domiciliario || "",
    });
    setEditMode(true);
  };

  // =========================
  // FILTROS
  // =========================
  const filteredEntregas = entregas.filter((e) => {
    const matchesSearch =
      e.ID_usuario.toString().includes(searchTerm) ||
      e.ID_producto.toString().includes(searchTerm);

    const fecha = new Date(e.Fecha_entrega);
    const matchesFecha =
      (!filterFechaInicio || fecha >= new Date(filterFechaInicio)) &&
      (!filterFechaFin || fecha <= new Date(filterFechaFin));

    return matchesSearch && matchesFecha;
  });

  // =========================
  // EXPORT PDF
  // =========================
  const handleExportPDF = () => {
    const columns = ["ID", "Usuario", "Producto", "Cantidad", "Fecha"];
    const rows = filteredEntregas.map((e) => [
      e.ID_entrega,
      e.ID_usuario,
      e.ID_producto,
      e.Cantidad,
      new Date(e.Fecha_entrega).toLocaleDateString(),
    ]);

    exportTableToPDF("Entregas Registradas", columns, rows);
  };

  // =========================
  // RENDER
  // =========================
  if (loading)
    return (
      <p className="text-white text-center mt-10">
        Cargando entregas...
      </p>
    );

  if (error)
    return (
      <p className="text-red-400 text-center mt-10">{error}</p>
    );

  return (
    <div className="p-6 bg-slate-800/60 rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4">Gestión de Entregas</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <input
          type="number"
          name="ID_usuario"
          placeholder="ID Usuario"
          value={formData.ID_usuario}
          onChange={handleChange}
          className="p-2 bg-slate-700 rounded"
        />

        <input
          type="number"
          name="ID_producto"
          placeholder="ID Producto"
          value={formData.ID_producto}
          onChange={handleChange}
          className="p-2 bg-slate-700 rounded"
        />

        <input
          type="number"
          name="Cantidad"
          placeholder="Cantidad"
          value={formData.Cantidad}
          onChange={handleChange}
          className="p-2 bg-slate-700 rounded"
        />

        <input
          type="date"
          name="Fecha_entrega"
          value={formData.Fecha_entrega}
          onChange={handleChange}
          className="p-2 bg-slate-700 rounded"
        />

        <button
          type="submit"
          className="md:col-span-3 bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-semibold"
        >
          {editMode ? "Guardar Cambios" : "Agregar Entrega"}
        </button>
      </form>

      {/* ACCIONES */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar usuario o producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 bg-slate-700 rounded"
        />

        <input
          type="date"
          value={filterFechaInicio}
          onChange={(e) => setFilterFechaInicio(e.target.value)}
          className="p-2 bg-slate-700 rounded"
        />

        <input
          type="date"
          value={filterFechaFin}
          onChange={(e) => setFilterFechaFin(e.target.value)}
          className="p-2 bg-slate-700 rounded"
        />

        <button
          onClick={handleExportPDF}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-bold"
        >
          Exportar PDF
        </button>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-slate-900 border border-slate-700 rounded-lg">
          <thead className="bg-indigo-700">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Usuario</th>
              <th className="py-3 px-4">Producto</th>
              <th className="py-3 px-4">Cantidad</th>
              <th className="py-3 px-4">Fecha</th>
              <th className="py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntregas.map((e) => (
              <tr key={e.ID_entrega} className="border-b border-slate-700">
                <td className="py-2 px-4">{e.ID_entrega}</td>
                <td className="py-2 px-4">{e.ID_usuario}</td>
                <td className="py-2 px-4">{e.ID_producto}</td>
                <td className="py-2 px-4">{e.Cantidad}</td>
                <td className="py-2 px-4">
                  {new Date(e.Fecha_entrega).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(e)}
                    className="bg-yellow-500 px-3 py-1 rounded text-black"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(e.ID_entrega)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EntregasList;
