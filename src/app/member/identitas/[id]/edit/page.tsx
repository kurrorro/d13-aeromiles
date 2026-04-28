'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { DUMMY_IDENTITAS } from '@/dummy/identitas';

export default function EditIdentitasPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const dokumen = DUMMY_IDENTITAS.find(d => d.nomor_dokumen === params.id);
    if (dokumen) setFormData(dokumen);
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pembaruan data identitas berhasil disimpan!');
    router.push('/member/identitas');
  };

  if (!formData) return <div className="p-20 text-center text-sm font-medium">Memuat data dokumen...</div>;

  return (
    <div className="min-h-screen bg-bg-subtle p-6 md:p-12 font-sans text-title">
      <div className="max-w-2xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <nav className="text-[10px] uppercase tracking-widest text-text-muted mb-2">
              Identitas / Edit Data
            </nav>
            <h1 className="text-2xl font-bold text-primary">Perbarui Dokumen</h1>
          </div>
          <Link href="/member/identitas" className="w-fit px-5 py-2 text-sm font-semibold border border-border-light rounded-lg hover:bg-white transition-all text-center">
            Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-border-light rounded-xl p-6 md:p-10 shadow-sm space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Nomor Dokumen (Terkunci)</label>
                <div className="bg-bg-subtle px-4 py-2.5 rounded-lg text-sm font-mono text-text-muted border border-border-light">
                  {formData.nomor_dokumen}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Jenis Dokumen</label>
                <select 
                  name="jenis"
                  value={formData.jenis}
                  onChange={handleChange}
                  className="w-full border-b border-border-light py-2 text-sm focus:border-primary outline-none bg-white cursor-pointer font-bold"
                >
                  <option value="KTP">KTP</option>
                  <option value="Paspor">Paspor</option>
                  <option value="SIM">SIM</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Negara Penerbit</label>
                <input 
                  required
                  name="negara_penerbit"
                  type="text" 
                  value={formData.negara_penerbit}
                  onChange={handleChange}
                  className="w-full border-b border-border-light py-2 text-sm focus:border-primary outline-none transition-colors" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Tanggal Terbit</label>
                <input 
                  required
                  name="tanggal_terbit"
                  type="date" 
                  value={formData.tanggal_terbit}
                  onChange={handleChange}
                  className="w-full border-b border-border-light py-2 text-sm focus:border-primary outline-none transition-colors" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Tanggal Habis</label>
                <input 
                  required
                  name="tanggal_habis"
                  type="date" 
                  value={formData.tanggal_habis}
                  onChange={handleChange}
                  className="w-full border-b border-border-light py-2 text-sm focus:border-primary outline-none transition-colors" 
                />
              </div>

            </div>
            
            <div className="pt-6 flex justify-end">
              <button type="submit" className="w-full md:w-auto bg-primary text-white px-10 py-3 rounded-lg font-bold hover:bg-secondary transition-all shadow-sm active:scale-95">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}