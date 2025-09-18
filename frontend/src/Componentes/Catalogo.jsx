import { useState } from "react";
import { MagicMotion } from "react-magic-motion";

const productos = [
  {
    id: 1,
    nombre: "Panel Solar 300W",
    imgSrc:
      "https://cdn.pixabay.com/photo/2016/10/29/10/16/solar-1781466_1280.jpg",
  },
  {
    id: 2,
    nombre: "Panel Solar 450W",
    imgSrc:
      "https://cdn.pixabay.com/photo/2017/01/20/00/30/solar-panel-1996334_1280.jpg",
  },
  {
    id: 3,
    nombre: "Kit Solar Hogar",
    imgSrc:
      "https://cdn.pixabay.com/photo/2020/05/30/17/07/solar-plant-5245247_1280.jpg",
  },
  {
    id: 4,
    nombre: "Inversor Solar 5kW",
    imgSrc:
      "https://cdn.pixabay.com/photo/2017/01/06/19/15/power-inverter-1958433_1280.jpg",
  },
  {
    id: 5,
    nombre: "Batería Solar 200Ah",
    imgSrc:
      "https://cdn.pixabay.com/photo/2017/05/18/11/04/battery-2327300_1280.jpg",
  },
  {
    id: 6,
    nombre: "Batería Solar 200Ah",
    imgSrc:
      "https://cdn.pixabay.com/photo/2017/05/18/11/04/battery-2327300_1280.jpg",
  },
  {
    id: 7,
    nombre: "Batería Solar 200Ah",
    imgSrc:
      "https://cdn.pixabay.com/photo/2017/05/18/11/04/battery-2327300_1280.jpg",
  },
   
];

// Tarjeta de producto
function Producto({ nombre, imgSrc }) {
  return (
    <div
      style={{
        padding: "0.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        backgroundColor: "rgba(240, 240, 240, 0.9)",
        borderRadius: "0.75rem",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h5
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.1em",
          color: "#064663",
        }}
      >
        {nombre}
      </h5>
      <img
        alt={`Imagen de ${nombre}`}
        src={imgSrc}
        style={{
          width: "100%",
          height: "8rem",
          objectFit: "cover",
          borderRadius: "0.5rem",
        }}
      />
      <button
        style={{
          marginTop: "auto",
          padding: "0.5rem",
          border: "none",
          borderRadius: "0.5rem",
          backgroundColor: "#1B998B",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#117a65")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#1B998B")}
      >
        Ver más
      </button>
    </div>
  );
}

function normalizarTexto(texto) {
  return texto
    .normalize("NFD") // separa letras y acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .toLowerCase(); // minúsculas
}

//  Catálogo con búsqueda y grid
export default function Catalogo() {
  const [busqueda, setBusqueda] = useState("");

  return (
    <div
      style={{
        margin: "2rem auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        width: "90%",
        maxWidth: "1200px",
      }}
    >
      <label
        htmlFor="busqueda"
        style={{ fontWeight: "bold", fontSize: "1.2em", color: "#3dc692" }}
      >
        ¿Qué busca hoy?
      </label>
      <input
        id="busqueda"
        placeholder="Ejemplo: Panel Solar 300W"
        type="text"
        maxLength={70}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          backgroundColor: "rgba(238, 238, 238)",
          lineHeight: 1.25,
          width: "18rem",
          padding: "0.5rem 0.75rem",
          borderRadius: "0.5rem",
          display: "block",
          fontSize: "0.9rem",
          border: "1px solid #ccc",
        }}
      />
      <h4 style={{ fontWeight: "bold", fontSize: "1.2em", marginTop: "1rem", color: "#3dc692"}}>
        Catálogo EcoEnergix
      </h4>
      <MagicMotion>
        <div
           style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 250px))",
            justifyContent: "center", 
            gap: "1.5rem",
            width: "100%",
          }}
        >
         {productos
            .filter(({ nombre }) =>
              normalizarTexto(nombre).includes(normalizarTexto(busqueda.trim()))
                )
             .map(({ id, nombre, imgSrc }) => (
               <Producto key={id} nombre={nombre} imgSrc={imgSrc} />
              ))}
         </div>
      </MagicMotion>
    </div>
  );
}
