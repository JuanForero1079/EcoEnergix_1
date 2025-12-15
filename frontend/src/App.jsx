import { Routes, Route } from "react-router-dom";

// ---------- Componentes públicos ----------
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
import ForgotPassword from "./Componentes/ForgotPassword.jsx";
import ResetPassword from "./Componentes/ResetPassword.jsx";
import PrivateRoute from "./Componentes/PrivateRoute.jsx";

// ---------- Admin ----------
import AdminLayoutAdmin from "./admin/AdminLayoutAdmin.jsx";
import PerfilAdmin from "./Componentes/PerfilAdmin.jsx";
import UsuariosList from "./Componentes/UsuariosList.jsx";
import ProductosList from "./Componentes/ProductosList.jsx";
import ComprasList from "./Componentes/ComprasList.jsx";
import PagosList from "./Componentes/PagosList.jsx";
import InstalacionesList from "./Componentes/InstalacionesList.jsx";
import ProveedoresList from "./Componentes/ProveedoresList.jsx";
import SoporteList from "./Componentes/SoporteList.jsx";
import EntregasList from "./Componentes/EntregasList.jsx";

// ---------- Usuario ----------
import UsuarioLayout from "./usuario/UsuarioLayout.jsx";
import HomeUsuario from "./usuario/Componentes/HomeUsuario.jsx";
import CatalogoUsuario from "./usuario/Componentes/CatalogoUsuario.jsx";
import CarritoUsuario from "./usuario/Componentes/CarritoUsuario.jsx";
import SeguimientoPedidos from "./usuario/Componentes/SeguimientoPedidos.jsx";
import ProcederPago from "./usuario/Componentes/ProcederPago.jsx";
import PerfilUsuario from "./usuario/Componentes/PerfilUsuario.jsx";
import MisCompras from "./usuario/Componentes/MisCompras.jsx";
import MisPagos from "./usuario/Componentes/MisPagos.jsx";
import SoporteTecnico from "./usuario/Componentes/SoporteTecnico.jsx";

// ---------- Domiciliario ----------
import DomiciliarioLayout from "./domiciliario/layout/DomiciliarioLayout.jsx";
import InicioDomiciliario from "./domiciliario/pages/InicioDomiciliario.jsx";
import Perfil from "./domiciliario/pages/Perfil.jsx";
import Domicilios from "./domiciliario/pages/Domicilios.jsx";
import Direcciones from "./domiciliario/pages/Direcciones.jsx";
import HistorialEntregas from "./domiciliario/pages/HistorialEntregas.jsx";
import PagosDomiciliario from "./domiciliario/pages/PagosDomiciliario.jsx";
import SoporteTraslados from "./domiciliario/pages/SoporteTraslados.jsx";
import InstalacionesAsignadas from "./domiciliario/pages/InstalacionesAsignadas.jsx";
import Auditoria from "./domiciliario/pages/Auditoria.jsx";
import Configuracion from "./domiciliario/pages/Configuracion.jsx";
import Agenda from "./domiciliario/pages/Agenda.jsx";

// ---------- Layout público ----------
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

// ---------- App ----------
export default function App() {
  return (
    <Routes>
      {/* ---------- Rutas públicas ---------- */}
      <Route path="/" element={<PublicLayout><Hero /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
      <Route path="/reset-password/:token" element={<PublicLayout><ResetPassword /></PublicLayout>} />
      <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
      <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
      <Route path="/catalogo" element={<PublicLayout><Catalogo /></PublicLayout>} />

      {/* ---------- Admin ---------- */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <AdminLayoutAdmin />
          </PrivateRoute>
        }
      >
        <Route index element={<h1 className="text-3xl text-white font-bold text-center">Bienvenido al Panel de Administración</h1>} />
        <Route path="perfil" element={<PerfilAdmin />} />
        <Route path="usuarios" element={<UsuariosList />} />
        <Route path="productos" element={<ProductosList />} />
        <Route path="compras" element={<ComprasList />} />
        <Route path="pagos" element={<PagosList />} />
        <Route path="entregas" element={<EntregasList />} />
        <Route path="instalaciones" element={<InstalacionesList />} />
        <Route path="proveedores" element={<ProveedoresList />} />
        <Route path="soporte" element={<SoporteList />} />
      </Route>

      {/* ---------- Domiciliario ---------- */}
      <Route
        path="/domiciliario/*"
        element={
          <PrivateRoute allowedRoles={["domiciliario"]}>
            <DomiciliarioLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<InicioDomiciliario />} />
        <Route path="inicio" element={<InicioDomiciliario />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="domicilios" element={<Domicilios />} />
        <Route path="direcciones" element={<Direcciones />} />
        <Route path="historial" element={<HistorialEntregas />} />
        <Route path="pagos" element={<PagosDomiciliario />} />
        <Route path="soporte-traslados" element={<SoporteTraslados />} />
        <Route path="instalaciones" element={<InstalacionesAsignadas />} />
        <Route path="auditoria" element={<Auditoria />} />
        <Route path="configuracion" element={<Configuracion />} />
        <Route path="agenda" element={<Agenda />} />
      </Route>

      {/* ---------- Usuario ---------- */}
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
        <Route path="carrito" element={<CarritoUsuario />} />
        <Route path="seguimiento" element={<SeguimientoPedidos />} />
        <Route path="pago" element={<ProcederPago />} />
        <Route path="perfil" element={<PerfilUsuario />} />
        <Route path="mis-compras" element={<MisCompras />} />
        <Route path="mis-pagos" element={<MisPagos />} />
        <Route path="soporte" element={<SoporteTecnico />} />
      </Route>

      {/* ---------- Not found ---------- */}
      <Route
        path="*"
        element={
          <PublicLayout>
            <h1 className="text-3xl text-white font-bold text-center">Ruta no encontrada</h1>
          </PublicLayout>
        }
      />
    </Routes>
  );
}
