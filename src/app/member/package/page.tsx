'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DUMMY_PACKAGES } from '@/dummy/package';
import { DUMMY_MEMBERS } from '@/dummy/member';

export default function PackagePage() {
  const { data: session } = useSession();
  const [awardMilesBalance, setAwardMilesBalance] = useState(0);

  useEffect(() => {
    const member = DUMMY_MEMBERS.find(m => m.email === session?.user?.email) || DUMMY_MEMBERS[0];
    setAwardMilesBalance(member.award_miles);
  }, [session]);
  
  const handleBeli = (pkg: any) => {
    const confirmMessage = `Apakah Anda yakin ingin membeli paket:\n${pkg.jumlah_award_miles.toLocaleString('id-ID')} Miles seharga Rp ${pkg.harga_paket.toLocaleString('id-ID')}?`;
    
    if (confirm(confirmMessage)) {
      setAwardMilesBalance(prev => prev + pkg.jumlah_award_miles);
      alert('Pembelian berhasil! Award Miles Anda telah ditambahkan.');
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

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {DUMMY_PACKAGES.map((pkg) => (
          <div key={pkg.id} className="bg-white border border-border-light rounded-lg p-6 flex flex-col justify-between hover:shadow-sm transition-shadow">
            <div>
              <p className="text-[10px] text-text-muted font-mono mb-4">{pkg.id}</p>
              <h3 className="text-3xl font-bold text-secondary mb-2">{pkg.jumlah_award_miles.toLocaleString('id-ID')}</h3>
              <p className="text-sm font-semibold text-title mb-6">Miles</p>
            </div>
            
            <div>
              <p className="text-xs text-text-muted mb-3">Harga Paket</p>
              <p className="text-lg font-bold text-title mb-5">Rp {pkg.harga_paket.toLocaleString('id-ID')}</p>
              
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
    </div>
  );
}

