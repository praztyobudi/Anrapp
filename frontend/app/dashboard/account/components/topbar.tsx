"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import AnrLogo from "../../../img/anrlogo";

export default function Topbar() {
  const router = useRouter();
  const goBack = () => router.back();
  return (
    <div className="relative">
      <header>
        <div className="bg-green-700 h-28 z-10 relative">
          <div className="flex justify-between px-4 pt-2">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-white hover:text-green-900 font-semibold"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <AnrLogo />
          </div>
          <div className="text-4xl text-white -top-4 font-bold text-center relative">User Management</div>
        </div>
      </header>
      <div className="bg-yellow-300 h-6 mx-20 -mt-2 rounded-lg z-0 relative"></div>
    </div>
  );
}
