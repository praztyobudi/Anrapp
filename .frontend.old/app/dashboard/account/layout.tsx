// File: /app/dashboard/akun/layout.tsx
import Sidebar from './components/sidebar';
import Topbar from './components/topbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-4 md:p-6 transition-all">{children}</main>
      </div>
    </div>
  );
}
