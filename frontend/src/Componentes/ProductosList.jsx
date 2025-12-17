import React, { useEffect, useState } from "react";
import ProductosService from "../admin/services/productsServiceAdmin.js";
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

  // CSV carga masiva
  const [file, setFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);

  // ============================
  // Manejo CSV
  // ============================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (!selectedFile) {
      setCsvPreview([]);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      const headers = lines[0].split(",");
      const rows = lines.slice(1).map((line) => {
        const values = line.split(",");
        const rowObj = {};
        headers.forEach((h, i) => (rowObj[h.trim()] = values[i]?.trim()));
        return rowObj;
      });
      setCsvPreview(rows);
    };
    reader.readAsText(selectedFile);
  };

  const handleBulkUploadCSV = async () => {
    if (!file) return alert("Selecciona un archivo CSV");
    const formDataCSV = new FormData();
    formDataCSV.append("archivo", file);

    try {
      const res = await ProductosService.bulkUpload(formDataCSV);
      alert(res.message || "Carga masiva exitosa");
      setFile(null);
      setCsvPreview([]);
      fetchProductos();
    } catch (err) {
      console.error("Error en carga masiva CSV:", err);
      alert(err.response?.data?.message || "Error al subir CSV");
    }
  };

  // ============================
  // Obtener productos
  // ============================
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const data = await ProductosService.getAll();
      setProductos(Array.isArray(data) ? data : []);
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
  // Crear / Editar producto
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await ProductosService.update(formData.ID_producto, formData);
        alert("Producto actualizado correctamente");
      } else {
        await ProductosService.create(formData);
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
      Fecha_fabricacion: producto.Fecha_fabricacion?.split("T")[0] || "",
      Garantia: producto.Garantia,
      ID_proveedor: producto.ID_proveedor,
    });
    setEditMode(true);
  };

  // ============================
  // Eliminar producto
  // ============================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await ProductosService.delete(id);
      alert("Producto eliminado correctamente");
      fetchProductos();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert("No se pudo eliminar el producto.");
    }
  };

  // ============================
  // Subir imagen
  // ============================
  const handleImageUpload = async (e, idProducto) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append("imagen", file);

    try {
      const data = await ProductosService.uploadImage(idProducto, formDataImg);
      alert(data.message || "Imagen subida correctamente");

      setProductos((prev) =>
        prev.map((p) =>
          p.ID_producto === idProducto ? { ...p, Foto: data.imagen } : p
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error subiendo la imagen");
    }
  };

  // ============================
  // Filtrado + PDF
  // ============================
  const filteredProductos = productos.filter(
    (p) =>
      p.Nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.Tipo_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.ID_proveedor).includes(searchTerm)
  );

  const handleExportPDF = () => {
    const columns = ["ID", "Nombre", "Tipo", "Precio", "Marca", "Garantía", "Proveedor"];
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

  const getImagenUrl = (foto) => (foto ? `http://localhost:3001${foto}` : "/placeholder.png");

  if (loading) return <p className="text-white p-4">Cargando productos...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-slate-800/60 rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4">Gestión de Productos</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="text" name="Nombre_producto" placeholder="Nombre" value={formData.Nombre_producto} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="text" name="Tipo_producto" placeholder="Tipo" value={formData.Tipo_producto} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="number" name="Precio" placeholder="Precio" value={formData.Precio} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="text" name="Marca" placeholder="Marca" value={formData.Marca} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="date" name="Fecha_fabricacion" value={formData.Fecha_fabricacion} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="text" name="Garantia" placeholder="Garantía (meses)" value={formData.Garantia} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="number" name="ID_proveedor" placeholder="ID proveedor" value={formData.ID_proveedor} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <button type="submit" className="col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded">
          {editMode ? "Guardar Cambios" : "Agregar Producto"}
        </button>
      </form>

      {/* Carga Masiva CSV */}
      <div className="mb-6">
        <input type="file" accept=".csv" onChange={handleFileChange} className="mb-2" />
        {csvPreview.length > 0 && (
          <div className="overflow-x-auto mb-2 text-black bg-white p-2 rounded">
            <h3 className="font-bold mb-2">Previsualización CSV:</h3>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>{Object.keys(csvPreview[0]).map((key) => (<th key={key} className="border px-2 py-1">{key}</th>))}</tr>
              </thead>
              <tbody>
                {csvPreview.map((row, idx) => (
                  <tr key={idx}>{Object.values(row).map((val, i) => (<td key={i} className="border px-2 py-1">{val}</td>))}</tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button onClick={handleBulkUploadCSV} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Cargar CSV
        </button>
      </div>

      {/* Acciones */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input type="text" placeholder="Buscar productos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-2 rounded bg-slate-700 text-white" />
        <button onClick={handleExportPDF} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Exportar PDF</button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        {filteredProductos.length === 0 ? (
          <p>No hay productos registrados.</p>
        ) : (
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
                <th className="py-3 px-4 text-center">Imagen</th>
                <th className="py-3 px-4 text-center">Subir Imagen</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map((p) => (
                <tr key={p.ID_producto} className="border-b border-slate-700 hover:bg-slate-800">
                  <td className="py-2 px-4">{p.ID_producto}</td>
                  <td className="py-2 px-4">{p.Nombre_producto}</td>
                  <td className="py-2 px-4">{p.Tipo_producto}</td>
                  <td className="py-2 px-4">${p.Precio}</td>
                  <td className="py-2 px-4">{p.Marca}</td>
                  <td className="py-2 px-4">{p.Garantia}</td>
                  <td className="py-2 px-4">{p.ID_proveedor}</td>
                  <td className="py-2 px-4 text-center">
                    <img src={getImagenUrl(p.Foto)} alt={p.Nombre_producto} className="w-16 h-16 object-cover mx-auto rounded" />
                  </td>
                  <td className="py-2 px-4 text-center">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, p.ID_producto)} />
                  </td>
                  <td className="py-2 px-4 flex gap-2 justify-center">
                    <button onClick={() => handleEdit(p)} className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded">Editar</button>
                    <button onClick={() => handleDelete(p.ID_producto)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProductosList;
