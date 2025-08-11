import { useEffect, useState } from "react";
import Modal from "../../../../components/modal";

export const FormEditModal = ({
  showModal,
  setShowModal,
  selectedUser,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    department: "",
    role: "",
  });

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || "",
        username: selectedUser.username || "",
        password: "",
        department: selectedUser.department || "",
        role: selectedUser.role || "",
      });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setShowModal(false);
  };

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <h2 className="text-xl font-bold text-center">Edit User</h2>
      <div className="border-b-2 my-4"></div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        {/* NP */}
        {selectedUser && (
          <div>
            <label
              htmlFor="np"
              className="block text-sm font-medium text-gray-700"
            >
              Nomor Pegawai
            </label>
            <div className="mt-1 block w-full text-gray-800 font-bold">
              {selectedUser.np}
            </div>
          </div>
        )}

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
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
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            required
          />
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
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
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
            required
          />
        </div>

        <div>
          <label
            htmlFor="np"
            className="block text-sm font-medium text-gray-700"
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
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
          />
        </div>

        {/* Department */}
        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
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

        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
          >
            <option value="" disabled>
              Pilih Role
            </option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-700 text-white p-2 rounded-md hover:bg-green-800 transition-colors"
        >
          Simpan Perubahan
        </button>
      </form>
    </Modal>
  );
};
export default FormEditModal;
