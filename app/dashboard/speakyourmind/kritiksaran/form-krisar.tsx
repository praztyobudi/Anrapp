"use client";

import { useState } from "react";

export default function FormKrisar({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [saran, setSaran] = useState("");
  const [kritik, setKritik] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saran || !kritik) return;
    onSubmit({
      from: "Anonymous",
      to: saran,
      idea: kritik,
      date: new Date().toLocaleDateString("id-ID"),
    });
    setKritik("");
    setSaran("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Textarea Kritik */}
      <div className="rounded-xl p-4 border border-gray-300">
        <h3 className="text-gray-700 font-bold pb-2 border-b border-gray-300">
          Kritik
        </h3>
        <textarea
          className="w-full text-sm text-gray-700 rounded-lg p-3 focus:outline-none resize-none min-h-[150px]"
          placeholder="Tulis kritikmu di sini..."
          value={kritik}
          onChange={(e) => setKritik(e.target.value)}
        />
      </div>

      {/* Textarea Saran */}
      <div className="rounded-xl p-4 border border-gray-300">
        <h3 className="text-gray-700 font-bold pb-2 border-b border-gray-300 mb-4">
          Saran
        </h3>
        <textarea
          className="w-full text-sm text-gray-700 rounded-lg p-3 focus:outline-none resize-none min-h-[150px]"
          placeholder="Tulis saranmu di sini..."
          value={saran}
          onChange={(e) => setSaran(e.target.value)}
        />
      </div>

      {/* Tombol Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-8 py-3 rounded-full flex items-center gap-2 shadow-md transition"
        >
          <span>Kirim</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L15 22L11 13L2 9L22 2Z"></path>
          </svg>
        </button>
      </div>
    </form>
  );
}
