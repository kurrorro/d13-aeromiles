'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const STATUS_STYLE: Record<string, string> = {
  'Menunggu':  'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
  'Disetujui': 'bg-[var(--color-success-light)] text-[var(--color-success)]',
  'Ditolak':   'bg-[var(--color-danger-light)] text-[var(--color-danger)]',
};

type Klaim = {
  id: number;
  email_member: string;
  nama_member: string;
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

export default function StafKlaimDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const id = params.id as string;

  const [klaim, setKlaim] = useState<Klaim | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState<'Disetujui' | 'Ditolak'>('Disetujui');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [finalStatus, setFinalStatus] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetch(`/api/klaim/${id}`)
      .then(r => r.json())
      .then(data => setKlaim(data))
      .catch(() => setKlaim(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <p className="text-sm text-[var(--color-text-muted)] animate-pulse">Memuat data klaim...</p>
      </div>
    );
  }

  if (!klaim) {
    return (
      <div className="max-w-3xl mx-auto p-10 font-sans text-center">
        <p className="text-[var(--color-text-muted)]">Klaim tidak ditemukan.</p>
        <Link href="/staf/klaim" className="text-[var(--color-secondary)] hover:underline text-sm mt-4 inline-block">← Kembali</Link>
      </div>
    );
  }

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch(`/api/klaim/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_penerimaan: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error || 'Gagal memproses klaim');
        return;
      }
      setProcessed(true);
      setFinalStatus(newStatus);
      setShowConfirmModal(false);
    } catch {
      setSubmitError('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStatus = processed ? finalStatus : klaim.status_penerimaan;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 font-sans">
      <Link href="/staf/klaim" className="inline-flex items-center gap-2 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Daftar
      </Link>

      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <header>
          <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Detail Klaim #{id}</h1>
          <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Informasi lengkap pengajuan klaim missing miles</p>
        </header>
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLE[currentStatus]}`}>
          {currentStatus}
        </span>
      </div>

      {submitError && (
        <div className="bg-[var(--color-danger-light)] border-l-4 border-[var(--color-danger)] rounded-lg p-4 mb-6">
          <p className="text-sm text-[var(--color-danger)]">{submitError}</p>
        </div>
      )}

      {/* Detail Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Member Info */}
        <div className="bg-white border border-[var(--color-border-light)] rounded-lg p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4">Informasi Member</h2>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Nama</p>
              <p className="text-sm font-semibold text-[var(--color-title)]">{klaim.nama_member || klaim.email_member}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Email</p>
              <p className="text-sm text-[var(--color-title)]">{klaim.email_member}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Timestamp Pengajuan</p>
              <p className="text-sm text-[var(--color-title)]">{String(klaim.timestamp).slice(0, 19).replace('T', ' ')}</p>
            </div>
            {klaim.email_staf && (
              <div>
                <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Diproses Oleh</p>
                <p className="text-sm text-[var(--color-title)]">{klaim.email_staf}</p>
              </div>
            )}
          </div>
        </div>

        {/* Flight Info */}
        <div className="bg-white border border-[var(--color-border-light)] rounded-lg p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4">Detail Penerbangan</h2>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Maskapai</p>
              <p className="text-sm font-semibold text-[var(--color-title)]">{klaim.maskapai} — {klaim.nama_maskapai}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Rute</p>
              <p className="text-sm font-bold text-[var(--color-title)]">{klaim.bandara_asal} → {klaim.bandara_tujuan}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Flight Number</p>
              <p className="text-sm font-mono text-[var(--color-title)]">{klaim.flight_number}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Tanggal Penerbangan</p>
              <p className="text-sm text-[var(--color-title)]">{klaim.tanggal_penerbangan}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Nomor Tiket</p>
              <p className="text-sm font-mono text-[var(--color-title)]">{klaim.nomor_tiket}</p>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Kelas Kabin</p>
                <p className="text-sm font-semibold text-[var(--color-title)]">{klaim.kelas_kabin}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">PNR</p>
                <p className="text-sm font-mono text-[var(--color-title)]">{klaim.pnr}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Form (only for Menunggu) */}
      {currentStatus === 'Menunggu' && !processed && (
        <div className="bg-white border border-[var(--color-border-light)] rounded-lg p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-5">Proses Klaim</h2>
          <div className="flex items-center gap-6 mb-6">
            <label className={`flex items-center gap-3 cursor-pointer p-4 rounded-lg border-2 transition-all ${newStatus === 'Disetujui' ? 'border-[var(--color-success)] bg-[var(--color-success-light)]' : 'border-[var(--color-border-light)] hover:border-[var(--color-border-light)]'}`}>
              <input type="radio" name="newStatus" value="Disetujui" checked={newStatus === 'Disetujui'} onChange={() => setNewStatus('Disetujui')} className="w-4 h-4" />
              <div>
                <p className="font-semibold text-sm text-[var(--color-title)]">Setujui Klaim</p>
                <p className="text-xs text-[var(--color-text-muted)]">Miles akan ditambahkan ke akun member</p>
              </div>
            </label>
            <label className={`flex items-center gap-3 cursor-pointer p-4 rounded-lg border-2 transition-all ${newStatus === 'Ditolak' ? 'border-[var(--color-danger)] bg-[var(--color-danger-light)]' : 'border-[var(--color-border-light)] hover:border-[var(--color-border-light)]'}`}>
              <input type="radio" name="newStatus" value="Ditolak" checked={newStatus === 'Ditolak'} onChange={() => setNewStatus('Ditolak')} className="w-4 h-4" />
              <div>
                <p className="font-semibold text-sm text-[var(--color-title)]">Tolak Klaim</p>
                <p className="text-xs text-[var(--color-text-muted)]">Klaim ditolak, miles tidak ditambahkan</p>
              </div>
            </label>
          </div>
          <div className="flex gap-3">
            <Link href="/staf/klaim"
              className="px-6 py-2.5 text-sm font-semibold border border-[var(--color-border-light)] rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] transition-colors">
              Kembali
            </Link>
            <button onClick={() => setShowConfirmModal(true)}
              className={`px-8 py-2.5 text-sm font-semibold rounded-lg text-white transition-all ${newStatus === 'Disetujui' ? 'bg-[var(--color-success)] hover:opacity-90' : 'bg-[var(--color-danger)] hover:opacity-90'}`}>
              {newStatus === 'Disetujui' ? 'Setujui Klaim' : 'Tolak Klaim'}
            </button>
          </div>
        </div>
      )}

      {/* Result after processing */}
      {processed && (
        <div className={`rounded-lg p-5 ${finalStatus === 'Disetujui' ? 'bg-[var(--color-success-light)] border border-[var(--color-success)]' : 'bg-[var(--color-danger-light)] border border-[var(--color-danger)]'}`}>
          <p className={`font-semibold ${finalStatus === 'Disetujui' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
            Klaim telah berhasil <strong>{finalStatus === 'Disetujui' ? 'disetujui' : 'ditolak'}</strong>.
            {finalStatus === 'Disetujui' && ' Miles akan segera ditambahkan ke akun member.'}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Diproses oleh: {session?.user?.email}</p>
          <Link href="/staf/klaim" className="text-sm font-semibold text-[var(--color-primary)] hover:underline mt-3 inline-block">
            ← Kembali ke Daftar Klaim
          </Link>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-7 w-full max-w-md border border-[var(--color-border-light)]">
            <h3 className="text-base font-bold text-[var(--color-title)] mb-2">
              Konfirmasi {newStatus === 'Disetujui' ? 'Persetujuan' : 'Penolakan'} Klaim
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-5">
              Anda akan <strong>{newStatus === 'Disetujui' ? 'menyetujui' : 'menolak'}</strong> klaim <strong>#{id}</strong> dari <strong>{klaim.nama_member || klaim.email_member}</strong>.
              {newStatus === 'Disetujui' && ' Miles akan ditambahkan ke akun member setelah konfirmasi.'}
              {' '}Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="bg-[var(--color-bg-subtle)] rounded-lg p-4 text-sm mb-5">
              <p className="font-semibold text-[var(--color-title)]">{klaim.bandara_asal} → {klaim.bandara_tujuan}</p>
              <p className="text-[var(--color-text-muted)]">{klaim.flight_number} · {klaim.kelas_kabin} · {klaim.tanggal_penerbangan}</p>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirmModal(false)} disabled={isSubmitting}
                className="px-5 py-2 text-sm font-semibold border border-[var(--color-border-light)] rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] transition-colors disabled:opacity-50">
                Batal
              </button>
              <button onClick={handleConfirm} disabled={isSubmitting}
                className={`px-6 py-2 text-sm font-semibold rounded-lg text-white transition-all disabled:opacity-50 ${newStatus === 'Disetujui' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-danger)]'}`}>
                {isSubmitting ? 'Memproses...' : `Ya, ${newStatus === 'Disetujui' ? 'Setujui' : 'Tolak'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
