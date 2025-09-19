// Products.jsx
import React, { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productsService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", price: "", stock: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  return (
    <div className="p-6 space-y-6">
      {/* ENCABEZADO */}
      <div className="glass-container text-white">
        <h2 className="text-3xl font-bold">Gestión de Productos</h2>
        <p className="text-sm text-white/70">Administra los productos de la plataforma</p>
      </div>

      {/* FORMULARIO */}
      <div className="glass-container">
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            name="name"
            placeholder="Nombre del producto"
            value={form.name}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none"
          />
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={form.price}
            onChange={handleChange}
            className="flex-1 min-w-[140px] p-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="flex-1 min-w-[120px] p-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-[#00C9A7] to-[#7D5FFF] text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            {isEditing ? "Actualizar" : "Agregar"}
          </button>
        </form>
      </div>

      {/* TABLA */}
      <div className="glass-container">
        <div className="overflow-x-auto">
          <table className="w-full rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-[#00C9A7] to-[#7D5FFF] text-white">
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
                        className="px-3 py-1 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 rounded-lg border border-red-400 text-red-400 hover:bg-red-500 hover:text-white transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-300">
                    No hay productos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}