import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer // 👈 ¡Importante!
} from "recharts";
import yuhuLogo from './images/yuhu_logo.png'; // 👈 Importa tu logo

export default function App() {
  const [nombre, setNombre] = useState("");
  const [genero, setGenero] = useState("M");
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [stats, setStats] = useState(null);
  const [loadingComentario, setLoadingComentario] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  // URL del backend
  const API_URL = "https://yuhu-sentiment.onrender.com/api";

  // Enviar comentario
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
      setMensaje(`✅ ${res.data.data.sentimiento}`);
      setNombre("");
      setGenero("M");
      setComentario("");
      await fetchStats(); // Recargar stats después de enviar
    } catch (err) {
      console.error(err)
      setMensaje("❌ Error al analizar el comentario.");
    } finally {
      setLoadingComentario(false);
    }
  };

  // Obtener estadísticas
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await axios.get(`${API_URL}/insights`);
      setStats(res.data);
    } catch (e) {
      console.error("Error cargando estadísticas", e);
    } finally {
      setLoadingStats(false);
    }
  };

  // Cargar stats al iniciar
  useEffect(() => {
    fetchStats();
  }, []);

  // Colores para el gráfico de pastel (Verde, Rojo, Amarillo)
  const COLORS = ["#22c55e", "#ef4444", "#facc15"];

  return (
    <div className="min-h-screen bg-gray-100 p-4 pt-8 sm:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* === ENCABEZADO === */}
        <header className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 mb-8">
          <img src={yuhuLogo} alt="Yuhu Logo" className="w-20 h-20" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center sm:text-left">
            Dashboard de Sentimiento
          </h1>
        </header>

        {/* === LAYOUT PRINCIPAL (GRID) === */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* === COLUMNA 1: FORMULARIO === */}
          <div className="lg:col-span-1">
            <form
              onSubmit={enviarComentario}
              className="bg-white p-6 rounded-2xl shadow-lg w-full space-y-4"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-700">
                Analizar Nuevo Comentario
              </h2>
              <div>
                <label className="block mb-2 font-semibold text-gray-600">Nombre:</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-600">Género:</label>
                <select
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="M">Femenino</option>
                  <option value="H">Masculino</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-600">Comentario:</label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  required
                  rows="4"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe cómo te sientes con la maestría aquí..."
                ></textarea>
              </div>

              {/* Botón de enviar */}
              <button
                type="submit"
                disabled={loadingComentario}
                className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                  loadingComentario
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700" // 👈 Color azul de Yuhu
                }`}
              >
                {loadingComentario ? "Analizando..." : "Enviar Comentario"}
              </button>

              {mensaje && <p className="mt-4 text-center font-semibold">{mensaje}</p>}
            </form>
          </div>

          {/* === COLUMNA 2: GRÁFICOS E INSIGHTS === */}
          <div className="lg:col-span-2 space-y-8">
            {loadingStats ? (
              <div className="w-full flex justify-center py-12">
                <p className="text-gray-600">Cargando estadísticas...</p>
              </div>
            ) : stats ? (
              <div className="space-y-8">
                {/* Contenedor para los dos primeros gráficos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* GRÁFICA DE SENTIMIENTOS (RESPONSIVA) */}
                  <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">
                      Distribución de Sentimientos
                    </h2>
                    {/* Contenedor con altura fija para que el gráfico se adapte */}
                    <div className="w-full h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
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
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* GRÁFICA DE GÉNERO (RESPONSIVA) */}
                  <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">
                      Participación por Género
                    </h2>
                    {/* Contenedor con altura fija para que el gráfico se adapte */}
                    <div className="w-full h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: "Hombres", value: stats.hombres },
                            { name: "Mujeres", value: stats.mujeres },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          {/* 👈 Color azul de Yuhu */}
                          <Bar dataKey="value" fill="#2563EB" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* INSIGHTS (Ocupa todo el ancho) */}
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-700">
                    📊 Insights Automáticos
                  </h2>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {stats.insights}
                  </pre>
                </div>

              </div>
            ) : (
              <div className="w-full py-8 text-center text-gray-600">
                <p>Aún no hay estadísticas disponibles.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}