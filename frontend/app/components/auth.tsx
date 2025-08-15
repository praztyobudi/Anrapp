// "use client";

// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";

// export default function AuthGuard({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   function decodeToken(token: string) {
//     const payload = token.split(".")[1];
//     const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
//     const padded = base64.padEnd(
//       base64.length + ((4 - (base64.length % 4)) % 4),
//       "="
//     );
//     return JSON.parse(atob(padded));
//   }

//   useEffect(() => {
//     const token = Cookies.get("token");

//     if (!token) {
//       logout();
//       return;
//     }

//     try {
//       const decoded = decodeToken(token);
//       const now = Math.floor(Date.now() / 1000);
//       if (decoded.exp < now) {
//         throw new Error("Token expired");
//       }

//       const interval = setInterval(() => {
//         const now = Math.floor(Date.now() / 1000);
//         if (decoded.exp < now) {
//           alert("Sesi telah berakhir. Silakan login kembali.");
//           logout();
//           clearInterval(interval);
//         }
//       }, 30_000);

//       return () => clearInterval(interval);
//     } catch {
//       logout();
//     } finally {
//       setLoading(false);
//     }

//     function logout() {
//       Cookies.remove("token");
//       Cookies.remove("refresh_token");
//       router.replace("/auth/login");
//     }
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
//       </div>
//     );
//   }

//   return <>{children}</>;
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { me } from "../libs/users/api";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const redirected = useRef(false);

  const isAuthPage = pathname.startsWith("/auth");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (isAuthPage) {            // whitelist halaman auth
        setChecking(false);
        return;
      }

      try {
        const res = await me();
        if (cancelled) return;

        if (res.status === 401) {
          if (!redirected.current) {
            redirected.current = true;
            router.replace("/auth/login");
          }
          return;
        }

        if (!res.ok) {
          // optional: tampilkan error khusus
          setChecking(false);
          return;
        }

        // 200 OK → boleh lanjut
        if (!cancelled) setChecking(false);
      } catch (e) {
        // network/CORS error → anggap tidak login
        if (!redirected.current) {
          redirected.current = true;
          router.replace("/auth/login");
        }
      }
    }

    check();
    return () => { cancelled = true; };
  }, [isAuthPage, pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}
