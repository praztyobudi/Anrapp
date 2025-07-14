"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  function decodeToken(token: string) {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    return JSON.parse(atob(padded));
  }

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      logout();
      return;
    }

    try {
      const decoded = decodeToken(token);
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        throw new Error("Token expired");
      }

      const interval = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp < now) {
          alert("Sesi telah berakhir. Silakan login kembali.");
          logout();
          clearInterval(interval);
        }
      }, 30_000);

      return () => clearInterval(interval);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }

    function logout() {
      Cookies.remove("token");
      Cookies.remove("refresh_token");
      router.replace("/auth/login");
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}
