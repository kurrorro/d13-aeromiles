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
    <div className="max-w-7xl mx-auto p-6 md:p-10 font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-title)] tracking-tight mb-1">Klaim Miles</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Kelola pengajuan klaim missing miles Anda</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:border-[var(--color-secondary)] bg-white text-[var(--color-text-muted)] cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Ditolak">Ditolak</option>
          </select>
          <Link
            href="/member/klaim/ajukan"
            className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--color-secondary)] transition-all shadow-sm"
          >
            + Ajukan Klaim
          </Link>
        </div>
      </div>

      {/* Info note */}
      <div className="bg-[var(--color-success-light)] border-l-4 border-[var(--color-secondary)] rounded-lg p-4 mb-6">
        <p className="text-sm text-[var(--color-title)]">
          Anda hanya dapat mengedit atau membatalkan klaim dengan status <strong>Menunggu</strong>. Klaim yang sudah Disetujui atau Ditolak tidak dapat diubah.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--color-border-light)] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-x-auto">
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-sm text-[var(--color-text-muted)] animate-pulse">Memuat data klaim...</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="border-b border-[var(--color-border-light)] bg-[var(--color-bg-subtle)]">
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">No. Klaim</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Maskapai</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Rute</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Tgl Penerbangan</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Flight</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Kelas</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Status</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Timestamp</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {filtered.length > 0 ? filtered.map(k => (
                <tr key={k.id} className="hover:bg-[var(--color-bg-subtle)] transition-colors">
                  <td className="py-4 px-5">
                    <Link href={`/member/klaim/${k.id}`} className="text-xs font-mono font-semibold text-[var(--color-primary)] hover:underline">#{k.id}</Link>
                  </td>
                  <td className="py-4 px-5">
                    <p className="text-xs font-semibold text-[var(--color-title)]">{k.maskapai}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{k.nama_maskapai}</p>
                  </td>
                  <td className="py-4 px-5 text-xs text-[var(--color-title)] font-semibold">
                    {k.bandara_asal} → {k.bandara_tujuan}
                  </td>
                  <td className="py-4 px-5 text-xs text-[var(--color-text-muted)]">{k.tanggal_penerbangan}</td>
                  <td className="py-4 px-5 text-xs font-mono text-[var(--color-text-muted)]">{k.flight_number}</td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${KELAS_STYLE[k.kelas_kabin]}`}>
                      {k.kelas_kabin}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${STATUS_STYLE[k.status_penerimaan]}`}>
                      {k.status_penerimaan}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-xs text-[var(--color-text-muted)]">{String(k.timestamp).slice(0, 19).replace('T', ' ')}</td>
                  <td className="py-4 px-5 text-right">
                    {k.status_penerimaan === 'Menunggu' ? (
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/member/klaim/${k.id}/edit`}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-300 hover:border-blue-500 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleBatalkan(k.id)}
                          className="text-xs font-semibold text-[var(--color-danger)] hover:text-red-800 border border-[var(--color-danger)]/30 hover:border-[var(--color-danger)] px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Batalkan
                        </button>
                      </div>
                    ) : (
                      <Link
                        href={`/member/klaim/${k.id}`}
                        className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] border border-[var(--color-border-light)] hover:border-[var(--color-primary)] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Lihat
                      </Link>
                    )}
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
