// src/admin/pages/ProductosList.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";

function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Obtener productos al cargar
  const fetchProductos = async () => {
    try {
      const res = await API.get("/productos"); // ✅ sin /api porque baseURL ya lo incluye
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

  // 🔹 Eliminar producto
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      await API.delete(`/productos/${id}`); // ✅ también sin /api
      alert("🗑️ Producto eliminado correctamente.");
      fetchProductos(); // refresca la tabla
    } catch (err) {
      console.error("❌ Error al eliminar producto:", err);
      alert("No se pudo eliminar el producto.");
    }
  };

  // 🔹 Estados de carga o error
  if (loading) return <p className="text-white p-4">Cargando productos...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Gestión de Productos</h2>
        <button
          onClick={() => alert("🆕 Aquí iría el formulario para crear producto")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          ➕ Nuevo Producto
        </button>
      </div>

      {productos.length === 0 ? (
        <p className="text-white">No hay productos registrados.</p>
      ) : (
        <table className="w-full border border-gray-700 text-white">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Marca</th>
              <th className="p-3 text-left">Precio</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr
                key={p.ID_producto}
                className="border-t border-gray-700 hover:bg-gray-800"
              >
                <td className="p-3">{p.ID_producto}</td>
                <td className="p-3">{p.Nombre_producto || "Sin nombre"}</td>
                <td className="p-3">{p.Marca || "—"}</td>
                <td className="p-3">${p.Precio ?? "0"}</td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => alert(`✏️ Editar producto ${p.Nombre_producto}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarProducto(p.ID_producto)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductosList;
