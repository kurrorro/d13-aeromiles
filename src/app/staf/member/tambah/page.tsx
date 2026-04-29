'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddMemberPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    salutation: 'Mr.',
    first_mid_name: '',
    last_name: '',
    country_code: '+62',
    mobile_number: '',
    tanggal_lahir: '',
    kewarganegaraan: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const generatedID = "M" + Math.floor(1000 + Math.random() * 9000);
    
    alert(`Member Baru Berhasil Dibuat!\nID: ${generatedID}\nTier: Blue (Default)\nTanggal: ${new Date().toLocaleDateString('id-ID')}`);
    
    router.push('/staf/member');
  };

  return (
    <div className="min-h-screen bg-bg-subtle p-6 md:p-12 font-sans text-title">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <nav className="text-[10px] uppercase tracking-widest text-text-muted mb-2">
              Manajemen Member / Registrasi Baru
            </nav>
            <h1 className="text-2xl font-bold text-primary">Tambah Member Baru</h1>
          </div>
          <Link 
            href="/staf/member" 
            className="w-fit px-5 py-2 text-sm font-semibold border border-border-light rounded-lg hover:bg-white transition-all text-center"
          >
            Batal
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="bg-white border border-border-light rounded-xl p-6 md:p-10 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              Formulir Identitas Member
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Alamat Email</label>
                <input 
                  required
                  name="email"
                  type="email" 
                  placeholder="contoh: member@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b border-border-light py-2 text-sm focus:border-primary outline-none transition-colors" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Kata Sandi Sementara</label>
                <input 
                  required
                  name="password"
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-b border-border-light py-2 text-sm focus:border-primary outline-none transition-colors" 
                />
              </div>

              <div className="grid grid-cols-4 gap-3 md:col-span-2">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Sapaan</label>
                  <select 
                    name="salutation"
                    value={formData.salutation}
                    onChange={handleChange}
                    className="w-full border-b border-border-light py-2 text-sm outline-none bg-white cursor-pointer"
                  >
                    <option value="Mr.">Mr.</option><option value="Mrs.">Mrs.</option><option value="Ms.">Ms.</option><option value="Dr.">Dr.</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Nama Depan-Tengah</label>
                  <input 
                    required
                    name="first_mid_name"
                    type="text" 
                    value={formData.first_mid_name}
                    onChange={handleChange}
                    className="w-full border-b border-border-light py-2 text-sm focus:border-primary outline-none transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Nama Belakang</label>
                <input 
                  required
                  name="last_name"
                  type="text" 
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full border-b border-border-light py-2 text-sm focus:border-primary outline-none transition-colors" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Kewarganegaraan</label>
                <input 
                  required
                  name="kewarganegaraan"
                  type="text" 
                  placeholder="Contoh: Indonesia"
                  value={formData.kewarganegaraan}
                  onChange={handleChange}
                  className="w-full border-b border-border-light py-2 text-sm focus:border-primary outline-none transition-colors" 
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Kode</label>
                  <input 
                    required
                    name="country_code"
                    type="text" 
                    value={formData.country_code}
                    onChange={handleChange}
                    className="w-full border-b border-border-light py-2 text-sm text-center outline-none" 
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Nomor HP</label>
                  <input 
                    required
                    name="mobile_number"
                    type="text" 
                    placeholder="812xxxx"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    className="w-full border-b border-border-light py-2 text-sm focus:border-primary outline-none transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Tanggal Lahir</label>
                <input 
                  required
                  name="tanggal_lahir"
                  type="date" 
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  className="w-full border-b border-border-light py-2 text-sm focus:border-primary outline-none transition-colors" 
                />
              </div>
            </div>

            <div className="mt-12 p-4 bg-bg-subtle rounded-lg border border-border-light">
              <p className="text-[11px] text-text-muted italic leading-relaxed">
                * Nomor Member, Tanggal Bergabung, dan Tier awal (Blue) akan dikonfigurasi secara otomatis oleh sistem setelah formulir disimpan.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="w-full md:w-auto bg-primary text-white px-12 py-3 rounded-lg font-bold hover:bg-secondary transition-all shadow-md active:scale-95"
            >
              Daftarkan Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}