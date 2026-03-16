import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Moon, Star } from 'lucide-react';
import { useEffect } from 'react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // We trim the inputs so that accidental spaces (e.g., "vincensius chandra ") don't cause login failures
    if (login(username.trim(), password.trim())) {
      navigate('/');
    } else {
      setError('Username / password salah.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url("${import.meta.env.BASE_URL}assets/login_bg.png")` }}
      >
        <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-[2px]"></div>
      </div>

      <div className="max-w-md w-full mx-4 relative z-10 transition-all duration-700">
        <div className="bg-emerald-900/90 backdrop-blur-md px-6 py-8 text-center relative z-10 border-b border-white/10">
          <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-xl p-2 border-4 border-amber-400/30">
            <img src={`${import.meta.env.BASE_URL}logo.jpeg`} alt="PPKD Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-widest">PPKD HOTEL</h2>
          <div className="inline-flex items-center justify-center gap-1.5 mt-3 bg-amber-400/20 px-4 py-1.5 rounded-full text-amber-200 text-xs font-bold uppercase tracking-wider border border-amber-400/20">
            <Moon className="w-3.5 h-3.5" />
            <span>Visi Ramadhan</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-lg px-8 py-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-emerald-50/30 text-sm outline-none transition-colors disabled:opacity-50"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-emerald-50/30 text-sm outline-none transition-colors disabled:opacity-50 tracking-widest font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-700 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                'Masuk Portal'
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium pb-2">
            Created by Vincensius Chandra
          </div>
        </div>
      </div>
    </div>
  );
};
