"use client";

import { useEffect, useState } from "react";
import FormIde from "./formide";
import ListIde from "./riwayat-ide";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Idea } from "./types";
import AnrLogo from "../../../img/anrlogo";
import AuthGuard from "../../../components/auth";
import { me } from "../../../libs/users/api";

export default function Home(p0: unknown) {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const addIdea = async (
    idea: Idea
  ): Promise<{ success: boolean; error?: Error }> => {
    try {
      const res = await fetch("https://app.prazelab.my.id/api/ide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: idea.from,
          message: idea.idea,
          department: idea.to,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal menambahkan ide");
      }

      setIdeas([idea, ...ideas]);
      return { success: true };
    } catch (error) {
      console.error("Create error:", error);
      return { success: false, error };
    }
  };

  const updateIdea = async (updatedIdea: Idea) => {
    try {
      const res = await fetch(
        `https://app.prazelab.my.id/api/ide/${updatedIdea.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedIdea.from,
            message: updatedIdea.idea,
            department: updatedIdea.to,
          }),
        }
      );

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData?.message || "Gagal mengupdate ide");
      }

      // setIdeas(prev => prev.map(item =>
      //   item.id === updatedIdea.id ? updatedIdea : item
      // ));
      // setSelectedIdea(null);

      const ideupdate = {
        ...updatedIdea,
        updated_at: resData.data.updated_at,
      };
      setIdeas((prev) => {
        // Hapus item lama
        const filtered = prev.filter((item) => item.id !== updatedIdea.id);
        // Tambahkan item yang baru diupdate ke paling atas
        return [ideupdate, ...filtered];
      });
      return { success: true };
    } catch (error) {
      console.error("Update error:", error);
      return { success: false, error };
    }
  };

  const refreshData = async () => {
    setStatusMsg("Please wait...");
    setLoading(true);
    try {
      const res = await fetch("https://app.prazelab.my.id/api/ide");
      if (!res.ok) throw new Error("Fetch failed");
      const result = await res.json();
      console.log("Successfully refreshed");
      setIdeas(result.data.map((item: any) => ({
        id: item?.id ?? 0,
        from: item?.name ?? "Anonim",
        to: item?.department ?? "Tidak diketahui",
        idea: item?.message ?? "",
        date: item?.updated_at ?? "",
      })))

      setStatusMsg("Updated!");
    } catch (error) {
      console.error("Gagal refresh data:", error);
      setStatusMsg("Gagal memuat data. Coba lagi.");
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg(""), 3000); // reset setelah 3 detik
    }
  };
  useEffect(() => {
    refreshData(); // initial fetch
  }, []);
  const goBack = () => {
    router.back();
  };

  const handleCancelEdit = () => {
    setSelectedIdea(null); // ini bikin mode jadi 'create'
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-green-700 flex flex-col items-center px-6 py-8">
        <div className="flex gap-4 w-full justify-between left-4">
          <button
            onClick={goBack}
            className="self-start flex items-center gap-2 text-white hover:text-green-900 font-semibold"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <span className="pt-1">
            <AnrLogo />
          </span>
        </div>
        <h1 className="text-3xl font-bold pb-6 text-white text-center">
          Ide kreatifmu, semangat kita semua!
        </h1>
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-screen-2xl">
          <div className="w-full md:w-3/3">
            <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col">
              <FormIde
                onSubmit={selectedIdea ? updateIdea : addIdea}
                defaultValue={selectedIdea ?? undefined}
                mode={selectedIdea ? "edit" : "create"}
                onCancel={handleCancelEdit}
              />
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col">
              <ListIde
                onEdit={setSelectedIdea}
                ideas={ideas}
                setIdeas={setIdeas}
                refreshData={refreshData}
                statusMsg={statusMsg}
              />
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
