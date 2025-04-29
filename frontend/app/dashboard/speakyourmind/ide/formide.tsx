"use client";

import { useState } from "react";

export default function FormIde({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [department, setDepartment] = useState("");
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !idea) return;
    onSubmit({
      from: "Anonymous",
      to: department,
      idea,
      date: new Date().toLocaleDateString("id-ID"),
    });
    setIdea("");
    setDepartment("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex gap-4">
        <div className="flex-1 bg-gray-100 p-3 rounded-xl text-gray-600 text-sm">
          From <span className="font-semibold ml-2 text-gray-800">Anonymous</span>
        </div>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="flex-1 bg-gray-100 p-3 rounded-xl text-sm text-gray-600 focus:outline-none"
        >
          <option value="">Select Department</option>
          <option value="Marketing">Marketing</option>
          <option value="Production">Production</option>
          <option value="HR">HR</option>
        </select>
      </div>

      {/* Textarea */}
      <textarea
        className="bg-gray-100 rounded-xl p-4 min-h-[200px] text-sm text-gray-700 focus:outline-none resize-none"
        placeholder="Tulis ide kreatifmu di sini..."
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
      />

      {/* Submit Button */}
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
