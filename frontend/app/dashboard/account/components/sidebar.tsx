'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, ArrowLeft } from 'lucide-react';

const navItems = [
  { href: '/dashboard/account', label: 'Dashboard' },
  { href: '/dashboard/account/users', label: 'Users' },
];

export default function Sidebar() {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-green-700 text-white min-h-screen duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } hidden md:block`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && <div className="font-bold text-xl">Admin</div>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:text-gray-200"
        >
          {collapsed ? <Menu size={20} /> : <ArrowLeft size={20} />}
        </button>
      </div>

      <nav className="space-y-2 px-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-3 py-2 rounded hover:bg-green-800 ${
              path === item.href ? 'bg-green-900' : ''
            }`}
          >
            <span className="material-icons mr-2">•</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
