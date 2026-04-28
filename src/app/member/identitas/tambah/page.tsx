'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TambahIdentitasPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nomor_dokumen: '',
    jenis: 'KTP',
    negara_penerbit: '',
    tanggal_terbit: '',
    tanggal_habis: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Dokumen ${formData.jenis} (${formData.nomor_dokumen}) berhasil didaftarkan!\nNomor dokumen ini akan menjadi ID unik di sistem.`);
    router.push('/member/identitas');
  };

  return (
    <div className="min-h-screen bg-bg-subtle p-6 md:p-12 font-sans text-title">
      <div className="max-w-2xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <nav className="text-[10px] uppercase tracking-widest text-text-muted mb-2">
              Identitas / Tambah Baru
            </nav>
            <h1 className="text-2xl font-bold text-primary">Daftar Dokumen Baru</h1>
          </div>
          <Link href="/member/identitas" className="w-fit px-5 py-2 text-sm font-semibold border border-border-light rounded-lg hover:bg-white transition-all text-center">
            Batal
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-border-light rounded-xl p-6 md:p-10 shadow-sm space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
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
                  placeholder="Contoh: Indonesia"
                  value={formData.negara_penerbit}
                  onChange={handleChange}
                  className="w-full border-b border-border-light py-2 text-sm focus:border-primary outline-none transition-colors" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Nomor Dokumen</label>
                <input 
                  required
                  name="nomor_dokumen"
                  type="text" 
                  placeholder="Masukkan nomor seri identitas..."
                  value={formData.nomor_dokumen}
                  onChange={handleChange}
                  className="w-full border-b border-border-light py-2 text-sm font-mono focus:border-primary outline-none transition-colors" 
                />
                <p className="text-[10px] text-text-muted mt-2 italic">* Nomor dokumen harus unik dan tidak dapat diubah setelah didaftarkan.</p>
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
            
            <div className="pt-6">
              <button type="submit" className="w-full bg-primary text-white px-10 py-3 rounded-lg font-bold hover:bg-secondary transition-all shadow-sm active:scale-95">
                Simpan Dokumen
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}