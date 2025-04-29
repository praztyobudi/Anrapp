"use client";

import { useState } from "react";
import FormIde from "./formide";
import ListIde from "./listide";

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function Home() {
    const router = useRouter();
    const [ideas, setIdeas] = useState<any[]>([]);
  
    const addIdea = (idea: any) => {
      setIdeas([idea, ...ideas]);
    };

    const goBack = () => {
      router.back();
    };
  
    return (
      <main className="min-h-screen bg-green-50 flex flex-col items-center px-6 py-10">
        <button
          onClick={goBack}
          className="self-start mb-4 flex items-center gap-2 text-green-700 hover:text-green-900 font-semibold"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-8 text-center">
          Ide kreatifmu, semangat kita semua!
        </h1>
  
        {/* Container */}
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
          
          {/* Form */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-2xl p-6 shadow-md h-full flex flex-col">
              <FormIde onSubmit={addIdea} />
            </div>
          </div>
  
          {/* List */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-2xl p-6 shadow-md h-full flex flex-col">
              <ListIde ideas={ideas} />
            </div>
          </div>
  
        </div>
      </main>
    );
  }
