"use client";
import React, { useEffect, useState } from "react";
import { getUserById, me, updateUser } from "../../../libs/users/api";
import { User } from "../types";
import toast, { Toaster } from "react-hot-toast";
import { getIdToken } from "../../../utils/jwtdecode";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import LoadingAnim from "../../../components/loading-anim";

export default function UserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cekData, setCekData] = useState<{
    username: string;
    password?: string;
  }>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    np: "",
    name: "",
    username: "",
    password: "",
    department: "",
    role: "user", // ✅ default role agar tidak null
  });

  // ✅ Ambil data user saat page load
  useEffect(() => {
    const ambilData = async () => {
      const userId = await me();
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response: { status: string; message: string; data: User } =
          await getUserById(userId.data.id);

        const data = response.data;

        setFormData({
          np: data.np || "",
          name: data.name || "",
          username: data.username || "",
          password: "",
          department: data.department || "",
          role: data.role ?? "user",
        });
        setCekData({
          username: data.username || "",
          password: "",
        });
      } catch (err: any) {
        setError(err.message || "Error fetching user data");
      } finally {
        setLoading(false);
      }
    };
    ambilData();
  }, []);

  // ✅ Handle perubahan form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle submit data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = await me();
    if (!userId.data.id) {
      toast.error("User ID tidak ditemukan di token");
      return;
    }

    try {
      setLoading(true);
      await updateUser(userId.data.id, {
        ...formData,
      });
      toast.success("Data user berhasil diperbarui");
      if (
        cekData.username !== formData.username ||
        (formData.password && formData.password.trim() !== "")
      ) {
        alert("Silakan login ulang untuk menggunakan data baru");
        Cookies.remove("token");
        router.push("/auth/login");
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui data user");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-1.5">
        <LoadingAnim message="Loading" />
      </div>
    );
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <>
      <Toaster position="top-right" reverseOrder={true} />
      <div className="bg-white p-8 rounded-lg shadow-md max-h-[500px] sm:w-2/3 max-w-3xl 2xl:max-w-[90rem] mx-auto overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="space-y-2 sm:space-y-4 px-2 sm:px-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label
              htmlFor="name"
              className="text-base font-medium text-gray-700"
            >
              NP
            </label>
            <div className="mt-1 block w-full text-gray-800 font-bold">
              {formData.np}
            </div>
          </div>
          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label
              htmlFor="name"
              className="text-base font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan Nama"
              className="sm:col-span-2 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
              required
            />
          </div>

          {/* Username */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label
              htmlFor="username"
              className="text-base font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Masukkan Username"
              className="sm:col-span-2 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
              required
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label
              htmlFor="password"
              className="text-base font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Abaikan jika tidak diubah"
              className="sm:col-span-2 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            />
          </div>

          {/* Department */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label
              htmlFor="department"
              className="text-base font-medium text-gray-700"
            >
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="sm:col-span-2 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            >
              <option value="" disabled>
                Pilih Departemen
              </option>
              <option value="umum">Umum</option>
              <option value="hc">HC</option>
              <option value="finance">Finance</option>
              <option value="purchase">Purchase</option>
              <option value="warehouse">Warehouse</option>
              <option value="maa">MAA</option>
              <option value="qc">QC</option>
              <option value="lab">LAB</option>
              <option value="rnd">RnD</option>
              <option value="principal">Principal</option>
              <option value="marketing">Marketing</option>
              <option value="pramaterial">Pramaterial</option>
            </select>
          </div>

          {/* Button */}
          <div className="text-end pt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
