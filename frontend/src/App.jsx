import { Routes, Route } from "react-router-dom";
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
<<<<<<< Updated upstream
import Catalog from "./Componentes/Catalogo";
import Breadcrumb from "./Componentes/Breadcrumbs";
=======
import Catalogo from "./Componentes/Catalogo";
import PrivateRoute from './Componentes/PrivateRoute';
>>>>>>> Stashed changes

// Panel Admin
import AdminLayout from './admin/AdminLayout';
import sidebar from './admin/Componentes/sidebar';

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
<<<<<<< Updated upstream

 <div className="relative min-h-screen flex flex-col">
          <FondoSlider/>
  
       <div className="absolute inset-0 bg-black/50"></div>
      <Navbar />
      <main className=" pt-16 flex-grow z-10 relative w-full flex flex-col items-center justify-center min-h-screen ">
       <div className="min-h-screen">
    <Breadcrumb />

=======
    <div className="relative min-h-screen flex flex-col">
      <FondoSlider />
      <div className="absolute inset-0 bg-black/50"></div>
      <Navbar />
      <main className="pt-16 flex-grow z-10 relative w-full flex flex-col items-center justify-center min-h-screen ">
>>>>>>> Stashed changes
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
              <PrivateRoute allowedRoles={['Administrador']}>
                <UsuariosList />
              </PrivateRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <PrivateRoute allowedRoles={['Administrador']}>
                <ProductosList />
              </PrivateRoute>
            }
          />
          <Route
            path="/compras"
            element={
              <PrivateRoute allowedRoles={['Administrador']}>
                <ComprasList />
              </PrivateRoute>
            }
          />
          <Route
            path="/pagos"
            element={
              <PrivateRoute allowedRoles={['Administrador']}>
                <PagosList />
              </PrivateRoute>
            }
          />
          <Route
            path="/entregas"
            element={
              <PrivateRoute allowedRoles={['Administrador']}>
                <EntregasList />
              </PrivateRoute>
            }
          />
          <Route
            path="/instalaciones"
            element={
              <PrivateRoute allowedRoles={['Administrador']}>
                <InstalacionesList />
              </PrivateRoute>
            }
          />
          <Route
            path="/proveedores"
            element={
              <PrivateRoute allowedRoles={['Administrador']}>
                <ProveedoresList />
              </PrivateRoute>
            }
          />
          <Route
            path="/soporte"
            element={
              <PrivateRoute allowedRoles={['Administrador']}>
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
  );
}
