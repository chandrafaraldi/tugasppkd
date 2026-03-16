import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BedDouble, CalendarCheck, Clock, Moon, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user, guests } = useAuth();

  // Ensure guests is an array
  const safeGuests = Array.isArray(guests) ? guests : [];
  
  const totalRooms = 120;
  const occupiedCount = safeGuests.filter(g => g.status === 'Checked In').length;
  const pendingCleanCount = safeGuests.filter(g => g.status === 'Pending Clean').length; 
  const availableCount = totalRooms - occupiedCount - pendingCleanCount;
  
  const stats = [
    { name: 'Total Rooms', value: totalRooms.toString(), icon: BedDouble, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Occupied', value: occupiedCount.toString(), icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Available', value: availableCount.toString(), icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Pending Clean', value: pendingCleanCount.toString(), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  // Use live data from context for Recent Registrations
  const recentRegistrations = safeGuests.slice(0, 5).map(g => ({
    name: g?.name || 'Unknown',
    type: g?.roomType || '-',
    date: g?.checkIn || g?.date || '-', 
    status: g?.status || 'Unknown'
  }));

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Ramadan Theme Header Banner */}
      <div className="mb-8 bg-emerald-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg border border-emerald-700/50">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10">
          <Moon size={200} />
        </div>
        <div className="absolute bottom-4 right-1/4 opacity-20 animate-pulse">
          <Star size={32} />
        </div>
        <div className="absolute top-8 right-1/3 opacity-20 animate-pulse delay-150">
          <Star size={24} />
        </div>
        <div className="absolute bottom-8 left-2/3 opacity-15">
          <Moon size={64} />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-3 bg-emerald-900/50 px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-200 text-sm">
            <Moon className="w-4 h-4 text-amber-300" />
            <span>Spesial Bulan Suci</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Marhaban ya Ramadhan, {user?.name || 'Admin'}
          </h1>
          <p className="text-emerald-100/90 max-w-xl text-lg">
            Selamat menunaikan ibadah puasa. Berikut adalah ringkasan sistem reservasi PPKD Hotel hari ini.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Registrations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Guest Name</th>
                  <th className="px-4 py-3">Room Type</th>
                  <th className="px-4 py-3">Check-in</th>
                  <th className="px-4 py-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRegistrations.map((row, i) => (
                  <tr key={i} className="border-b border-emerald-50 hover:bg-emerald-50/50 transition-colors last:border-0">
                    <td className="px-4 py-3 font-medium text-emerald-950">{row.name}</td>
                    <td className="px-4 py-3 text-emerald-700/70">{row.type}</td>
                    <td className="px-4 py-3 text-emerald-700/70">{row.date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full ${row.status === 'Checked In' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Moon size={100} />
          </div>
          <h2 className="text-lg font-bold text-emerald-900 mb-4 relative z-10">Quick Actions</h2>
          <div className="space-y-3 relative z-10">
            <Link to="/registration" className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition-all shadow-md shadow-emerald-600/20">
              Registrasi Tamu Baru
            </Link>
            <Link to="/guests" className="block w-full text-center bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-800 py-3 rounded-xl font-medium transition-colors">
              Lihat Semua Tamu
            </Link>
            <Link to="/rooms" className="block w-full text-center bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-800 py-3 rounded-xl font-medium transition-colors">
              Ketersediaan Kamar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
