// src/App.jsx
import { Routes, Route } from "react-router-dom";
import FondoSlider from "./Componentes/FondoSlider.jsx";
import Navbar from "./Componentes/Navbar.jsx";
import Hero from "./Componentes/Hero.jsx";
import Services from "./Componentes/Services.jsx";
import About from "./Componentes/About.jsx";
import Contact from "./Componentes/Contact.jsx";
import Footer from "./Componentes/Footer.jsx";
import Login from "./Componentes/Login.jsx";
import Register from "./Componentes/Register.jsx";
import Terms from "./Componentes/Terms.jsx";
import Privacy from "./Componentes/Privacy.jsx";
import Catalogo from "./Componentes/Catalogo.jsx";
import PrivateRoute from "./Componentes/PrivateRoute.jsx";

// ⚙️ Panel de administrador
import AdminLayoutAdmin from "./admin/AdminLayoutAdmin.jsx";
import UsuariosList from "./Componentes/UsuariosList.jsx";
import ProductosList from "./Componentes/ProductosList.jsx";
import ComprasList from "./Componentes/ComprasList.jsx";
import PagosList from "./Componentes/PagosList.jsx";
import EntregasList from "./Componentes/EntregasList.jsx";
import InstalacionesList from "./Componentes/InstalacionesList.jsx";
import ProveedoresList from "./Componentes/ProveedoresList.jsx";
import SoporteList from "./Componentes/SoporteList.jsx";

export default function App() {
  return (
    <Routes>
      {/* 🌿 Layout público */}
      <Route
        path="/*"
        element={
          <div className="relative min-h-screen flex flex-col">
            <FondoSlider />
            <div className="absolute inset-0 bg-black/50"></div>
            <Navbar />
            <main className="pt-16 flex-grow z-10 relative w-full flex flex-col items-center justify-center min-h-screen">
              <Routes>
                {/* 👇 Rutas públicas */}
                <Route path="/" element={<Hero />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/catalogo" element={<Catalogo />} />
              </Routes>
            </main>
            <Footer />
          </div>
        }
      />

      {/* ⚙️ Layout de administrador */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["Administrador"]}>
            <AdminLayoutAdmin />
          </PrivateRoute>
        }
      >
        {/* 👇 Subrutas que se renderizan dentro del <Outlet /> */}
        <Route index element={<h1 className="text-3xl font-bold">Bienvenido al Panel Admin</h1>} />
        <Route path="usuarios" element={<UsuariosList />} />
        <Route path="productos" element={<ProductosList />} />
        <Route path="compras" element={<ComprasList />} />
        <Route path="pagos" element={<PagosList />} />
        <Route path="entregas" element={<EntregasList />} />
        <Route path="instalaciones" element={<InstalacionesList />} />
        <Route path="proveedores" element={<ProveedoresList />} />
        <Route path="soporte" element={<SoporteList />} />
      </Route>
    </Routes>
  );
}
