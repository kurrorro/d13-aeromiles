'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function TambahHadiah() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/staf/hadiah');
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/staf/hadiah" className="inline-flex items-center gap-2 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Katalog
      </Link>

      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Buat Hadiah Baru</h1>
        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Daftarkan item reward baru ke dalam katalog AeroMiles</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[var(--color-border-light)] shadow-sm p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Nama Reward</label>
            <input 
              type="text" 
              required
              placeholder="Contoh: Voucher Diskon Hotel 50%"
              className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium transition-colors"
            />
          </div>

          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Penyedia</label>
            <select required className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none bg-transparent font-medium transition-colors">
              <option value="">Pilih Penyedia...</option>
              <optgroup label="Maskapai">
                <option>Garuda Indonesia</option>
                <option>Lion Air</option>
                <option>Citilink</option>
              </optgroup>
              <optgroup label="Mitra">
                <option>Hotel Santika</option>
                <option>Grand Hyatt Jakarta</option>
                <option>Restoran Padang Sederhana</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Harga Miles</label>
            <input 
              type="number" 
              required
              placeholder="0"
              className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-bold text-[var(--color-secondary)] transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Deskripsi Hadiah</label>
            <textarea 
              rows={3}
              placeholder="Jelaskan detail hadiah dan cara penukarannya..."
              className="w-full border border-[var(--color-border-light)] rounded-lg p-3 text-xs focus:border-[var(--color-secondary)] outline-none font-medium transition-colors resize-none"
            ></textarea>
          </div>

          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Valid Start Date</label>
            <input 
              type="date" 
              required
              className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium bg-transparent transition-colors"
            />
          </div>

          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Program End</label>
            <input 
              type="date" 
              required
              className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium bg-transparent transition-colors"
            />
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Memproses...' : 'Simpan Hadiah Baru'}
          </button>
        </div>
      </form>
    </div>
  );
}

