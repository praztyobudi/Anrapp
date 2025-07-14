'use client';

import { useEffect, useState } from 'react';
import { getUsers } from '../../../libs/api'; // Adjust the import path as necessary

export default function UserTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-center">Loading users...</p>;

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full bg-white shadow rounded-xl overflow-hidden">
        <thead className="bg-green-700 text-white">
          <tr>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={idx} className="border-t hover:bg-gray-50">
              <td className="py-3 px-6">{u.name}</td>
              <td className="py-3 px-6">{u.email}</td>
              <td className="py-3 px-6 capitalize">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
