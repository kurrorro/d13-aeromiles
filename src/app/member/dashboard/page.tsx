'use client';
import { useSession } from 'next-auth/react';
import { RECENT_TRANSACTIONS } from '@/dummy/dashboard';

export default function MemberDashboard() {
  const { data: session } = useSession();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans text-title">
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[var(--color-border-light)] p-6 md:p-10">
        <header className="mb-10">
        <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">
          Halo, {session?.user?.name}
        </h1>
      </header>

      <section className="mb-12">
        <h2 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-4">Identitas Member</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 border-t border-[var(--color-border-light)] pt-5">
          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Nomor Member</label>
            <p className="text-xs font-mono font-bold text-[var(--color-title)]">M-20240001</p>
          </div>
          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Email</label>
            <p className="text-xs font-medium text-[var(--color-title)] truncate">{session?.user?.email}</p>
          </div>
          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Telepon</label>
            <p className="text-xs font-medium text-[var(--color-title)]">+62 812-3456-789</p>
          </div>
          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Kewarganegaraan</label>
            <p className="text-xs font-medium text-[var(--color-title)]">Indonesia</p>
          </div>
          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Tanggal Lahir</label>
            <p className="text-xs font-medium text-[var(--color-title)]">2004-05-12</p>
          </div>
          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Join Date</label>
            <p className="text-xs font-medium text-[var(--color-title)]">2026-01-01</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-4">Status & Saldo Miles</h2>
        <div className="grid grid-cols-3 border-y border-[var(--color-border-light)] py-4">
          <div className="border-r border-[var(--color-border-light)] px-2">
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Tier Saat Ini</label>
            <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-tighter">Blue Tier</p>
          </div>
          <div className="border-r border-[var(--color-border-light)] px-8">
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Total Miles</label>
            <p className="text-lg font-bold text-[var(--color-title)] tracking-tight">24,500</p>
          </div>
          <div className="px-8">
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Award Miles</label>
            <p className="text-lg font-bold text-[var(--color-primary)] tracking-tight">12,200</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-4">5 Transaksi Terakhir</h2>
        <div className="border-t border-[var(--color-border-light)] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {RECENT_TRANSACTIONS.map((t) => (
                <tr key={t.id} className="hover:bg-[var(--color-bg-subtle)] transition-colors group">
                  <td className="py-4 px-2 text-[10px] font-bold text-[var(--color-text-muted)] w-24">{t.tanggal}</td>
                  <td className="py-4 px-2">
                    <p className="text-xs font-bold text-[var(--color-title)]">{t.tipe}</p>
                    <p className="text-[9px] text-[var(--color-text-muted)] uppercase">{t.deskripsi}</p>
                  </td>
                  <td className={`py-4 px-2 text-xs font-bold text-right ${t.status === 'plus' ? 'text-[var(--color-primary)]' : 'text-[var(--color-danger)]'}`}>
                    {t.status === 'plus' ? '+' : ''}{t.jumlah.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      </div>
    </div>
  );
}
