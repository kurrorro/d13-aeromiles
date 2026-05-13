'use client';

import { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  tipe: string;
  nama_member: string;
  email_member: string;
  miles: number;
  timestamp: string;
}

interface TopMember {
  peringkat: number;
  email: string;
  nama_lengkap: string;
  total_miles: number;
}

export default function LaporanPage() {
  const [filterTipe, setFilterTipe] = useState('');
  const [searchMember, setSearchMember] = useState('');
  const [filterDari, setFilterDari] = useState('');
  const [filterSampai, setFilterSampai] = useState('');
  const [topTab, setTopTab] = useState<'miles' | 'transfer' | 'redeem'>('miles');
  
  const [stats, setStats] = useState({
    total_miles_beredar: 0,
    redeem_bulan_ini: 0,
    total_klaim_disetujui: 0
  });
  const [topMembers, setTopMembers] = useState<TopMember[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/staf/laporan');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setTopMembers(data.topMembers);
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, tipe: string) => {
    if (tipe === 'Klaim Disetujui') {
      alert('Transaksi Klaim Disetujui tidak dapat dihapus!');
      return;
    }
    if (!confirm(`Hapus permanen transaksi ini?`)) return;

    try {
      const res = await fetch('/api/staf/laporan', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchLaporan();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Gagal menghapus transaksi');
    }
  };

  const filteredTransaksi = transactions.filter(t => {
    const matchTipe = filterTipe === '' || t.tipe.toLowerCase().includes(filterTipe.toLowerCase());
    const matchMember = searchMember === '' || t.nama_member.toLowerCase().includes(searchMember.toLowerCase()) || t.email_member.toLowerCase().includes(searchMember.toLowerCase());
    const tDate = new Date(t.timestamp);
    const matchDari = filterDari === '' || tDate >= new Date(filterDari);
    const matchSampai = filterSampai === '' || tDate <= new Date(filterSampai + 'T23:59:59');
    return matchTipe && matchMember && matchDari && matchSampai;
  });

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
          <p className="text-3xl font-bold text-title">{stats.total_miles_beredar.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white border-l-4 border-secondary rounded-lg p-6 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Total Redeem Bulan Ini</p>
          <p className="text-3xl font-bold text-title">{stats.redeem_bulan_ini.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white border-l-4 border-secondary rounded-lg p-6 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Total Klaim Disetujui</p>
          <p className="text-3xl font-bold text-title">{stats.total_klaim_disetujui.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-3 mb-4">
            <input 
              type="text" 
              placeholder="Cari Member..."
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              className="flex-1 min-w-[160px] px-4 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-secondary bg-white"
            />
            <select 
              value={filterTipe}
              onChange={(e) => setFilterTipe(e.target.value)}
              className="px-4 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-secondary bg-white text-title"
            >
              <option value="">Semua Tipe Transaksi</option>
              <option value="Klaim">Klaim</option>
              <option value="Redeem">Redeem Hadiah</option>
              <option value="Package">Pembelian Package</option>
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
                {loading ? (
                    <tr><td colSpan={5} className="py-10 text-center text-xs text-text-muted">Memuat data...</td></tr>
                ) : filteredTransaksi.length === 0 ? (
                    <tr><td colSpan={5} className="py-10 text-center text-xs text-text-muted">Tidak ada transaksi ditemukan.</td></tr>
                ) : filteredTransaksi.map(t => (
                  <tr key={t.id} className="hover:bg-bg-subtle transition-colors">
                    <td className="py-4 px-4 text-sm font-semibold text-title">{t.tipe}</td>
                    <td className="py-4 px-4 text-xs text-text-muted">
                        <p className="font-bold">{t.nama_member}</p>
                        <p className="opacity-70">{t.email_member}</p>
                    </td>
                    <td className={`py-4 px-4 text-right text-sm font-bold ${t.miles > 0 ? 'text-secondary' : 'text-danger'}`}>
                      {t.miles > 0 ? '+' : ''}{t.miles.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-4 text-[11px] text-text-muted">{new Date(t.timestamp).toLocaleString('id-ID')}</td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        onClick={() => handleDelete(t.id, t.tipe)}
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
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-lg border border-border-light overflow-hidden">
          <div className="p-5 border-b border-border-light bg-bg-subtle">
            <h2 className="text-sm font-bold tracking-wider uppercase text-title">Top Member (Berdasarkan Total Miles)</h2>
          </div>
          
          <div className="p-5 flex flex-col gap-4">
            {loading ? (
                <p className="text-center text-xs text-text-muted">Memuat peringkat...</p>
            ) : topMembers.length === 0 ? (
                <p className="text-center text-xs text-text-muted">Belum ada data member.</p>
            ) : topMembers.map(m => (
              <div key={m.email} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-border-light w-4">{m.peringkat}</span>
                  <div>
                    <p className="text-sm font-bold text-title">{m.nama_lengkap}</p>
                    <p className="text-[10px] text-text-muted font-mono">{m.email}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-secondary">{m.total_miles.toLocaleString('id-ID')}</p>
              </div>
            ))}
            
            {!loading && topMembers.length > 0 && (
                <div className="mt-4 p-3 bg-bg-subtle rounded border border-border-light text-[10px] text-text-muted italic">
                    Data dihitung secara dinamis dari total akumulasi miles member.
                </div>
            )}
          </div>
        </div>

      </div>

      </div>
    </div>
  );
}
