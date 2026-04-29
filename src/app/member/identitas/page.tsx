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
    <div className="max-w-7xl mx-auto p-8 md:p-12 font-sans text-title">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Dokumen Identitas</h1>
          <p className="text-sm text-text-muted font-medium">Kelola dokumen identitas pribadi Anda</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input 
            type="text"
            placeholder="Cari nomor atau negara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 md:w-64 pl-4 pr-4 py-2 text-xs border border-border-light rounded-lg focus:outline-none focus:border-primary transition-colors bg-bg-subtle/50"
          />

          <select 
            value={selectedJenis}
            onChange={(e) => setSelectedJenis(e.target.value)}
            className="px-3 py-2 text-xs border border-border-light rounded-lg focus:outline-none focus:border-primary bg-white text-text-muted cursor-pointer"
          >
            <option value="">Semua Jenis</option>
            <option value="KTP">KTP</option>
            <option value="Paspor">Paspor</option>
            <option value="SIM">SIM</option>
          </select>

          <Link 
            href="/member/identitas/tambah" 
            className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-secondary transition-all shadow-sm"
          >
            + Tambah Dokumen
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead>
            <tr className="border-b border-border-light">
              <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">No. Dokumen</th>
              <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">Jenis</th>
              <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">Negara Penerbit</th>
              <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">Tgl Terbit</th>
              <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">Tgl Habis</th>
              <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted text-center">Status</th>
              <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {filteredDokumen.map((d) => {
              const expired = isExpired(d.tanggal_habis);
              
              return (
                <tr key={d.nomor_dokumen} className="group hover:bg-bg-subtle transition-colors">
                  
                  <td className="py-5 px-2 text-xs font-mono font-medium text-text-muted">
                    {d.nomor_dokumen}
                  </td>

                  <td className="py-5 px-2 font-semibold text-sm">
                    {d.jenis}
                  </td>
                  
                  <td className="py-5 px-2 text-xs text-text-muted">
                    {d.negara_penerbit}
                  </td>
                  
                  <td className="py-5 px-2 text-xs text-text-muted">
                    {d.tanggal_terbit}
                  </td>

                  <td className="py-5 px-2 text-xs text-text-muted">
                    {d.tanggal_habis}
                  </td>
                  
                  <td className={`py-5 px-2 text-center text-[11px] font-bold tracking-wider uppercase ${expired ? 'text-danger' : 'text-primary'}`}>
                    {expired ? 'Kedaluwarsa' : 'Aktif'}
                  </td>
                  
                  <td className="py-5 px-2 text-right">
                    <div className="flex justify-end gap-5">
                      <Link href={`/member/identitas/${d.nomor_dokumen}/edit`} className="text-text-muted hover:text-primary transition-colors" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                        </svg>
                      </Link>
                      
                      <button onClick={() => deleteDokumen(d.nomor_dokumen)} className="text-text-muted hover:text-danger transition-colors" title="Hapus">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
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
          <div className="py-20 text-center text-sm text-text-muted italic">
            Dokumen identitas tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}