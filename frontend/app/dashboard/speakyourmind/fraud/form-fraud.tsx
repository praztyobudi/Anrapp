"use client";

import { Eye, Send } from "lucide-react";
import { useState } from "react";

export default function FormFraud({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [farud, setFraud] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farud) return;
    setFraud("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Textarea Kritik */}
      <div className="rounded-xl p-4 border border-gray-300">
        <h3 className="text-gray-700 font-bold pb-2 border-b border-gray-300 gap-2 flex items-center">
        <Eye strokeWidth={2} /> Apa temuanmu ?
        </h3>
        <textarea
          className="w-full text-sm text-gray-700 rounded-lg p-3 focus:outline-none resize-none min-h-[150px]"
          placeholder="Tulis kritikmu di sini..."
          value={farud}
          onChange={(e) => setFraud(e.target.value)}
        />
      </div>

      {/* Tombol Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-red-500 hover:bg-green-600 text-white font-medium px-8 py-3 rounded-full flex items-center gap-2 shadow-md transition"
        >
          <Send /><span>Laporkan</span>
        </button>
      </div>
    </form>
  );
}
