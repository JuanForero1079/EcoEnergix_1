import React, { useEffect, useState } from "react";
import ProductosService from "../admin/services/productsServiceAdmin.js";
import { exportTableToPDF } from "../utils/exportPDF";

function ProductosList() {
  /* ============================
      STATES
  ============================ */
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

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
  const [showModal, setShowModal] = useState(false);

  /* CSV */
  const [file, setFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);

  /* PAGINACIÓN */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /* ============================
      FETCH
  ============================ */
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const data = await ProductosService.getAll();
      setProductos(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudo obtener la lista de productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  /* ============================
      FORM
  ============================ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
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
  };

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
      resetForm();
      setShowModal(false);
      fetchProductos();
    } catch {
      alert("Error al guardar producto");
    }
  };

  const handleEdit = (p) => {
    setFormData({
      ...p,
      Fecha_fabricacion: p.Fecha_fabricacion?.split("T")[0] || "",
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    await ProductosService.delete(id);
    fetchProductos();
  };

  /* ============================
      CSV
  ============================ */
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (!selected) return setCsvPreview([]);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split("\n").filter(Boolean);
      const headers = lines[0].split(",");
      const rows = lines.slice(1).map((line) => {
        const values = line.split(",");
        const obj = {};
        headers.forEach((h, i) => (obj[h.trim()] = values[i]?.trim()));
        return obj;
      });
      setCsvPreview(rows);
    };
    reader.readAsText(selected);
  };

  const handleBulkUploadCSV = async () => {
    if (!file) return alert("Selecciona un CSV");
    const fd = new FormData();
    fd.append("archivo", file);

    try {
      await ProductosService.bulkUpload(fd);
      alert("Carga masiva exitosa");
      setFile(null);
      setCsvPreview([]);
      fetchProductos();
    } catch (err) {
      alert("Error al subir CSV");
    }
  };

  /* ============================
      IMAGE
  ============================ */
  const handleImageUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("imagen", file);

    try {
      const data = await ProductosService.uploadImage(id, fd);
      setProductos((prev) =>
        prev.map((p) =>
          p.ID_producto === id ? { ...p, Foto: data.imagen } : p
        )
      );
    } catch {
      alert("Error subiendo imagen");
    }
  };

  /* ============================
      FILTER + PAGINATION
  ============================ */
  const filteredProductos = productos.filter(
    (p) =>
      p.Nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.Tipo_producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProductos = filteredProductos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  /* ============================
      PDF
  ============================ */
  const handleExportPDF = () => {
    exportTableToPDF(
      "Productos",
      ["ID", "Nombre", "Tipo", "Precio", "Marca"],
      filteredProductos.map((p) => [
        p.ID_producto,
        p.Nombre_producto,
        p.Tipo_producto,
        p.Precio,
        p.Marca,
      ])
    );
  };

  const getImagenUrl = (foto) =>
    foto ? `http://localhost:3001${foto}` : "/placeholder.png";

  /* ============================
      LOADING / ERROR
  ============================ */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando productos..
      </div>
    );

  if (error)
    return <div className="p-6 text-red-400">{error}</div>;

  /* ============================
      UI
  ============================ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
      <div className="max-w-7xl mx-auto">

        {/* TOP BAR */}
        <div className="mb-6 bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 flex flex-col lg:flex-row gap-4 justify-between">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 bg-slate-700/50 rounded-xl"
          />

          <div className="flex gap-3 flex-wrap">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-3 bg-slate-700 rounded-xl"
            >
              <option value={2}>2 por pagina</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <button
              onClick={handleExportPDF}
              className="px-6 py-3 bg-green-600 rounded-xl"
            >
              PDF
            </button>

            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl"
            >
              + Nuevo Producto
            </button>
          </div>
        </div>

        {/* CSV */}
        <div className="mb-6 bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <input type="file" accept=".csv" onChange={handleFileChange} />
          {csvPreview.length > 0 && (
            <div className="mt-4 overflow-x-auto bg-white text-black p-4 rounded">
              <table className="min-w-full border">
                <thead>
                  <tr>
                    {Object.keys(csvPreview[0]).map((h) => (
                      <th key={h} className="border px-2 py-1">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvPreview.map((r, i) => (
                    <tr key={i}>
                      {Object.values(r).map((v, j) => (
                        <td key={j} className="border px-2 py-1">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button
            onClick={handleBulkUploadCSV}
            className="mt-4 px-6 py-3 bg-blue-600 rounded-xl"
          >
            Cargar CSV
          </button>
        </div>

        {/* CARDS */}
        <div className="space-y-4">
          {currentProductos.map((p) => (
            <div
              key={p.ID_producto}
              className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700 flex flex-wrap gap-4 justify-between"
            >
              <div className="flex gap-4">
                <img
                  src={getImagenUrl(p.Foto)}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div>
                  <p className="text-lg font-semibold">{p.Nombre_producto}</p>
                  <p className="text-slate-400 text-sm">{p.Tipo_producto}</p>
                  <p className="text-slate-300 font-bold">${p.Precio}</p>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <label className="cursor-pointer text-xs bg-slate-700 px-3 py-2 rounded">
                  Imagen
                  <input
                    type="file"
                    hidden
                    onChange={(e) =>
                      handleImageUpload(e, p.ID_producto)
                    }
                  />
                </label>

                <button
                  onClick={() => handleEdit(p)}
                  className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(p.ID_producto)}
                  className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded ${
                    page === currentPage
                      ? "bg-teal-600"
                      : "bg-slate-700"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 w-full max-w-2xl border border-slate-700">

            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editMode ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData)
                .filter(([k]) => k !== "ID_producto")
                .map(([k, v]) => (
                  <input
                    key={k}
                    name={k}
                    value={v}
                    onChange={handleChange}
                    placeholder={k.replace("_", " ")}
                    className="p-3 bg-slate-700 rounded-xl"
                    required
                  />
                ))}

              <div className="md:col-span-2 flex gap-3 pt-4">
                <button className="flex-1 bg-teal-600 py-3 rounded-xl">
                  {editMode ? "Guardar" : "Crear"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-slate-700 rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

export default ProductosList;
