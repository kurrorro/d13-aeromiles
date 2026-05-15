'use client';

import { useState, useEffect, useCallback } from 'react';

interface Transaksi {
  tipe: string;
  nama_member: string;
  email_member: string;
  miles: number;
  timestamp: string;
  ref_1: string;
  ref_2: string;
  ref_ts: string;
}

interface Stats {
  total_miles_beredar: number;
  redeem_bulan_ini: number;
  total_klaim_disetujui: number;
}

interface TopMember {
  peringkat?: number;
  email: string;
  nama: string;
  nama_lengkap?: string;
  total_miles: number;
  frekuensi?: number;
}

export default function LaporanPage() {
  const [filterTipe, setFilterTipe] = useState('');
  const [searchMember, setSearchMember] = useState('');
  const [filterDari, setFilterDari] = useState('');
  const [filterSampai, setFilterSampai] = useState('');
  const [topTab, setTopTab] = useState<'miles' | 'transfer' | 'redeem'>('miles');
  
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [topMembers, setTopMembers] = useState<TopMember[]>([]);
  const [noticeMessage, setNoticeMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterTipe) params.append('tipe', filterTipe);
      if (searchMember) params.append('email', searchMember);
      if (filterDari) params.append('startDate', filterDari);
      if (filterSampai) params.append('endDate', filterSampai);

      const res = await fetch(`/api/staf/laporan/transactions?${params.toString()}`);
      const data = await res.json();
      setTransaksiList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  }, [filterTipe, searchMember, filterDari, filterSampai]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/staf/laporan/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchTopMembers = useCallback(async () => {
    try {
      const res = await fetch(`/api/staf/laporan/top?category=${topTab}`);
      const result = await res.json();
      setTopMembers(result.data || []);
      if (topTab === 'miles' && result.message) {
        setNoticeMessage(result.message);
      } else {
        setNoticeMessage('');
      }
    } catch (error) {
      console.error('Failed to fetch top members:', error);
    }
  }, [topTab]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchTransactions(), fetchStats(), fetchTopMembers()]);
      setLoading(false);
    };
    init();
  }, [fetchTransactions, fetchTopMembers]);

  const handleDelete = async (t: Transaksi) => {
    if (t.tipe === 'Klaim Disetujui') {
      alert('Transaksi Klaim Disetujui tidak dapat dihapus!');
      return;
    }
    
    if (confirm(`Hapus permanen transaksi ${t.tipe} untuk member ${t.email_member}?`)) {
      try {
        const res = await fetch('/api/staf/laporan/transaction', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipe: t.tipe,
            email: t.email_member,
            ref_1: t.ref_1,
            ref_2: t.ref_2,
            timestamp: t.ref_ts
          })
        });
        
        const result = await res.json();
        if (result.success) {
          alert(result.message);
          fetchTransactions();
          fetchStats(); // Stats might change
        } else {
          alert('Gagal menghapus: ' + result.error);
        }
      } catch (error) {
        alert('Terjadi kesalahan saat menghapus transaksi.');
      }
    }
  };

  if (loading && transaksiList.length === 0) {
    return <div className="flex justify-center items-center min-h-screen text-title font-bold">Memuat Data Laporan...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans text-title">
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[var(--color-border-light)] p-6 md:p-10">
      
      <div className="mb-10 border-b border-[var(--color-border-light)] pb-5">
        <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Laporan & Riwayat Transaksi</h1>
        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Pantau perputaran miles dalam sistem AeroMiles</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border-l-4 border-secondary rounded-lg p-6 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Total Miles Beredar</p>
          <p className="text-3xl font-bold text-title">{stats?.total_miles_beredar?.toLocaleString('id-ID') || 0}</p>
        </div>
        <div className="bg-white border-l-4 border-secondary rounded-lg p-6 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Total Redeem Bulan Ini</p>
          <p className="text-3xl font-bold text-title">{stats?.redeem_bulan_ini?.toLocaleString('id-ID') || 0}</p>
        </div>
        <div className="bg-white border-l-4 border-secondary rounded-lg p-6 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Total Klaim Disetujui</p>
          <p className="text-3xl font-bold text-title">{stats?.total_klaim_disetujui?.toLocaleString('id-ID') || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-3 mb-4">
            <input 
              type="text" 
              placeholder="Cari Email Member..."
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              className="flex-1 min-w-[160px] px-4 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-secondary bg-white"
            />
            <select 
              value={filterTipe}
              onChange={(e) => setFilterTipe(e.target.value)}
              className="px-4 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-secondary bg-white text-title"
            >
              <option value="">Semua Tipe</option>
              <option value="Klaim Disetujui">Klaim</option>
              <option value="Redeem">Redeem</option>
              <option value="Pembelian Package">Package</option>
              <option value="Transfer">Transfer</option>
            </select>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filterDari}
                onChange={(e) => setFilterDari(e.target.value)}
                className="px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-secondary bg-white text-title"
                title="Dari tanggal"
              />
              <span className="text-xs text-text-muted font-medium">s.d.</span>
              <input
                type="date"
                value={filterSampai}
                onChange={(e) => setFilterSampai(e.target.value)}
                className="px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-secondary bg-white text-title"
                title="Sampai tanggal"
              />
            </div>
            {(filterDari || filterSampai || filterTipe || searchMember) && (
              <button
                onClick={() => { setFilterDari(''); setFilterSampai(''); setFilterTipe(''); setSearchMember(''); }}
                className="px-3 py-2 text-xs font-semibold text-[var(--color-text-muted)] border border-border-light rounded-lg hover:bg-bg-subtle transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          <div className="bg-white rounded-lg border border-border-light overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-border-light bg-bg-subtle">
                  <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Tipe Transaksi</th>
                  <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Member</th>
                  <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Jumlah</th>
                  <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Waktu</th>
                  <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {transaksiList.map((t, idx) => (
                  <tr key={`${t.ref_ts}-${idx}`} className="hover:bg-bg-subtle transition-colors">
                    <td className="py-4 px-4 text-sm font-semibold text-title">{t.tipe}</td>
                    <td className="py-4 px-4">
                      <p className="text-[11px] font-bold text-title">{t.nama_member}</p>
                      <p className="text-[10px] text-text-muted">{t.email_member}</p>
                    </td>
                    <td className={`py-4 px-4 text-right text-sm font-bold ${t.miles > 0 ? 'text-secondary' : 'text-danger'}`}>
                      {t.miles > 0 ? '+' : ''}{t.miles.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-4 text-[11px] text-text-muted">{new Date(t.timestamp).toLocaleString('id-ID')}</td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        onClick={() => handleDelete(t)}
                        disabled={t.tipe === 'Klaim Disetujui'}
                        className={t.tipe === 'Klaim Disetujui' ? 'text-[var(--color-border-light)] cursor-not-allowed' : 'text-[var(--color-danger)] hover:opacity-70 transition-opacity'}
                        title="Hapus"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {transaksiList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-text-muted text-sm italic">Tidak ada transaksi yang ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-lg border border-border-light overflow-hidden">
          <div className="p-5 border-b border-border-light bg-bg-subtle">
            <h2 className="text-sm font-bold tracking-wider uppercase text-title">Top Member</h2>
          </div>
          
          <div className="flex border-b border-border-light text-[10px] font-bold text-text-muted uppercase tracking-widest">
            <button onClick={() => setTopTab('miles')} className={`flex-1 py-4 transition-colors cursor-pointer ${topTab === 'miles' ? 'text-secondary border-b-2 border-secondary bg-white' : 'hover:text-title hover:bg-bg-subtle'}`}>Miles</button>
            <button onClick={() => setTopTab('transfer')} className={`flex-1 py-4 transition-colors cursor-pointer ${topTab === 'transfer' ? 'text-secondary border-b-2 border-secondary bg-white' : 'hover:text-title hover:bg-bg-subtle'}`}>Transfer</button>
            <button onClick={() => setTopTab('redeem')} className={`flex-1 py-4 transition-colors cursor-pointer ${topTab === 'redeem' ? 'text-secondary border-b-2 border-secondary bg-white' : 'hover:text-title hover:bg-bg-subtle'}`}>Redeem</button>
          </div>

          <div className="p-5 flex flex-col gap-4">
            {topTab === 'miles' && noticeMessage && (
              <div className="bg-secondary/5 border border-secondary/20 rounded p-3 mb-2">
                <p className="text-[10px] text-secondary font-bold leading-relaxed">{noticeMessage}</p>
              </div>
            )}

            {topMembers.map((m, idx) => (
              <div key={m.email} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-border-light w-4 group-hover:text-secondary transition-colors">{idx + 1}</span>
                  <div>
                    <p className="text-sm font-bold text-title">{m.nama || m.nama_lengkap}</p>
                    <p className="text-[10px] text-text-muted font-mono">{m.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${topTab === 'miles' ? 'text-secondary' : 'text-title'}`}>
                    {topTab === 'miles' ? m.total_miles?.toLocaleString('id-ID') : `${m.frekuensi}x`}
                  </p>
                  {topTab !== 'miles' && m.total_miles > 0 && (
                     <p className="text-[9px] font-bold text-text-muted uppercase tracking-tight">{m.total_miles?.toLocaleString('id-ID')} MILES</p>
                  )}
                </div>
              </div>
            ))}
            {topMembers.length === 0 && (
              <p className="text-center text-text-muted text-xs italic py-4">Belum ada data.</p>
            )}
          </div>
        </div>

      </div>

      </div>
    </div>
  );
}

