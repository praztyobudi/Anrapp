"use client";

import { useEffect, useState } from "react";
import { propsRiwayatIde } from "./types";
import { Trash2, RefreshCw, Eye } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import useDelayedFlag from "../../../components/loading-time";

export default function ListIde({
  onEdit,
  ideas,
  setIdeas,
  refreshData,
  statusMsg,
}: propsRiwayatIde) {
  const [loading, setLoading] = useState(false);
  
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus ide ini?")) return;
    try {
      await fetch(`https://app.prazelab.my.id/api/ide/${id}`, {
        method: "DELETE",
      });
      setIdeas(prev => prev.filter(i => i.id !== id));
      toast.success("Berhasil dihapus.");
    } catch (error) {
      console.error("Error deleting idea:", error);
      toast.error("Gagal menghapus!");
    }
  };

  // Fungsi untuk memeriksa apakah tanggal valid
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// Fungsi isNew
const isNew = (created_at, maxAgeInSeconds = 60) => {
  // Validasi input
  if (!created_at || !isValidDate(created_at)) {
    console.error(`Invalid created_at: ${created_at}`);
    return false; // Kembalikan false jika tanggal tidak valid
  }

  const created = new Date(created_at);
  const now = new Date();
  const diffSeconds = (now.getTime() - created.getTime()) / 1000;
  return diffSeconds < maxAgeInSeconds;
};

// Fungsi isEdited
const isEdited = (created_at, updated_at, maxAgeInSeconds = 60) => {
  // Validasi input
  if (!created_at || !isValidDate(created_at)) {
    console.error(`Invalid created_at: ${created_at}`);
    return false;
  }
  if (!updated_at || !isValidDate(updated_at)) {
    console.error(`Invalid updated_at: ${updated_at}`);
    return false;
  }

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


  // Jika tidak loading dan data kosong -> mulai hitung
  const emptyArmed = !loading && (ideas?.length ?? 0) === 0;
  const showEmpty = useDelayedFlag(emptyArmed, 1000); //  detik

  return (
    <>
      <Toaster position="top-right" reverseOrder={true} />
      <div className="flex flex-col gap-4 h-[465px]">
        <div className="flex items-center justify-between sticky top-0 bg-white z-10">
          {/* Kiri */}
          <div className="font-bold text-sm md:text-base text-gray-600">
            Your idea history
          </div>

          {/* Tengah + Kanan */}
          <div className="flex items-center gap-2">
            {statusMsg && (
              <div className="bg-green-100 text-green-700 px-1 py-0.5 rounded text-xs mx-1 whitespace-nowrap">
                {statusMsg}
              </div>
            )}
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  await refreshData();
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className={`text-gray-500 ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="border-b-2" />

        <div className="overflow-y-auto max-h-[500px]">
          {loading ? (
            <div className="text-center text-gray-500 text-sm" aria-live="polite">
              <span>Loading</span>
              <span className="dot-anim ml-1 inline-block">.</span>
            </div>
          ) : (ideas?.length ?? 0) === 0 ? (
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
            ideas.map((item) => (
              <div
                key={item.id}
                className="border-b last:border-0 py-2 last:pb-0"
              >
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-gray-700 text-sm">
                    From : {item.from}
                  </div>
                  <div className="text-xs text-gray-700">
                    {isNew(item.created_at) && (
                      <span className="bg-green-100 text-green-600 ml-2 px-2 py-0.5 mr-2 rounded text-[12px]">
                        New !
                      </span>
                    )}
                    {!isNew(item.created_at) &&
                      isEdited(item.created_at, item.updated_at) && (
                        <span className="bg-yellow-100 text-yellow-600 ml-2 px-2 py-0.5 mr-2 rounded text-[12px]">
                          Edited !
                        </span>
                      )}
                    <span className="text-gray-500">
                    {new Date(item.updated_at).toLocaleDateString("id-ID")}
                  </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-green-600 text-sm mt-1">
                    To : {item.to}
                  </div>
                  <div className="flex gap-2 mt-2 mr-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Lihat"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}


// "use client";

// import { useState } from "react";
// import { propsRiwayatIde } from "./types";
// import { Trash2, RefreshCw, Eye } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";

// export default function ListIde({
//   onEdit,
//   ideas,
//   setIdeas,
//   refreshData,
//   statusMsg,
// }: propsRiwayatIde) {
//   const [loading, setLoading] = useState(false);
//   const handleDelete = async (id: number) => {
//     if (!confirm("Yakin ingin menghapus ide ini?")) return;
//     try {
//       await fetch(`https://app.prazelab.my.id/api/ide/${id}`, {
//         method: "DELETE",
//       });
//       setIdeas(prev => prev.filter(i => i.id !== id));
//       toast.success("Berhasil dihapus.");
//     } catch (error) {
//       console.error("Error deleting idea:", error);
//       toast.error("Gagal menghapus!");
//     }
//   };
//   const isNew = (updatedAt: string) => {
//     const updated = new Date(updatedAt);
//     const now = new Date();
//     const diffSeconds = (now.getTime() - updated.getTime()) / 1000;
//     return diffSeconds < 60; // anggap baru jika kurang dari 60 detik
//   };

//   return (
//     <>
//       <Toaster position="top-right" reverseOrder={true} />
//       <div className="flex flex-col gap-4 max-h-[465px]">
//         <div className="flex items-center justify-between sticky top-0 bg-white z-10">
//           {/* Kiri */}
//           <div className="font-bold text-sm md:text-base text-gray-600">
//             Your idea history
//           </div>
//           {/* Tengah */}
//           <div className="flex items-center gap-2">
//             {statusMsg && (
//               <div className="bg-green-100 text-green-700 px-1 py-0.5 rounded text-xs mx-1 whitespace-nowrap">
//                 {statusMsg}
//               </div>
//             )}
//             {/* Kanan */}
//             <button
//               onClick={async () => {
//                 setLoading(true);
//                 await refreshData();
//                 setLoading(false);
//               }}
//               disabled={loading}
//               className={`text-gray-500 ${loading ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               title="Refresh"
//             >
//               <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
//             </button>
//           </div>
//         </div>
//         <div className="border-b-2"></div>

//         <div className="overflow-y-auto max-h-[500px]">
//           {loading ? (
//             <div className="text-center text-gray-500 text-sm">
//               {" "}
//               <span>Loading</span>
//               <span className="dot-anim ml-1 inline-block">.</span>
//             </div>
//           ) : ideas.length === 0 ? (
//             <div className="text-center text-gray-500 text-sm">
//               {" "}
//               <span>Wait a moment</span>
//               <span className="dot-anim ml-1 inline-block">.</span>
//             </div>
//           ) : (
//             ideas.map((item, index) => (
//               <div
//                 key={index}
//                 className="border-b last:border-0 py-2 last:pb-0 "
//               >
//                 <div className="flex justify-between items-center">
//                   <div className="font-semibold text-gray-700 text-sm">
//                     From : {item.from}
//                   </div>
//                   {/* <div className="text-xs text-gray-700">{item.date}</div> */}
//                   <div className="text-xs text-gray-700">
//                     {isNew(item.date) && (
//                       <span className="ml-2 bg-green-100 text-green-600 p-1 mr-2 rounded-md">
//                         New!
//                       </span>
//                     )}
//                     {new Date(item.date).toLocaleDateString("id-ID")}
//                   </div>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <div className="text-green-600 text-sm mt-1">
//                     To : {item.to}
//                   </div>
//                   <div className="flex gap-2 mt-2 mr-2">
//                     <button
//                       onClick={() => onEdit(item)}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       <Eye size={16} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(item.id)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
