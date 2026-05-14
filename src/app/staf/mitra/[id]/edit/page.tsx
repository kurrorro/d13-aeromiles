'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function EditMitra() {
  const router = useRouter();
  const params = useParams();
  const emailId = decodeURIComponent(params.id as string);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama_mitra: '',
    tanggal_kerja_sama: '',
    id_penyedia: 0
  });

  useEffect(() => {
    fetch(`/api/staf/mitra/${encodeURIComponent(emailId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setFormData({
          nama_mitra: data.nama_mitra || '',
          tanggal_kerja_sama: data.tanggal_kerja_sama || '',
          id_penyedia: data.id_penyedia || 0
        });
      })
      .catch(err => {
        console.error('Error fetching partner detail:', err);
        alert('Gagal memuat data mitra');
      });
  }, [emailId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/staf/mitra/${encodeURIComponent(emailId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        router.push('/staf/mitra');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Gagal memperbarui mitra');
    } finally {
      setIsSubmitting(false);
    }
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
        <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Edit Informasi Mitra</h1>
        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Perbarui data kerja sama dengan mitra penyedia</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[var(--color-border-light)] shadow-sm p-8 space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5 opacity-60">Email Mitra (Kunci)</label>
            <p className="w-full border-b border-transparent py-2 text-xs font-mono font-bold text-[var(--color-title)] bg-[var(--color-bg-subtle)] px-2 rounded">
              {emailId}
            </p>
          </div>
          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5 opacity-60">ID Penyedia (Kunci)</label>
            <p className="w-full border-b border-transparent py-2 text-xs font-mono font-bold text-[var(--color-primary)] bg-[var(--color-bg-subtle)] px-2 rounded">
              #{formData.id_penyedia}
            </p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Nama Mitra</label>
          <input
            type="text"
            required
            value={formData.nama_mitra}
            onChange={(e) => setFormData({ ...formData, nama_mitra: e.target.value })}
            className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium transition-colors"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Tanggal Kerja Sama</label>
          <input
            type="date"
            required
            value={formData.tanggal_kerja_sama}
            onChange={(e) => setFormData({ ...formData, tanggal_kerja_sama: e.target.value })}
            className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium bg-transparent transition-colors"
          />
        </div>

        <div className="pt-4 flex gap-4">
          <Link
            href="/staf/mitra"
            className="flex-1 border border-[var(--color-border-light)] text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest text-center py-3 rounded-lg hover:bg-[var(--color-bg-subtle)] transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] bg-[var(--color-primary)] text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
