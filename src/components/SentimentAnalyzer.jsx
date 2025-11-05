import { useState } from "react";
import { motion } from "framer-motion";
import { Smile, Frown, Meh } from "lucide-react";

export default function SentimentAnalyzer() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState(null);

  const analyzeSentiment = async () => {
    if (!text.trim()) return;
    const name = prompt("¿Cuál es tu nombre?");

    const res = await fetch("http://localhost:4000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, comment: text }),
    });

    const data = await res.json();
    if (data.analysis) {
      const { sentimiento } = data.analysis;
      setSentiment(sentimiento);
    }
  };

  const getSentimentInfo = () => {
    switch (sentiment) {
      case "positive":
        return { color: "text-green-500", Icon: Smile, label: "Positivo 😀" };
      case "negative":
        return { color: "text-red-500", Icon: Frown, label: "Negativo 😞" };
      default:
        return { color: "text-gray-500", Icon: Meh, label: "Neutro 😐" };
    }
  };

  const { color, Icon, label } = getSentimentInfo();

  return (
    <motion.div
      className="flex flex-col items-center justify-center mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe tu opinión aquí..."
        className="w-96 h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        onClick={analyzeSentiment}
        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
      >
        Analizar sentimiento
      </button>

      {sentiment && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Icon className={`mx-auto ${color}`} size={48} />
          <p className={`text-xl font-semibold mt-2 ${color}`}>{label}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
