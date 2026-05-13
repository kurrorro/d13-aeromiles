'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Hadiah {
  kode_hadiah: string;
  nama: string;
  miles: number;
  deskripsi: string;
  valid_start_date: string;
  program_end: string;
  nama_penyedia: string;
}

interface RiwayatRedeem {
  timestamp: string;
  kode_hadiah: string;
  nama: string;
  miles: number;
}

export default function RedeemPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'katalog' | 'riwayat'>('katalog');
  const [awardMilesBalance, setAwardMilesBalance] = useState(0);
  const [katalog, setKatalog] = useState<Hadiah[]>([]);
  const [riwayat, setRiwayat] = useState<RiwayatRedeem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const data = await profileRes.json();
        setAwardMilesBalance(data.profile.award_miles || 0);
      }

      const katalogRes = await fetch('/api/member/redeem');
      if (katalogRes.ok) {
        const data = await katalogRes.json();
        setKatalog(data);
      }

      const riwayatRes = await fetch('/api/member/redeem/riwayat');
      if (riwayatRes.ok) {
        const data = await riwayatRes.json();
        setRiwayat(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  const handleRedeem = async (hadiah: Hadiah) => {
    if (awardMilesBalance < hadiah.miles) {
      alert(`Saldo tidak cukup! Anda butuh ${hadiah.miles.toLocaleString('id-ID')} miles.`);
      return;
    }

    const confirmMsg = `Konfirmasi Penukaran:\nHadiah: ${hadiah.nama}\nMiles Dipotong: ${hadiah.miles.toLocaleString('id-ID')}\nLanjutkan?`;

    if (confirm(confirmMsg)) {
      try {
        const res = await fetch('/api/member/redeem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kode_hadiah: hadiah.kode_hadiah })
        });

        const data = await res.json();
        if (res.ok) {
          alert(data.message || 'Penukaran berhasil!');
          fetchData(); // Refresh balance and history
        } else {
          alert(data.message || 'Gagal melakukan penukaran.');
        }
      } catch (error) {
        alert('Terjadi kesalahan koneksi.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 md:p-12 font-sans text-title">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-start mb-10 gap-6">
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
        <p className="text-center py-10 text-text-muted">Memuat data...</p>
      ) : activeTab === 'katalog' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {katalog.map(h => (
            <div key={h.kode_hadiah} className="bg-white border border-border-light rounded-lg p-6 flex flex-col hover:shadow-sm transition-shadow">
              <div className="mb-4">
                <p className="text-[10px] text-text-muted font-mono mb-2">{h.kode_hadiah}</p>
                <h3 className="text-lg font-bold text-title leading-tight mb-2">{h.nama}</h3>
                <p className="text-xs text-text-muted font-medium">{h.nama_penyedia}</p>
              </div>

              <p className="text-sm text-text-muted mb-6 flex-grow">{h.deskripsi}</p>

              <div className="flex items-end justify-between mt-auto">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Harga</p>
                  <p className="text-xl font-bold text-secondary">{h.miles.toLocaleString('id-ID')} <span className="text-xs font-normal text-text-muted">Miles</span></p>
                </div>
                <button
                  onClick={() => handleRedeem(h)}
                  disabled={awardMilesBalance < h.miles}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${awardMilesBalance >= h.miles ? 'bg-primary text-white hover:bg-secondary' : 'bg-border-light text-text-muted cursor-not-allowed'}`}
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
          {katalog.length === 0 && (
            <div className="col-span-full py-10 text-center text-text-muted italic">Tidak ada hadiah tersedia saat ini.</div>
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
                  <td className="py-4 px-6 text-xs text-text-muted">
                    {new Date(r.timestamp).toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-semibold text-title">{r.nama}</p>
                    <p className="text-[10px] text-text-muted font-mono">{r.kode_hadiah}</p>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-danger">
                    -{r.miles.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
              {riwayat.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-sm text-text-muted italic">Belum ada riwayat redeem.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

