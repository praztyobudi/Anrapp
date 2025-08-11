// app/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "./utils/jwtdecode";

export default function Home() {
  const router = useRouter();
  //cek apakah token tersedia jika ada maka lanjut ke proses jika tidak kembali ke login
  useEffect(() => {
    const token = getToken();
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  }, []);
  //   router.replace('/auth/login');
  // }, [router]);

  return null;
}
