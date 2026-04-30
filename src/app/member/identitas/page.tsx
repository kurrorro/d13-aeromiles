'use client';
import { useState } from 'react';
import Link from 'next/link';
import { DUMMY_IDENTITAS } from '@/dummy/identitas';

export default function IdentitasMemberPage() {
  const [dokumen, setDokumen] = useState(DUMMY_IDENTITAS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJenis, setSelectedJenis] = useState('');

  const deleteDokumen = (nomor: string) => {
    const confirmMessage = `Apakah Anda yakin ingin menghapus dokumen ${nomor}? 
    
Tindakan ini permanen dan dokumen tidak dapat dikembalikan.`;

    if (confirm(confirmMessage)) {
      setDokumen(dokumen.filter(d => d.nomor_dokumen !== nomor));
      alert(`Dokumen ${nomor} telah berhasil dihapus dari sistem.`);
    }
  };

  const isExpired = (tanggalHabis: string) => {
    return new Date(tanggalHabis) < new Date();
  };

  const filteredDokumen = dokumen.filter(d => {
    const matchesSearch = 
      d.nomor_dokumen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.negara_penerbit.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesJenis = selectedJenis === '' || d.jenis === selectedJenis;
    
    return matchesSearch && matchesJenis;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans text-title">
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[var(--color-border-light)] p-6 md:p-10">

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-[var(--color-border-light)] pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Dokumen Identitas</h1>
          <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Kelola dokumen identitas pribadi Anda</p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div>
            <input 
              type="text"
              placeholder="Cari nomor atau negara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-64 border border-[var(--color-border-light)] rounded-lg px-4 py-2 text-xs focus:border-[var(--color-primary)] outline-none font-medium bg-white"
            />
          </div>
          <div>
            <select 
              value={selectedJenis}
              onChange={(e) => setSelectedJenis(e.target.value)}
              className="w-full lg:w-auto border border-[var(--color-border-light)] rounded-lg px-4 py-2 text-xs focus:border-[var(--color-primary)] outline-none font-medium bg-white"
            >
              <option value="">Semua Jenis</option>
              <option value="KTP">KTP</option>
              <option value="Paspor">Paspor</option>
              <option value="SIM">SIM</option>
            </select>
          </div>
          <Link 
            href="/member/identitas/tambah" 
            className="shrink-0 bg-[var(--color-primary)] hover:opacity-90 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Dokumen
          </Link>
        </div>
      </header>

      <div className="bg-white rounded-xl border border-[var(--color-border-light)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-[var(--color-bg-subtle)] border-b border-[var(--color-border-light)]">
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">No. Dokumen</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Jenis</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Negara Penerbit</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Tgl Terbit</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Tgl Habis</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {filteredDokumen.map((d) => {
                const expired = isExpired(d.tanggal_habis);
                return (
                  <tr key={d.nomor_dokumen} className="hover:bg-[var(--color-bg-subtle)]/50 transition-colors">

                    <td className="px-6 py-4 text-xs font-mono font-bold text-[var(--color-primary)]">
                      {d.nomor_dokumen}
                    </td>

                    <td className="px-6 py-4 text-xs font-semibold text-[var(--color-title)]">
                      {d.jenis}
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-[var(--color-title)]">
                      {d.negara_penerbit}
                    </td>

                    <td className="px-6 py-4 text-xs text-[var(--color-text-muted)]">
                      {d.tanggal_terbit}
                    </td>

                    <td className="px-6 py-4 text-xs text-[var(--color-text-muted)]">
                      {d.tanggal_habis}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${expired ? 'text-[var(--color-danger)]' : 'text-[var(--color-primary)]'}`}>
                        {expired ? 'Kedaluwarsa' : 'Aktif'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link href={`/member/identitas/${d.nomor_dokumen}/edit`} className="text-[var(--color-primary)] hover:opacity-70 transition-opacity" title="Edit">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>

                        <button onClick={() => deleteDokumen(d.nomor_dokumen)} className="text-[var(--color-danger)] hover:opacity-70 transition-opacity" title="Hapus">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredDokumen.length === 0 && (
            <div className="py-20 text-center text-sm text-[var(--color-text-muted)] italic">
              Dokumen identitas tidak ditemukan.
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
