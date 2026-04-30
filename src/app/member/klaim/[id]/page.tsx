'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const STATUS_STYLE: Record<string, { pill: string }> = {
  Menunggu:  { pill: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]' },
  Disetujui: { pill: 'bg-[var(--color-success-light)] text-[var(--color-success)]' },
  Ditolak:   { pill: 'bg-[var(--color-danger-light)]  text-[var(--color-danger)]' },
};

const KELAS_STYLE: Record<string, string> = {
  Economy:  'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]',
  Business: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
  First:    'bg-[var(--color-success-light)] text-[var(--color-success)]',
};

type Klaim = {
  id: number;
  email_member: string;
  email_staf: string | null;
  maskapai: string;
  nama_maskapai: string;
  bandara_asal: string;
  bandara_tujuan: string;
  tanggal_penerbangan: string;
  flight_number: string;
  nomor_tiket: string;
  kelas_kabin: string;
  pnr: string;
  status_penerimaan: string;
  timestamp: string;
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 py-3 border-b border-[var(--color-border-light)] last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] sm:w-52 shrink-0">
        {label}
      </span>
      <span className="text-sm text-[var(--color-title)] font-medium">{value}</span>
    </div>
  );
}

export default function DetailKlaimPage() {
  const params = useParams();
  const id = params.id as string;

  const [klaim, setKlaim] = useState<Klaim | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/klaim/${id}`)
      .then(res => {
        if (res.status === 404) { setNotFound(true); return null; }
        return res.json();
      })
      .then(data => { if (data) setKlaim(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <p className="text-sm text-[var(--color-text-muted)] animate-pulse">Memuat detail klaim...</p>
      </div>
    );
  }

  if (notFound || !klaim) {
    return (
      <div className="max-w-3xl mx-auto p-10 font-sans text-center">
        <div className="bg-[var(--color-danger-light)] border border-[var(--color-danger)]/30 rounded-xl p-8">
          <p className="text-lg font-bold text-[var(--color-danger)] mb-2">Klaim Tidak Ditemukan</p>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">Klaim dengan ID #{id} tidak ada atau sudah dihapus.</p>
          <Link href="/member/klaim" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-secondary)] hover:underline">
            ← Kembali ke Daftar Klaim
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_STYLE[klaim.status_penerimaan] ?? STATUS_STYLE['Menunggu'];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 font-sans">
      <Link href="/member/klaim" className="inline-flex items-center gap-2 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Daftar
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <header>
          <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Detail Klaim #{id}</h1>
          <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Diajukan pada {String(klaim.timestamp).slice(0, 19).replace('T', ' ')}</p>
        </header>
        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusInfo.pill}`}>
          {klaim.status_penerimaan}
        </span>
      </div>

      {/* Penerbangan Card */}
      <div className="bg-white border border-[var(--color-border-light)] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">Informasi Penerbangan</h2>

        {/* Route visual */}
        <div className="flex items-center justify-between gap-3 bg-[var(--color-bg-subtle)] rounded-lg p-4 mb-5">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[var(--color-title)] tracking-wider">{klaim.bandara_asal}</p>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full border-t-2 border-dashed border-[var(--color-border-light)] relative">
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 text-[var(--color-text-muted)] bg-[var(--color-bg-subtle)] px-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </div>
            <p className="text-[10px] font-mono text-[var(--color-text-muted)] mt-2">{klaim.flight_number}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[var(--color-title)] tracking-wider">{klaim.bandara_tujuan}</p>
          </div>
        </div>

        <InfoRow label="Maskapai" value={<span>{klaim.nama_maskapai} <span className="font-mono text-xs text-[var(--color-text-muted)]">({klaim.maskapai})</span></span>} />
        <InfoRow label="Tanggal Penerbangan" value={klaim.tanggal_penerbangan} />
        <InfoRow label="Flight Number" value={<span className="font-mono">{klaim.flight_number}</span>} />
        <InfoRow label="Kelas Kabin" value={
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${KELAS_STYLE[klaim.kelas_kabin]}`}>
            {klaim.kelas_kabin}
          </span>
        } />
      </div>

      {/* Dokumen Card */}
      <div className="bg-white border border-[var(--color-border-light)] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">Dokumen & Referensi</h2>
        <InfoRow label="Nomor Tiket" value={<span className="font-mono">{klaim.nomor_tiket}</span>} />
        <InfoRow label="PNR" value={<span className="font-mono">{klaim.pnr}</span>} />
      </div>

      {/* Status Card */}
      <div className="bg-white border border-[var(--color-border-light)] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6 mb-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">Status Klaim</h2>
        <InfoRow label="Status" value={
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.pill}`}>
            {klaim.status_penerimaan}
          </span>
        } />
        <InfoRow label="Diproses oleh" value={
          klaim.email_staf
            ? <span className="font-mono">{klaim.email_staf}</span>
            : <span className="italic text-[var(--color-text-muted)]">Belum diproses</span>
        } />
        <InfoRow label="Waktu Pengajuan" value={String(klaim.timestamp).slice(0, 19).replace('T', ' ')} />

        {klaim.status_penerimaan === 'Ditolak' && (
          <div className="mt-4 bg-[var(--color-danger-light)] border-l-4 border-[var(--color-danger)] rounded-lg p-4">
            <p className="text-sm font-semibold text-[var(--color-danger)] mb-1">Klaim Ditolak</p>
            <p className="text-xs text-[var(--color-text-muted)]">Klaim ini telah ditolak oleh staf. Anda dapat mengajukan klaim baru jika diperlukan.</p>
          </div>
        )}

        {klaim.status_penerimaan === 'Disetujui' && (
          <div className="mt-4 bg-[var(--color-success-light)] border-l-4 border-[var(--color-success)] rounded-lg p-4">
            <p className="text-sm font-semibold text-[var(--color-success)] mb-1">Klaim Berhasil Disetujui</p>
            <p className="text-xs text-[var(--color-text-muted)]">Miles dari penerbangan ini telah berhasil dikreditkan ke akun Anda.</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Link href="/member/klaim" className="px-5 py-2.5 text-sm font-semibold border border-[var(--color-border-light)] rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] transition-colors">
          ← Kembali
        </Link>
        {klaim.status_penerimaan === 'Menunggu' && (
          <Link href={`/member/klaim/${id}/edit`} className="px-5 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-secondary)] transition-all shadow-sm">
            Edit Klaim
          </Link>
        )}
      </div>
    </div>
  );
}
