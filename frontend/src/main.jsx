import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// Importa el provider del contexto del carrito
import { CarritoProvider } from "./usuario/context/CarritoContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </BrowserRouter>
  </React.StrictMode>
);

