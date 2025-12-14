import React, { useEffect, useState } from "react";
import API from "../admin/services/api";
import { exportTableToPDF } from "../utils/exportPDF";

function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    ID_producto: null,
    Nombre_producto: "",
    Tipo_producto: "",
    Precio: "",
    Marca: "",
    Fecha_fabricacion: "",
    Garantia: "",
    ID_proveedor: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ============================
  // OBTENER PRODUCTOS (ADMIN)
  // ============================
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/productos");
      setProductos(res.data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError("No se pudo obtener la lista de productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ============================
  // CREAR / EDITAR PRODUCTO
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await API.put(
          `/admin/productos/${formData.ID_producto}`,
          formData
        );
        alert("Producto actualizado correctamente");
      } else {
        await API.post("/admin/productos", formData);
        alert("Producto creado correctamente");
      }

      setFormData({
        ID_producto: null,
        Nombre_producto: "",
        Tipo_producto: "",
        Precio: "",
        Marca: "",
        Fecha_fabricacion: "",
        Garantia: "",
        ID_proveedor: "",
      });

      setEditMode(false);
      fetchProductos();
    } catch (err) {
      console.error("Error al guardar producto:", err);
      alert("Error al guardar producto.");
    }
  };

  const handleEdit = (producto) => {
    setFormData({
      ID_producto: producto.ID_producto,
      Nombre_producto: producto.Nombre_producto,
      Tipo_producto: producto.Tipo_producto,
      Precio: producto.Precio,
      Marca: producto.Marca,
      Fecha_fabricacion:
        producto.Fecha_fabricacion?.split("T")[0] || "",
      Garantia: producto.Garantia,
      ID_proveedor: producto.ID_proveedor,
    });
    setEditMode(true);
  };

  // ============================
  // ELIMINAR PRODUCTO
  // ============================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await API.delete(`/admin/productos/${id}`);
      alert("Producto eliminado correctamente");
      fetchProductos();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert("No se pudo eliminar el producto.");
    }
  };

  // ============================
  // CARGA MASIVA
  // ============================
  const handleBulkUpload = async () => {
    const productosMasivos = [
      {
        Nombre_producto: "Panel Solar 450W",
        Tipo_producto: "Panel",
        Precio: 850000,
        Marca: "SolarMax",
        Fecha_fabricacion: "2024-01-15",
        Garantia: 24,
        ID_proveedor: 1,
      },
      {
        Nombre_producto: "Inversor 5000W",
        Tipo_producto: "Inversor",
        Precio: 2300000,
        Marca: "EcoPower",
        Fecha_fabricacion: "2024-02-10",
        Garantia: 36,
        ID_proveedor: 2,
      },
    ];

    try {
      const res = await API.post(
        "/admin/productos/bulk",
        productosMasivos
      );
      alert(res.data.message);
      fetchProductos();
    } catch (err) {
      console.error("Error en carga masiva:", err);
      alert("No se pudieron cargar los productos.");
    }
  };

  // ============================
  // FILTRO + PDF
  // ============================
  const filteredProductos = productos.filter(
    (p) =>
      p.Nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.Tipo_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.ID_proveedor).includes(searchTerm)
  );

  const handleExportPDF = () => {
    const columns = [
      "ID",
      "Nombre",
      "Tipo",
      "Precio",
      "Marca",
      "Garantía",
      "Proveedor",
    ];
    const rows = filteredProductos.map((p) => [
      p.ID_producto,
      p.Nombre_producto,
      p.Tipo_producto,
      p.Precio,
      p.Marca,
      p.Garantia,
      p.ID_proveedor,
    ]);
    exportTableToPDF("Productos Registrados", columns, rows);
  };

  if (loading) return <p className="text-white p-4">Cargando productos...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-slate-800/60 rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4">Gestión de Productos</h2>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <input
          type="text"
          name="Nombre_producto"
          placeholder="Nombre"
          value={formData.Nombre_producto}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <input
          type="text"
          name="Tipo_producto"
          placeholder="Tipo"
          value={formData.Tipo_producto}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <input
          type="number"
          name="Precio"
          placeholder="Precio"
          value={formData.Precio}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <input
          type="text"
          name="Marca"
          placeholder="Marca"
          value={formData.Marca}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <input
          type="date"
          name="Fecha_fabricacion"
          value={formData.Fecha_fabricacion}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <input
          type="text"
          name="Garantia"
          placeholder="Garantía (meses)"
          value={formData.Garantia}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <input
          type="number"
          name="ID_proveedor"
          placeholder="ID proveedor"
          value={formData.ID_proveedor}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <button
          type="submit"
          className="col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
        >
          {editMode ? "Guardar Cambios" : "Agregar Producto"}
        </button>
      </form>

      {/* Acciones */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar productos..."
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
      {filteredProductos.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-900 text-gray-100 border border-slate-700 rounded-lg">
            <thead>
              <tr className="bg-green-600 text-left">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Precio</th>
                <th className="py-3 px-4">Marca</th>
                <th className="py-3 px-4">Garantía</th>
                <th className="py-3 px-4">Proveedor</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map((p) => (
                <tr
                  key={p.ID_producto}
                  className="border-b border-slate-700 hover:bg-slate-800"
                >
                  <td className="py-2 px-4">{p.ID_producto}</td>
                  <td className="py-2 px-4">{p.Nombre_producto}</td>
                  <td className="py-2 px-4">{p.Tipo_producto}</td>
                  <td className="py-2 px-4">${p.Precio}</td>
                  <td className="py-2 px-4">{p.Marca}</td>
                  <td className="py-2 px-4">{p.Garantia}</td>
                  <td className="py-2 px-4">{p.ID_proveedor}</td>
                  <td className="py-2 px-4 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.ID_producto)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
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

export default ProductosList;
