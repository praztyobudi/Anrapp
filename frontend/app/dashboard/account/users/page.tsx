import UserForm from '../components/form-user';
import UserTable from '../components/table-user';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700">Manajemen Pengguna</h2>
      <UserForm />
      <UserTable />
    </div>
  );
}
