// src/admin/pages/ProductsAdmin.jsx
import React, { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productsServiceAdmin";

function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    id: null,
    Nombre_producto: "",
    Tipo_producto: "",
    Precio: "",
    Marca: "",
    Fecha_fabricacion: "",
    Garantia: "",
    ID_proveedor: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Cargar productos al iniciar
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setError(null);
      const data = await getProducts();

      // Si el backend devuelve { productos: [...] }
      const lista = Array.isArray(data) ? data : data.productos || [];
      setProducts(lista);
    } catch (err) {
      console.error("❌ Error al obtener productos:", err);
      setError(err.message || "No se pudo obtener la lista de productos.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateProduct(form.id, form);
      } else {
        await createProduct(form);
      }
      await loadProducts();
      resetForm();
    } catch (err) {
      console.error("Error al guardar producto:", err);
      setError("Error al guardar el producto. Verifica los datos.");
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      Nombre_producto: "",
      Tipo_producto: "",
      Precio: "",
      Marca: "",
      Fecha_fabricacion: "",
      Garantia: "",
      ID_proveedor: "",
    });
    setIsEditing(false);
  };

  const handleEdit = (p) => {
    setForm({
      id: p.ID_producto,
      Nombre_producto: p.Nombre_producto,
      Tipo_producto: p.Tipo_producto,
      Precio: p.Precio,
      Marca: p.Marca,
      Fecha_fabricacion: p.Fecha_fabricacion?.split("T")[0],
      Garantia: p.Garantia,
      ID_proveedor: p.ID_proveedor,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setError("Error al eliminar el producto.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Cargando productos...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Gestión de Productos
      </h2>

      {error && (
        <p className="text-center text-red-600 font-semibold mb-4">{error}</p>
      )}

      {/* 🔸 Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow-md mb-6 max-w-xl mx-auto"
      >
        <input
          type="text"
          name="Nombre_producto"
          placeholder="Nombre del producto"
          value={form.Nombre_producto}
          onChange={handleChange}
          required
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="text"
          name="Tipo_producto"
          placeholder="Tipo de producto"
          value={form.Tipo_producto}
          onChange={handleChange}
          required
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="number"
          name="Precio"
          placeholder="Precio"
          value={form.Precio}
          onChange={handleChange}
          required
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="text"
          name="Marca"
          placeholder="Marca"
          value={form.Marca}
          onChange={handleChange}
          required
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="date"
          name="Fecha_fabricacion"
          placeholder="Fecha de fabricación"
          value={form.Fecha_fabricacion}
          onChange={handleChange}
          required
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="text"
          name="Garantia"
          placeholder="Garantía (meses)"
          value={form.Garantia}
          onChange={handleChange}
          required
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="number"
          name="ID_proveedor"
          placeholder="ID del proveedor"
          value={form.ID_proveedor}
          onChange={handleChange}
          required
          className="border p-2 w-full mb-4 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          {isEditing ? "Actualizar Producto" : "Agregar Producto"}
        </button>
      </form>

      {/* 🔸 Tabla */}
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No hay productos registrados</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Nombre</th>
                <th className="border px-4 py-2">Tipo</th>
                <th className="border px-4 py-2">Precio</th>
                <th className="border px-4 py-2">Marca</th>
                <th className="border px-4 py-2">Garantía</th>
                <th className="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.ID_producto}>
                  <td className="border px-4 py-2 text-center">{p.ID_producto}</td>
                  <td className="border px-4 py-2">{p.Nombre_producto}</td>
                  <td className="border px-4 py-2">{p.Tipo_producto}</td>
                  <td className="border px-4 py-2 text-center">${p.Precio}</td>
                  <td className="border px-4 py-2">{p.Marca}</td>
                  <td className="border px-4 py-2">{p.Garantia}</td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
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

export default ProductsAdmin;
