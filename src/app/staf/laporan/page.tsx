'use client';

import { useState } from 'react';
import { 
  DUMMY_LAPORAN_STATISTIK, 
  DUMMY_TRANSAKSI, 
  DUMMY_TOP_MEMBER_MILES,
  DUMMY_TOP_MEMBER_TRANSFER,
  DUMMY_TOP_MEMBER_REDEEM
} from '@/dummy/laporan';

export default function LaporanPage() {
  const [filterTipe, setFilterTipe] = useState('');
  const [searchMember, setSearchMember] = useState('');
  const [filterDari, setFilterDari] = useState('');
  const [filterSampai, setFilterSampai] = useState('');
  const [topTab, setTopTab] = useState<'miles' | 'transfer' | 'redeem'>('miles');
  const [transaksiList, setTransaksiList] = useState(DUMMY_TRANSAKSI);

  const handleDelete = (id: string, tipe: string) => {
    if (tipe === 'Klaim Disetujui') {
      alert('Transaksi Klaim Disetujui tidak dapat dihapus!');
      return;
    }
    if (confirm(`Hapus permanen transaksi ${id}?`)) {
      setTransaksiList(transaksiList.filter(t => t.id !== id));
    }
  };

  const filteredTransaksi = transaksiList.filter(t => {
    const matchTipe = filterTipe === '' || t.tipe.toLowerCase().includes(filterTipe.toLowerCase());
    const matchMember = searchMember === '' || t.member.toLowerCase().includes(searchMember.toLowerCase());
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
          <p className="text-3xl font-bold text-title">{DUMMY_LAPORAN_STATISTIK.totalMilesBeredar.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white border-l-4 border-secondary rounded-lg p-6 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Total Redeem Bulan Ini</p>
          <p className="text-3xl font-bold text-title">{DUMMY_LAPORAN_STATISTIK.totalRedeemBulanIni.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white border-l-4 border-secondary rounded-lg p-6 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Total Klaim Disetujui</p>
          <p className="text-3xl font-bold text-title">{DUMMY_LAPORAN_STATISTIK.totalKlaimDisetujui.toLocaleString('id-ID')}</p>
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
                {filteredTransaksi.map(t => (
                  <tr key={t.id} className="hover:bg-bg-subtle transition-colors">
                    <td className="py-4 px-4 text-sm font-semibold text-title">{t.tipe}</td>
                    <td className="py-4 px-4 text-xs text-text-muted">{t.member}</td>
                    <td className={`py-4 px-4 text-right text-sm font-bold ${t.jumlah > 0 ? 'text-secondary' : 'text-danger'}`}>
                      {t.jumlah > 0 ? '+' : ''}{t.jumlah.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-4 text-[11px] text-text-muted">{t.timestamp}</td>
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
            <h2 className="text-sm font-bold tracking-wider uppercase text-title">Top Member</h2>
          </div>
          
          <div className="flex border-b border-border-light text-xs font-semibold text-text-muted">
            <button onClick={() => setTopTab('miles')} className={`flex-1 py-3 transition-colors cursor-pointer ${topTab === 'miles' ? 'text-primary border-b-2 border-secondary' : 'hover:text-primary'}`}>Total Miles</button>
            <button onClick={() => setTopTab('transfer')} className={`flex-1 py-3 transition-colors cursor-pointer ${topTab === 'transfer' ? 'text-primary border-b-2 border-secondary' : 'hover:text-primary'}`}>Transfer</button>
            <button onClick={() => setTopTab('redeem')} className={`flex-1 py-3 transition-colors cursor-pointer ${topTab === 'redeem' ? 'text-primary border-b-2 border-secondary' : 'hover:text-primary'}`}>Redeem</button>
          </div>

          <div className="p-5 flex flex-col gap-4">
            {topTab === 'miles' && DUMMY_TOP_MEMBER_MILES.map(m => (
              <div key={m.nomor_member} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-border-light w-4">{m.peringkat}</span>
                  <div>
                    <p className="text-sm font-bold text-title">{m.nama}</p>
                    <p className="text-[10px] text-text-muted font-mono">{m.nomor_member}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-secondary">{m.total_miles.toLocaleString('id-ID')}</p>
              </div>
            ))}

            {topTab === 'transfer' && DUMMY_TOP_MEMBER_TRANSFER.map(m => (
              <div key={m.nomor_member} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-border-light w-4">{m.peringkat}</span>
                  <div>
                    <p className="text-sm font-bold text-title">{m.nama}</p>
                    <p className="text-[10px] text-text-muted font-mono">{m.nomor_member}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-title">{m.frekuensi}x</p>
              </div>
            ))}

            {topTab === 'redeem' && DUMMY_TOP_MEMBER_REDEEM.map(m => (
              <div key={m.nomor_member} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-border-light w-4">{m.peringkat}</span>
                  <div>
                    <p className="text-sm font-bold text-title">{m.nama}</p>
                    <p className="text-[10px] text-text-muted font-mono">{m.nomor_member}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-title">{m.frekuensi}x</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      </div>
    </div>
  );
}

