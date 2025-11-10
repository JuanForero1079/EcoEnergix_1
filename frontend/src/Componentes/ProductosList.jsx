// src/admin/pages/ProductosList.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";

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

  // 🔹 Obtener productos
  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/api/admin/productos");
      setProductos(res.data);
    } catch (err) {
      console.error("❌ Error al obtener productos:", err);
      setError("No se pudo obtener la lista de productos. Verifica el backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // 🔹 Manejo de formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await API.put(`/api/admin/productos/${formData.ID_producto}`, formData);
        alert("✅ Producto actualizado correctamente");
      } else {
        await API.post("/api/admin/productos", formData);
        alert("✅ Producto creado correctamente");
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
      console.error("❌ Error al guardar producto:", err);
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
      Fecha_fabricacion: producto.Fecha_fabricacion?.split("T")[0] || "",
      Garantia: producto.Garantia,
      ID_proveedor: producto.ID_proveedor,
    });
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await API.delete(`/api/admin/productos/${id}`);
      alert("🗑️ Producto eliminado correctamente");
      fetchProductos();
    } catch (err) {
      console.error("❌ Error al eliminar producto:", err);
      alert("No se pudo eliminar el producto.");
    }
  };

  if (loading) return <p className="text-white p-4">Cargando productos...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-slate-800/60 rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4">📦 Gestión de Productos</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="text" name="Nombre_producto" placeholder="Nombre" value={formData.Nombre_producto} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="text" name="Tipo_producto" placeholder="Tipo" value={formData.Tipo_producto} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="number" name="Precio" placeholder="Precio" value={formData.Precio} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="text" name="Marca" placeholder="Marca" value={formData.Marca} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="date" name="Fecha_fabricacion" placeholder="Fecha fabricación" value={formData.Fecha_fabricacion} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="text" name="Garantia" placeholder="Garantía (meses)" value={formData.Garantia} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="number" name="ID_proveedor" placeholder="ID proveedor" value={formData.ID_proveedor} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <button type="submit" className="col-span-1 md:col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded">
          {editMode ? "💾 Guardar Cambios" : "➕ Agregar Producto"}
        </button>
      </form>

      {/* Tabla de productos */}
      {productos.length === 0 ? (
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
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.ID_producto} className="border-b border-slate-700 hover:bg-slate-800">
                  <td className="py-2 px-4">{p.ID_producto}</td>
                  <td className="py-2 px-4">{p.Nombre_producto}</td>
                  <td className="py-2 px-4">{p.Tipo_producto}</td>
                  <td className="py-2 px-4 text-center">${p.Precio}</td>
                  <td className="py-2 px-4">{p.Marca}</td>
                  <td className="py-2 px-4">{p.Garantia}</td>
                  <td className="py-2 px-4 text-center flex justify-center gap-2">
                    <button onClick={() => handleEdit(p)} className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded">✏️</button>
                    <button onClick={() => handleDelete(p.ID_producto)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">🗑️</button>
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
