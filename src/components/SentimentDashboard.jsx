import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function SentimentDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/sentiments")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const counts = data.reduce(
    (acc, item) => {
      acc[item.sentiment]++;
      return acc;
    },
    { positivo: 0, negativo: 0, neutro: 0 }
  );

  const chartData = {
    labels: ["Positivo", "Negativo", "Neutro"],
    datasets: [
      {
        label: "Cantidad de comentarios",
        data: [counts.positivo, counts.negativo, counts.neutro],
        backgroundColor: ["#22c55e", "#ef4444", "#9ca3af"],
      },
    ],
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Bar data={chartData} />
    </div>
  );
}
