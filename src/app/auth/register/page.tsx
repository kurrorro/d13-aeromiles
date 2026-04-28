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

    if (formData.email === 'sudahada@example.com') {
      setErrorMessage('Email sudah terdaftar. Silakan gunakan email lain atau Log In.');
      return;
    }

    if (role === 'member') {
      alert('Registrasi Member Berhasil! Akun Anda masuk ke tier Blue. Nomor Member telah digenerate.');
    } else {
      alert('Registrasi Staf Berhasil! ID Staf Anda telah digenerate otomatis.');
    }
    
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen py-8 px-4 flex items-center justify-center bg-bg-subtle font-sans text-title">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-border-light p-6 md:p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-1">AeroMiles</h1>
          <p className="text-text-muted text-sm font-medium">Buat akun baru Anda</p>
        </div>
        
        {/* TAB PILIHAN ROLE (Minimalis) */}
        <div className="flex bg-bg-subtle p-1 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => { setRole('member'); setErrorMessage(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-md transition-all ${
              role === 'member' ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-title'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2-.5-3.5-1.5L14.5 6 6.3 4.2 4.6 5.9l5.4 3.9-3.9 3.9-3.2-.8-1.5 1.5 3.9 1.6 1.6 3.9 1.5-1.5-.8-3.2 3.9-3.9 3.9 5.4z"/>
            </svg>
            Member
          </button>
          <button
            type="button"
            onClick={() => { setRole('staf'); setErrorMessage(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-md transition-all ${
              role === 'staf' ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-title'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            Staf Maskapai
          </button>
        </div>

        {/* INFO BOX (Seragam & Minimalis) */}
        <div className="bg-bg-subtle border-l-4 border-primary p-4 rounded-r-lg mb-6 flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
          </svg>
          <p className="text-sm text-title">
            {role === 'member' 
              ? 'Nomor Member dan Tier awal (Blue) akan dibuat otomatis.' 
              : 'ID Staf akan digenerate otomatis setelah pendaftaran.'}
          </p>
        </div>

        {/* AREA PESAN ERROR */}
        {errorMessage && (
          <div className="flex items-center gap-2 bg-danger-light border border-danger text-danger px-4 py-3 rounded-lg mb-6 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>
            </svg>
            {errorMessage}
          </div>
        )}

        {/* FORM GRID (Responsif: 1 kolom di HP, 2 kolom di Laptop) */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary placeholder-text-muted transition-colors" placeholder="email@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary placeholder-text-muted transition-colors" placeholder="••••••••" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Konfirmasi Password</label>
            <input type="password" name="konfirmasiPassword" value={formData.konfirmasiPassword} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary placeholder-text-muted transition-colors" placeholder="••••••••" />
          </div>

          <div className="grid grid-cols-3 gap-3 md:col-span-2">
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-1">Sapaan</label>
              <select name="salutation" value={formData.salutation} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary bg-white transition-colors">
                <option value="Mr.">Mr.</option><option value="Mrs.">Mrs.</option><option value="Ms.">Ms.</option><option value="Dr.">Dr.</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Nama Depan-Tengah</label>
              <input type="text" name="namaDepan" value={formData.namaDepan} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nama Belakang</label>
            <input type="text" name="namaBelakang" value={formData.namaBelakang} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Lahir</label>
            <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary text-title transition-colors" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-1">Kode</label>
              <input type="text" name="countryCode" value={formData.countryCode} onChange={handleChange} required placeholder="+62" className="w-full border border-border-light rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary text-center transition-colors" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Nomor HP</label>
              <input type="text" name="nomorHp" value={formData.nomorHp} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kewarganegaraan</label>
            <input type="text" name="kewarganegaraan" value={formData.kewarganegaraan} onChange={handleChange} required placeholder="Contoh: Indonesia" className="w-full border border-border-light rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" />
          </div>

          {/* KHUSUS STAF */}
          {role === 'staf' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Kode Maskapai</label>
              <select name="kodeMaskapai" value={formData.kodeMaskapai} onChange={handleChange} required className="w-full border border-border-light rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary bg-white transition-colors">
                <option value="">-- Pilih Maskapai --</option>
                <option value="GA">GA - Garuda Indonesia</option>
                <option value="SQ">SQ - Singapore Airlines</option>
                <option value="QZ">QZ - AirAsia</option>
                <option value="JT">JT - Lion Air</option>
              </select>
            </div>
          )}

          <div className="md:col-span-2 mt-2">
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition-colors shadow-sm">
              {role === 'member' ? 'Daftar Sebagai Member' : 'Daftar Sebagai Staf'}
            </button>
            
            <p className="text-center mt-6 text-sm text-text-muted">
              Sudah punya akun?{' '}
              <Link href="/auth/login" className="text-primary font-semibold hover:text-secondary transition-colors">
                Log In di sini
              </Link>
            </p>
          </div>
          
        </form>
      </div>
    </div>
  );
}