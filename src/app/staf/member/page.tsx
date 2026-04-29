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
    <div className="p-8 md:p-12 font-sans max-w-7xl mx-auto text-title">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Manajemen Member</h1>
          <p className="text-sm text-text-muted font-small">Kelola data keanggotaan AeroMiles</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
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
            className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-secondary transition-all shadow-sm"
          >
            + Member Baru
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead>
            <tr className="border-b border-border-light">
              <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">Nomor</th>
              <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">Nama Lengkap</th>
              <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">Email</th>
              <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted text-center">Tier</th>
              <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Total Miles</th>
              <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right text-primary">Award</th>
              <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted text-center">Bergabung</th>
              <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {filteredMembers.map((m) => (
              <tr key={m.nomor_member} className="group hover:bg-bg-subtle transition-colors">
                
                <td className="py-5 px-2 text-xs font-mono font-medium text-text-muted">
                  {m.nomor_member}
                </td>

                <td className="py-5 px-2 font-semibold text-sm">
                  {m.salutation} {m.first_mid_name} {m.last_name}
                </td>
                
                <td className="py-5 px-2 text-xs text-text-muted">
                  {m.email}
                </td>
                
                <td className="py-5 px-2 text-center text-[11px] font-bold tracking-wider uppercase">
                  {m.id_tier}
                </td>
                
                <td className="py-5 px-2 text-right font-medium text-xs">
                  {m.total_miles.toLocaleString('id-ID')}
                </td>

                <td className="py-5 px-2 text-right font-bold text-primary text-xs">
                  {m.award_miles.toLocaleString('id-ID')}
                </td>

                <td className="py-5 px-2 text-center text-[10px] text-text-muted uppercase">
                  {m.tanggal_bergabung}
                </td>
                
                <td className="py-5 px-2 text-right">
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
  );
}