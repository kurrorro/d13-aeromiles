'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function PengaturanProfil() {
  const { data: session } = useSession();
  const isStaf = session?.user?.role === 'staf';

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-16 font-sans bg-white min-h-screen">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Pengaturan Profil</h1>
        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Kelola informasi pribadi dan keamanan akun</p>
      </header>

      <form className="space-y-14">
        
        <section>
          <h2 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-4">Informasi Identitas (Permanen)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 border-t border-[var(--color-border-light)] pt-5">
            <div className="opacity-60">
              <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Email</label>
              <p className="text-xs font-medium text-[var(--color-title)]">{session?.user?.email}</p>
            </div>
            {isStaf ? (
              <div>
                <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">ID Staf</label>
                <p className="text-xs font-mono font-bold text-[var(--color-title)]">S-99081</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Nomor Member</label>
                  <p className="text-xs font-mono font-bold text-[var(--color-title)]">M-20240001</p>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Tanggal Bergabung</label>
                  <p className="text-xs font-medium text-[var(--color-title)]">2026-01-01</p>
                </div>
              </>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-4">Perbarui Profil</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6 border-t border-[var(--color-border-light)] pt-6">
            <div>
              <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Sapaan</label>
              <select className="w-full border-b border-[var(--color-border-light)] py-1.5 text-xs focus:border-[var(--color-primary)] outline-none bg-transparent font-medium">
                <option>Mr.</option><option>Mrs.</option><option>Ms.</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Nama Depan & Tengah</label>
              <input type="text" defaultValue="Keisha" className="w-full border-b border-[var(--color-border-light)] py-1.5 text-xs focus:border-[var(--color-primary)] outline-none font-medium" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Nama Belakang</label>
              <input type="text" defaultValue="Putri" className="w-full border-b border-[var(--color-border-light)] py-1.5 text-xs focus:border-[var(--color-primary)] outline-none font-medium" />
            </div>
            <div className="flex gap-4">
              <div className="w-16">
                <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Kode</label>
                <input type="text" defaultValue="+62" className="w-full border-b border-[var(--color-border-light)] py-1.5 text-xs focus:border-[var(--color-primary)] outline-none font-medium text-center" />
              </div>
              <div className="flex-1">
                <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Nomor HP</label>
                <input type="text" defaultValue="8123456789" className="w-full border-b border-[var(--color-border-light)] py-1.5 text-xs focus:border-[var(--color-primary)] outline-none font-medium" />
              </div>
            </div>
            <div>
              <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Kewarganegaraan</label>
              <input type="text" defaultValue="Indonesia" className="w-full border-b border-[var(--color-border-light)] py-1.5 text-xs focus:border-[var(--color-primary)] outline-none font-medium" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Tanggal Lahir</label>
              <input type="date" defaultValue="2004-05-12" className="w-full border-b border-[var(--color-border-light)] py-1.5 text-xs focus:border-[var(--color-primary)] outline-none font-medium bg-transparent" />
            </div>
            {isStaf && (
              <div>
                <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Kode Maskapai</label>
                <select className="w-full border-b border-[var(--color-border-light)] py-1.5 text-xs focus:border-[var(--color-primary)] outline-none bg-transparent font-medium text-[var(--color-primary)] font-bold">
                  <option value="GA">GA - Garuda Indonesia</option>
                  <option value="SQ">SQ - Singapore Airlines</option>
                </select>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-[var(--color-border-light)] pt-10">
          {!showPasswordForm ? (
            <button 
              type="button"
              onClick={() => setShowPasswordForm(true)}
              className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest border border-[var(--color-primary)] px-6 py-2 rounded hover:bg-[var(--color-primary)] hover:text-white transition-all"
            >
              Ubah Password
            </button>
          ) : (
            <div className="max-w-md animate-in fade-in slide-in-from-top-2 duration-300">
              <h2 className="text-[10px] font-bold text-[var(--color-danger)] uppercase tracking-[0.2em] mb-6">Keamanan Akun</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Password Lama</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-[var(--color-border-light)] rounded px-3 py-2 text-xs focus:border-[var(--color-danger)] outline-none" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Password Baru</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-[var(--color-border-light)] rounded px-3 py-2 text-xs focus:border-[var(--color-primary)] outline-none" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block mb-1">Konfirmasi Password Baru</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-[var(--color-border-light)] rounded px-3 py-2 text-xs focus:border-[var(--color-primary)] outline-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowPasswordForm(false)} className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest px-4 py-2">Batal</button>
                  <button type="button" className="bg-[var(--color-primary)] text-white text-[9px] font-bold uppercase tracking-widest px-6 py-2 rounded shadow-sm">Simpan Password</button>
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="pt-8 flex justify-center">
          <button 
            type="submit"
            className="bg-[var(--color-primary)] text-white px-12 py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-md active:scale-[0.98]"
          >
            Simpan Perubahan Profil
          </button>
        </div>

      </form>
    </div>
  );
}