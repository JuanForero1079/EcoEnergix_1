import React, { useState, useEffect } from "react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export default function IntroLogin({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simular progreso de carga
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Iniciar fade out
          setTimeout(() => {
            setFadeOut(true);
            // Completar después de la animación de fade
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 1000);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center transition-opacity duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3dc692]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5f54b3]/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4375b2]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo animado */}
        <div className="mb-8 transform hover:scale-110 transition-transform duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3dc692] to-[#5f54b3] rounded-full blur-2xl opacity-50 animate-pulse" />
            <div className="relative w-32 h-32 bg-gradient-to-br from-[#3dc692] to-[#5f54b3] rounded-full flex items-center justify-center shadow-2xl">
              <svg
                className="w-20 h-20 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31-1-6-4.65-6-8V8.3l6-3 6 3V12c0 3.35-2.69 7-6 8z" />
                <path d="M7 12l3 3 6-6-1.41-1.41L10 12.17l-1.59-1.59L7 12z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Texto con efecto hover */}
        <div className="h-[300px] flex items-center justify-center">
          <TextHoverEffect text="ECOENERGIX" />
        </div>

        {/* Mensaje de bienvenida */}
        <div className="mt-8 text-center">
          <p className="text-xl text-blue-200 mb-4 animate-pulse">
            Bienvenido a tu panel energético
          </p>
          
          {/* Barra de progreso */}
          <div className="w-80 h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-lg">
            <div
              className="h-full bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-sm text-blue-300 mt-3">
            Cargando tu experiencia... {progress}%
          </p>
        </div>

        {/* Partículas flotantes */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] rounded-full opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}