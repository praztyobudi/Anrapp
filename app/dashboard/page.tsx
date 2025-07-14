"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Wrench,
  Laugh,
  BarChart2,
  UserCog2,
  LogOut,
  UserCircle2,
  RotateCw,
} from "lucide-react";
import Cookies from "js-cookie";
import Popup from "../components/popup-sym";
import toast from "react-hot-toast";
import AuthGuard from "../components/auth";

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
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const decodeToken = (token: string): UserData => {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    return JSON.parse(atob(padded));
  };

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decoded = decodeToken(token);
        setUserData({
          id: decoded.id,
          name: decoded.name,
          department: decoded.department,
        });
      } catch (err) {
        console.error("Gagal decode token:", err);
        toast.error("Terjadi kesalahan saat mengambil data user.");
      }
    }

    setLoading(false);
  }, []);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const token = Cookies.get('token');
  //       if (!token) {
  //         router.push('/auth/login');
  //         return;
  //       }

  //       const response = await fetch('https://app.prazelab.my.id/api/users', {
  //         headers: {
  //           'Authorization': `Bearer ${token}`
  //         },
  //       });

  //       if (response.status === 401) {
  //         Cookies.remove('token');
  //         setSessionExpired(true);
  //         router.push('/auth/login');
  //         return;
  //       }

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         throw new Error(errorData.message || 'Failed to fetch user data');
  //       }

  //       const data = await response.json();
  //       console.log('userData fetched:', data.data);
  //       setUserData(data.data);
  //     } catch (err) {
  //       console.error('Error fetching user data:', err);
  //       setError('Failed to load user data');

  //       const storedUser = Cookies.get('user');
  //       if (storedUser) {
  //         try {
  //           setUserData(JSON.parse(storedUser));
  //         } catch (parseError) {
  //           console.error('Error parsing stored user data:', parseError);
  //         }
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserData();
  // }, [router]);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const token = Cookies.get("token");
  //       if (!token) {
  //         handleSessionExpired();
  //         return;
  //       }

  //       let response = await fetch("https://app.prazelab.my.id/api/users", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       console.log("Response status:", response.status);

  //       if (response.status === 401) {
  //         const refreshToken = Cookies.get("refresh_token");

  //         if (refreshToken) {
  //           const refreshRes = await fetch(
  //             "https://app.prazelab.my.id/api/refresh",
  //             {
  //               method: "POST",
  //               headers: { "Content-Type": "application/json" },
  //               body: JSON.stringify({ refresh_token: refreshToken }),
  //             }
  //           );

  //           if (refreshRes.ok) {
  //             const newTokens = await refreshRes.json();
  //             Cookies.set("token", newTokens.token, { path: "/" });
  //             Cookies.set("refresh_token", newTokens.refresh_token, {
  //               path: "/",
  //             });
  //             return fetchUserData(); // Retry setelah refresh
  //           }
  //         }

  //         handleSessionExpired();
  //         return;
  //       }

  //       const data = await response.json();
  //       setUserData(data.data);
  //       console.log("User data fetched:", data.data);
  //       // Simpan data user ke cookies untuk fallback
  //       Cookies.set("user", JSON.stringify(data.data), { path: "/" });
  //     } catch (err) {
  //       console.error("Error fetching user data:", err);
  //       setError("Gagal mengambil data user");

  //       const fallbackUser = Cookies.get("user");
  //       if (fallbackUser) {
  //         try {
  //           setUserData(JSON.parse(fallbackUser));
  //         } catch (parseErr) {
  //           console.error("Error parsing fallback user:", parseErr);
  //         }
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const handleSessionExpired = () => {
  //     Cookies.remove("token");
  //     Cookies.remove("refresh_token");
  //     Cookies.remove("user");
  //     toast.error("⚠️ Sesi Anda telah berakhir. Silakan login kembali.");
  //     router.replace("/auth/login");
  //   };

  //   fetchUserData();
  // }, [router]);

  // useEffect(() => {
  //   if (userData) {
  //     console.log("User data loaded:", userData);
  //   }
  //   if (sessionExpired) {
  //     alert("Sesi Anda telah habis. Silakan login kembali.");
  //     router.push("/auth/login");
  //   }
  // }, [sessionExpired, router, userData]);

  // function base64UrlDecode(str: string) {
  //   const base64 = str.replace(/-/g, "+").replace(/_/g, "/"); //encoding yang URL-safe (punya karakter - atau _)
  //   const padded = base64.padEnd(
  //     base64.length + ((4 - (base64.length % 4)) % 4),
  //     "="
  //   );
  //   return atob(padded);
  // }

  // useEffect(() => {
  //   const token = Cookies.get("token");

  //   if (!token) {
  //     handleSessionExpired();
  //     return;
  //   }

  //   try {
  //     const payload = token.split(".")[1]; // ambil bagian tengah
  //     // const decodedPayload = JSON.parse(atob(payload)); // base64 decode → JSON.parse
  //     const decodedPayload = JSON.parse(base64UrlDecode(payload));

  //     // Validasi exp (optional tapi penting)
  //     const now = Math.floor(Date.now() / 1000);
  //     if (decodedPayload.exp < now) {
  //       throw new Error("Token expired");
  //     }
  //     console.log("Decoded payload:", decodedPayload);
  //     setUserData(decodedPayload);
  //     // 🔁 Cek terus setiap 30 detik
  //     const interval = setInterval(() => {
  //       const now = Math.floor(Date.now() / 1000);
  //       if (decodedPayload.exp < now) {
  //         console.warn("Token expired while idle. Logging out...");
  //         handleSessionExpired();
  //         clearInterval(interval);
  //       }
  //     }, 30 * 1000); // 30 detik

  //     return () => clearInterval(interval); // Bersihkan jika unmount
  //   } catch (err) {
  //     console.error("Failed to decode token manually:", err);
  //     handleSessionExpired();
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // const handleSessionExpired = () => {
  //   Cookies.remove("token");
  //   Cookies.remove("refresh_token");
  //   alert("Sesi Anda telah habis. Silakan login kembali.");
  //   toast.error("⚠️ Sesi Anda telah berakhir. Silakan login kembali.");
  //   router.replace("/auth/login");
  // };

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    Cookies.remove("token");
    Cookies.remove("user");
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/auth/login");
  }, [router]);

  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const cardData: CardItem[] = [
    {
      id: 1,
      label: "Asset Care",
      path: "/dashboard/assetcare",
      icon: Wrench,
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      label: "Speak Your Mind",
      path: "/dashboard/speakyourmind",
      icon: Laugh,
      iconColor: "text-green-600",
    },
    {
      id: 3,
      label: "Monitoring Jaringan",
      path: "/dashboard/fitur3",
      icon: BarChart2,
      iconColor: "text-purple-600",
    },
    {
      id: 4,
      label: "Account Setting",
      path: "/dashboard/account",
      icon: UserCog2,
      iconColor: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6fffa] flex items-center justify-center">
        <div className="text-center">
          <p className="flex gap-2 animate-pulse text-gray-500">
            <RotateCw
              size={24}
              strokeWidth={2}
              className={`stroke-green-600 ${loading ? "animate-spin" : ""}`}
            />
            <span className="dot-anim">Loading</span>
          </p>
        </div>
      </div>
    );
  }

  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-[#f6fffa] flex items-center justify-center">
        <div className="text-center">
          <p className="flex gap-2 animate-pulse text-gray-500">
            <RotateCw
              size={24}
              strokeWidth={2}
              className={`stroke-green-600 ${loading ? "animate-spin" : ""}`}
            />
            <span className="dot-anim">See you</span>
          </p>
        </div>
      </div>
    );
  }

  // return (
  //   <AuthGuard>
  //   <div className="min-h-screen bg-[#f6fffa] justify-center">
  //     <div className="flex flex-col items-center space-y-8 md:space-y-14 w-full max-w-5xl mx-auto p-4 md:p-20">
  //       <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-2">
  //         <div className="relative group">
  //           <button
  //             onClick={handleLogout}
  //             className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold rounded-lg px-3 py-2 bg-white shadow-md hover:shadow-lg transition-all duration-200"
  //           >
  //             <LogOut className="w-5 h-5" size={20} />
  //           </button>
  //           <span className="absolute right-full top-1/2 -translate-y-1/2 ml-2 mr-2 whitespace-nowrap bg-red-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
  //             Logout
  //           </span>
  //         </div>
  //       </div>
  //         <span className="text-center text-2x1 md:text-7xl font-bold text-black mb-4 md:mb-6">
  //           Sistem Pemantauan dan Informasi Teknologi
  //         </span>
  //       <div className="text-center">
  //         <h2 className="text-lg md:text-xl">
  //           Welcome {"  "}
  //           <span>{userData?.name ?? "Loading..."}</span> dari{" "}
  //           <span>{userData?.department ?? "Loading..."}</span>!
  //         </h2>
  //       </div>
  //       <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 w-full">
  //         {cardData.map(({ id, label, path, icon: Icon, iconColor }) => {
  //           return (
  //             <button
  //               key={id}
  //               onClick={() => {
  //                 if (label === "Speak Your Mind") {
  //                   openPopup();
  //                 } else {
  //                   handleNavigation(path);
  //                 }
  //               }}
  //               className="bg-white rounded-2xl shadow-md h-28 md:h-32 flex flex-col items-center justify-center text-gray-600 text-base md:text-lg font-semibold hover:shadow-xl hover:bg-gray-50 p-4 hover:scale-105 transform transition-transform duration-200"
  //             >
  //               <Icon className={`w-6 h-6 md:w-8 md:h-8 mb-2 ${iconColor}`} />
  //               {label}
  //             </button>
  //           );
  //         })}
  //       </div>
  //     </div>
  //     <Popup isOpen={isPopupOpen} onClose={closePopup} />
  //   </div>
  //   </AuthGuard>
  // );
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f6fffa] flex flex-col items-center justify-start">
        {/* Header Hijau */}
        <div className="relative w-full mx-auto">
          {/* Background Hijau */}
          <div className="relative bg-[#0b5b34] py-20 md:py-28 text-center overflow-hidden">
            {/* Gambar sebagai dekorasi kiri bawah */}
            <div className="hidden md:block absolute bottom-0 left-0 z-0 w-[250px] md:w-[300px] lg:w-[350px] pointer-events-none">
              <div className="relative w-full h-full">
                {/* Gambar PNG */}
                <img
                  src="/img/gb3.png"
                  alt="img1"
                  className="w-full h-auto object-contain brightness-[.4] relative z-10"
                />

                {/* Gradasi hitam di sisi kanan */}
                <div
                  className="absolute inset-0 z-20"
                  style={{
                    background:
                      "linear-gradient(to left, rgba(11, 91, 52, 1), transparent)",
                  }}
                />
              </div>
            </div>

            {/* Heading Teks */}
            <h1 className="relative z-10 text-white text-3xl md:text-7xl font-bold leading-tight">
              Sistem Pemantauan dan <br className="hidden md:block" />
              Informasi Teknologi
            </h1>
          </div>
        </div>

        <div className="relative w-full z-10">
          <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 w-[80%] md:w-[50%] bg-yellow-300 py-2 md:py-4 rounded-full z-0 text-center">
            <h2 className="text-black font-bold text-lg md:text-3xl">
              Welcome {userData?.name ?? "Loading..."} dari{" "}
              {userData?.department ?? "Loading..."}!
            </h2>
          </div>
        </div>

        {/* Grid Tombol Card */}
        <div className="py-20 px-4 w-full flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-screen-lg w-full">
            {cardData.map(({ id, label, path, icon: Icon, iconColor }) => (
              <button
                key={id}
                onClick={() =>
                  label === "Speak Your Mind"
                    ? openPopup()
                    : handleNavigation(path)
                }
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
              <LogOut className="w-5 h-5" size={20} />
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
