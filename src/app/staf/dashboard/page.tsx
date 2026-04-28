'use client';
import { useSession } from 'next-auth/react';
import { STAFF_STATS } from '@/dummy/dashboard';

export default function StaffDashboard() {
  const { data: session } = useSession();

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-8 font-sans bg-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Panel Kerja Staf</h1>
      </header>

      <section className="mb-10">
        <h2 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-3">Informasi Petugas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4 border-t border-[var(--color-border-light)] pt-4">
          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block">ID Staf</label>
            <p className="text-xs font-mono font-bold text-[var(--color-title)]">S-99081</p>
          </div>
          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block">Nama Lengkap</label>
            <p className="text-xs font-medium text-[var(--color-title)]">Mr. {session?.user?.name}</p>
          </div>
          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block">Email</label>
            <p className="text-xs font-medium text-[var(--color-title)] truncate">{session?.user?.email}</p>
          </div>
          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block">Nomor HP</label>
            <p className="text-xs font-medium text-[var(--color-title)]">+62 812-9988-776</p>
          </div>
          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block">Kewarganegaraan</label>
            <p className="text-xs font-medium text-[var(--color-title)]">Indonesia</p>
          </div>
          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block">Tanggal Lahir</label>
            <p className="text-xs font-medium text-[var(--color-title)]">1995-10-20</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-3">Statistik Klaim Miles</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 border-y border-[var(--color-border-light)] py-3 divide-x divide-[var(--color-border-light)]">
          <div className="px-2">
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block">Maskapai</label>
            <p className="text-xs font-bold text-[var(--color-primary)] uppercase truncate">GA - Garuda Indonesia</p>
          </div>
          <div className="px-4">
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block">Antrean Global</label>
            <p className="text-base font-bold text-[var(--color-warning)]">{STAFF_STATS.totalPendingAllStaff} <span className="text-[8px] opacity-60">Wait</span></p>
          </div>
          <div className="px-4">
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block">Disetujui (Anda)</label>
            <p className="text-base font-bold text-[var(--color-primary)]">{STAFF_STATS.myApproved}</p>
          </div>
          <div className="px-4">
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block">Ditolak (Anda)</label>
            <p className="text-base font-bold text-[var(--color-danger)]">{STAFF_STATS.myRejected}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-3">Navigasi Operasional</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-between p-3.5 border border-[var(--color-border-light)] rounded hover:bg-[var(--color-bg-subtle)] transition-all">
            <span className="text-[11px] font-bold text-[var(--color-title)] uppercase tracking-tight">Kelola Missing Miles</span>
            <span className="text-[11px] text-[var(--color-primary)]">→</span>
          </button>
          <button className="flex items-center justify-between p-3.5 border border-[var(--color-border-light)] rounded hover:bg-[var(--color-bg-subtle)] transition-all">
            <span className="text-[11px] font-bold text-[var(--color-title)] uppercase tracking-tight">Database Member</span>
            <span className="text-[11px] text-[var(--color-primary)]">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}