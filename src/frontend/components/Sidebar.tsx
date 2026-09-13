"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  AlertTriangle, 
  Target, 
  CheckSquare, 
  MessageSquare
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Recruitment', href: '/recruitment', icon: UserPlus },
  { name: 'Workforce Risk', href: '/risk', icon: AlertTriangle },
  { name: 'Skill Gap', href: '/skills', icon: Target },
  { name: 'Action Center', href: '/actions', icon: CheckSquare },
  { name: 'AI Assistant', href: '/chat', icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-slate-900 text-white h-full border-r border-slate-800">
      <div className="flex items-center justify-center h-20 border-b border-slate-800 gap-3">
        <Image src="/logo.png" alt="WorkForce AI Logo" width={32} height={32} className="rounded-xl shadow-md" />
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          WorkForce AI
        </h1>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className={clsx('w-5 h-5 mr-3', isActive ? 'text-white' : 'text-slate-400')} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-10 h-10 rounded-full border-2 border-indigo-500" />
          <div>
            <p className="text-sm font-medium text-white">Yashwanth</p>
            <p className="text-xs text-slate-400">HR Director</p>
          </div>
        </div>
      </div>
    </div>
  );
}
