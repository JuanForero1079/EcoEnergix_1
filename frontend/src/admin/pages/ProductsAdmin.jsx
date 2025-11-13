
import React, { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productsServiceAdmin";

//  Componente principal
function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    ID_producto: null,
    Nombre_producto: "",
    Tipo_producto: "",
    Precio: "",
    Marca: "",
    Fecha_fabricacion: "",
    Garantia: "",
    ID_proveedor: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  //   Cargar productos al iniciar
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getProducts();
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data?.productos) {
        setProducts(data.productos);
      } else {
        console.warn("  Respuesta inesperada:", data);
        setProducts([]);
      }
    } catch (err) {
      console.error("  Error al obtener productos:", err);
      setError("No se pudo obtener la lista de productos. Verifica el backend.");
    } finally {
      setLoading(false);
    }
  };

  //   Manejo de cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //   Validaciones antes de enviar
  const validateForm = () => {
    const { Nombre_producto, Tipo_producto, Precio, Marca, Fecha_fabricacion, Garantia, ID_proveedor } = form;
    if (!Nombre_producto || !Tipo_producto || !Precio || !Marca || !Fecha_fabricacion || !Garantia || !ID_proveedor) {
      setMessage({ type: "error", text: "Todos los campos son obligatorios" });
      return false;
    }
    if (Number(Precio) <= 0 || Number(ID_proveedor) <= 0) {
      setMessage({ type: "error", text: "Precio y proveedor deben ser mayores a 0" });
      return false;
    }
    return true;
  };

  //   Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing) {
        await updateProduct(form.ID_producto, form);
        setMessage({ type: "success", text: "Producto actualizado correctamente" });
      } else {
        await createProduct(form);
        setMessage({ type: "success", text: "Producto agregado correctamente" });
      }
      resetForm();
      loadProducts();
    } catch (err) {
      console.error("  Error al guardar producto:", err);
      setMessage({ type: "error", text: "Error al guardar el producto. Verifica los datos." });
    }
  };

  //   Resetear formulario
  const resetForm = () => {
    setForm({
      ID_producto: null,
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

  //   Editar producto
  const handleEdit = (p) => {
    setForm({
      ID_producto: p.ID_producto,
      Nombre_producto: p.Nombre_producto,
      Tipo_producto: p.Tipo_producto,
      Precio: p.Precio,
      Marca: p.Marca,
      Fecha_fabricacion: p.Fecha_fabricacion?.split("T")[0] || "",
      Garantia: p.Garantia,
      ID_proveedor: p.ID_proveedor,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //   Eliminar producto
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      setMessage({ type: "success", text: "Producto eliminado correctamente" });
      loadProducts();
    } catch (err) {
      console.error("  Error al eliminar producto:", err);
      setMessage({ type: "error", text: "Error al eliminar el producto" });
    }
  };

  if (loading) return <p className="text-center text-gray-600 mt-6">Cargando productos...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Gestión de Productos</h2>

      {/* Mensajes de éxito/error */}
      {message && (
        <p className={`text-center mb-4 font-semibold ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
          {message.text}
        </p>
      )}

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="Nombre_producto"
          placeholder="Nombre del producto"
          value={form.Nombre_producto}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="Tipo_producto"
          placeholder="Tipo de producto"
          value={form.Tipo_producto}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="Precio"
          placeholder="Precio"
          value={form.Precio}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="Marca"
          placeholder="Marca"
          value={form.Marca}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          name="Fecha_fabricacion"
          value={form.Fecha_fabricacion}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="Garantia"
          placeholder="Garantía (meses)"
          value={form.Garantia}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="ID_proveedor"
          placeholder="ID del proveedor"
          value={form.ID_proveedor}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:col-span-2"
        >
          {isEditing ? "Actualizar Producto" : "Agregar Producto"}
        </button>
      </form>

      {/* Tabla de productos */}
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
                <th className="border px-4 py-2">Proveedor</th>
                <th className="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.ID_producto} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-center">{p.ID_producto}</td>
                  <td className="border px-4 py-2">{p.Nombre_producto}</td>
                  <td className="border px-4 py-2">{p.Tipo_producto}</td>
                  <td className="border px-4 py-2 text-right">
                    {Number(p.Precio).toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                  </td>
                  <td className="border px-4 py-2">{p.Marca}</td>
                  <td className="border px-4 py-2">{p.Garantia}</td>
                  <td className="border px-4 py-2 text-center">{p.ID_proveedor}</td>
                  <td className="border px-4 py-2 flex justify-center gap-2">
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
