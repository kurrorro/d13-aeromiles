'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

type TabType = 'semua' | 'dikirim' | 'diterima';

type Transfer = {
  email_member_1: string;
  nama_1: string;
  email_member_2: string;
  nama_2: string;
  timestamp: string;
  jumlah: number;
  catatan: string | null;
};

export default function TransferPage() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? '';

  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('semua');
  const [awardMiles, setAwardMiles] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch('/api/transfer').then(r => r.json()),
      fetch('/api/transfer/saldo').then(r => r.json()),
    ])
      .then(([transferData, saldoData]) => {
        setTransfers(Array.isArray(transferData) ? transferData : []);
        setAwardMiles(saldoData?.saldo ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const all      = transfers.filter(t => t.email_member_1 === email || t.email_member_2 === email);
  const sent     = transfers.filter(t => t.email_member_1 === email);
  const received = transfers.filter(t => t.email_member_2 === email);

  const displayList = activeTab === 'semua' ? all : activeTab === 'dikirim' ? sent : received;

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'semua',    label: 'Semua',    count: all.length },
    { key: 'dikirim',  label: 'Dikirim',  count: sent.length },
    { key: 'diterima', label: 'Diterima', count: received.length },
  ];

  const totalDikirim  = sent.reduce((sum, t) => sum + Number(t.jumlah), 0);
  const totalDiterima = received.reduce((sum, t) => sum + Number(t.jumlah), 0);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-title)] tracking-tight mb-1">Transfer Miles</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Riwayat transfer miles yang pernah dilakukan</p>
        </div>
        <Link href="/member/transfer/buat"
          className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--color-secondary)] transition-all shadow-sm">
          + Transfer Baru
        </Link>
      </div>

      {/* Balance & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border-light)] rounded-lg p-5 flex flex-col items-start">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Saldo Award Miles</p>
          <p className="text-2xl font-bold text-[var(--color-secondary)]">{awardMiles.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white border border-[var(--color-border-light)] rounded-lg p-5 border-l-4 border-l-[var(--color-danger)]">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Total Dikirim</p>
          <p className="text-xl font-bold text-[var(--color-danger)]">-{totalDikirim.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white border border-[var(--color-border-light)] rounded-lg p-5 border-l-4 border-l-[var(--color-secondary)]">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Total Diterima</p>
          <p className="text-xl font-bold text-[var(--color-secondary)]">+{totalDiterima.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-border-light)] mb-6">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`py-3 px-6 text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === tab.key
                ? 'border-b-2 border-[var(--color-secondary)] text-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
            }`}>
            {tab.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-[var(--color-secondary)] text-white' : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--color-border-light)] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-x-auto">
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-sm text-[var(--color-text-muted)] animate-pulse">Memuat riwayat transfer...</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="border-b border-[var(--color-border-light)] bg-[var(--color-bg-subtle)]">
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Timestamp</th>
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Tipe</th>
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Nama & Email</th>
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] text-right">Jumlah Miles</th>
                <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {displayList.length > 0 ? displayList.map((t, i) => {
                const isSender = t.email_member_1 === email;
                const counterpart = isSender
                  ? { nama: t.nama_2, email: t.email_member_2 }
                  : { nama: t.nama_1, email: t.email_member_1 };

                return (
                  <tr key={i} className="hover:bg-[var(--color-bg-subtle)] transition-colors">
                    <td className="py-4 px-6 text-xs text-[var(--color-text-muted)]">{String(t.timestamp).slice(0, 19).replace('T', ' ')}</td>
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        isSender
                          ? 'bg-[var(--color-danger-light)] text-[var(--color-danger)]'
                          : 'bg-[var(--color-success-light)] text-[var(--color-success)]'
                      }`}>
                        <span>{isSender ? '↑' : '↓'}</span>
                        {isSender ? 'Dikirim' : 'Diterima'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs font-semibold text-[var(--color-title)]">{counterpart.nama}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{counterpart.email}</p>
                    </td>
                    <td className={`py-4 px-6 text-right text-sm font-bold ${isSender ? 'text-[var(--color-danger)]' : 'text-[var(--color-secondary)]'}`}>
                      {isSender ? '-' : '+'}{Number(t.jumlah).toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-6 text-xs text-[var(--color-text-muted)] italic">{t.catatan || '—'}</td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <p className="text-sm font-medium text-[var(--color-text-muted)]">Tidak ada riwayat transfer.</p>
                    <Link href="/member/transfer/buat" className="text-xs text-[var(--color-secondary)] hover:underline mt-2 inline-block">
                      Buat transfer pertama Anda →
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
