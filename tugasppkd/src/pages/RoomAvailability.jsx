import React, { useState } from 'react';
import { BedDouble, CheckCircle2, XCircle, Filter, Search, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RoomAvailability = () => {
  const { guests } = useAuth();
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Generate 120 rooms: 6 floors, 20 rooms per floor
  // Floor 1: 101-120, Floor 2: 201-220, etc.
  const floors = [1, 2, 3, 4, 5, 6];
  const roomsPerFloor = 20;

  const getRoomType = (roomNo) => {
    const num = parseInt(roomNo);
    if (num > 600) return 'Executive Suite';
    if (num > 400) return 'Deluxe Room';
    if (num > 200) return 'Superior Room';
    return 'Standard Room';
  };

  const allRooms = floors.flatMap(floor => 
    Array.from({ length: roomsPerFloor }, (_, i) => {
      const roomNo = `${floor}${String(i + 1).padStart(2, '0')}`;
      const occupant = guests.find(g => g.room_no === roomNo && g.status === 'Checked In');
      const pendingRoom = guests.find(g => g.room_no === roomNo && g.status === 'Pending Clean');
      
      return {
        roomNo,
        type: getRoomType(roomNo),
        isOccupied: !!occupant,
        isPendingClean: !!pendingRoom && !occupant, // Just in case
        occupantName: occupant ? occupant.name : (pendingRoom ? pendingRoom.name : null)
      };
    })
  );

  const filteredRooms = allRooms.filter(room => {
    const matchesFilter = filterType === 'All' || room.type === filterType;
    const matchesSearch = room.roomNo.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Room Availability</h1>
          <p className="text-slate-500 mt-1 text-sm">Real-time visual map of all 120 rooms across 6 floors.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search room..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-32 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="All">All Types</option>
            <option value="Standard Room">Standard</option>
            <option value="Superior Room">Superior</option>
            <option value="Deluxe Room">Deluxe</option>
            <option value="Executive Suite">Executive Suite</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 mb-8 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white border border-emerald-200 shadow-sm"></div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500 shadow-lg shadow-amber-200"></div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500 shadow-lg shadow-blue-200"></div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Pending Clean</span>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-2 text-emerald-600">
          <Moon size={16} />
          <span className="text-xs italic">Sistem Pemetaan Otomatis</span>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3">
        {filteredRooms.map(room => (
          <div 
            key={room.roomNo}
            className={`
              relative p-3 rounded-xl border transition-all duration-300 group
              ${room.isOccupied 
                ? 'bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-100' 
                : room.isPendingClean
                  ? 'bg-blue-500 border-blue-600 text-white shadow-lg shadow-blue-100'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:shadow-md'}
            `}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-lg font-black tracking-tighter">{room.roomNo}</span>
              {room.isOccupied ? <XCircle className="w-3 h-3 opacity-60" /> : room.isPendingClean ? <Clock className="w-3 h-3 opacity-60" /> : <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            </div>
            <p className={`text-[8px] uppercase font-bold tracking-tight truncate ${(room.isOccupied || room.isPendingClean) ? 'text-white/80' : 'text-slate-400'}`}>
              {room.type}
            </p>

            {/* Tooltip on Hover for Occupied/Pending Rooms */}
            {(room.isOccupied || room.isPendingClean) && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-[60]">
                <div className="bg-slate-900 text-white text-[10px] py-1 px-3 rounded shadow-xl whitespace-nowrap">
                  {room.isOccupied ? 'Guest: ' : 'Left by: '} {room.occupantName}
                </div>
                <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mt-10">
          <BedDouble className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No rooms found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
