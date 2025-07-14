'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserInput } from '../../../validators/validate';
import { createUser } from '../../../libs/api';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function UserForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<UserInput>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserInput) => {
    setLoading(true);
    try {
      await createUser(data);
      toast.success('User created!');
      reset();
    } catch {
      toast.error('Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl shadow max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input {...register('name')} className="w-full border px-3 py-2 rounded" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" {...register('email')} className="w-full border px-3 py-2 rounded" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Role</label>
        <select {...register('role')} className="w-full border px-3 py-2 rounded">
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
      </div>

      <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        {loading ? 'Saving...' : 'Add User'}
      </button>
    </form>
  );
}
