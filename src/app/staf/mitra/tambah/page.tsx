'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function TambahMitra() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/staf/mitra');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/staf/mitra" className="inline-flex items-center gap-2 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Daftar
      </Link>

      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Daftarkan Mitra Baru</h1>
        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Sistem akan otomatis membuat profil Penyedia baru</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[var(--color-border-light)] shadow-sm p-8 space-y-8">
        <div>
          <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Email Mitra</label>
          <input 
            type="email" 
            required
            placeholder="partner@example.com"
            className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium transition-colors"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Nama Mitra</label>
          <input 
            type="text" 
            required
            placeholder="Contoh: Hotel Indonesia Kempinski"
            className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium transition-colors"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Tanggal Kerja Sama</label>
          <input 
            type="date" 
            required
            className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium bg-transparent transition-colors"
          />
        </div>

        <div className="bg-[var(--color-bg-subtle)] p-4 rounded-lg border border-[var(--color-border-light)]">
          <div className="flex gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-secondary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider mb-1">Informasi Otomatis</p>
              <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
                ID Penyedia akan digenerate otomatis oleh sistem dan dikaitkan secara permanen dengan mitra ini.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Mendaftarkan...' : 'Daftarkan Mitra'}
          </button>
        </div>
      </form>
    </div>
  );
}

