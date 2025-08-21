"use client";

import { useState, useEffect } from "react";
import FormKrisar from "./form-krisar";
import RiwayatKrisar from "./riwayat-krisar";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Krisar, userData } from "./types";
import toast from "react-hot-toast";
import AnrLogo from "../../../img/anrlogo";
import AuthGuard from "../../../components/auth";
import { getUsers, me } from "../../../libs/users/api";

export default function Home() {
  const router = useRouter();
  const [userData, setUserData] = useState<string | null>(null);
  const [krisars, setKrisars] = useState<Krisar[]>([]);
  const [selectedKrisar, setSelectedKrisar] = useState<Krisar | null>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const addKrisar = async (
    krisar: Krisar
  ): Promise<{ success: boolean; error?: Error }> => {
    try {
      const currentUser = await me();
      const isAdmin = currentUser.data.role === "admin";
      let userName: string;

      if (isAdmin) {
        userName = currentUser.data.name;
      } else {
        userName = "I'm Anonymous";
      }
      const response = await fetch("https://app.prazelab.my.id/api/krisar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: krisar.user_id,
          critique: krisar.critique,
          suggestion: krisar.suggestion,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add Krisar");
      }

      // setKrisars([krisar, ...krisars]);
      const result = await response.json();
      const newKrisar = {
        ...result.data,
        user_name: userName,
      };
      // setKrisars((prev) => [result.data, ...prev]);
      setKrisars((prev) => [newKrisar, ...prev]);
      console.log("Success add:", result);
      return { success: true };
    } catch (error) {
      console.error("Error adding Krisar:", error);
      return { success: false, error };
    }
  };

  const updateKrisar = async (
    krisarUpdate: Krisar
  ): Promise<{ success: boolean; error?: Error }> => {
    try {
      const response = await fetch(
        `https://app.prazelab.my.id/api/krisar/${krisarUpdate.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            critique: krisarUpdate.critique,
            suggestion: krisarUpdate.suggestion,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update Krisar");
      }
      const resData = await response.json();
      console.log("resData from update:", resData);
      if (resData.status === "success") {
        await refreshData();
        return { success: true };
      }
      return { success: true };
    } catch (error) {
      console.error("Error updating Krisar:", error);
      return { success: false, error };
    }
  };
  const refreshData = async () => {
    setStatusMsg("Please wait...");
    setLoading(true);
    try {
      const response = await fetch("https://app.prazelab.my.id/api/krisar");
      const result = await response.json();
      const userdata = await me();
      let usersMap: { [key: number]: string } = {};
      if (userdata.data.role === "admin") {
        const usersResponse = await getUsers();
        const users = usersResponse.data;
        // Buat peta user_id ke nama pengguna
        usersMap = users.reduce((map: { [key: number]: string }, user: userData) => {
          map[user.id] = "From : " + user.name;
          return map;
        }, {});
        // setUserData(userId.data[0].name);
      } else {
        usersMap[userdata.data.id] = "I'm Anonymous";
      }
      setKrisars(
        result.data
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          )
          .map((item: Krisar) => ({
            id: item.id,
            user_id: item.user_id,
            critique: item.critique,
            suggestion: item.suggestion,
            created_at: item.created_at,
            updated_at: item.updated_at,
            user_name: usersMap[item.user_id] || "Unknown User",
          }))
      );
      // Set userData untuk pengguna yang login
      setUserData(userdata.data.role === "admin" ? userdata.data.name : "I'm Anonymous");
      setStatusMsg("Updated!");
      return { success: true };
    } catch (error) {
      console.error("Error fetching Krisar data:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg(""), 1000); // reset setelah 3 detik
    }
  };
  const deleteKrisar = async (id: number) => {
    if (!confirm("Yakin ingin menghapus Krisar ini?")) return;
    try {
      const response = await fetch(
        `https://app.prazelab.my.id/api/krisar/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete Krisar");
      }
      setKrisars((prev) => prev.filter((k) => k.id !== id));
      toast.success("Berhasil dihapus.", {
        style: {
          background: "#DC2525",
          padding: "12px",
          color: "#ffffff",
        },
        iconTheme: {
          primary: "#ffffff",
          secondary: "#DC2525",
        },
      });
      console.log("Krisar deleted successfully");
      return { success: true };
    } catch (error) {
      console.error("Error deleting Krisar:", error);
      return { success: false, error };
    }
  };

  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    refreshData();
  }, []);

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
          Kritik dan saran sangat membantu
        </h1>

        {/* Container */}
        <div className="flex flex-col md:flex-row md:gap-4 w-full max-w-screen-2xl">
          {/* Form */}
          <div className="w-full md:w-3/3">
            <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col">
              <FormKrisar
                userId={5} // Sementara
                onSubmit={selectedKrisar ? updateKrisar : addKrisar}
                defaultValue={selectedKrisar ?? undefined}
                mode={selectedKrisar ? "edit" : "create"}
                onCancel={() => setSelectedKrisar(null)}
              />
            </div>
          </div>

          {/* List */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col">
              <RiwayatKrisar
                userData={userData}
                editKrisar={(krisar) => setSelectedKrisar(krisar)}
                deleteKrisar={deleteKrisar}
                krisars={krisars}
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
