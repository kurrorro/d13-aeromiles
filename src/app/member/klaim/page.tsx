'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const STATUS_STYLE: Record<string, string> = {
  'Menunggu':  'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
  'Disetujui': 'bg-[var(--color-success-light)] text-[var(--color-success)]',
  'Ditolak':   'bg-[var(--color-danger-light)] text-[var(--color-danger)]',
};

const KELAS_STYLE: Record<string, string> = {
  'Economy':  'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]',
  'Business': 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
  'First':    'bg-[var(--color-success-light)] text-[var(--color-success)]',
};

type Klaim = {
  id: number;
  maskapai: string;
  nama_maskapai: string;
  bandara_asal: string;
  bandara_tujuan: string;
  tanggal_penerbangan: string;
  flight_number: string;
  kelas_kabin: string;
  status_penerimaan: string;
  timestamp: string;
};

export default function MemberKlaimPage() {
  const [klaim, setKlaim] = useState<Klaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchKlaim = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/klaim');
      if (!res.ok) throw new Error('Gagal memuat data');
      const data = await res.json();
      setKlaim(data);
    } catch {
      setKlaim([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKlaim(); }, []);

  const filtered = klaim.filter(k => filterStatus === '' || k.status_penerimaan === filterStatus);

  const handleBatalkan = (id: number) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmBatalkan = async () => {
    if (selectedId === null) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/klaim/${selectedId}`, { method: 'DELETE' });
      setKlaim(prev => prev.filter(k => k.id !== selectedId));
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <header>
          <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Klaim Miles</h1>
          <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Kelola Riwayat Pengajuan Klaim Missing Miles Anda</p>
        </header>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 text-xs border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:border-[var(--color-secondary)] bg-white text-[var(--color-title)] cursor-pointer transition-colors"
          >
            <option value="">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Ditolak">Ditolak</option>
          </select>
          <Link
            href="/member/klaim/ajukan"
            className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span className="text-base leading-none">+</span> AJUKAN KLAIM
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--color-border-light)] rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-sm text-[var(--color-text-muted)] animate-pulse">Memuat data klaim...</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-[var(--color-bg-subtle)] border-b border-[var(--color-border-light)]">
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[var(--color-title)]">No. Klaim</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[var(--color-title)]">Maskapai</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[var(--color-title)]">Rute</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[var(--color-title)]">Tgl Terbang</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[var(--color-title)]">Status</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[var(--color-title)] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {filtered.length > 0 ? filtered.map(k => (
                <tr key={k.id} className="hover:bg-[var(--color-bg-subtle)] transition-colors">
                  <td className="py-5 px-6">
                    <span className="text-xs font-mono font-bold text-[var(--color-primary)]">{k.id}</span>
                  </td>
                  <td className="py-5 px-6">
                    <p className="text-xs font-semibold text-[var(--color-title)]">{k.maskapai}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{k.nama_maskapai}</p>
                  </td>
                  <td className="py-5 px-6 text-xs text-[var(--color-title)] font-semibold">
                    {k.bandara_asal} <span className="text-[var(--color-text-muted)] mx-1">→</span> {k.bandara_tujuan}
                  </td>
                  <td className="py-5 px-6 text-xs text-[var(--color-text-muted)] font-medium">{k.tanggal_penerbangan}</td>
                  <td className="py-5 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${k.status_penerimaan === 'Menunggu' ? 'text-[var(--color-warning)]' : k.status_penerimaan === 'Disetujui' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                      {k.status_penerimaan}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/member/klaim/${k.id}`}
                        title="Lihat Detail"
                        className="text-[var(--color-primary)] hover:opacity-70 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      {k.status_penerimaan === 'Menunggu' && (
                        <>
                          <Link
                            href={`/member/klaim/${k.id}/edit`}
                            title="Edit"
                            className="text-[var(--color-primary)] hover:opacity-70 transition-opacity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleBatalkan(k.id)}
                            title="Batalkan"
                            className="text-[var(--color-danger)] hover:opacity-70 transition-opacity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <p className="text-sm font-medium text-[var(--color-text-muted)]">Tidak ada klaim ditemukan.</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">Coba ubah filter atau ajukan klaim baru.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-7 w-full max-w-md border border-[var(--color-border-light)]">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-[var(--color-danger-light)] flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--color-title)] mb-1">Batalkan Klaim</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Apakah Anda yakin ingin membatalkan klaim <strong>#{selectedId}</strong>? Tindakan ini permanen dan tidak dapat dibatalkan.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowDeleteModal(false); setSelectedId(null); }}
                disabled={isDeleting}
                className="px-5 py-2 text-sm font-semibold border border-[var(--color-border-light)] rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={confirmBatalkan}
                disabled={isDeleting}
                className="px-5 py-2 text-sm font-semibold bg-[var(--color-danger)] text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Membatalkan...' : 'Ya, Batalkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
