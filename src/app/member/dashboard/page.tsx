'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function MemberDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard/member');
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!data) return <div className="p-8 text-red-500">Error loading dashboard</div>;

  const { profile, transactions } = data;

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 font-sans">
      {/* Header Welcome Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-3xl p-10 md:p-14 text-white shadow-2xl shadow-primary/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl" />
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Halo, {profile.salutation} {profile.first_mid_name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
                ID: {profile.nomor_member}
              </span>
              <span className="text-sm font-medium border-l border-white/30 pl-4">
                Bergabung sejak {new Date(profile.tanggal_bergabung).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 text-center min-w-[120px]">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Tier</p>
              <p className="text-3xl font-black">{profile.tier_name}</p>
            </div>
            <div className="flex-1 md:flex-none bg-white/95 p-6 rounded-3xl text-center min-w-[150px] shadow-lg">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-[var(--text-muted)]">Award Miles</p>
              <p className="text-3xl font-black text-[var(--primary)]">{profile.award_miles.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-[var(--border-light)] p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--primary)]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Total Miles Akumulasi</p>
          </div>
          <p className="text-4xl font-black text-[var(--title)] tracking-tight">{profile.total_miles.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Transaction Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-[var(--title)] tracking-tight">5 Transaksi Terakhir</h2>
          <div className="h-px flex-1 bg-[var(--border-light)] mx-6 hidden md:block" />
        </div>

        <div className="bg-white rounded-2xl border border-[var(--border-light)] shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-[var(--border-light)]">
            <thead className="bg-[var(--bg-subtle)]">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Tanggal</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Tipe</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Keterangan</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {transactions.length > 0 ? transactions.map((t: any, i: number) => (
                <tr key={i} className="hover:bg-[var(--bg-subtle)]/50 transition-colors group">
                  <td className="px-8 py-5 whitespace-nowrap text-xs font-medium text-[var(--title)]">
                    {new Date(t.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      t.tipe.toLowerCase().includes('out') || t.tipe.toLowerCase().includes('redeem') || t.amount < 0
                      ? 'bg-[var(--danger-light)] text-[var(--danger)]' 
                      : 'bg-[var(--success-light)] text-[var(--success)]'
                    }`}>
                      {t.tipe}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-[var(--title)] opacity-80">{t.keterangan}</td>
                  <td className={`px-8 py-5 whitespace-nowrap text-base text-right font-black ${
                    t.amount < 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]'
                  }`}>
                    {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('id-ID')}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-[var(--text-muted)] font-bold italic">
                    Belum ada transaksi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
