'use client';
import { useSession } from 'next-auth/react';
import { DUMMY_MEMBERS } from '@/dummy/member';
import { DUMMY_KLAIM } from '@/dummy/klaim';
import { DUMMY_TRANSFER } from '@/dummy/transfer';
import { DUMMY_TIERS } from '@/dummy/tier';

export default function MemberDashboard() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  // Find member data
  const member = DUMMY_MEMBERS.find(m => m.email === email) || DUMMY_MEMBERS[0];
  const currentTier = DUMMY_TIERS.find(t => t.nama === member.id_tier || t.id_tier === member.id_tier) || DUMMY_TIERS[0];
  const nextTier = DUMMY_TIERS[DUMMY_TIERS.findIndex(t => t.id_tier === currentTier.id_tier) + 1] || null;
  const tierProgress = nextTier ? Math.min(100, (member.total_miles / nextTier.minimal_tier_miles) * 100) : 100;

  // Build recent 5 transactions from klaim + transfer
  type Transaction = {
    tipe: string;
    deskripsi: string;
    tanggal: string;
    jumlah: number;
    arah: 'plus' | 'minus';
  };
  const transactions: Transaction[] = [];

  // Add approved klaim for this member
  DUMMY_KLAIM
    .filter(k => k.email_member === member.email && k.status_penerimaan === 'Disetujui')
    .forEach(k => {
      transactions.push({
        tipe: 'Klaim Miles',
        deskripsi: `${k.bandara_asal} → ${k.bandara_tujuan} (${k.nama_maskapai})`,
        tanggal: k.timestamp.split(' ')[0],
        jumlah: k.kelas_kabin === 'First' ? 5000 : k.kelas_kabin === 'Business' ? 3000 : 1500,
        arah: 'plus',
      });
    });

  // Add transfers — sent (minus) and received (plus)
  DUMMY_TRANSFER
    .filter(t => t.email_member_1 === member.email || t.email_member_2 === member.email)
    .forEach(t => {
      const isSender = t.email_member_1 === member.email;
      transactions.push({
        tipe: 'Transfer Miles',
        deskripsi: isSender ? `Dikirim ke ${t.nama_2}` : `Diterima dari ${t.nama_1}`,
        tanggal: t.timestamp.split(' ')[0],
        jumlah: t.jumlah,
        arah: isSender ? 'minus' : 'plus',
      });
    });

  // Sort and take 5 most recent
  const recent = transactions
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 font-sans">

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-title)] tracking-tight">
          Selamat datang, {session?.user?.name}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Pantau miles dan aktivitas keanggotaan Anda</p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Nomor Member */}
        <div className="bg-white border border-[var(--color-border-light)] rounded-lg p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-l-4 border-l-[var(--color-secondary)]">
          <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">Nomor Member</p>
          <p className="text-xl font-bold text-[var(--color-title)] font-mono">{member.nomor_member}</p>
        </div>

        {/* Tier */}
        <div className="bg-white border border-[var(--color-border-light)] rounded-lg p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-l-4 border-l-[var(--color-secondary)]">
          <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">Tier Saat Ini</p>
          <p className="text-xl font-bold text-[var(--color-title)] uppercase tracking-wide">{currentTier.nama}</p>
        </div>

        {/* Total Miles */}
        <div className="bg-white border border-[var(--color-border-light)] rounded-lg p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-l-4 border-l-[var(--color-secondary)]">
          <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">Total Miles</p>
          <p className="text-xl font-bold text-[var(--color-title)]">{member.total_miles.toLocaleString('id-ID')}</p>
        </div>

        {/* Award Miles */}
        <div className="bg-white border border-[var(--color-border-light)] rounded-lg p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-l-4 border-l-[var(--color-secondary)]">
          <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">Award Miles</p>
          <p className="text-xl font-bold text-[var(--color-secondary)]">{member.award_miles.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Progress Bar ke tier berikutnya */}
      {nextTier && (
        <div className="bg-white border border-[var(--color-border-light)] rounded-lg p-5 mb-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-[var(--color-title)]">
              Menuju Tier <span className="uppercase font-bold tracking-wider">{nextTier.nama}</span>
            </p>
            <p className="text-sm font-bold text-[var(--color-secondary)]">
              {member.total_miles.toLocaleString('id-ID')} / {nextTier.minimal_tier_miles.toLocaleString('id-ID')} Miles
            </p>
          </div>
          <div className="h-2.5 w-full bg-[var(--color-border-light)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-secondary)] rounded-full transition-all duration-700"
              style={{ width: `${tierProgress}%` }}
            />
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            Butuh <span className="font-bold text-[var(--color-secondary)]">{Math.max(0, nextTier.minimal_tier_miles - member.total_miles).toLocaleString('id-ID')} miles</span> lagi untuk naik tier
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Pribadi */}
        <div className="bg-white border border-[var(--color-border-light)] rounded-lg p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <h2 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-5">Informasi Pribadi</h2>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Nama Lengkap</p>
              <p className="text-sm font-semibold text-[var(--color-title)]">{member.salutation} {member.first_mid_name} {member.last_name}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Email</p>
              <p className="text-sm text-[var(--color-title)]">{member.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Nomor HP</p>
              <p className="text-sm text-[var(--color-title)]">{member.country_code} {member.mobile_number}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Kewarganegaraan</p>
              <p className="text-sm text-[var(--color-title)]">{member.kewarganegaraan}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Tanggal Lahir</p>
              <p className="text-sm text-[var(--color-title)]">{member.tanggal_lahir}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">Tanggal Bergabung</p>
              <p className="text-sm text-[var(--color-title)]">{member.tanggal_bergabung}</p>
            </div>
          </div>
        </div>

        {/* 5 Transaksi Terbaru */}
        <div className="lg:col-span-2 bg-white border border-[var(--color-border-light)] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border-light)] bg-[var(--color-bg-subtle)]">
            <h2 className="text-xs font-bold text-[var(--color-title)] uppercase tracking-widest">5 Transaksi Terbaru</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--color-border-light)]">
                  <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Tipe</th>
                  <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Deskripsi</th>
                  <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Tanggal</th>
                  <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] text-right">Jumlah Miles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-light)]">
                {recent.length > 0 ? recent.map((t, i) => (
                  <tr key={i} className="hover:bg-[var(--color-bg-subtle)] transition-colors">
                    <td className="py-4 px-5 text-xs font-semibold text-[var(--color-title)]">{t.tipe}</td>
                    <td className="py-4 px-5 text-xs text-[var(--color-text-muted)]">{t.deskripsi}</td>
                    <td className="py-4 px-5 text-xs text-[var(--color-text-muted)]">{t.tanggal}</td>
                    <td className={`py-4 px-5 text-xs font-bold text-right ${t.arah === 'plus' ? 'text-[var(--color-secondary)]' : 'text-[var(--color-danger)]'}`}>
                      {t.arah === 'plus' ? '+' : '-'}{t.jumlah.toLocaleString('id-ID')}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-sm text-[var(--color-text-muted)] italic">
                      Belum ada transaksi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
