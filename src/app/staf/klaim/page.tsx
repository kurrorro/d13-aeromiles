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
  email_member: string;
  nama_member: string;
  maskapai: string;
  nama_maskapai: string;
  bandara_asal: string;
  bandara_tujuan: string;
  tanggal_penerbangan: string;
  flight_number: string;
  kelas_kabin: string;
  timestamp: string;
  status_penerimaan: string;
};

export default function StafKlaimPage() {
  const [klaim, setKlaim] = useState<Klaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMaskapai, setFilterMaskapai] = useState('');
  const [filterTanggalDari, setFilterTanggalDari] = useState('');
  const [filterTanggalSampai, setFilterTanggalSampai] = useState('');

  useEffect(() => {
    // Staf bisa lihat semua klaim — gunakan endpoint khusus staf
    fetch('/api/klaim/semua')
      .then(r => r.json())
      .then(data => setKlaim(Array.isArray(data) ? data : []))
      .catch(() => setKlaim([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = klaim.filter(k => {
    const matchStatus   = filterStatus === '' || k.status_penerimaan === filterStatus;
    const matchMaskapai = filterMaskapai === '' || k.maskapai === filterMaskapai;
    const tgl = String(k.timestamp).slice(0, 10);
    const matchDari     = filterTanggalDari === '' || tgl >= filterTanggalDari;
    const matchSampai   = filterTanggalSampai === '' || tgl <= filterTanggalSampai;
    return matchStatus && matchMaskapai && matchDari && matchSampai;
  });

  const maskapaiList = Array.from(new Set(klaim.map(k => k.maskapai))).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-title)] tracking-tight mb-1">Kelola Klaim Missing Miles</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Verifikasi dan proses pengajuan klaim miles dari seluruh member</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--color-border-light)] rounded-lg p-5 mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4">Filter</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-title)] mb-1.5">Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="w-full border border-[var(--color-border-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-secondary)] bg-white text-[var(--color-title)]">
              <option value="">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-title)] mb-1.5">Maskapai</label>
            <select value={filterMaskapai} onChange={e => setFilterMaskapai(e.target.value)}
              className="w-full border border-[var(--color-border-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-secondary)] bg-white text-[var(--color-title)]">
              <option value="">Semua Maskapai</option>
              {maskapaiList.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-title)] mb-1.5">Tanggal Pengajuan (Dari)</label>
            <input type="date" value={filterTanggalDari} onChange={e => setFilterTanggalDari(e.target.value)}
              className="w-full border border-[var(--color-border-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-secondary)] bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-title)] mb-1.5">Tanggal Pengajuan (Sampai)</label>
            <input type="date" value={filterTanggalSampai} onChange={e => setFilterTanggalSampai(e.target.value)}
              className="w-full border border-[var(--color-border-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-secondary)] bg-white" />
          </div>
        </div>
        {(filterStatus || filterMaskapai || filterTanggalDari || filterTanggalSampai) && (
          <button onClick={() => { setFilterStatus(''); setFilterMaskapai(''); setFilterTanggalDari(''); setFilterTanggalSampai(''); }}
            className="mt-3 text-xs font-semibold text-[var(--color-danger)] hover:underline">
            Reset Filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--color-border-light)] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-x-auto">
        <div className="px-6 py-4 border-b border-[var(--color-border-light)] bg-[var(--color-bg-subtle)]">
          <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
            {loading ? 'Memuat...' : `${filtered.length} klaim ditemukan`}
          </span>
        </div>
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-sm text-[var(--color-text-muted)] animate-pulse">Memuat data klaim...</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="border-b border-[var(--color-border-light)]">
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">ID</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Nama Member</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Maskapai</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Rute</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Tgl Penerbangan</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Flight</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Kelas</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Tgl Pengajuan</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Status</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {filtered.length > 0 ? filtered.map(k => (
                <tr key={k.id} className="hover:bg-[var(--color-bg-subtle)] transition-colors">
                  <td className="py-4 px-5 text-xs font-mono text-[var(--color-text-muted)]">CLM-{String(k.id).padStart(3, '0')}</td>
                  <td className="py-4 px-5">
                    <p className="text-xs font-semibold text-[var(--color-title)]">{k.nama_member || k.email_member}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{k.email_member}</p>
                  </td>
                  <td className="py-4 px-5 text-xs font-semibold text-[var(--color-title)]">{k.maskapai}</td>
                  <td className="py-4 px-5 text-xs font-semibold text-[var(--color-title)]">{k.bandara_asal} → {k.bandara_tujuan}</td>
                  <td className="py-4 px-5 text-xs text-[var(--color-text-muted)]">{k.tanggal_penerbangan}</td>
                  <td className="py-4 px-5 text-xs font-mono text-[var(--color-text-muted)]">{k.flight_number}</td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${KELAS_STYLE[k.kelas_kabin]}`}>
                      {k.kelas_kabin}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-xs text-[var(--color-text-muted)]">{String(k.timestamp).slice(0, 10)}</td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold ${STATUS_STYLE[k.status_penerimaan]}`}>
                      {k.status_penerimaan}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    {k.status_penerimaan === 'Menunggu' ? (
                      <Link href={`/staf/klaim/${k.id}`}
                        className="text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] px-3 py-1.5 rounded-lg transition-colors">
                        Proses
                      </Link>
                    ) : (
                      <Link href={`/staf/klaim/${k.id}`}
                        className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] border border-[var(--color-border-light)] px-3 py-1.5 rounded-lg transition-colors">
                        Detail
                      </Link>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <p className="text-sm font-medium text-[var(--color-text-muted)]">Tidak ada klaim ditemukan.</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">Coba ubah atau reset filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
