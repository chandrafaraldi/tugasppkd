import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState([]);
  const [guestsLoading, setGuestsLoading] = useState(true);

  // Fetch guests from Supabase
  const fetchGuests = async () => {
    try {
      setGuestsLoading(true);
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setGuests(data);
      }
    } catch (error) {
      console.error('Error fetching guests from Supabase:', error.message);
      alert('Gagal mengambil data tamu dari database.');
    } finally {
      setGuestsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGuests();
    }
  }, [user]);

  // In a real app, you'd check localStorage or an API here
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    } else {
      // AUTO-LOGIN: Jika belum ada user, langsung gunakan akun Vincensius
      const defaultUser = { 
        username: 'vincensius', 
        role: 'Receptionist', 
        name: 'Vincensius Chandra DaludaCako Faraldi' 
      };
      setUser(defaultUser);
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const validUsers = [
      { username: 'admin', password: 'password', role: 'admin', name: 'Admin Utama' },
      { username: 'vincensius', password: 'hotel123', role: 'Receptionist', name: 'Vincensius Chandra DaludaCako Faraldi' },
      { username: 'chandra faraldi', password: 'chandra08', role: 'manager', name: 'Pak chandra faraldi' }
    ];

    // Check if entered credentials match any user in our list
    const foundUser = validUsers.find(
      (u) => u.username.trim() === username.trim() && u.password === password
    );

    if (foundUser) {
      // Remove password from stored data for security
      const { password, ...userData } = foundUser;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addGuest = async (newGuest) => {
    // 1. OFFLINE FEEL: Langsung masukkan data ke state lokal agar UI terasa instan
    setGuests(prevGuests => [newGuest, ...prevGuests]);

    // 2. BACKSTAGE ONLINE: Coba simpan ke Supabase di belakang layar
    try {
      console.log('Inserting guest to Supabase:', newGuest);
      const { data, error } = await supabase
        .from('guests')
        .insert([newGuest])
        .select();

      if (error) {
        console.error('Supabase Insert Error:', error);
        alert(`Gagal menyimpan ke database (Supabase): ${error.message}. Pastikan struktur tabel sesuai.`);
      } else {
        console.log('Successfully synced to Supabase:', data);
      }
    } catch (error) {
      console.error('Network Error saat menyimpan ke Supabase:', error.message);
    }

    // Selalu kembalikan "Sukses" agar Registration.jsx bisa langsung lompat ke halaman cetak/nota
    return { success: true };
  };

  const removeGuest = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data tamu ini?')) {
      // 1. OFFLINE FEEL: Langsung hapus dari layar
      setGuests(prevGuests => prevGuests.filter(g => g.id !== id));

      // 2. BACKSTAGE ONLINE: Kirim perintah hapus ke server
      try {
        const { error } = await supabase
          .from('guests')
          .delete()
          .eq('id', id);

        if (error) {
          console.warn('Peringatan: Gagal menghapus data di Supabase secara online.', error.message);
        }
      } catch (error) {
        console.error('Network Error saat menghapus dari Supabase:', error.message);
      }
    }
  };

  const updateGuest = async (id, updatedData) => {
    // 1. OFFLINE FEEL: Langsung ubah di layar
    setGuests(prevGuests => prevGuests.map(g =>
      g.id === id ? { ...g, ...updatedData } : g
    ));

    // 2. BACKSTAGE ONLINE: Update ke server
    try {
      const { error } = await supabase
        .from('guests')
        .update(updatedData)
        .eq('id', id);

      if (error) {
        console.warn('Peringatan: Gagal mengupdate data di Supabase secara online.', error.message);
      }
    } catch (error) {
      console.error('Network Error saat mengupdate ke Supabase:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, login, logout, isAuthenticated: !!user, loading,
      guests, guestsLoading, fetchGuests, addGuest, removeGuest, updateGuest
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
