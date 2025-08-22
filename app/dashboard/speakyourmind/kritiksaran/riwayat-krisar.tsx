import { Eye, RefreshCw, RotateCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { propsRiwayatKrisar } from "./types";
import useDelayedFlag from "../../../components/loading-time";

export default function RiwayatKrisar({
  refreshData,
  statusMsg,
  krisars,
  editKrisar,
  deleteKrisar,
}: propsRiwayatKrisar) {
  const [loading, setLoading] = useState(false);
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

  const handleRefresh = () => {
    if (loading) return;
    setLoading(true);
    refreshData().finally(() => setLoading(false));
  };

  const emptyArmed = !loading && (krisars?.length ?? 0) === 0;
  const showEmpty = useDelayedFlag(emptyArmed, 1000); // detik

  return (
    <>
      <div className="flex flex-col gap-4 h-[460px]">
        <div className="flex items-center justify-between sticky top-0 bg-white z-10">
          {/* Kiri */}
          <div className="font-bold text-sm md:text-base text-gray-600">
            Your history
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
              onClick={handleRefresh}
              disabled={loading}
              className={`text-gray-500 ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
        <div className="border-b-2"></div>
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500 text-sm">
                {" "}
                {/* <span>Loading</span>
                <span className="dot-anim ml-1 inline-block">.</span> */}
                <RotateCw size={16} className={loading ? "animate-spin" : ""} />
              </div>
            </div>
          ) : (krisars?.length ?? 0) === 0 ? (
            showEmpty ? (
              <div className="text-center text-gray-500 text-sm" aria-live="polite">
                <p>Sorry, no data!</p>
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm" aria-live="polite">
                <span>Wait a moment</span>
                <span className="dot-anim ml-1 inline-block">.</span>
              </div>
            )
          ) : (
            krisars.map((item) => (
              <div
                key={item.id}
                className="border-b last:border-0 py-2 last:pb-0 "
              >
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-gray-700 text-sm">
                    {item.user_name}
                    {isNew(item.created_at) && (
                      <span className="bg-green-100 text-green-600 ml-2 px-2 py-0.5 rounded text-[12px]">
                        New !
                      </span>
                    )}
                    {!isNew(item.created_at) &&
                      isEdited(item.created_at, item.updated_at) && (
                        <span className="bg-yellow-100 text-yellow-600 ml-2 px-2 py-0.5 rounded text-[12px]">
                          Edited !
                        </span>
                      )}
                  </div>
                  <div className="flex justify-end items-center">
                    {/* <div className="text-green-600 text-sm mt-1">
                  To : All dept.
                </div> */}
                    <div className="flex gap-2 mt-2 mr-2">
                      <button
                        onClick={() => editKrisar(item)}
                        aria-label="Edit"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => deleteKrisar(item.id)}
                        aria-label="Delete"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-700 flex items-center gap-1">
                  <span className="text-gray-500">
                    {new Date(item.updated_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
