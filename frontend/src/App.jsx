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
import Catalog from "./Componentes/Catalogo";


export default function App() {
  return (

 <div className="relative min-h-screen flex flex-col">
          <FondoSlider/>
   
       <div className="absolute inset-0 bg-black/50"></div>
      <Navbar />
      <main className="flex-grow z-10 relative w-full flex flex-col items-center justify-center min-h-screen ">
      

        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/catalogo" element={<Catalog />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
