import React, { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productsServiceAdmin"; // ✅ ruta corregida

export default function ProductsAdmin() { // ✅ renombrar para consistencia
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", price: "", stock: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || form.price === "" || form.stock === "") return;

    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
    };

    if (isEditing) {
      updateProduct(form.id, payload);
      setIsEditing(false);
    } else {
      createProduct(payload);
    }

    setForm({ id: null, name: "", price: "", stock: "" });
    setProducts(getProducts());
  };

  const handleEdit = (p) => {
    setForm({ id: p.id, name: p.name, price: p.price, stock: p.stock });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setProducts(getProducts());
  };

  const glassStyle = {
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(2, 6, 23, 0.18)",
    transition: "all 0.3s ease-in-out",
  };

  return (
    <div className="p-8 space-y-8 relative">
      <span className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 opacity-20 blur-3xl"></span>

      <div style={glassStyle} className="p-6">
        <h2 className="text-3xl font-bold text-white">Gestión de Productos</h2>
        <p className="text-sm text-white/70 mt-1">
          Administra los productos de la plataforma
        </p>
      </div>

      <div style={glassStyle} className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            name="name"
            placeholder="Nombre del producto"
            value={form.name}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={form.price}
            onChange={handleChange}
            className="flex-1 min-w-[140px] p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="flex-1 min-w-[120px] p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            type="submit"
            className="relative px-6 py-3 rounded-xl font-medium text-white
                       bg-gradient-to-r from-teal-400 to-purple-500
                       shadow-[0_4px_15px_rgba(0,0,0,0.3)]
                       hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)]
                       transition-transform duration-300 ease-out"
          >
            {isEditing ? "Actualizar" : "Agregar"}
          </button>
        </form>
      </div>

      <div style={glassStyle} className="overflow-x-auto">
        <table className="w-full rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-purple-500 text-white">
              <th className="p-3">ID</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-white/20 transition text-white">
                  <td className="p-3 text-center">{p.id}</td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">${p.price}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-4 py-2 rounded-xl border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-4 py-2 rounded-xl border border-red-400 text-red-400 hover:bg-red-500 hover:text-white transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-white/60">
                  No hay productos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
