import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Users, Moon, BedDouble, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user } = useAuth();
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Registration Form', icon: FileText, path: '/registration' },
    { name: 'Guest List', icon: Users, path: '/guests' },
    { name: 'Room Availability', icon: BedDouble, path: '/rooms' },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 border-r border-white/5 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-10 right-10 transform rotate-12">
          <Moon size={300} />
        </div>
      </div>

      <div className="p-6 flex items-center gap-3 border-b border-white/5 relative z-10">
        <div className="w-12 h-12 rounded-xl border border-amber-400/30 flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-inner p-1 shrink-0">
          <img src={`${import.meta.env.BASE_URL}logo.jpeg`} alt="Logo" className="w-full h-full object-contain rounded-lg" />
        </div>
        <div className="overflow-hidden">
          <h1 className="text-lg font-black text-white tracking-widest truncate">PPKD HOTEL</h1>
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">Edisi Ramadhan</p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'text-emerald-100/90 hover:bg-emerald-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-emerald-800/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold text-emerald-100 border border-emerald-600">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-white truncate">{user?.name || 'Front Office'}</p>
          <p className="text-[10px] text-emerald-400 capitalize">{user?.role || 'Staff'}</p>
        </div>
      </div>

      <div className="p-2 border-t border-emerald-800/50 text-[10px] text-emerald-400/60 text-center">
        &copy; 2026 PPKD Jakarta Pusat
      </div>
    </div>
  );
};
