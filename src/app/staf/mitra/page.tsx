'use client';

import Link from 'next/link';
import { useState } from 'react';

// Mock data for Mitra based on dump_sql.txt
const mockMitra = [
  { email_mitra: 'partner@hotelsantika.com', id_penyedia: 6, nama_mitra: 'Hotel Santika', tanggal_kerja_sama: '2023-01-01' },
  { email_mitra: 'partner@grandhyatt.com', id_penyedia: 7, nama_mitra: 'Grand Hyatt Jakarta', tanggal_kerja_sama: '2023-06-15' },
  { email_mitra: 'partner@restosederhana.com', id_penyedia: 8, nama_mitra: 'Restoran Padang Sederhana', tanggal_kerja_sama: '2024-01-10' },
  { email_mitra: 'partner@transrental.com', id_penyedia: 9, nama_mitra: 'Trans Rental Car', tanggal_kerja_sama: '2024-03-20' },
  { email_mitra: 'partner@plazaindonesia.com', id_penyedia: 10, nama_mitra: 'Plaza Indonesia', tanggal_kerja_sama: '2024-07-01' },
];

export default function DaftarMitra() {
  const [mitra, setMitra] = useState(mockMitra);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (email: string) => {
    setMitra(mitra.filter(m => m.email_mitra !== email));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans text-title">
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[var(--color-border-light)] p-6 md:p-10">
      <header className="flex justify-between items-end mb-10 border-b border-[var(--color-border-light)] pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Manajemen Mitra</h1>
          <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Kelola data mitra penyedia hadiah AeroMiles</p>
        </div>
        <Link 
          href="/staf/mitra/tambah"
          className="bg-[var(--color-primary)] hover:opacity-90 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Mitra Baru
        </Link>
      </header>

      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--color-bg-subtle)] border-b border-[var(--color-border-light)]">
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Email Mitra</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">ID Penyedia</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Nama Mitra</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Tanggal Kerja Sama</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {mitra.map((item) => (
                <tr key={item.email_mitra} className="hover:bg-[var(--color-bg-subtle)]/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-[var(--color-title)]">{item.email_mitra}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-[var(--color-primary)]">
                      #{item.id_penyedia}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-semibold text-[var(--color-title)]">{item.nama_mitra}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-[var(--color-text-muted)]">{item.tanggal_kerja_sama}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link 
                        href={`/staf/mitra/${encodeURIComponent(item.email_mitra)}/edit`}
                        className="text-[var(--color-primary)] hover:opacity-70 transition-opacity"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button 
                        onClick={() => setShowDeleteConfirm(item.email_mitra)}
                        className="text-[var(--color-danger)] hover:opacity-70 transition-opacity"
                        title="Hapus"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-[var(--color-border-light)] max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-[var(--color-danger-light)] rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[var(--color-title)] mb-2">Hapus Mitra?</h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-8">
              Tindakan ini permanen. Menghapus mitra <span className="font-bold text-[var(--color-title)]">{showDeleteConfirm}</span> juga akan menghapus seluruh hadiah yang disediakan oleh mitra ini secara permanen.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-6 py-3 border border-[var(--color-border-light)] text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-[var(--color-bg-subtle)] transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-6 py-3 bg-[var(--color-danger)] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-all shadow-md"
              >
                Ya, Hapus Mitra
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
