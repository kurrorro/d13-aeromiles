'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function EditHadiah() {
  const router = useRouter();
  const params = useParams();
  const kodeId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [penyediaList, setPenyediaList] = useState<{id_penyedia: number, nama: string, jenis: string}[]>([]);
  const [formData, setFormData] = useState({
    nama: '',
    id_penyedia: '',
    miles: 0,
    deskripsi: '',
    valid_start_date: '',
    program_end: ''
  });

  useEffect(() => {
    // Fetch current data
    fetch(`/api/staf/hadiah/${kodeId}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          nama: data.nama || '',
          id_penyedia: data.id_penyedia?.toString() || '',
          miles: data.miles || 0,
          deskripsi: data.deskripsi || '',
          valid_start_date: data.valid_start_date ? new Date(data.valid_start_date).toISOString().split('T')[0] : '',
          program_end: data.program_end ? new Date(data.program_end).toISOString().split('T')[0] : ''
        });
      })
      .catch(err => console.error('Error fetching reward detail:', err));

    // Fetch providers for dropdown
    fetch('/api/staf/penyedia')
      .then(res => res.json())
      .then(data => setPenyediaList(data))
      .catch(err => console.error('Error fetching providers:', err));
  }, [kodeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/staf/hadiah/${kodeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        router.push('/staf/hadiah');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Gagal memperbarui hadiah');
    } finally {
      setIsSubmitting(false);
    }
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
        <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Edit Detail Hadiah</h1>
        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Perbarui informasi reward atau perpanjang periode validitas</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[var(--color-border-light)] shadow-sm p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-1">
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5 opacity-60">Kode Hadiah (Kunci)</label>
            <p className="w-full border-b border-transparent py-2 text-xs font-mono font-bold text-[var(--color-primary)] bg-[var(--color-bg-subtle)] px-2 rounded">
              {kodeId}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Nama Reward</label>
            <input 
              type="text" 
              required
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
              className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium transition-colors"
            />
          </div>

          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Penyedia</label>
            <select 
              required 
              value={formData.id_penyedia}
              onChange={(e) => setFormData({...formData, id_penyedia: e.target.value})}
              className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none bg-transparent font-medium transition-colors"
            >
              <option value="">Pilih Penyedia...</option>
              {penyediaList.map(p => (
                <option key={p.id_penyedia} value={p.id_penyedia}>{p.nama}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Harga Miles</label>
            <input 
              type="number" 
              required
              value={formData.miles}
              onChange={(e) => setFormData({...formData, miles: parseInt(e.target.value) || 0})}
              className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-bold text-[var(--color-secondary)] transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Deskripsi Hadiah</label>
            <textarea 
              rows={3}
              value={formData.deskripsi}
              onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
              className="w-full border border-[var(--color-border-light)] rounded-lg p-3 text-xs focus:border-[var(--color-secondary)] outline-none font-medium transition-colors resize-none"
            ></textarea>
          </div>

          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Valid Start Date</label>
            <input 
              type="date" 
              required
              value={formData.valid_start_date}
              onChange={(e) => setFormData({...formData, valid_start_date: e.target.value})}
              className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium bg-transparent transition-colors"
            />
          </div>

          <div>
            <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1.5">Program End</label>
            <input 
              type="date" 
              required
              value={formData.program_end}
              onChange={(e) => setFormData({...formData, program_end: e.target.value})}
              className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium bg-transparent transition-colors"
            />
          </div>
        </div>

        <div className="pt-6 flex gap-4">
          <Link 
            href="/staf/hadiah"
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
