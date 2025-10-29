// src/App.jsx
import { Routes, Route } from "react-router-dom";
<<<<<<< HEAD
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
=======
import FondoSlider from "./Componentes/FondoSlider";
import Navbar from "./Componentes/Navbar";
import Hero from "./Componentes/Hero";
import Services from "./Componentes/Services";
import About from "./Componentes/About";
import Contact from "./Componentes/Contact";
import Footer from "./Componentes/Footer";
import Login from "./Componentes/Login";
import Register from "./Componentes/Register";
import Terms from "./Componentes/terms";
import Privacy from "./Componentes/Privacy";
import Catalogo from "./Componentes/Catalogo";
import PrivateRoute from "./Componentes/PrivateRoute";

// Panel Admin
import AdminLayout from "./admin/AdminLayout";
import sidebar from "./admin/Componentes/sidebar";

// 👇 Importa todos los componentes de listas
import UsuariosList from "./Componentes/UsuariosList";
import ProductosList from "./Componentes/ProductosList";
import ComprasList from "./Componentes/ComprasList";
import PagosList from "./Componentes/PagosList";
import EntregasList from "./Componentes/EntregasList";
import InstalacionesList from "./Componentes/InstalacionesList";
import ProveedoresList from "./Componentes/ProveedoresList";
import SoporteList from "./Componentes/SoporteList";

export default function App() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <FondoSlider />

      <div className="absolute inset-0 bg-black/50"></div>
      <Navbar />
      <main className=" pt-16 flex-grow z-10 relative w-full flex flex-col items-center justify-center min-h-screen ">
        <div className="min-h-screen">
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

            {/* 👇 Rutas protegidas solo para Administrador */}
            <Route
              path="/usuarios"
              element={
                <PrivateRoute allowedRoles={["Administrador"]}>
                  <UsuariosList />
                </PrivateRoute>
              }
            />
            <Route
              path="/productos"
              element={
                <PrivateRoute allowedRoles={["Administrador"]}>
                  <ProductosList />
                </PrivateRoute>
              }
            />
            <Route
              path="/compras"
              element={
                <PrivateRoute allowedRoles={["Administrador"]}>
                  <ComprasList />
                </PrivateRoute>
              }
            />
            <Route
              path="/pagos"
              element={
                <PrivateRoute allowedRoles={["Administrador"]}>
                  <PagosList />
                </PrivateRoute>
              }
            />
            <Route
              path="/entregas"
              element={
                <PrivateRoute allowedRoles={["Administrador"]}>
                  <EntregasList />
                </PrivateRoute>
              }
            />
            <Route
              path="/instalaciones"
              element={
                <PrivateRoute allowedRoles={["Administrador"]}>
                  <InstalacionesList />
                </PrivateRoute>
              }
            />
            <Route
              path="/proveedores"
              element={
                <PrivateRoute allowedRoles={["Administrador"]}>
                  <ProveedoresList />
                </PrivateRoute>
              }
            />
            <Route
              path="/soporte"
              element={
                <PrivateRoute allowedRoles={["Administrador"]}>
                  <SoporteList />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <PrivateRoute allowedRoles={["Administrador"]}>
                  <AdminLayout />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
>>>>>>> 8e8a85fe7a346c715910b77e6455fddd6139f675
  );
}
