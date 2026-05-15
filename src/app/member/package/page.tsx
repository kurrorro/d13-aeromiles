'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ToastProvider';

export default function PackagePage() {
  const { data: session } = useSession();
  const { showToast, showConfirm } = useToast();
  const [packages, setPackages] = useState<any[]>([]);
  const [awardMilesBalance, setAwardMilesBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Packages
      const pkgRes = await fetch('/api/member/package');
      const pkgData = await pkgRes.json();
      if (pkgRes.ok) setPackages(pkgData);

      // Fetch Profile for Balance
      const profileRes = await fetch('/api/dashboard/member');
      const profileData = await profileRes.json();
      if (profileRes.ok) setAwardMilesBalance(profileData.profile.award_miles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchData();
  }, [session]);
  
  const handleBeli = async (pkg: any) => {
    const confirmed = await showConfirm({
      title: 'Konfirmasi Beli Paket',
      message: `Beli ${pkg.jumlah_award_miles.toLocaleString('id-ID')} Miles seharga Rp ${Number(pkg.harga_paket).toLocaleString('id-ID')}?`,
      confirmText: 'Beli Sekarang',
      type: 'success'
    });
    
    if (confirmed) {
      setIsBuying(true);
      try {
        const res = await fetch('/api/member/package', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_award_miles_package: pkg.id })
        });
        const data = await res.json();
        
        if (!res.ok) {
          showToast(data.message || 'Gagal membeli package', 'error');
          return;
        }

        showToast(data.message, 'success');
        fetchData(); // Refresh balance and data
      } catch (err) {
        showToast('Terjadi kesalahan jaringan.', 'error');
      } finally {
        setIsBuying(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center">
        <p className="text-sm text-text-muted animate-pulse font-bold tracking-widest">MEMUAT PAKET MILES...</p>
      </div>
    );
  }

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
                disabled={isBuying}
                className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary transition-colors disabled:opacity-50"
              >
                {isBuying ? 'Memproses...' : 'Beli Sekarang'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

