import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

export default function App() {
  const [nombre, setNombre] = useState("");
  const [genero, setGenero] = useState("M");
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [stats, setStats] = useState(null);
  const [loadingComentario, setLoadingComentario] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  const API_URL = "https://yuhu-sentiment.onrender.com/api";

  // Enviar comentario al backend
  const enviarComentario = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;
    setLoadingComentario(true);
    
    try {
      const res = await axios.post(`${API_URL}/comentario`, {
        nombre,
        genero,
        comentario,
      });
      console.log("resultado front",res)
      setMensaje(
        `✅ ${res.data.data.sentimiento}`
      );
      setLoadingComentario(false);
      setNombre("");
      setGenero("M");
      setComentario("");
      await fetchStats();
    } catch (err) {
      console.error(err)
      setMensaje("❌ Error al analizar el comentario.");
    } finally {
      setLoadingComentario(false);
    }
  };

  // Obtener estadísticas e insights
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await axios.get(`${API_URL}/insights`);
      console.log("insigts front", res);
      setStats(res.data);
    } catch (e) {
      console.error("Error cargando estadísticas", e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const COLORS = ["#22c55e", "#ef4444", "#facc15"]; // verde, rojo, amarillo

  return (
    
    <div className="max-w-md mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-lg space-y-4">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">
        Análisis de Sentimientos - YUhu 🎯
      </h1>

      <form
        onSubmit={enviarComentario}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md mb-8"
      >
        <label className="block mb-2 font-semibold">Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 font-semibold">Género:</label>
        <select
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="M">Femenino</option>
          <option value="H">Masculino</option>
        </select>

        <label className="block mb-2 font-semibold">Comentario:</label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        ></textarea>

        {/* 🔘 Botón de enviar comentario */}
        <button
          onClick={enviarComentario}
          disabled={loadingComentario}
          className={`w-full py-2 mt-3 rounded-lg text-white font-semibold transition ${
            loadingComentario
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loadingComentario ? (
            <div className="flex justify-center items-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              <span>Analizando comentario...</span>
            </div>
          ) : (
            "Enviar comentario"
          )}
        </button>

        {mensaje && <p className="mt-4 text-center font-semibold">{mensaje}</p>}
      </form>

      {loadingStats ? (
  <div className="w-full flex flex-col items-center justify-center py-12">
    <div className="flex items-center space-x-3">
      <svg
        className="animate-spin h-8 w-8 text-indigo-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        ></path>
      </svg>
      <div className="text-sm text-gray-700">
        <div className="font-medium">Recargando estadísticas...</div>
        <div className="text-xs text-gray-500">Por favor espera, esto puede tardar unos segundos.</div>
      </div>
    </div>
  </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto px-4 sm:px-6">
          {/* GRÁFICA DE SENTIMIENTOS */}
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col items-center">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-indigo-700">
              Distribución de Sentimientos
            </h2>
            <div className="flex justify-center">
              <PieChart width={Math.min(300, window.innerWidth - 80)} height={300}>
                <Pie
                  dataKey="value"
                  data={[
                    { name: "Positivos", value: stats.positivos },
                    { name: "Negativos", value: stats.negativos },
                    { name: "Neutros", value: stats.neutros },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>

          {/* GRÁFICA DE GÉNERO */}
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col items-center">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-indigo-700">
              Participación por Género
            </h2>
            <div className="overflow-x-auto">
              <BarChart
                width={Math.min(400, window.innerWidth - 80)}
                height={300}
                data={[
                  { name: "Hombres", value: stats.hombres },
                  { name: "Mujeres", value: stats.mujeres },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </div>
          </div>

          {/* INSIGHTS */}
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 col-span-2">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-indigo-700">
              📊 Insights Automáticos
            </h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{stats.insights}</pre>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto py-8 text-center text-gray-600">
          <p className="mb-2 font-medium">Aún no hay estadísticas disponibles.</p>
          <p className="text-sm">Envía el primer comentario para ver resultados y gráficos.</p>
        </div>
      )}
    </div>
  );
}
