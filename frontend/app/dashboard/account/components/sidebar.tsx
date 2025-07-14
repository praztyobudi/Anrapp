'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard/account', label: 'Dashboard' },
  { href: '/dashboard/account/users', label: 'Users' },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-green-700 text-white hidden md:block">
      <div className="p-6 font-bold text-2xl">Admin</div>
      <nav className="space-y-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded ${path === item.href ? 'bg-green-900' : 'hover:bg-green-800'}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
