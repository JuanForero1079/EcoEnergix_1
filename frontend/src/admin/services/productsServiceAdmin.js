const API = axios.create({
  baseURL: "http://localhost:3001/api/admin", //   cambiar a /api/admin
});

//   Obtener todos los productos
export async function getProducts() {
  try {
    const res = await API.get("/productos"); // ahora apunta a /api/admin/productos
    console.log("  Productos obtenidos:", res.data);
    return res.data;
  } catch (err) {
    console.error("  Error al obtener productos:", err.response?.data || err.message);
    throw new Error("No se pudo obtener la lista de productos. Verifica el backend o la URL.");
  }
}

//   Crear producto
export async function createProduct(payload) {
  const res = await API.post("/productos", payload);
  return res.data;
}

//   Actualizar producto
export async function updateProduct(id, payload) {
  const res = await API.put(`/productos/${id}`, payload);
  return res.data;
}

//   Eliminar producto
export async function deleteProduct(id) {
  const res = await API.delete(`/productos/${id}`);
  return res.data;
}
