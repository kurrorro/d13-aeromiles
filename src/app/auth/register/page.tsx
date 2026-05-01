'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'member' | 'staf'>('member');
  
  const [formData, setFormData] = useState({
    email: '',
    salutation: 'Mr.',
    namaDepan: '',
    namaBelakang: '',
    password: '',
    konfirmasiPassword: '',
    tanggalLahir: '',
    kewarganegaraan: '',
    countryCode: '',
    nomorHp: '',
    kodeMaskapai: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); 

    if (formData.password !== formData.konfirmasiPassword) {
      setErrorMessage('Password dan Konfirmasi Password tidak sama!');
      return;
    }

    alert(role === 'member' 
      ? 'Registrasi Member Berhasil! Akun Anda masuk ke tier Blue.' 
      : 'Registrasi Staf Berhasil! ID Staf Anda telah digenerate.');
    
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen py-10 px-4 flex items-start justify-center bg-bg-subtle font-sans text-title">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-border-light p-6 md:p-10">
        
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl font-semibold text-[var(--color-primary)] mb-1">Daftar Akun</h1>
          <p className="text-text-muted text-sm">Lengkapi formulir di bawah untuk mendaftar AeroMiles</p>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 bg-danger-light border border-danger text-danger px-4 py-3 rounded-lg mb-6 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>
            </svg>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-title mb-3">Daftar sebagai:</label>
            <div className="flex gap-8 items-center">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="role"
                  checked={role === 'member'}
                  onChange={() => { setRole('member'); setErrorMessage(''); }}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                <span className={`text-sm font-medium transition-colors ${role === 'member' ? 'text-primary' : 'text-text-muted group-hover:text-title'}`}>Member</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="role"
                  checked={role === 'staf'}
                  onChange={() => { setRole('staf'); setErrorMessage(''); }}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                <span className={`text-sm font-medium transition-colors ${role === 'staf' ? 'text-primary' : 'text-text-muted group-hover:text-title'}`}>Staf Maskapai</span>
              </label>
            </div>
            <p className="mt-2.5 text-[11px] text-text-muted italic leading-relaxed">
              * {role === 'member' 
                ? 'Nomor Member dan Tier awal (Blue) akan dibuat secara otomatis oleh sistem.' 
                : 'ID Staf akan digenerate secara otomatis oleh sistem setelah pendaftaran berhasil.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Alamat Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="email@example.com" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Kata Sandi</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="••••••••" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Konfirmasi Sandi</label>
              <input type="password" name="konfirmasiPassword" value={formData.konfirmasiPassword} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="••••••••" />
            </div>

            <div className="md:col-span-2 grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Sapaan</label>
                <select name="salutation" value={formData.salutation} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-2 py-2 focus:outline-none focus:border-primary bg-white text-sm">
                  <option value="Mr.">Mr.</option><option value="Mrs.">Mrs.</option><option value="Ms.">Ms.</option><option value="Dr.">Dr.</option>
                </select>
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Nama Depan-Tengah</label>
                <input type="text" name="namaDepan" value={formData.namaDepan} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Nama Belakang</label>
              <input type="text" name="namaBelakang" value={formData.namaBelakang} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Tanggal Lahir</label>
              <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-sm" />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Kode</label>
                <input type="text" name="countryCode" value={formData.countryCode} onChange={handleChange} required placeholder="+62" className="w-full border border-border-light rounded-lg px-2 py-2 focus:outline-none focus:border-primary text-center text-sm" />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Nomor HP</label>
                <input type="text" name="nomorHp" value={formData.nomorHp} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Kewarganegaraan</label>
              <input type="text" name="kewarganegaraan" value={formData.kewarganegaraan} onChange={handleChange} required placeholder="Contoh: Indonesia" className="w-full border border-border-light rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-sm" />
            </div>

            {role === 'staf' && (
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Kode Maskapai</label>
                <select name="kodeMaskapai" value={formData.kodeMaskapai} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2 focus:outline-none focus:border-primary bg-white text-sm">
                  <option value="">-- Pilih Maskapai --</option>
                  <option value="GA">GA - Garuda Indonesia</option>
                  <option value="SQ">SQ - Singapore Airlines</option>
                  <option value="QZ">QZ - AirAsia</option>
                  <option value="JT">JT - Lion Air</option>
                </select>
              </div>
            )}
          </div>

          <div className="mt-4">
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-secondary transition-all shadow-sm active:scale-[0.98]">
              Daftar Sekarang
            </button>
            <p className="text-center mt-6 text-sm text-text-muted">
              Sudah punya akun?{' '}
              <Link href="/auth/login" className="text-primary font-bold hover:text-secondary transition-colors underline-offset-4 hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
          
        </form>
      </div>
    </div>
  );
}
