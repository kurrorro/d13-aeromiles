'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DUMMY_HADIAH, DUMMY_REDEEM } from '@/dummy/hadiah';
import { DUMMY_MEMBERS } from '@/dummy/member';

export default function RedeemPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'katalog' | 'riwayat'>('katalog');
  const [awardMilesBalance, setAwardMilesBalance] = useState(0);
  const [riwayat, setRiwayat] = useState(DUMMY_REDEEM);

  useEffect(() => {
    const email = session?.user?.email;
    const member = DUMMY_MEMBERS.find(m => m.email === email) || DUMMY_MEMBERS[0];
    setAwardMilesBalance(member.award_miles);
    
    const myRiwayat = email ? DUMMY_REDEEM.filter(r => r.email_member === email) : DUMMY_REDEEM;
    setRiwayat(myRiwayat);
  }, [session]);

  const handleRedeem = (hadiah: any) => {
    if (awardMilesBalance < hadiah.miles) {
      alert(`Saldo tidak cukup! Anda butuh ${hadiah.miles.toLocaleString('id-ID')} miles.`);
      return;
    }

    const confirmMsg = `Konfirmasi Penukaran:\nHadiah: ${hadiah.nama}\nMiles Dipotong: ${hadiah.miles.toLocaleString('id-ID')}\nSisa Miles Nanti: ${(awardMilesBalance - hadiah.miles).toLocaleString('id-ID')}\nLanjutkan?`;
    
    if (confirm(confirmMsg)) {
      setAwardMilesBalance(prev => prev - hadiah.miles);
      setRiwayat([
        {
          email_member: session?.user?.email || 'unknown',
          kode_hadiah: hadiah.kode_hadiah,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        },
        ...riwayat
      ]);
      alert('Penukaran berhasil!');
    }
  };

  const getHadiahName = (kode: string) => {
    return DUMMY_HADIAH.find(h => h.kode_hadiah === kode)?.nama || kode;
  };

  const getHadiahMiles = (kode: string) => {
    return DUMMY_HADIAH.find(h => h.kode_hadiah === kode)?.miles || 0;
  };

  return (
    <div className="max-w-7xl mx-auto p-8 md:p-12 font-sans text-title">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-start mb-10 gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Redeem Hadiah</h1>
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

      {activeTab === 'katalog' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_HADIAH.map(h => {
            const isExpired = new Date(h.program_end) < new Date();
            if (isExpired) return null;

            return (
              <div key={h.kode_hadiah} className="bg-white border border-border-light rounded-lg p-6 flex flex-col hover:shadow-sm transition-shadow">
                <div className="mb-4">
                  <p className="text-[10px] text-text-muted font-mono mb-2">{h.kode_hadiah}</p>
                  <h3 className="text-lg font-bold text-title leading-tight mb-2">{h.nama}</h3>
                  <p className="text-xs text-text-muted">Penyedia ID: {h.id_penyedia}</p>
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
            );
          })}
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
                  <td className="py-4 px-6 text-xs text-text-muted">{r.timestamp}</td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-semibold text-title">{getHadiahName(r.kode_hadiah)}</p>
                    <p className="text-[10px] text-text-muted font-mono">{r.kode_hadiah}</p>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-danger">
                    -{getHadiahMiles(r.kode_hadiah).toLocaleString('id-ID')}
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
