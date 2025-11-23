import React, { useState } from "react";
import axios from "../../services/api";

export default function ReportesAdmin() {
  const [tipoReporte, setTipoReporte] = useState("compras");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const generarReporte = async () => {
    setErrorMsg("");

    if (fechaInicio && fechaFin && fechaFin < fechaInicio) {
      setErrorMsg("La fecha final no puede ser menor a la fecha inicial.");
      return;
    }

    try {
      setLoading(true);

      const params = {
        fechaInicio,
        fechaFin,
        estado,
      };

      const response = await axios.get(`/admin/reportes/${tipoReporte}`, {
        params,
      });

      setResultados(response.data.data || []);
    } catch (error) {
      console.error("Error generando reporte:", error);
      setErrorMsg("Error generando el reporte. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Reportes del Administrador</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40 p-6 rounded-lg">

        <div>
          <label className="font-semibold">Tipo de reporte</label>
          <select
            value={tipoReporte}
            onChange={(e) => {
              setTipoReporte(e.target.value);
              setResultados([]);
            }}
            className="w-full p-2 rounded text-black"
          >
            <option value="compras">Compras</option>
            <option value="pagos">Pagos</option>
            <option value="entregas">Entregas</option>
            <option value="instalaciones">Instalaciones</option>
            <option value="soportes">Soporte Técnico</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">Estado (opcional)</label>
          <input
            type="text"
            placeholder="pendiente, completado..."
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full p-2 rounded text-black"
          />
        </div>

        <div>
          <label className="font-semibold">Fecha inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full p-2 rounded text-black"
          />
        </div>

        <div>
          <label className="font-semibold">Fecha fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full p-2 rounded text-black"
          />
        </div>

        <button
          onClick={generarReporte}
          className="md:col-span-2 bg-blue-600 hover:bg-blue-700 w-full py-2 rounded text-white font-bold"
        >
          {loading ? "Generando..." : "Generar Reporte"}
        </button>
      </div>

      {errorMsg && (
        <p className="mt-4 text-red-300 font-semibold">{errorMsg}</p>
      )}

      {/* Tabla resultados */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Resultados</h2>

        {resultados.length === 0 ? (
          <p>No hay datos para mostrar</p>
        ) : (
          <div className="overflow-auto max-h-[500px] border border-white/20 rounded-lg">
            <table className="w-full border-collapse bg-black/20">
              <thead>
                <tr className="bg-black/40 sticky top-0">
                  {Object.keys(resultados[0]).map((key) => (
                    <th key={key} className="border p-2 text-left">
                      {key.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultados.map((item, index) => (
                  <tr key={index} className="border">
                    {Object.values(item).map((value, i) => (
                      <td key={i} className="border p-2">
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
