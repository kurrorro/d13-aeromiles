'use client';

import { useSession } from 'next-auth/react';
import { DUMMY_TIERS } from '@/dummy/tier';
import { DUMMY_MEMBERS } from '@/dummy/member';

export default function InfoTierPage() {
  const { data: session } = useSession();
  
  const currentMember = DUMMY_MEMBERS.find(m => m.email === session?.user?.email) || DUMMY_MEMBERS[0];
  
  const currentTier = currentMember.id_tier; 
  const currentMiles = currentMember.total_miles;

  const currentTierIndex = DUMMY_TIERS.findIndex(t => t.id_tier === currentTier);
  const nextTier = DUMMY_TIERS[currentTierIndex + 1] || null;
  const milesNeeded = nextTier 
    ? Math.max(0, nextTier.minimal_tier_miles - currentMiles)
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-8 md:p-12 font-sans text-title">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Informasi Tier</h1>
        <p className="text-sm text-text-muted font-medium">Pelajari tingkatan tier dan minimal penerbangan/miles</p>
      </div>

      {nextTier && (
        <div className="bg-bg-subtle border border-border-light rounded-lg p-5 mb-8">
          <p className="text-title font-medium text-sm">
            Butuh <span className="font-bold text-secondary">{milesNeeded.toLocaleString('id-ID')} miles lagi</span> untuk naik ke tier <span className="font-bold uppercase tracking-wider">{nextTier.nama}</span>
          </p>
          <div className="mt-4 h-2 w-full bg-border-light rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary transition-all" 
              style={{ width: `${(currentMiles / nextTier.minimal_tier_miles) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DUMMY_TIERS.map((tier, index) => {
          const isCurrent = tier.id_tier === currentTier;
          
          return (
            <div
              key={tier.id_tier}
              className={`rounded-lg border p-6 transition-colors ${
                isCurrent
                  ? 'border-secondary bg-bg-subtle'
                  : 'border-border-light bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold tracking-wider uppercase text-title">{tier.nama}</h2>
                {isCurrent && (
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                    Tier Kamu
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded p-4 border border-border-light">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Min. Frekuensi</p>
                  <p className="text-xl font-bold text-title">
                    {tier.minimal_frekuensi_terbang}x
                  </p>
                </div>
                <div className="bg-white rounded p-4 border border-border-light">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Min. Miles</p>
                  <p className="text-xl font-bold text-title">
                    {tier.minimal_tier_miles.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
