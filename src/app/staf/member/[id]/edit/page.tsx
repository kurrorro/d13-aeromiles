'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DUMMY_MEMBERS } from '@/dummy/member';

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const member = DUMMY_MEMBERS.find(m => m.nomor_member === params.id);
    if (member) {
      setFormData(member);
    }
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!formData) return <div className="p-20 text-center font-medium">Memuat data member...</div>;

  return (
    <div className="min-h-screen bg-bg-subtle p-6 md:p-12 font-sans text-title">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-primary)]">Edit Member</h1>
            <p className="text-sm text-text-muted">Nomor Member: <span className="font-mono font-bold text-title">{formData.nomor_member}</span></p>
          </div>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-semibold border border-border-light rounded-lg hover:bg-white transition-all"
          >
            Kembali
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); alert('Perubahan disimpan!'); router.push('/staf/member'); }} className="space-y-6">
          
          <div className="bg-white border border-border-light rounded-xl p-6 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Informasi Keanggotaan & Miles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-bg-subtle/50 p-3 rounded-lg border border-border-light/50">
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Email (Primary Key)</label>
                <div className="text-sm font-medium">{formData.email}</div>
              </div>
              <div className="bg-bg-subtle/50 p-3 rounded-lg border border-border-light/50">
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Award Miles</label>
                <div className="text-sm font-bold text-primary">{formData.award_miles.toLocaleString()}</div>
              </div>
              <div className="bg-bg-subtle/50 p-3 rounded-lg border border-border-light/50">
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Total Miles</label>
                <div className="text-sm font-bold">{formData.total_miles.toLocaleString()}</div>
              </div>
              <div className="md:col-span-3">
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-2">Tier Saat Ini (Dapat Diubah Manual)</label>
                <select 
                  name="id_tier"
                  value={formData.id_tier}
                  onChange={handleChange}
                  className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-bold focus:border-primary outline-none transition-all cursor-pointer"
                >
                  <option value="Blue">Blue</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border-light rounded-xl p-6 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Detail Profil Pengguna
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="grid grid-cols-3 gap-3 md:col-span-2">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Sapaan</label>
                  <select name="salutation" value={formData.salutation} onChange={handleChange} className="w-full border border-border-light rounded-lg px-3 py-2 text-sm bg-white outline-none">
                    <option value="Mr.">Mr.</option><option value="Mrs.">Mrs.</option><option value="Ms.">Ms.</option><option value="Dr.">Dr.</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Nama Depan-Tengah</label>
                  <input name="first_mid_name" type="text" value={formData.first_mid_name} onChange={handleChange} className="w-full border border-border-light rounded-lg px-4 py-2 text-sm focus:border-primary outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Nama Belakang</label>
                <input name="last_name" type="text" value={formData.last_name} onChange={handleChange} className="w-full border border-border-light rounded-lg px-4 py-2 text-sm focus:border-primary outline-none" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Kewarganegaraan</label>
                <input name="kewarganegaraan" type="text" value={formData.kewarganegaraan} onChange={handleChange} className="w-full border border-border-light rounded-lg px-4 py-2 text-sm focus:border-primary outline-none" />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Kode</label>
                  <input name="country_code" type="text" value={formData.country_code} onChange={handleChange} className="w-full border border-border-light rounded-lg px-2 py-2 text-sm text-center outline-none" />
                </div>
                <div className="col-span-3">
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Nomor HP</label>
                  <input name="mobile_number" type="text" value={formData.mobile_number} onChange={handleChange} className="w-full border border-border-light rounded-lg px-4 py-2 text-sm focus:border-primary outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5">Tanggal Lahir</label>
                <input name="tanggal_lahir" type="date" value={formData.tanggal_lahir} onChange={handleChange} className="w-full border border-border-light rounded-lg px-4 py-2 text-sm focus:border-primary outline-none" />
              </div>

            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition-all shadow-md active:scale-95"
            >
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}