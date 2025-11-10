// src/Componentes/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function VerifyEmail() {
  const [message, setMessage] = useState("Verificando...");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Token no proporcionado.");
      setMessage("");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await API.get(`/api/auth/verify-email?token=${token}`);
        setMessage(res.data || "✅ Cuenta verificada correctamente.");
        setTimeout(() => {
          navigate("/login"); // Redirigir al login después de 3 segundos
        }, 3000);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Error al verificar la cuenta.");
        setMessage("");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="p-6 rounded-2xl shadow-2xl bg-white/20 backdrop-blur-lg border border-white/30 text-center">
        {message && <p className="text-green-500 text-lg">{message}</p>}
        {error && <p className="text-red-500 text-lg">{error}</p>}
        {!message && !error && <p className="text-white">Verificando...</p>}
      </div>
    </div>
  );
}
