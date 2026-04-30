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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Manajemen Member</h1>
          <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-1">Kelola data keanggotaan AeroMiles</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input 
            type="text"
            placeholder="Cari nomor, nama, atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 md:w-64 pl-4 pr-4 py-2 text-xs border border-border-light rounded-lg focus:outline-none focus:border-primary transition-colors bg-bg-subtle/50"
          />

          <select 
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 text-xs border border-border-light rounded-lg focus:outline-none focus:border-primary bg-white text-text-muted cursor-pointer"
          >
            <option value="">Semua Tier</option>
            <option value="Blue">Blue</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>

          <Link 
            href="/staf/member/tambah" 
            className="shrink-0 bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Member
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="border-t border-[var(--color-border-light)] pt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-[var(--color-bg-subtle)] border-b border-border-light">
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Nomor</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Nama Lengkap</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider text-center">Tier</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider text-right">Total Miles</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider text-right text-primary">Award</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider text-center">Bergabung</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-title)] uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {filteredMembers.map((m) => (
              <tr key={m.nomor_member} className="group hover:bg-bg-subtle transition-colors">
                
                <td className="px-6 py-4 text-xs font-mono font-medium text-[var(--color-primary)]">
                  {m.nomor_member}
                </td>

                <td className="px-6 py-4 font-semibold text-[var(--color-title)] text-xs">
                  {m.salutation} {m.first_mid_name} {m.last_name}
                </td>
                
                <td className="px-6 py-4 text-xs text-[var(--color-title)] font-medium">
                  {m.email}
                </td>
                
                <td className="px-6 py-4 text-center text-[11px] font-bold tracking-wider uppercase text-[var(--color-secondary)]">
                  {m.id_tier}
                </td>
                
                <td className="px-6 py-4 text-right font-bold text-[var(--color-title)] text-sm">
                  {m.total_miles.toLocaleString('id-ID')}
                </td>

                <td className="px-6 py-4 text-right font-bold text-[var(--color-primary)] text-sm">
                  {m.award_miles.toLocaleString('id-ID')}
                </td>

                <td className="px-6 py-4 text-center text-[10px] text-[var(--color-text-muted)]">
                  {m.tanggal_bergabung}
                </td>
                
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-5">
                    <Link href={`/staf/member/${m.nomor_member}/edit`} className="text-text-muted hover:text-primary transition-colors" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                      </svg>
                    </Link>
                    
                    <button onClick={() => deleteMember(m.nomor_member)} className="text-text-muted hover:text-danger transition-colors" title="Hapus">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                      </svg>
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {filteredMembers.length === 0 && (
          <div className="py-20 text-center text-sm text-text-muted italic">
            Data tidak ditemukan.
          </div>
        )}
        </div>
      </div>
      </div>
    </div>
  );
}