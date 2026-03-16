import React, { useState } from 'react';
import { Search, Filter, MoreVertical, BedDouble, Calendar, UserCheck, LogOut, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROOM_RATES = {
  'Standard Room': 500000,
  'Superior Room': 750000,
  'Deluxe Room': 1000000,
  'Executive Suite': 2500000
};

const calculateNights = (arrival, departure) => {
  if (!arrival || !departure) return 1;
  const start = new Date(arrival);
  const end = new Date(departure);
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

export const GuestList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRoom, setFilterRoom] = useState('All');
  const [actionOpenId, setActionOpenId] = useState(null);
  const [editingGuest, setEditingGuest] = useState(null);
  const [viewingGuest, setViewingGuest] = useState(null);
  const { guests, guestsLoading, removeGuest, updateGuest } = useAuth();

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateGuest(editingGuest.id, editingGuest);
    setEditingGuest(null);
  };

  const filteredGuests = guests.filter(guest => {
    // Search match
    const searchMatch = 
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.room_no.includes(searchTerm);
      
    // Status match
    const statusMatch = filterStatus === 'All' || guest.status === filterStatus;
    
    // Room type match
    const roomMatch = filterRoom === 'All' || guest.room_type === filterRoom;
    
    return searchMatch && statusMatch && roomMatch;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Guest List</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage and view all registered guests in the hotel.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search guest or room..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-64 transition-shadow"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            
            {showFilter && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 p-4 z-20">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Filter By Status</h3>
                <div className="space-y-1 mb-4">
                  {['All', 'Checked In', 'Pending Clean', 'Checked Out'].map(status => (
                    <label key={status} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer p-1 hover:bg-slate-50 rounded">
                      <input 
                        type="radio" 
                        name="status" 
                        value={status} 
                        checked={filterStatus === status}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      {status}
                    </label>
                  ))}
                </div>
                
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Filter By Room Type</h3>
                <div className="space-y-1">
                  {['All', 'Standard Room', 'Superior Room', 'Deluxe Room', 'Executive Suite'].map(room => (
                    <label key={room} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer p-1 hover:bg-slate-50 rounded">
                      <input 
                        type="radio" 
                        name="room" 
                        value={room} 
                        checked={filterRoom === room}
                        onChange={(e) => setFilterRoom(e.target.value)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      {room}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Guest Info</th>
                <th className="px-6 py-4">Room Details</th>
                <th className="px-6 py-4">Stay Duration</th>
                <th className="px-6 py-4">Status & Billing</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guestsLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex justify-center items-center space-x-2">
                       <div className="w-4 h-4 rounded-full animate-pulse bg-emerald-600"></div>
                       <div className="w-4 h-4 rounded-full animate-pulse bg-emerald-600"></div>
                       <div className="w-4 h-4 rounded-full animate-pulse bg-emerald-600"></div>
                    </div>
                    <p className="mt-4">Memuat data dari Supabase...</p>
                  </td>
                </tr>
              ) : filteredGuests.length > 0 ? (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                          {guest.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{guest.name}</div>
                          <div className="text-xs text-slate-500">{guest.id} • {guest.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-900 font-medium">
                        <BedDouble className="w-4 h-4 text-slate-400" />
                        Room {guest.room_no}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{guest.room_type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{guest.check_in} <span className="text-slate-400 text-xs mx-1">to</span> {guest.check_out}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1.5">
                        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          guest.status === 'Checked In' ? 'bg-emerald-100 text-emerald-700' : 
                          guest.status === 'Checked Out' ? 'bg-slate-200 text-slate-700' : 
                          guest.status === 'Pending Clean' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {guest.status === 'Checked In' && <UserCheck className="w-3 h-3 mr-1" />}
                          {guest.status === 'Checked Out' && <LogOut className="w-3 h-3 mr-1" />}
                          {guest.status === 'Pending Clean' && <Clock className="w-3 h-3 mr-1" />}
                          {guest.status}
                        </span>
                        <span className="font-medium text-slate-700 text-xs">{formatCurrency(guest.total)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      <button 
                        onClick={() => setActionOpenId(actionOpenId === guest.id ? null : guest.id)}
                        className="text-slate-400 hover:text-emerald-600 p-1 rounded-md hover:bg-emerald-50 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 mx-auto" />
                      </button>
                      
                      {/* Actions Dropdown Menu */}
                      {actionOpenId === guest.id && (
                        <div className="absolute right-8 top-10 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-30 text-left">
                          <button 
                            onClick={() => { setViewingGuest(guest); setActionOpenId(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => { setEditingGuest({...guest}); setActionOpenId(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            Edit Guest
                          </button>
                          {guest.status === 'Checked In' && (
                            <button 
                              onClick={() => { updateGuest(guest.id, { status: 'Pending Clean' }); setActionOpenId(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 hover:text-amber-700 font-medium"
                            >
                              Check Out (Pending Clean)
                            </button>
                          )}
                          {guest.status === 'Pending Clean' && (
                            <button 
                              onClick={() => { updateGuest(guest.id, { status: 'Checked Out' }); setActionOpenId(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium"
                            >
                              Mark Room as Cleaned
                            </button>
                          )}
                          {guest.status === 'Checked Out' && (
                            <button 
                              onClick={() => { updateGuest(guest.id, { status: 'Checked In' }); setActionOpenId(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                            >
                              Re-Check In
                            </button>
                          )}
                          <div className="h-px bg-slate-100 my-1"></div>
                          <button 
                            onClick={() => { removeGuest(guest.id); setActionOpenId(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
                          >
                            Delete Record
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No guests found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <span className="font-medium text-slate-700">{filteredGuests.length}</span> of <span className="font-medium text-slate-700">{guests.length}</span> guests</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded bg-emerald-600 border border-emerald-600 text-white hover:bg-emerald-700">1</button>
            <button className="px-3 py-1 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-emerald-800 p-6 text-white relative">
              <h2 className="text-xl font-bold">Edit Guest Data</h2>
              <p className="text-emerald-100/70 text-sm mt-1">{editingGuest.id}</p>
              <button 
                onClick={() => setEditingGuest(null)}
                className="absolute top-6 right-6 text-emerald-100 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editingGuest.name}
                  onChange={(e) => setEditingGuest({...editingGuest, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Room No</label>
                  <input 
                    type="text" 
                    value={editingGuest.room_no}
                    onChange={(e) => setEditingGuest({...editingGuest, room_no: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                  <select 
                    value={editingGuest.status}
                    onChange={(e) => setEditingGuest({...editingGuest, status: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Checked In">Checked In</option>
                    <option value="Pending Clean">Pending Clean</option>
                    <option value="Checked Out">Checked Out</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Room Type</label>
                <select 
                  value={editingGuest.room_type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    const nights = calculateNights(editingGuest.check_in, editingGuest.check_out);
                    const rate = ROOM_RATES[newType] || 0;
                    // Assuming 1 room for simplicity in the edit modal, as noOfRoom isn't tracked in guest object currently
                    const newTotal = nights * rate;
                    setEditingGuest({...editingGuest, room_type: newType, total: newTotal});
                  }}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Standard Room">Standard Room - Rp 500.000</option>
                  <option value="Superior Room">Superior Room - Rp 750.000</option>
                  <option value="Deluxe Room">Deluxe Room - Rp 1.000.000</option>
                  <option value="Executive Suite">Executive Suite - Rp 2.500.000</option>
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">New Total Billing (Auto-calculated)</label>
                <div className="text-lg font-bold text-emerald-700">
                  {formatCurrency(editingGuest.total)}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingGuest(null)}
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-emerald-800 p-6 text-white flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">Guest Details</h2>
                <p className="text-emerald-100/70 text-sm mt-1">Booking ID: {viewingGuest.id}</p>
              </div>
              <button 
                onClick={() => setViewingGuest(null)}
                className="text-emerald-100 hover:text-white bg-white/10 p-2 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold">
                  {viewingGuest.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{viewingGuest.name}</h3>
                  <p className="text-slate-500">{viewingGuest.phone}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2 ${
                    viewingGuest.status === 'Checked In' ? 'bg-emerald-100 text-emerald-700' : 
                    viewingGuest.status === 'Checked Out' ? 'bg-slate-200 text-slate-700' : 
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {viewingGuest.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Room Information</p>
                  <p className="font-semibold text-slate-700">Room {viewingGuest.room_no}</p>
                  <p className="text-sm text-slate-500">{viewingGuest.room_type}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Billing</p>
                  <p className="font-bold text-emerald-700 text-lg">{formatCurrency(viewingGuest.total)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Check In Date</p>
                  <p className="font-medium text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {viewingGuest.check_in}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Check Out Date</p>
                  <p className="font-medium text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {viewingGuest.check_out}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => setViewingGuest(null)}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
