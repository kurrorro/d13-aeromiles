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
    return matchTipe && matchMember;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans text-title">
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[var(--color-border-light)] p-6 md:p-10">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">Laporan & Riwayat Transaksi</h1>
        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Pantau perputaran miles dalam sistem AeroMiles</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-bg-subtle border-l-4 border-primary rounded-lg p-6">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Total Miles Beredar</p>
          <p className="text-3xl font-bold text-title">{DUMMY_LAPORAN_STATISTIK.totalMilesBeredar.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-bg-subtle border-l-4 border-primary rounded-lg p-6">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Total Redeem Bulan Ini</p>
          <p className="text-3xl font-bold text-title">{DUMMY_LAPORAN_STATISTIK.totalRedeemBulanIni.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-bg-subtle border-l-4 border-primary rounded-lg p-6">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Total Klaim Disetujui</p>
          <p className="text-3xl font-bold text-title">{DUMMY_LAPORAN_STATISTIK.totalKlaimDisetujui.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input 
              type="text" 
              placeholder="Cari Member..."
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              className="flex-1 px-4 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-secondary bg-white"
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
          </div>

          <div className="border-t border-border-light pt-5 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
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
                        className={`text-sm font-medium ${t.tipe === 'Klaim Disetujui' ? 'text-border-light cursor-not-allowed' : 'text-danger hover:underline'}`}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-border-light overflow-hidden">
          <div className="p-5 border-b border-border-light bg-bg-subtle">
            <h2 className="text-sm font-bold tracking-wider uppercase text-title">Top Member</h2>
          </div>
          
          <div className="flex border-b border-border-light text-xs font-semibold text-text-muted">
            <button onClick={() => setTopTab('miles')} className={`flex-1 py-3 transition-colors ${topTab === 'miles' ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}>Total Miles</button>
            <button onClick={() => setTopTab('transfer')} className={`flex-1 py-3 transition-colors ${topTab === 'transfer' ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}>Transfer</button>
            <button onClick={() => setTopTab('redeem')} className={`flex-1 py-3 transition-colors ${topTab === 'redeem' ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}>Redeem</button>
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
