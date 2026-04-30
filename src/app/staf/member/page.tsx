'use client';
import { useState } from 'react';
import Link from 'next/link';
import { DUMMY_MEMBERS } from '@/dummy/member';

export default function StaffMemberManagement() {
  const [members, setMembers] = useState(DUMMY_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('');

    const deleteMember = (nomor: string) => {
    const confirmMessage = `Apakah Anda yakin ingin menghapus member ${nomor}? 
    
    Tindakan ini permanen dan akan menghapus seluruh data terkait:
    - Identitas
    - Klaim Missing Miles
    - Transfer Miles
    - Redeem Miles`;

    if (confirm(confirmMessage)) {
        setMembers(members.filter(m => m.nomor_member !== nomor));
        alert(`Member ${nomor} telah berhasil dihapus dari sistem.`);
    }
};

  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.nomor_member.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.first_mid_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTier = selectedTier === '' || m.id_tier === selectedTier;
    
    return matchesSearch && matchesTier;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans text-title">
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[var(--color-border-light)] p-6 md:p-10">
      
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-[var(--color-border-light)] pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Manajemen Member</h1>
          <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Kelola data keanggotaan AeroMiles</p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div>
            <input 
              type="text"
              placeholder="Cari nomor, nama, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-64 border border-[var(--color-border-light)] rounded-lg px-4 py-2 text-xs focus:border-[var(--color-primary)] outline-none font-medium bg-white"
            />
          </div>
          <div>
            <select 
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full lg:w-auto border border-[var(--color-border-light)] rounded-lg px-4 py-2 text-xs focus:border-[var(--color-primary)] outline-none font-medium bg-white"
            >
              <option value="">Semua Tier</option>
              <option value="Blue">Blue</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
          <Link 
            href="/staf/member/tambah" 
            className="shrink-0 bg-[var(--color-primary)] hover:opacity-90 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Member Baru
          </Link>
        </div>
      </header>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
          <thead>
            <tr className="bg-[var(--color-bg-subtle)] border-b border-[var(--color-border-light)]">
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Nomor</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Nama Lengkap</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider text-center">Tier</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider text-right">Total Miles</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider text-right text-[var(--color-primary)]">Award</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider text-center">Bergabung</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-light)]">
            {filteredMembers.map((m) => (
              <tr key={m.nomor_member} className="hover:bg-[var(--color-bg-subtle)]/50 transition-colors">
                
                <td className="px-6 py-4 text-xs font-mono font-bold text-[var(--color-primary)]">
                  {m.nomor_member}
                </td>

                <td className="px-6 py-4 text-xs font-semibold text-[var(--color-title)]">
                  {m.salutation} {m.first_mid_name} {m.last_name}
                </td>
                
                <td className="px-6 py-4 text-xs font-medium text-[var(--color-title)]">
                  {m.email}
                </td>
                
                <td className="px-6 py-4 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
                    {m.id_tier}
                  </span>
                </td>
                
                <td className="px-6 py-4 text-right font-medium text-xs">
                  {m.total_miles.toLocaleString('id-ID')}
                </td>

                <td className="px-6 py-4 text-right font-bold text-[var(--color-primary)] text-xs">
                  {m.award_miles.toLocaleString('id-ID')}
                </td>

                <td className="px-6 py-4 text-center text-[10px] text-[var(--color-text-muted)] uppercase">
                  {m.tanggal_bergabung}
                </td>
                
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/staf/member/${m.nomor_member}/edit`} className="text-[var(--color-primary)] hover:opacity-70 transition-opacity" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    
                    <button onClick={() => deleteMember(m.nomor_member)} className="text-[var(--color-danger)] hover:opacity-70 transition-opacity" title="Hapus">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {filteredMembers.length === 0 && (
          <div className="py-20 text-center text-sm text-[var(--color-text-muted)] italic">
            Data tidak ditemukan.
          </div>
        )}
        </div>
      </div>
      </div>
    </div>
  );
}