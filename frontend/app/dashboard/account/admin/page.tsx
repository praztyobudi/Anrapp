"use client";

import { useEffect, useState } from "react";
import { deleteUser, getUsers, updateUser } from "../../../libs/users/api";
import { locationDept } from "../../../utils/locationdept";
import { Building2, Eye, Factory, Search, SquarePen, Trash2, UserRound, Users, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { UserDetailModal } from "./modal/view";
import FormEditModal from "./modal/edit";
import { User } from "../types";



export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const get = await getUsers();
      const getlocation = get.data.map((user: User) => ({
        ...user,
        location: locationDept(user.department),
      }));
      setUsers(getlocation);
    } catch (err: any) {
      setError(err.message || "Error fetching user");
    } finally {
      setLoading(false);
    }
  };

  const updateHandler = async (id: number, data: any) => {
    try {
      setLoading(true);
      await updateUser(id, data);
      await fetchUsers();
      toast.success("User updated successfully");
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err: any) {
      setError(err.message || "Error updating user");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    setSelectedUser(user);
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus user ini?");
    if (!confirmDelete) return;
    try {
      await deleteUser(id);
      toast.success("Berhasil dihapus.", {
        style: {
          background: "#DC2525",
          padding: "12px",
          color: "#ffffff",
          borderColor: "#ffffff",
          borderWidth: "1px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        },
        iconTheme: {
          primary: "#ffffff",
          secondary: "#DC2525",
        },
      });
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Gagal menghapus user";
      toast.error(msg);
    }
  };
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(filter.toLowerCase()) ||
      user.username?.toLowerCase().includes(filter.toLowerCase()) ||
      user.department?.toLowerCase().includes(filter.toLowerCase()) ||
      user.location?.toLowerCase().includes(filter.toLowerCase()) ||
      user.np?.toLowerCase().includes(filter.toLowerCase())
  );

  if (users.length === 0 && !loading) {
    return <div className="text-gray-600 text-center">Tidak ada data</div>;
  }
  if (error) {
    return (
      <div className="text-center space-y-8 py-6 items-center">
        <div className="text-red-600">❌ {error}</div>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded"
        >
          Back
        </button>
      </div>
    );
  }

  const headers = [
    "No",
    "NP",
    "Name",
    "Username",
    "Department",
    "Location",
    "Action",
  ];

  const ho = users.filter(user => user.location === "Head Office").length;
  const pabrik = users.filter(user => user.location === "Pabrik").length;
  const items = [
    { icon: UserRound, label: "Users", count: users.length, colorIcon: "text-blue-600" },
    { icon: Building2, label: "Head Office", count: ho, colorIcon: "text-green-600" },
    { icon: Factory, label: "Factory", count: pabrik, colorIcon: "text-red-600" },
  ];

  return (
    <>
      <Toaster position="top-right" reverseOrder={true} />
      <UserDetailModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedUser={selectedUser}
      />
      <FormEditModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        selectedUser={selectedUser}
        onSubmit={(data) => updateHandler(selectedUser?.id || 0, data)}
      />
      <div className="bg-white rounded-lg shadow-md flex flex-col h-screen">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 border-b border-gray-200 px-3 md:px-6">
          {/* Input Search */}
          <div className="w-full sm:max-w-md">
            <div className="relative flex items-center">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent text-sm"
              />
              {filter && (
                <button
                  type="button"
                  onClick={() => setFilter("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-red-500 focus:outline-none"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Box Ringkasan */}
          <div
            className="flex flex-row gap-2 mt-2 sm:mt-0 overflow-x-auto sm:overflow-visible"
          >
            {items.map(({ icon: Icon, label, count, colorIcon }, i) => (
              <div
                key={i}
                className="bg-white rounded-md shadow flex flex-col sm:flex-row items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-200 ease-in-out w-24 h-20 sm:w-40 sm:h-16 my-2 md:my-0 hover:shadow-lg text-center"
              >
                <Icon className={`mb-1 sm:mb-0 sm:mr-3 ${colorIcon} w-6 h-6 sm:w-8 sm:h-8`} />
                <div className="flex flex-col sm:flex-col sm:items-start">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">{label}</span>
                  <span className="text-sm sm:text-lg font-bold text-gray-700">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bagian Konten dengan Scroll */}
        <div className="flex-1 overflow-y-auto">
          {/* Tabel untuk layar besar */}
          <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800 hidden sm:table">
            <thead className="bg-green-700 text-white sticky top-0 z-10">
              <tr>
                {headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left font-semibold text-sm md:text-base 2xl:text-lg 2xl:px-6 2xl:py-5"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-500 text-sm md:text-base 2xl:text-lg 2xl:px-6 2xl:py-10"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="px-4 py-3 2xl:px-6 2xl:py-5 2xl:text-lg">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 2xl:px-6 2xl:py-5 2xl:text-lg">
                      {user.np}
                    </td>
                    <td className="px-4 py-3 2xl:px-6 2xl:py-5 2xl:text-lg">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 2xl:px-6 2xl:py-5 2xl:text-lg">
                      {user.username}
                    </td>
                    <td className="px-4 py-3 capitalize 2xl:px-6 2xl:py-5 2xl:text-lg">
                      {user.department}
                    </td>
                    <td className="px-4 py-3 capitalize 2xl:px-6 2xl:py-5 2xl:text-lg">
                      {user.location}
                    </td>
                    <td className="px-4 py-3 space-x-2 2xl:px-6 2xl:py-5 2xl:space-x-4 2xl:text-lg">
                      <button
                        onClick={() => handleView(user.id)}
                        className="px-2 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="px-2 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                      >
                        <SquarePen size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Daftar untuk layar kecil dengan nomor urut */}
          <div className="sm:hidden divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Tidak ada data ditemukan.
              </div>
            ) : (
              filteredUsers.map((user, index) => (
                <div key={user.id} className="p-4 hover:bg-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">
                        {index + 1}. {user.name}
                      </p>
                      <p className="text-xs text-gray-600">NP: {user.np}</p>
                      <p className="text-xs text-gray-600">
                        Username: {user.username}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">
                        Departemen: {user.department}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">
                        Lokasi: {user.location}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleView(user.id)}
                        className="text-blue-600 hover:underline text-xs px-2 py-1"
                      >
                        Lihat
                      </button>
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="text-yellow-600 hover:underline text-xs px-2 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:underline text-xs px-2 py-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
