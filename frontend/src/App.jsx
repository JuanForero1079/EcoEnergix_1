// src/App.jsx
import { Routes, Route } from "react-router-dom";

// 🌿 Componentes públicos
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
import VerifyEmail from "./Componentes/VerifyEmail.jsx"; // ✅ Verificación de correo
import PrivateRoute from "./Componentes/PrivateRoute.jsx";

// 🧭 Panel Admin
import AdminLayoutAdmin from "./admin/AdminLayoutAdmin.jsx";
import UsuariosList from "./Componentes/UsuariosList.jsx";
import ProductosList from "./Componentes/ProductosList.jsx";
import ComprasList from "./Componentes/ComprasList.jsx";
import PagosList from "./Componentes/PagosList.jsx";
import InstalacionesList from "./Componentes/InstalacionesList.jsx";
import ProveedoresList from "./Componentes/ProveedoresList.jsx";
import SoporteList from "./Componentes/SoporteList.jsx";
import EntregasAdmin from "./admin/pages/EntregasAdmin.jsx";

// 👤 Panel Usuario
import UsuarioLayout from "./usuario/UsuarioLayout.jsx";
import HomeUsuario from "./usuario/Componentes/HomeUsuario.jsx";
import CatalogoUsuario from "./usuario/Componentes/CatalogoUsuario.jsx";
import ComprasUsuario from "./usuario/Componentes/ComprasUsuario.jsx";
import PagosUsuario from "./usuario/Componentes/PagosUsuario.jsx";
import SoporteUsuario from "./usuario/Componentes/SoporteUsuario.jsx";

// 🏍 Panel Domiciliario
import DomiciliarioLayout from "./domiciliario/DomiciliarioLayout.jsx";

// 🌍 Layout público reutilizable
function PublicLayout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <FondoSlider />
      <div className="absolute inset-0 bg-black/50 -z-10" />
      <Navbar />
      <main className="pt-16 flex-grow relative z-10 w-full flex flex-col items-center justify-center min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* 🌐 RUTAS PÚBLICAS */}
      <Route path="/" element={<PublicLayout><Hero /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route path="/verify-email" element={<PublicLayout><VerifyEmail /></PublicLayout>} />
      <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
      <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
      <Route path="/catalogo" element={<PublicLayout><Catalogo /></PublicLayout>} />

      {/* 🧩 RUTAS PRIVADAS DEL ADMIN */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <AdminLayoutAdmin />
          </PrivateRoute>
        }
      >
        <Route index element={
          <div className="flex justify-center items-center h-full">
            <h1 className="text-3xl font-bold text-white">Bienvenido al Panel de Administración</h1>
          </div>
        } />
        <Route path="usuarios" element={<UsuariosList />} />
        <Route path="productos" element={<ProductosList />} />
        <Route path="compras" element={<ComprasList />} />
        <Route path="pagos" element={<PagosList />} />
        <Route path="entregas" element={<EntregasAdmin />} />
        <Route path="instalaciones" element={<InstalacionesList />} />
        <Route path="proveedores" element={<ProveedoresList />} />
        <Route path="soporte" element={<SoporteList />} />
      </Route>

      {/* 🏍 RUTAS PRIVADAS DEL DOMICILIARIO */}
      <Route
        path="/domiciliario/*"
        element={
          <PrivateRoute allowedRoles={["domiciliario"]}>
            <DomiciliarioLayout />
          </PrivateRoute>
        }
      >
        <Route index element={
          <h1 className="text-3xl text-white font-bold text-center">Bienvenido, Domiciliario</h1>
        } />
      </Route>

      {/* 👤 RUTAS PRIVADAS DEL USUARIO */}
      <Route
        path="/usuario/*"
        element={
          <PrivateRoute allowedRoles={["usuario", "cliente"]}>
            <UsuarioLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<HomeUsuario />} />
        <Route path="catalogo" element={<CatalogoUsuario />} />
        <Route path="compras/:userId" element={<ComprasUsuario />} />
        <Route path="pagos/:userId" element={<PagosUsuario />} />
        <Route path="soporte/:userId" element={<SoporteUsuario />} />
      </Route>

      {/* 🚫 RUTA NO ENCONTRADA */}
      <Route path="*" element={
        <PublicLayout>
          <h1 className="text-3xl text-white font-bold text-center">Ruta no encontrada</h1>
        </PublicLayout>
      } />
    </Routes>
  );
}
