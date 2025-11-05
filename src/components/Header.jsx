import { Smile } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow p-4 flex items-center justify-center gap-2">
      <Smile className="text-purple-600" size={32} />
      <h1 className="text-2xl font-bold text-gray-800">Yuhu Sentiment Live</h1>
    </header>
  );
}
