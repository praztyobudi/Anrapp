'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    username: '',
    department: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('https://app.prazelab.my.id/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registrasi gagal');

      setMessage({ type: 'success', text: 'Registrasi berhasil! Mengarahkan ke login...' });
      setTimeout(() => router.push('/auth/login'), 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Daftar Akun</h2>

        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded text-sm font-medium ${
              message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-anr'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-anr"
              placeholder="Nama lengkap"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              required
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-anr"
              placeholder="Username"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Departemen</label>
            <select
              name="department"
              required
              value={form.department}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-anr"
            >
              <option value="" disabled>Pilih Departemen</option>
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

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-anr"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-anr hover:bg-anr-100 text-white font-semibold py-2 rounded-xl transition duration-300"
          >
            {loading ? 'Mendaftarkan...' : 'Daftar'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Sudah punya akun?{' '}
          <a href="/auth/login" className="text-anr hover:font-semibold">
            Masuk di sini
          </a>
        </p>
      </div>
    </div>
  );
}
