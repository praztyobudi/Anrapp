"use client";

import { useState } from "react";
import FormFraud from "./form-fraud";
import RiwayatFraud from "./riwayat-fraud";

import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [frauds, setFrauds] = useState<any[]>([]);

  const addFraud = (fraud: any) => {
    setFrauds([fraud, ...frauds]);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <main className="min-h-screen bg-red-500 flex flex-col items-center px-6 py-10">
      <button
        onClick={goBack}
        className="self-start mb-4 flex items-center gap-2 text-white hover:text-red-600 font-semibold"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
        Kembali
      </button>
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center gap-2 flex items-center">
        Pelaporan Indikasi Fraud <ShieldAlert size={50}/>
      </h1>

      {/* Container */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">

        {/* Form */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-2xl p-6 shadow-md h-full flex flex-col">
            <FormFraud onSubmit={addFraud} />
          </div>
        </div>

        {/* List */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-2xl p-6 shadow-md h-full flex flex-col">
            <RiwayatFraud frauds={frauds} />
          </div>
        </div>

      </div>
    </main>
  );
}
