import React, { useEffect, useState } from "react";
import API from "../services/api";

function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/producto")
      .then((res) => {
        setProductos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener productos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div>
      <h2>Lista de productos</h2>
      {productos.length === 0 ? (
        <p>No hay productos registrados</p>
      ) : (
        <ul>
          {productos.map((p) => (
            <li key={p.ID_producto}>
              {p.Nombre_producto} – {p.Marca} – ${p.Precio}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductosList;
