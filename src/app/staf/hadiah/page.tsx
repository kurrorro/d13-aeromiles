'use client';

import Link from 'next/link';
import { useState } from 'react';

// Mock data for Hadiah based on dump_sql.txt
const mockHadiah = [
  { kode_hadiah: 'RWD-001', nama: 'Diskon Menginap 20%', miles: 5000, penyedia: 'Hotel Santika', valid_start: '2025-01-01', program_end: '2025-12-31', active: true },
  { kode_hadiah: 'RWD-003', nama: 'Voucher Makan Rp 150.000', miles: 2000, penyedia: 'Restoran Padang Sederhana', valid_start: '2025-01-01', program_end: '2025-06-30', active: true },
  { kode_hadiah: 'RWD-004', nama: 'Upgrade Kabin Gratis', miles: 10000, penyedia: 'Garuda Indonesia', valid_start: '2025-03-01', program_end: '2025-12-31', active: true },
  { kode_hadiah: 'RWD-010', nama: 'Priority Check-in', miles: 1500, penyedia: 'Lion Air', valid_start: '2025-01-01', program_end: '2025-06-30', active: true },
  { kode_hadiah: 'RWD-999', nama: 'Expired Reward Example', miles: 1000, penyedia: 'Citilink', valid_start: '2024-01-01', program_end: '2024-12-31', active: false },
];

export default function DaftarHadiah() {
  const [hadiah, setHadiah] = useState(mockHadiah);
  const [filterPenyedia, setFilterPenyedia] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  const filteredHadiah = hadiah.filter(item => {
    const matchPenyedia = filterPenyedia === 'Semua' || item.penyedia === filterPenyedia;
    const matchStatus = filterStatus === 'Semua' || (filterStatus === 'Aktif' ? item.active : !item.active);
    return matchPenyedia && matchStatus;
  });

  const handleDelete = (kode: string) => {
    // Check if expired
    const item = hadiah.find(h => h.kode_hadiah === kode);
    if (item && item.active) {
      alert("Hanya hadiah yang sudah tidak berlaku (Expired) yang dapat dihapus.");
      return;
    }
    setHadiah(hadiah.filter(h => h.kode_hadiah !== kode));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans text-title">
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[var(--color-border-light)] p-6 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight mb-1">Katalog Hadiah & Penyedia</h1>
          <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Kelola hadiah yang tersedia untuk ditukarkan oleh Member</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={filterPenyedia}
            onChange={(e) => setFilterPenyedia(e.target.value)}
            className="px-3 py-2 text-xs border border-border-light rounded-lg focus:outline-none focus:border-primary bg-white text-text-muted cursor-pointer"
          >
            <option value="Semua">Semua Penyedia</option>
            <option value="Garuda Indonesia">Garuda Indonesia</option>
            <option value="Lion Air">Lion Air</option>
            <option value="Hotel Santika">Hotel Santika</option>
            <option value="Restoran Padang Sederhana">Restoran Padang Sederhana</option>
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs border border-border-light rounded-lg focus:outline-none focus:border-primary bg-white text-text-muted cursor-pointer"
          >
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Expired">Expired</option>
          </select>

          <Link 
            href="/staf/hadiah/tambah"
            className="shrink-0 bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Hadiah
          </Link>
        </div>
      </div>

      <div className="border-t border-[var(--color-border-light)] pt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--color-bg-subtle)] border-b border-[var(--color-border-light)]">
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Kode</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Nama Hadiah</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Penyedia</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Miles</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Periode Valid</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {filteredHadiah.map((item) => (
                <tr key={item.kode_hadiah} className="hover:bg-[var(--color-bg-subtle)]/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-mono font-bold text-[var(--color-primary)]">{item.kode_hadiah}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-semibold text-[var(--color-title)]">{item.nama}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-[var(--color-title)]">{item.penyedia}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[var(--color-secondary)]">{item.miles.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[10px] text-[var(--color-text-muted)]">{item.valid_start} s.d {item.program_end}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-bold tracking-wider ${
                      item.active 
                        ? 'text-[var(--color-success)]' 
                        : 'text-[var(--color-danger)]'
                    }`}>
                      {item.active ? 'Aktif' : 'Expired'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-5">
                      <Link 
                        href={`/staf/hadiah/${item.kode_hadiah}/edit`}
                        className="text-text-muted hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                        </svg>
                      </Link>
                      <button 
                        onClick={() => handleDelete(item.kode_hadiah)}
                        className={`transition-colors ${
                          item.active 
                            ? 'text-border-light cursor-not-allowed' 
                            : 'text-text-muted hover:text-danger'
                        }`}
                        title={item.active ? "Hadiah aktif tidak dapat dihapus" : "Hapus"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}
