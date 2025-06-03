"use client";

import { useState } from "react";
import { Idea } from "./types";
import { Pencil, Trash2, RefreshCw } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type Props = {
  onEdit: (idea: Idea) => void;
  ideas: Idea[];
  setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>;
  refreshData: () => Promise<void>;
  statusMsg: string;
};
export default function ListIde({ onEdit, ideas, setIdeas, refreshData, statusMsg }: Props) {
  const [loading, setLoading] = useState(false);
console.log("ListIde rendered with ideas:", ideas);
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus ide ini?")) return;
    try {
      await fetch(`https://app.prazelab.my.id/api/ide/${id}`, { method: "DELETE" });
      setIdeas(ideas.filter(item => item.id !== id));
      toast.success("Berhasil dihapus.");
    } catch (error) {
      console.error("Error deleting idea:", error);
      toast.error("Gagal menghapus!");
    }
  };
  const isNew = (updatedAt: string) => {
    const updated = new Date(updatedAt);
    const now = new Date();
    const diffSeconds = (now.getTime() - updated.getTime()) / 1000;
    return diffSeconds < 60; // anggap baru jika kurang dari 60 detik
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={true} />
      <div className="flex flex-col gap-4 max-h-[465px]">
        <div className="flex items-center justify-between sticky top-0 bg-white z-10">
          {/* Kiri */}
          <div className="font-semibold text-xs md:text-sm text-gray-600">
            Your idea history
          </div>
          {/* Tengah */}
          <div className="flex items-center gap-2">
            {statusMsg && (
              <div className="bg-green-100 text-green-700 px-1 py-0.5 rounded text-xs mx-1 whitespace-nowrap">
                {statusMsg}
              </div>
            )}
            {/* Kanan */}
            <button
              onClick={async () => {
                setLoading(true);
                await refreshData();
                setLoading(false);
              }}
              disabled={loading}
              className={`text-gray-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[500px] my-2">
          {loading ? (
            <div className="text-center text-gray-500 text-sm"> <span>Loading</span>
              <span className="dot-anim ml-1 inline-block">.</span></div>
          ) : ideas.length === 0 ? (
            <div className="text-center text-gray-500 text-sm"> <span>Wait a moment</span>
              <span className="dot-anim ml-1 inline-block">.</span></div>
          ) : (
            ideas.map((item, index) => (
              <div key={index} className="border-b last:border-0 py-2 last:pb-0 ">
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-gray-700 text-sm">From : {item.from}</div>
                  {/* <div className="text-xs text-gray-700">{item.date}</div> */}
                  <div className="text-xs text-gray-700">
                    {isNew(item.date) && (
                      <span className="ml-2 bg-green-100 text-green-600 p-1 mr-2 rounded-md">New!</span>
                    )}
                    {new Date(item.date).toLocaleDateString("id-ID")}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-green-600 text-sm mt-1">To : {item.to}</div>
                  <div className="flex gap-2 mt-2 mr-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
          }
        </div>
      </div>
    </>
  );

}
