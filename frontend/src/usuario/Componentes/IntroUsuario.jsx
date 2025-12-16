import React, { useState, useEffect, useMemo } from "react";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import HomeUsuario from "../Componentes/HomeUsuario";



// Palabras base
const BASE_WORDS = [
  "Sostenible",
  "Limpia",
  "Renovable",
  "Eficiente",
  "Inteligente",
  "Confiable",
  "Accesible",
  "Innovadora",
  "Responsable",
  "Tecnológica",
  "Económica",
  "Del futuro",
];

// Colores dinámicos
const COLORS = [
  "text-[#3dc692]",
  "text-[#5f54b3]",
  "text-[#4375b2]",
  "text-emerald-400",
  "text-cyan-400",
  "text-teal-400",
];

// Mezclar palabras (shuffle)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function IntroUsuario() {
  const [showIntro, setShowIntro] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  // Obtener nombre del usuario
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const nombreUsuario = usuario?.nombre || "Usuario";

  // Palabras aleatorias por ingreso
  const words = useMemo(() => shuffleArray(BASE_WORDS), []);

  useEffect(() => {
  const introMostrada = sessionStorage.getItem("introUsuarioMostrada");

  if (!introMostrada) {
    setShowIntro(true);
    sessionStorage.setItem("introUsuarioMostrada", "true");
     }
   }, []);

  // Cambio de color del texto
  useEffect(() => {
    const colorTimer = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % COLORS.length);
    }, 800);
    return () => clearInterval(colorTimer);
  }, []);

  // Control de tiempos
  useEffect(() => {
    const wordsTime = 6000; // tiempo mostrando palabras

    const welcomeTimer = setTimeout(() => {
      setShowWelcome(true);
    }, wordsTime);

    const endTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setShowIntro(false), 1000);
    }, wordsTime + 2500);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(endTimer);
    };
  }, []);

  if (!showIntro) {
    return <HomeUsuario />;
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center transition-opacity duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3dc692]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5f54b3]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4375b2]/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-4">
        {/* Título SOLO mientras salen las palabras */}
        {!showWelcome && (
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Energía
          </h1>
        )}

        {/* Palabras / Bienvenida */}
        {!showWelcome ? (
          <div className={`transition-colors duration-700 ${COLORS[colorIndex]}`}>
            <ContainerTextFlip words={words} />
          </div>
        ) : (
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] bg-clip-text text-transparent animate-fade-in">
            Bienvenido{" "}
            <span className="whitespace-nowrap">
              {nombreUsuario}
            </span>{" "}
            a EcoEnergix
          </h2>
        )}

        <p className="text-xl text-blue-200 max-w-2xl mx-auto mt-8">
          Transforma tu hogar con la energía del futuro
        </p>

        {/* Barra */}
        <div className="w-80 mx-auto mt-8">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] animate-load" />
          </div>
        </div>

        <p className="text-sm text-blue-300 mt-4 animate-pulse">
          Preparando tu experiencia...
        </p>
      </div>

      <style>{`
        @keyframes load {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-load {
          animation: load 2s ease-in-out infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}