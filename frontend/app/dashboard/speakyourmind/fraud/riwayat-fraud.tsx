"use client";

import { Pencil, Trash2, Loader2, RefreshCw, Eye, RotateCw } from "lucide-react";
import { propsRiwayatFraud } from "./types";
import { useState } from "react";

export default function RiwayatFraud({
  frauds,
  editFraud,
  deleteFraud,
  refreshData,
  statusMsg,
  isLoading,
  error,
}: propsRiwayatFraud) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await deleteFraud(id);
    setDeletingId(null);
  };

  const handleRefresh = () => {
    if (loading) return;
    setLoading(true);
    refreshData().finally(() => setLoading(false));
  };

  const isNew = (created_at: string, maxAgeInSeconds: number = 60) => {
    const created = new Date(created_at);
    const now = new Date();
    const diffSeconds = (now.getTime() - created.getTime()) / 1000;
    return diffSeconds < maxAgeInSeconds;
  };

  const isEdited = (
    created_at: string,
    updated_at: string,
    maxAgeInSeconds: number = 60
  ) => {
    const created = new Date(created_at);
    const updated = new Date(updated_at);
    const now = new Date();

    const isActuallyEdited = created.getTime() !== updated.getTime();
    const diffSeconds = (now.getTime() - updated.getTime()) / 1000;

    // Jika data masih dianggap 'new', jangan tampilkan 'edited'
    if ((now.getTime() - created.getTime()) / 1000 < maxAgeInSeconds) {
      return false;
    }

    return isActuallyEdited && diffSeconds < maxAgeInSeconds;
  };

  return (
    <div className="flex flex-col gap-4 h-[423px]">
      <div className="flex items-center justify-between sticky top-0 bg-white z-10">
        <h2 className="font-bold text-sm md:text-base text-gray-600">
          Your history
        </h2>
        <div className="flex items-center gap-2">
          {statusMsg && (
            <div className="bg-green-100 text-green-700 px-1 py-0.5 rounded text-xs mx-1 whitespace-nowrap">
              {statusMsg}
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`text-gray-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
      <div className="border-b-2"></div>
      {frauds.length === 0 && !isLoading ? (
        // Jika tidak ada data yang ditemukan munculkan pesan tidak ada data
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500 italic">Sorry, no data!</div>
        </div>
      ) : isLoading ? (
        // Jika masih menunggu proses pengambilan data munculkan pesan loading
        <div className="flex items-center justify-center h-full">
          <RotateCw size={16} className={loading ? "animate-spin" : ""} />
        </div>
      ) : (
        // Jika ada data, tampilkan data di sini
        <div>
          {/* Render data di sini */}

          <div className="max-h-[350px] overflow-y-auto pr-2">
            <ul className="space-y-3">
              {[...frauds]
                .sort(
                  (a, b) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime()
                )
                .map((fraud) => (
                  <li
                    key={fraud.id}
                    className="border-b last:border-0 py-2 last:pb-0"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-700">
                          I'am Anonymous
                          {isNew(fraud.created_at) && (
                            <span className="bg-green-100 text-green-600 ml-2 px-2 py-0.5 rounded text-[12px]">
                              New !
                            </span>
                          )}
                          {!isNew(fraud.created_at) &&
                            isEdited(fraud.created_at, fraud.updated_at) && (
                              <span className="bg-yellow-100 text-yellow-600 ml-2 px-2 py-0.5 rounded text-[12px]">
                                Edited !
                              </span>
                            )}
                        </p>
                        <p className="text-gray-600 text-sm font-semibold">
                          {fraud.type_message}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(fraud.created_at).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => editFraud(fraud)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(fraud.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Hapus"
                            disabled={deletingId === fraud.id}
                          >
                            {deletingId === fraud.id ? (
                              <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
