'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function StaffDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard/staf');
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!data) return <div className="p-8 text-red-500">Error loading dashboard</div>;

  const { profile, waiting_count, approved_count, rejected_count } = data;

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 font-sans">
      {/* Header Welcome Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-3xl p-10 md:p-14 text-white shadow-2xl shadow-primary/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl" />
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Staff Dashboard</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {profile.salutation} {profile.first_mid_name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
                ID STAF: {profile.id_staf}
              </span>
              <span className="text-sm font-medium border-l border-white/30 pl-4">
                Petugas {profile.nama_maskapai} ({profile.kode_maskapai})
              </span>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 text-center min-w-[150px]">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Antrean Global</p>
              <p className="text-4xl font-black text-[var(--color-warning)]">{waiting_count}</p>
              <p className="text-[10px] font-bold opacity-60 mt-1">MENUNGGU</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-[var(--border-light)] p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--success-light)] flex items-center justify-center text-[var(--success)]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Disetujui (Anda)</p>
          </div>
          <p className="text-4xl font-black text-[var(--title)] tracking-tight">{approved_count}</p>
        </div>

        <div className="bg-white border border-[var(--border-light)] p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--danger-light)] flex items-center justify-center text-[var(--danger)]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Ditolak (Anda)</p>
          </div>
          <p className="text-4xl font-black text-[var(--title)] tracking-tight">{rejected_count}</p>
        </div>

        <div className="bg-[var(--bg-subtle)] border border-[var(--border-light)] p-8 rounded-2xl shadow-sm flex items-center justify-center">
           <div className="text-center">
             <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1">Maskapai</p>
             <p className="text-xl font-black text-[var(--primary)] uppercase">{profile.nama_maskapai}</p>
           </div>
        </div>
      </div>

      {/* Staff Detailed Info */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-[var(--title)] tracking-tight">Detail Profil Petugas</h2>
          <div className="h-px flex-1 bg-[var(--border-light)] mx-6 hidden md:block" />
        </div>

        <div className="bg-white rounded-2xl border border-[var(--border-light)] shadow-sm p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-2">Email Akun</label>
              <p className="text-sm font-bold text-[var(--title)]">{session?.user?.email}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-2">Nomor Mobile</label>
              <p className="text-sm font-bold text-[var(--title)]">{profile.mobile_number}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-2">Kewarganegaraan</label>
              <p className="text-sm font-bold text-[var(--title)]">{profile.kewarganegaraan}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-2">Tanggal Lahir</label>
              <p className="text-sm font-bold text-[var(--title)]">{new Date(profile.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

