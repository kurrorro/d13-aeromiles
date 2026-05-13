'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Package {
  id: string;
  harga_paket: number;
  jumlah_award_miles: number;
}

interface RiwayatPackage {
  id_award_miles_package: string;
  jumlah_award_miles: number;
  harga_paket: number;
  timestamp: string;
}

export default function PackagePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'beli' | 'riwayat'>('beli');
  const [awardMilesBalance, setAwardMilesBalance] = useState(0);
  const [packages, setPackages] = useState<Package[]>([]);
  const [riwayat, setRiwayat] = useState<RiwayatPackage[]>([]);
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

      const packagesRes = await fetch('/api/member/package');
      if (packagesRes.ok) {
        const data = await packagesRes.json();
        setPackages(data);
      }

      const riwayatRes = await fetch('/api/member/package/riwayat');
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

  const handleBeli = async (pkg: Package) => {
    const confirmMessage = `Apakah Anda yakin ingin membeli paket:\n${pkg.jumlah_award_miles.toLocaleString('id-ID')} Miles seharga Rp ${Number(pkg.harga_paket).toLocaleString('id-ID')}?`;

    if (confirm(confirmMessage)) {
      try {
        const res = await fetch('/api/member/package', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_award_miles_package: pkg.id })
        });

        const data = await res.json();
        if (res.ok) {
          alert(data.message || 'Pembelian berhasil!');
          fetchData();
        } else {
          alert(data.message || 'Gagal melakukan pembelian.');
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
          <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Beli Award Miles Package</h1>
          <p className="text-sm text-text-muted font-medium">Tingkatkan Award Miles Anda dengan mudah</p>
        </div>

        <div className="bg-bg-subtle border border-border-light px-6 py-4 rounded-lg flex flex-col items-end">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Saldo Award Miles</p>
          <p className="text-2xl font-bold text-secondary">{awardMilesBalance.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="flex border-b border-border-light mb-8">
        <button
          onClick={() => setActiveTab('beli')}
          className={`py-3 px-6 text-sm font-semibold transition-colors ${activeTab === 'beli' ? 'border-b-2 border-secondary text-primary' : 'text-text-muted hover:text-primary'}`}
        >
          Pilihan Paket
        </button>
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`py-3 px-6 text-sm font-semibold transition-colors ${activeTab === 'riwayat' ? 'border-b-2 border-secondary text-primary' : 'text-text-muted hover:text-primary'}`}
        >
          Riwayat Pembelian
        </button>
      </div>

      {loading ? (
        <p className="text-center py-10 text-text-muted">Memuat data...</p>
      ) : activeTab === 'beli' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white border border-border-light rounded-lg p-6 flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div>
                <p className="text-[10px] text-text-muted font-mono mb-4">{pkg.id}</p>
                <h3 className="text-3xl font-bold text-secondary mb-2">{pkg.jumlah_award_miles.toLocaleString('id-ID')}</h3>
                <p className="text-sm font-semibold text-title mb-6">Miles</p>
              </div>

              <div>
                <p className="text-xs text-text-muted mb-3">Harga Paket</p>
                <p className="text-lg font-bold text-title mb-5">Rp {Number(pkg.harga_paket).toLocaleString('id-ID')}</p>

                <button
                  onClick={() => handleBeli(pkg)}
                  className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  Beli Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border-light overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-border-light bg-bg-subtle">
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted">Tanggal & Waktu</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted">ID Paket</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted">Jumlah Miles</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Harga</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {riwayat.map((r, i) => (
                <tr key={i} className="hover:bg-bg-subtle transition-colors">
                  <td className="py-4 px-6 text-xs text-text-muted">
                    {new Date(r.timestamp).toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-6 text-sm font-mono text-title">{r.id_award_miles_package}</td>
                  <td className="py-4 px-6 text-sm font-bold text-secondary">+{r.jumlah_award_miles.toLocaleString('id-ID')}</td>
                  <td className="py-4 px-6 text-right font-semibold text-title">
                    Rp {Number(r.harga_paket).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
              {riwayat.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-sm text-text-muted italic">Belum ada riwayat pembelian.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

