// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState, useCallback } from "react";
// import {
//   Wrench,
//   Laugh,
//   BarChart2,
//   UserCog2,
//   LogOut,
//   RotateCw,
// } from "lucide-react";
// import Cookies from "js-cookie";
// import Popup from "../components/popup-sym";
// import toast from "react-hot-toast";
// import AuthGuard from "../components/auth";
// import { decodedToken, getToken } from "../utils/jwtdecode";
// import { getUserById, me } from "../libs/users/api";
// import LoadingAnim from "../components/loading-anim";

// interface UserData {
//   id: number;
//   name: string;
//   department: string;
// }

// interface CardItem {
//   id: number;
//   label: string;
//   path: string;
//   icon: React.ComponentType<{ className?: string }>;
//   iconColor: string;
// }

// export default function Dashboard() {
//   const router = useRouter();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);
//   // const [error, setError] = useState<string | null>(null);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   // const [sessionExpired, setSessionExpired] = useState(false);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const openPopup = () => setIsPopupOpen(true);
//   const closePopup = () => setIsPopupOpen(false);

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const getMe = await me();
//       console.log("getMe:", getMe);
//       if (!getMe.ok) {
//         if (getMe.status === 401) {
//           toast.error("Sesi berakhir, silakan login lagi.");
//           router.replace("/auth/login");
//           return;
//         }
//         toast.error(getMe.message || "Gagal mengambil data user.");
//         return;
//       }
//       setUserData(getMe.data);
//     } catch (err) {
//       console.error("Gagal fetch data user:", err);
//       toast.error("Gagal ambil data user.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     const handleFocus = () => {
//       fetchData();
//     };

//     window.addEventListener("focus", handleFocus);
//     return () => {
//       window.removeEventListener("focus", handleFocus);
//     };
//   }, [fetchData]);

//   const handleLogout = useCallback(async () => {
//     try {
//       setIsLoggingOut(true);
//       Cookies.remove("token", { path: "/" });
//       Cookies.remove("user", { path: "/" });
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       // router.push("/auth/login");
//       window.location.href = "/auth/login";
//     } catch (error) {
//       console.error("Error saat logout:", error);
//     }
//   }, [router]);

//   const handleNavigation = useCallback(
//     (path: string) => {
//       router.push(path);
//     },
//     [router]
//   );

//   const cardData: CardItem[] = [
//     {
//       id: 1,
//       label: "Asset Care",
//       path: "/dashboard/assetcare",
//       icon: Wrench,
//       iconColor: "text-blue-600",
//     },
//     {
//       id: 2,
//       label: "Speak Your Mind",
//       path: "/dashboard/speakyourmind",
//       icon: Laugh,
//       iconColor: "text-green-600",
//     },
//     {
//       id: 3,
//       label: "Monitoring Jaringan",
//       path: "/dashboard/fitur3",
//       icon: BarChart2,
//       iconColor: "text-purple-600",
//     },
//     {
//       id: 4,
//       label: "Account Setting",
//       path: "/dashboard/account",
//       icon: UserCog2,
//       iconColor: "text-orange-600",
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingAnim message="Loading" />
//       </div>
//     );
//   } else if (isLoggingOut) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingAnim message="See you" />
//       </div>
//     );
//   }

//   const departmentAlias: Record<string, string> = {
//     umum: "Umum",
//     hc: "HC",
//     finance: "Finance",
//     purchase: "Purchase",
//     warehouse: "Warehouse",
//     maa: "MAA",
//     qc: "QC",
//     lab: "LAB",
//     rnd: "RnD",
//     principal: "Principal",
//     marketing: "Marketing",
//     pramaterial: "Pramaterial",
//   };

//   return (
//     <AuthGuard>
//       <div className="min-h-screen bg-[#f6fffa] flex flex-col items-center justify-start">
//         {/* Header Hijau */}
//         <div className="relative w-full mx-auto">
//           {/* Background Hijau */}
//           <div className="relative bg-[#0b5b34] py-20 md:py-28 text-center overflow-hidden">
//             {/* Gambar sebagai dekorasi kiri bawah */}
//             <div className="hidden md:block absolute bottom-0 left-0 z-0 w-[250px] md:w-[300px] lg:w-[350px] pointer-events-none">
//               <div className="relative w-full h-full">
//                 {/* Gambar PNG */}
//                 <img
//                   src="/img/gb3.png"
//                   alt="img1"
//                   className="w-full h-auto object-contain brightness-[.4] relative z-10"
//                 />

//                 {/* Gradasi hitam di sisi kanan */}
//                 <div
//                   className="absolute inset-0 z-20"
//                   style={{
//                     background:
//                       "linear-gradient(to left, rgba(11, 91, 52, 1), transparent)",
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Heading Teks */}
//             <h1 className="relative z-10 text-white text-3xl md:text-7xl font-bold leading-tight">
//               Sistem Pemantauan dan <br className="hidden md:block" />
//               Informasi Teknologi
//             </h1>
//           </div>
//         </div>

//         <div className="relative w-full z-10">
//           <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 w-[80%] md:w-[50%] bg-yellow-300 py-2 md:py-4 rounded-full z-0 text-center">
//             <h2 className="text-black font-bold text-lg md:text-3xl">
//               Welcome {userData?.name ?? "Loading..."} from{" "}
//               {departmentAlias[userData?.department ?? ""] ?? "Loading..."}!
//             </h2>
//           </div>
//         </div>

//         {/* Grid Tombol Card */}
//         <div className="py-20 px-4 w-full flex justify-center">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-screen-lg w-full">
//             {cardData.map(({ id, label, path, icon: Icon, iconColor }) => (
//               <button
//                 key={id}
//                 onClick={() =>
//                   label === "Speak Your Mind"
//                     ? openPopup()
//                     : handleNavigation(path)
//                 }
//                 className="bg-white rounded-2xl shadow-md h-auto w-full md:h-44 flex flex-col items-center justify-center text-gray-600 text-base md:text-lg font-semibold hover:shadow-xl hover:bg-gray-50 p-4 hover:scale-105 transform transition-transform duration-200"
//               >
//                 <Icon className={`w-6 h-6 md:w-12 md:h-12 mb-2 ${iconColor}`} />
//                 {label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Logout Button */}
//         <div className="absolute md:fixed top-4 right-4 z-50">
//           <div className="relative group">
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold rounded-lg px-3 py-2 bg-white shadow-md hover:shadow-lg transition-all duration-200"
//             >
//               <LogOut className="w-5 h-5" size={20} />
//             </button>
//             <span className="absolute right-full top-1/2 -translate-y-1/2 ml-2 mr-2 whitespace-nowrap bg-red-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
//               Logout
//             </span>
//           </div>
//         </div>

//         {/* Popup */}
//         <Popup isOpen={isPopupOpen} onClose={closePopup} />
//       </div>
//     </AuthGuard>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Wrench, Laugh, BarChart2, UserCog2, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import Popup from "../components/popup-sym";
import toast from "react-hot-toast";
import AuthGuard from "../components/auth";
import LoadingAnim from "../components/loading-anim";
import { me } from "../libs/users/api";

interface UserData {
  id: number;
  name: string;
  department: string;
}

interface CardItem {
  id: number;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const getMe = await me();
      if (!getMe) {
        if (getMe.status === 401) {
          toast.error("Sesi berakhir, silakan login lagi.");
          router.replace("/auth/login");
          return; // stop eksekusi setelah redirect
        }
        throw new Error("Error fetching user data");
      }
      setUserData(getMe.data);
    } catch (err) {
      console.error("Gagal fetch data user:", err);
      toast.error("Gagal ambil data user.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        fetchData();
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchData]);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      // jika pakai httpOnly cookie, sebaiknya panggil endpoint logout di server
      Cookies.remove("token", { path: "/" });
      Cookies.remove("user", { path: "/" });
      router.replace("/auth/login");
      // Fallback darurat:
      // setTimeout(() => (window.location.href = "/auth/login"), 50);
    } catch (error) {
      console.error("Error saat logout:", error);
      setIsLoggingOut(false);
    }
  }, [router]);

  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const cardData: CardItem[] = [
    { id: 1, label: "Asset Care", path: "/dashboard/assetcare", icon: Wrench, iconColor: "text-blue-600" },
    { id: 2, label: "Speak Your Mind", path: "/dashboard/speakyourmind", icon: Laugh, iconColor: "text-green-600" },
    { id: 3, label: "Monitoring Jaringan", path: "/dashboard/fitur3", icon: BarChart2, iconColor: "text-purple-600" },
    { id: 4, label: "Account Setting", path: "/dashboard/account", icon: UserCog2, iconColor: "text-orange-600" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnim message="Loading" />
      </div>
    );
  }

  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnim message="See you" />
      </div>
    );
  }

  const departmentAlias: Record<string, string> = {
    umum: "Umum",
    hc: "HC",
    finance: "Finance",
    purchase: "Purchase",
    warehouse: "Warehouse",
    maa: "MAA",
    qc: "QC",
    lab: "LAB",
    rnd: "RnD",
    principal: "Principal",
    marketing: "Marketing",
    pramaterial: "Pramaterial",
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f6fffa] flex flex-col items-center justify-start">
        {/* Header Hijau */}
        <div className="relative w-full mx-auto">
          <div className="relative bg-[#0b5b34] py-20 md:py-28 text-center overflow-hidden">
            <div className="hidden md:block absolute bottom-0 left-0 z-0 w-[250px] md:w-[300px] lg:w-[350px] pointer-events-none">
              <div className="relative w-full h-full">
                <img
                  src="/img/gb3.png"
                  alt="img1"
                  className="w-full h-auto object-contain brightness-[.4] relative z-10"
                />
                <div
                  className="absolute inset-0 z-20"
                  style={{ background: "linear-gradient(to left, rgba(11, 91, 52, 1), transparent)" }}
                />
              </div>
            </div>
            <h1 className="relative z-10 text-white text-3xl md:text-7xl font-bold leading-tight">
              Sistem Pemantauan dan <br className="hidden md:block" />
              Informasi Teknologi
            </h1>
          </div>
        </div>

        <div className="relative w-full z-10">
          <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 w-[80%] md:w-[50%] bg-yellow-300 py-2 md:py-4 rounded-full z-0 text-center">
            <h2 className="text-black font-bold text-lg md:text-3xl">
              Welcome {userData?.name ?? "Loading..."} from{" "}
              {departmentAlias[userData?.department ?? ""] ?? "Loading..."}!
            </h2>
          </div>
        </div>

        {/* Grid Tombol Card */}
        <div className="py-20 px-4 w-full flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-screen-lg w-full">
            {cardData.map(({ id, label, path, icon: Icon, iconColor }) => (
              <button
                key={id}
                onClick={() => (label === "Speak Your Mind" ? openPopup() : handleNavigation(path))}
                className="bg-white rounded-2xl shadow-md h-auto w-full md:h-44 flex flex-col items-center justify-center text-gray-600 text-base md:text-lg font-semibold hover:shadow-xl hover:bg-gray-50 p-4 hover:scale-105 transform transition-transform duration-200"
              >
                <Icon className={`w-6 h-6 md:w-12 md:h-12 mb-2 ${iconColor}`} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="absolute md:fixed top-4 right-4 z-50">
          <div className="relative group">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold rounded-lg px-3 py-2 bg-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <span className="absolute right-full top-1/2 -translate-y-1/2 ml-2 mr-2 whitespace-nowrap bg-red-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              Logout
            </span>
          </div>
        </div>

        {/* Popup */}
        <Popup isOpen={isPopupOpen} onClose={closePopup} />
      </div>
    </AuthGuard>
  );
}
