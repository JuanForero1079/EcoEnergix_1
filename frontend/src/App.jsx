// src/App.jsx
import { Routes, Route } from "react-router-dom";

// Componentes públicos
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

// Panel Admin
import AdminLayoutAdmin from "./admin/AdminLayoutAdmin.jsx";
import UsuariosList from "./Componentes/UsuariosList.jsx";
import ProductosList from "./Componentes/ProductosList.jsx";
import ComprasList from "./Componentes/ComprasList.jsx";
import PagosList from "./Componentes/PagosList.jsx";
import EntregasList from "./Componentes/EntregasList.jsx";
import InstalacionesList from "./Componentes/InstalacionesList.jsx";
import ProveedoresList from "./Componentes/ProveedoresList.jsx";
import SoporteList from "./Componentes/SoporteList.jsx";

// Layout público
function PublicLayout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <FondoSlider />
      <div className="absolute inset-0 bg-black/50"></div>
      <Navbar />
      <main className="pt-16 flex-grow z-10 relative w-full flex flex-col items-center justify-center min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* 🌿 RUTAS PÚBLICAS */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Hero />
          </PublicLayout>
        }
      />
      <Route
        path="/services"
        element={
          <PublicLayout>
            <Services />
          </PublicLayout>
        }
      />
      <Route
        path="/about"
        element={
          <PublicLayout>
            <About />
          </PublicLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />
      <Route
        path="/register"
        element={
          <PublicLayout>
            <Register />
          </PublicLayout>
        }
      />
      <Route
        path="/terms"
        element={
          <PublicLayout>
            <Terms />
          </PublicLayout>
        }
      />
      <Route
        path="/privacy"
        element={
          <PublicLayout>
            <Privacy />
          </PublicLayout>
        }
      />
      <Route
        path="/catalogo"
        element={
          <PublicLayout>
            <Catalogo />
          </PublicLayout>
        }
      />

      {/* ⚙️ RUTAS ADMIN PRIVADAS */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <AdminLayoutAdmin />
          </PrivateRoute>
        }
      >
        {/* 👇 Subrutas del Panel */}
        <Route
          index
          element={<h1 className="text-3xl font-bold">Bienvenido al Panel Admin</h1>}
        />
        <Route path="usuarios" element={<UsuariosList />} />
        <Route path="productos" element={<ProductosList />} />
        <Route path="compras" element={<ComprasList />} />
        <Route path="pagos" element={<PagosList />} />
        <Route path="entregas" element={<EntregasList />} />
        <Route path="instalaciones" element={<InstalacionesList />} />
        <Route path="proveedores" element={<ProveedoresList />} />
        <Route path="soporte" element={<SoporteList />} />
      </Route>

      {/* 🚫 RUTA NO ENCONTRADA */}
      <Route
        path="*"
        element={
          <PublicLayout>
            <h1 className="text-3xl text-white font-bold">Ruta no encontrada</h1>
          </PublicLayout>
        }
      />
    </Routes>
  );
}
