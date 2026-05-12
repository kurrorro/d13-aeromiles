'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PengaturanProfil() {
  const { data: session, update } = useSession();
  const isStaf = session?.user?.role === 'staf';

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [profileData, setProfileData] = useState<any>(null);
  const [maskapaiList, setMaskapaiList] = useState<{kode_maskapai: string, nama_maskapai: string}[]>([]);

  const [formData, setFormData] = useState({
    salutation: 'Mr.',
    first_mid_name: '',
    last_name: '',
    country_code: '',
    mobile_number: '',
    kewarganegaraan: '',
    tanggal_lahir: '',
    kode_maskapai: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfileData(data.profile);
          setMaskapaiList(data.maskapaiList || []);
          setFormData({
            salutation: data.profile.salutation || 'Mr.',
            first_mid_name: data.profile.first_mid_name || '',
            last_name: data.profile.last_name || '',
            country_code: data.profile.country_code || '',
            mobile_number: data.profile.mobile_number || '',
            kewarganegaraan: data.profile.kewarganegaraan || '',
            tanggal_lahir: data.profile.tanggal_lahir || '',
            kode_maskapai: data.profile.kode_maskapai || ''
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    if (session?.user?.email) fetchProfile();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_PROFILE', ...formData })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      await update({ name: `${formData.first_mid_name} ${formData.last_name}`.trim() });
      alert('Profil berhasil diperbarui!');
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Konfirmasi password baru tidak cocok');
      return;
    }
    setIsSavingPassword(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_PASSWORD', oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert('Password berhasil diperbarui!');
      setShowPasswordForm(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans text-title">
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[var(--color-border-light)] p-6 md:p-10">
      <header className="mb-10 border-b border-[var(--color-border-light)] pb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Pengaturan Profil</h1>
        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Kelola informasi pribadi dan keamanan akun {isStaf ? 'Staf' : 'Member'}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT: Info & Avatar */}
        <div className="lg:col-span-1 space-y-8">
          <section className="text-center">
            <div className="w-24 h-24 rounded-full bg-[var(--color-bg-subtle)] border-2 border-[var(--color-secondary)] flex items-center justify-center font-bold text-3xl text-[var(--color-primary)] mx-auto mb-4 shadow-inner">
              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 className="text-lg font-bold text-[var(--color-title)] mb-1">{session?.user?.name || 'User'}</h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-6">{session?.user?.email || 'email@example.com'}</p>
            
            <div className="pt-6 border-t border-[var(--color-border-light)] grid grid-cols-2 gap-4 text-left">
              <div>
                <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Status</label>
                <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">{session?.user?.role || 'Member'}</p>
              </div>
              {isStaf ? (
                <div>
                  <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">ID Staf</label>
                  <p className="text-[10px] font-mono font-bold text-[var(--color-title)]">{profileData?.id_staf || '...'}</p>
                </div>
              ) : (
                <div>
                  <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">No. Member</label>
                  <p className="text-[10px] font-mono font-bold text-[var(--color-title)]">{profileData?.nomor_member || '...'}</p>
                </div>
              )}
            </div>
          </section>

          {/* Password Section */}
          <section className="pt-8 border-t border-[var(--color-border-light)]">
            <h3 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-6">Keamanan Akun</h3>
            {!showPasswordForm ? (
              <button 
                onClick={() => setShowPasswordForm(true)}
                className="w-full text-center border border-[var(--color-border-light)] py-3 rounded-lg text-[10px] font-bold text-[var(--color-title)] uppercase tracking-widest hover:bg-[var(--color-bg-subtle)] transition-all"
              >
                Ubah Password
              </button>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Password Lama</label>
                  <input type="password" value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} required placeholder="••••••••" className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-danger)] outline-none" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Password Baru</label>
                  <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} required placeholder="••••••••" className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-primary)] outline-none" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Konfirmasi</label>
                  <input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} required placeholder="••••••••" className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-primary)] outline-none" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowPasswordForm(false)} className="flex-1 text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest py-2">Batal</button>
                  <button type="submit" disabled={isSavingPassword} className="flex-2 bg-[var(--color-primary)] text-white text-[9px] font-bold uppercase tracking-widest py-2 px-4 rounded shadow-sm hover:opacity-90 transition-all disabled:opacity-50">{isSavingPassword ? 'Menyimpan...' : 'Update Password'}</button>
                </div>
              </form>
            )}
          </section>
        </div>

        {/* RIGHT: Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="lg:pl-12 lg:border-l border-[var(--color-border-light)] space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="md:col-span-2 opacity-60">
                <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Email (Permanen)</label>
                <div className="flex items-center gap-2 border-b border-transparent py-2 text-xs font-medium text-[var(--color-title)] bg-[var(--color-bg-subtle)] px-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {session?.user?.email}
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Sapaan</label>
                <select 
                  value={formData.salutation}
                  onChange={(e) => setFormData({...formData, salutation: e.target.value})}
                  className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none bg-transparent font-medium"
                >
                  <option>Mr.</option>
                  <option>Mrs.</option>
                  <option>Ms.</option>
                  <option>Dr.</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Kewarganegaraan</label>
                <input 
                  type="text" 
                  value={formData.kewarganegaraan}
                  onChange={(e) => setFormData({...formData, kewarganegaraan: e.target.value})}
                  className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Nama Depan & Tengah</label>
                <input 
                  type="text" 
                  value={formData.first_mid_name}
                  onChange={(e) => setFormData({...formData, first_mid_name: e.target.value})}
                  className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Nama Belakang</label>
                <input 
                  type="text" 
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium"
                />
              </div>

              <div className="flex gap-4">
                <div className="w-20">
                  <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Kode</label>
                  <input 
                    type="text" 
                    value={formData.country_code}
                    onChange={(e) => setFormData({...formData, country_code: e.target.value})}
                    className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium text-center"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Nomor HP</label>
                  <input 
                    type="text" 
                    value={formData.mobile_number}
                    onChange={(e) => setFormData({...formData, mobile_number: e.target.value})}
                    className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Tanggal Lahir</label>
                <input 
                  type="date" 
                  value={formData.tanggal_lahir}
                  onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})}
                  className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none font-medium bg-transparent"
                />
              </div>

              {isStaf && (
                <div className="md:col-span-2">
                  <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Kode Maskapai</label>
                  <select 
                    value={formData.kode_maskapai}
                    onChange={(e) => setFormData({...formData, kode_maskapai: e.target.value})}
                    className="w-full border-b border-[var(--color-border-light)] py-2 text-xs focus:border-[var(--color-secondary)] outline-none bg-transparent font-bold text-[var(--color-primary)]"
                  >
                    <option value="">-- Pilih Maskapai --</option>
                    {maskapaiList.map((m) => (
                      <option key={m.kode_maskapai} value={m.kode_maskapai}>
                        {m.kode_maskapai} - {m.nama_maskapai}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-[var(--color-border-light)]">
              <button 
                type="submit"
                disabled={isSaving}
                className="w-full bg-[var(--color-primary)] text-white py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
              >
                {isSaving ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Profil'}
              </button>
            </div>
          </form>
        </div>

      </div>
      </div>
    </div>
  );
}
