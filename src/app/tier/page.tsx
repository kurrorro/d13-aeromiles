'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Tier {
  id_tier: string;
  nama: string;
  minimal_frekuensi_terbang: number;
  minimal_tier_miles: number;
}

interface MemberData {
  id_tier: string;
  total_miles: number;
  award_miles: number;
}

export default function TierPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated') {
      const role = (session.user as any).role;
      if (role !== 'member') router.push('/dashboard');
    }
  }, [status]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    
    Promise.all([
      fetch('/api/tier').then(r => r.json()),
      fetch('/api/member/me').then(r => r.json()),
    ]).then(([tierData, memberInfo]) => {
      setTiers(tierData);
      setMemberData(memberInfo);
      setLoading(false);
    });
  }, [status]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-500">Memuat data tier...</p>
    </div>
  );

  const currentTierIndex = tiers.findIndex(t => t.id_tier === memberData?.id_tier);
  const nextTier = tiers[currentTierIndex + 1] || null;
  const milesNeeded = nextTier 
    ? Math.max(0, nextTier.minimal_tier_miles - (memberData?.total_miles || 0))
    : 0;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">Informasi Tier</h1>
      <p className="text-gray-500 mb-8">Program loyalitas penerbangan AeroMiles</p>

      {nextTier && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="text-blue-700 font-medium">
            🎯 Butuh <strong>{milesNeeded.toLocaleString('id-ID')} miles lagi</strong> untuk naik ke tier <strong>{nextTier.nama}</strong>
          </p>
          <p className="text-blue-500 text-sm mt-1">
            Total miles kamu saat ini: {(memberData?.total_miles || 0).toLocaleString('id-ID')} miles
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {tiers.map((tier, index) => {
          const isCurrent = tier.id_tier === memberData?.id_tier;
          const isPassed = index < currentTierIndex;

          return (
            <div
              key={tier.id_tier}
              className={`rounded-xl border-2 p-6 transition-all ${
                isCurrent
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : isPassed
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {tier.nama === 'Blue' ? '🔵' :
                     tier.nama === 'Silver' ? '⚪' :
                     tier.nama === 'Gold' ? '🟡' : '💎'}
                  </span>
                  <h2 className="text-xl font-bold text-gray-800">{tier.nama}</h2>
                </div>
                <div className="flex gap-2">
                  {isCurrent && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ✓ Tier Kamu
                    </span>
                  )}
                  {isPassed && (
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ✓ Tercapai
                    </span>
                  )}
                  {!isCurrent && !isPassed && (
                    <span className="bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                      Belum tercapai
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Minimal Frekuensi Terbang</p>
                  <p className="text-lg font-bold text-gray-800">
                    {tier.minimal_frekuensi_terbang}x
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Minimal Tier Miles</p>
                  <p className="text-lg font-bold text-gray-800">
                    {tier.minimal_tier_miles.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {isCurrent && !nextTier && (
                <p className="mt-3 text-green-600 font-semibold text-sm">
                  🏆 Selamat! Kamu sudah berada di tier tertinggi!
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}