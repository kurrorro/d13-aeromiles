'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';

type Hadiah = {
  kode_hadiah: string;
  nama: string;
  miles: number;
  deskripsi: string;
  valid_start_date: string;
  program_end: string;
  nama_penyedia: string;
};

type RiwayatRedeem = {
  kode_hadiah: string;
  nama_hadiah: string;
  timestamp: string;
  miles: number;
};

export default function RedeemPage() {
  const { data: session } = useSession();
  const { showToast, showConfirm } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'katalog' | 'riwayat'>('katalog');
  const [awardMilesBalance, setAwardMilesBalance] = useState(0);
  const [katalog, setKatalog] = useState<Hadiah[]>([]);
  const [riwayat, setRiwayat] = useState<RiwayatRedeem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Katalog Hadiah
      const resKatalog = await fetch('/api/member/redeem');
      const dataKatalog = await resKatalog.json();
      setKatalog(Array.isArray(dataKatalog) ? dataKatalog : []);

      // Fetch Riwayat Redeem Lengkap
      const resRiwayat = await fetch('/api/member/redeem/history');
      const dataRiwayat = await resRiwayat.json();
      setRiwayat(Array.isArray(dataRiwayat) ? dataRiwayat : []);

      // Fetch Profile for Balance (from dashboard API)
      const resProfile = await fetch('/api/dashboard/member');
      const dataProfile = await resProfile.json();
      setAwardMilesBalance(dataProfile?.profile?.award_miles ?? 0);
      
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchData();
  }, [session]);

  const handleRedeem = async (hadiah: Hadiah) => {
    const confirmed = await showConfirm({
      title: 'Konfirmasi Tukar Hadiah',
      message: `Tukarkan ${hadiah.miles.toLocaleString('id-ID')} miles untuk ${hadiah.nama}?`,
      confirmText: 'Tukarkan Sekarang',
      type: 'success'
    });

    if (!confirmed) return;

    try {
      const res = await fetch('/api/member/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kode_hadiah: hadiah.kode_hadiah }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(data.message || 'Redeem berhasil!', 'success');
        fetchData(); // Refresh data
      } else {
        showToast(data.message || 'Gagal melakukan redeem.', 'error');
      }
    } catch (error) {
      showToast('Terjadi kesalahan jaringan.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 md:p-12 font-sans text-title">
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Redeem Hadiah</h1>
          <p className="text-sm text-text-muted font-medium">Tukarkan miles Anda dengan berbagai hadiah menarik</p>
        </div>

        <div className="bg-bg-subtle border border-border-light px-6 py-4 rounded-lg flex flex-col items-end">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Saldo Award Miles</p>
          <p className="text-2xl font-bold text-secondary">{awardMilesBalance.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="flex border-b border-border-light mb-8">
        <button 
          onClick={() => setActiveTab('katalog')}
          className={`py-3 px-6 text-sm font-semibold transition-colors ${activeTab === 'katalog' ? 'border-b-2 border-secondary text-primary' : 'text-text-muted hover:text-primary'}`}
        >
          Katalog Hadiah
        </button>
        <button 
          onClick={() => setActiveTab('riwayat')}
          className={`py-3 px-6 text-sm font-semibold transition-colors ${activeTab === 'riwayat' ? 'border-b-2 border-secondary text-primary' : 'text-text-muted hover:text-primary'}`}
        >
          Riwayat Redeem
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-text-muted animate-pulse">Memuat data...</div>
      ) : activeTab === 'katalog' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {katalog.length > 0 ? katalog.map(h => (
            <div key={h.kode_hadiah} className="bg-white border border-border-light rounded-lg p-6 flex flex-col hover:shadow-sm transition-shadow">
              <div className="mb-4">
                <p className="text-[10px] text-text-muted font-mono mb-2">{h.kode_hadiah}</p>
                <h3 className="text-lg font-bold text-title leading-tight mb-2">{h.nama}</h3>
                <p className="text-xs text-secondary font-semibold">{h.nama_penyedia}</p>
              </div>
              
              <p className="text-sm text-text-muted mb-6 flex-grow">{h.deskripsi || 'Tidak ada deskripsi.'}</p>
              
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Harga</p>
                  <p className="text-xl font-bold text-secondary">{h.miles.toLocaleString('id-ID')} <span className="text-xs font-normal text-text-muted">Miles</span></p>
                </div>
                <button 
                  onClick={() => handleRedeem(h)}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  Redeem
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-10 text-text-muted">Tidak ada hadiah yang tersedia saat ini.</div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border-light overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-border-light bg-bg-subtle">
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted">Tanggal & Waktu</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted">Hadiah</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Miles Dipotong</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {riwayat.map((r, i) => (
                <tr key={i} className="hover:bg-bg-subtle transition-colors">
                  <td className="py-4 px-6 text-xs text-text-muted">{new Date(r.timestamp).toLocaleString('id-ID')}</td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-semibold text-title">{r.nama_hadiah}</p>
                    <p className="text-[10px] text-text-muted font-mono">{r.kode_hadiah}</p>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-danger">
                    -{r.miles.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
              {riwayat.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-16 text-center text-sm text-text-muted italic">Belum ada riwayat redeem.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
