"use client";

import { useEffect, useState } from "react";
import FormFraud from "./form-fraud";
import { Fraud, FraudReq, userData } from "./types";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import RiwayatFraud from "./riwayat-fraud";
import toast from "react-hot-toast";
import AnrLogo from "../../../img/anrlogo";
import AuthGuard from "../../../components/auth";
import { getUsers, me } from "../../../libs/users/api";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [frauds, setFrauds] = useState<Fraud[]>([]);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [error, setError] = useState<string | null>(null);
  const [selectedFraud, setSelectedFraud] = useState<Fraud | null>(null);

  const goBack = () => router.back();

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      setStatusMsg("Please wait...");
      setLoading(true);
      setError(null);

      // ambil data fraud
      const res = await fetch("https://app.prazelab.my.id/api/fraud", {
        credentials: "include",
      });
      const result = await res.json();

      // ambil user login
      const userdata = await me();

      // buat mapping id -> nama
      let usersMap: { [key: number]: string } = {};
      if (userdata.data.role === "admin") {
        const usersResponse = await getUsers();
        const users = usersResponse.data;
        usersMap = users.reduce(
          (map: { [key: number]: string }, user: userData) => {
            map[user.id] = "From: " + user.name;
            return map;
          },
          {}
        );
      } else {
        usersMap[userdata.data.id] = "I'm Anonymous";
      }

      const fraudsWithUser = result.data.map((fraud: Fraud) => ({
        ...fraud,
        userData: usersMap[fraud.user_id] || "Unknown User",
      }));
      const sorted = fraudsWithUser.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setFrauds(sorted);
      setStatusMsg("Updated!");
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data fraud";

      setError(errMsg);
      return { success: false, error: error as Error };
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg(""), 1000);
    }
  };

  const addFraud = async (
    fraud: FraudReq
  ): Promise<{ success: boolean; error?: Error }> => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("https://app.prazelab.my.id/api/fraud", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(fraud),
      });

      const result = await res.json();

      // Cek response dari backend
      if (!res.ok || result.status !== "success") {
        throw new Error(result.message || "Gagal menambah data");
      }
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menambah data";
      setError(msg);
      // toast.error(msg);
      return { success: false, error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  const updateFraud = async (
    fraud: Fraud
  ): Promise<{ success: boolean; error?: Error }> => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://app.prazelab.my.id/api/fraud/${fraud.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(fraud),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success || !result.data) {
        throw new Error(result.message || "Gagal memperbarui data fraud");
      }

      setFrauds((prev) =>
        prev.map((f) => (f.id === result.data.id ? result.data : f))
      );

      setSelectedFraud(null);
      setMode("create");
      await refreshData();
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memperbarui data";

      setError(errorMessage);
      return { success: false, error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  const deleteFraud = async (id: number) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirmDelete) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://app.prazelab.my.id/api/fraud/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok || result.status !== "success") {
        throw new Error(result.message || "Gagal menghapus data");
      }

      toast.success("Data berhasil dihapus");
      await refreshData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus data";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-red-500 flex flex-col items-center px-6">
        <div className="flex w-full items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-white hover:text-red-900 font-semibold"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <span className="pt-1">
            <AnrLogo />
          </span>
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-white md:mb-8 mt-0 text-center gap-2 flex items-center justify-center">
          <ShieldAlert className="h-6 md:w-10 md:h-10" />
          Pelaporan Indikasi Fraud
        </h1>

        {/* Container */}
        <div className="flex flex-col md:flex-row md:gap-4 w-full max-w-screen-2xl">
          {/* Form */}
          <div className="w-full md:w-3/3 py-4 md:py-0">
            <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col">
              <div>
                <FormFraud
                  onSubmit={selectedFraud ? updateFraud : addFraud}
                  defaultValue={
                    selectedFraud
                      ? {
                        id: selectedFraud.id,
                        types: selectedFraud.type_message,
                        fraud_message: selectedFraud.fraud_message,
                      }
                      : undefined
                  }
                  isLoading={loading}
                  mode={mode}
                  onCancel={() => {
                    setSelectedFraud(null);
                    setMode("create");
                  }}
                  refreshData={refreshData}
                />
              </div>
            </div>
          </div>

          {/* List */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col">
              <RiwayatFraud
                frauds={frauds}
                editFraud={(fraud) => {
                  setMode("edit");
                  setSelectedFraud(fraud);
                }}
                deleteFraud={deleteFraud}
                refreshData={refreshData}
                statusMsg={statusMsg}
                isLoading={loading}
                error={error}
              />
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
