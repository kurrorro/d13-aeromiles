'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Hadiah {
  kode_hadiah: string;
  nama: string;
  deskripsi: string;
  miles: number;
  valid_start_date: string;
  program_end: string;
  id_penyedia: number;
  nama_penyedia: string;
  status: string;
}

export default function DaftarHadiah() {
  const [hadiah, setHadiah] = useState<Hadiah[]>([]);
  const [penyediaList, setPenyediaList] = useState<{ id_penyedia: number, nama: string }[]>([]);
  const [filterPenyedia, setFilterPenyedia] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPenyedia();
  }, []);

  useEffect(() => {
    fetchHadiah();
  }, [filterPenyedia, filterStatus]);

  const fetchPenyedia = async () => {
    try {
      const res = await fetch('/api/staf/penyedia');
      if (res.ok) {
        const data = await res.json();
        setPenyediaList(data);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const fetchHadiah = async () => {
    setLoading(true);
    try {
      let url = '/api/staf/hadiah';
      const params = new URLSearchParams();
      if (filterPenyedia) params.append('idPenyedia', filterPenyedia);
      if (filterStatus) params.append('status', filterStatus);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setHadiah(data);
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (kode: string) => {
    const item = hadiah.find(h => h.kode_hadiah === kode);
    if (item && item.status === 'Aktif') {
      alert("Hanya hadiah yang sudah tidak berlaku (Expired) yang dapat dihapus.");
      return;
    }

    if (!confirm('Apakah Anda yakin ingin menghapus hadiah ini?')) return;

    try {
      const res = await fetch(`/api/staf/hadiah/${kode}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchHadiah();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Gagal menghapus hadiah');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans text-title">
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[var(--color-border-light)] p-6 md:p-10">

        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-[var(--color-border-light)] pb-5">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Katalog Hadiah & Penyedia</h1>
            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Kelola hadiah yang tersedia untuk ditukarkan oleh Member</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div>
              <select
                value={filterPenyedia}
                onChange={(e) => setFilterPenyedia(e.target.value)}
                className="w-full lg:w-auto border border-[var(--color-border-light)] rounded-lg px-4 py-2 text-xs focus:border-[var(--color-primary)] outline-none font-medium bg-white"
              >
                <option value="">Semua Penyedia</option>
                {penyediaList.map(p => (
                  <option key={p.id_penyedia} value={p.id_penyedia}>{p.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full lg:w-auto border border-[var(--color-border-light)] rounded-lg px-4 py-2 text-xs focus:border-[var(--color-primary)] outline-none font-medium bg-white"
              >
                <option value="">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>
            <Link
              href="/staf/hadiah/tambah"
              className="shrink-0 bg-[var(--color-primary)] hover:opacity-90 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Hadiah
            </Link>
          </div>
        </header>

        <div className="bg-white rounded-xl border border-[var(--color-border-light)] shadow-sm overflow-hidden">
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-xs text-[var(--color-text-muted)]">Memuat data...</td>
                  </tr>
                ) : hadiah.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-xs text-[var(--color-text-muted)]">Tidak ada hadiah ditemukan.</td>
                  </tr>
                ) : hadiah.map((item) => (
                  <tr key={item.kode_hadiah} className="hover:bg-[var(--color-bg-subtle)]/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-xs font-mono font-bold text-[var(--color-primary)]">{item.kode_hadiah}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-semibold text-[var(--color-title)]">{item.nama}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-[var(--color-title)]">{item.nama_penyedia}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[var(--color-secondary)]">{item.miles.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        {new Date(item.valid_start_date).toLocaleDateString()} s.d {new Date(item.program_end).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold uppercase tracking-wider ${item.status === 'Aktif'
                          ? 'text-[var(--color-success)]'
                          : 'text-[var(--color-danger)]'
                        }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/staf/hadiah/${item.kode_hadiah}/edit`}
                          className="text-[var(--color-primary)] hover:opacity-70 transition-opacity"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(item.kode_hadiah)}
                          className={`transition-opacity ${item.status === 'Aktif'
                              ? 'text-[var(--color-border-light)] cursor-not-allowed'
                              : 'text-[var(--color-danger)] hover:opacity-70'
                            }`}
                          title={item.status === 'Aktif' ? "Hadiah aktif tidak dapat dihapus" : "Hapus"}
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
      </div>
    </div>
  );
}
