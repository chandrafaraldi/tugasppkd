import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Mobile menu button and Logo */}
        <div className="flex items-center gap-4">
          <div className="md:hidden flex items-center">
            <button className="text-slate-500 hover:text-slate-700">
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="Logo" className="w-8 h-8 object-contain rounded-md border border-slate-200" />
            <h1 className="text-sm font-bold text-emerald-900 tracking-tight hidden sm:block">PPKD HOTEL</h1>
          </div>
        </div>

        {/* Search or Title placeholder */}
        <div className="hidden md:flex flex-1">
          <h2 className="text-sm font-medium text-slate-800 bg-slate-100 px-3 py-1.5 rounded-md">
            Front Desk Shift: Day
          </h2>
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-slate-600 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-200"></div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="hidden sm:block text-right">
              <p className="text-slate-700 font-medium">{user?.name || 'Front Office'}</p>
              <p className="text-slate-500 text-xs capitalize">{user?.role || 'Staff'}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold border border-emerald-200">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
            </div>
            
            <button 
              onClick={handleLogout}
              className="ml-2 text-slate-400 hover:text-red-600 transition-colors tooltip"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
