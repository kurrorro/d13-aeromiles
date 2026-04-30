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
    <div className="max-w-2xl mx-auto px-6 py-12 font-sans">
      <Link href="/staf/member" className="inline-flex items-center gap-2 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Daftar
      </Link>

      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Tambah Member Baru</h1>
        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Sistem akan otomatis membuat profil Member baru</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[var(--color-border-light)] shadow-sm p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

          <div className="md:col-span-2">
            <label className="block text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">Alamat Email</label>
            <input
              required
              name="email"
              type="email"
              placeholder="contoh: member@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">Kata Sandi Sementara</label>
            <input
              required
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium transition-colors"
            />
          </div>

          <div className="grid grid-cols-4 gap-3 md:col-span-2">
            <div className="col-span-1">
              <label className="block text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">Sapaan</label>
              <select
                name="salutation"
                value={formData.salutation}
                onChange={handleChange}
                className="w-full border-b border-[var(--color-border-light)] py-2 text-xs outline-none bg-white cursor-pointer font-medium"
              >
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
              </select>
            </div>
            <div className="col-span-3">
              <label className="block text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">Nama Depan & Tengah</label>
              <input
                required
                name="first_mid_name"
                type="text"
                value={formData.first_mid_name}
                onChange={handleChange}
                className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">Nama Belakang</label>
            <input
              required
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium transition-colors"
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">Kewarganegaraan</label>
            <input
              required
              name="kewarganegaraan"
              type="text"
              placeholder="Contoh: Indonesia"
              value={formData.kewarganegaraan}
              onChange={handleChange}
              className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium transition-colors"
            />
          </div>

          <div className="grid grid-cols-4 gap-3 md:col-span-2">
            <div className="col-span-1">
              <label className="block text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">Kode</label>
              <input
                required
                name="country_code"
                type="text"
                value={formData.country_code}
                onChange={handleChange}
                className="w-full border-b border-[var(--color-border-light)] py-2 text-xs text-center outline-none font-medium"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">Nomor HP</label>
              <input
                required
                name="mobile_number"
                type="text"
                placeholder="812xxxx"
                value={formData.mobile_number}
                onChange={handleChange}
                className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">Tanggal Lahir</label>
            <input
              required
              name="tanggal_lahir"
              type="date"
              value={formData.tanggal_lahir}
              onChange={handleChange}
              className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium bg-transparent transition-colors"
            />
          </div>

          <div className="md:col-span-2 mt-2 p-4 bg-[var(--color-bg-subtle)] rounded-lg border border-[var(--color-border-light)]">
            <div className="flex gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-secondary)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider mb-1">Informasi Otomatis</p>
                <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
                  Nomor Member, Tanggal Bergabung, dan Tier awal (Blue) akan dikonfigurasi secara otomatis oleh sistem setelah formulir disimpan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--color-border-light)]">
          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-md active:scale-[0.99]"
          >
            Daftarkan Member
          </button>
        </div>
      </form>
    </div>
  );
}