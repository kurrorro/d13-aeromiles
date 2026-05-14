'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function InfoTierPage() {
  const { data: session } = useSession();
  const [tiers, setTiers] = useState<any[]>([]);
  const [currentMember, setCurrentMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tierRes, memberRes] = await Promise.all([
          fetch('/api/tier'),
          fetch('/api/member/me')
        ]);
        
        if (tierRes.ok) setTiers(await tierRes.json());
        if (memberRes.ok) setCurrentMember(await memberRes.json());
      } catch (err) {
        console.error('Error fetching tier data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  if (loading) return <div className="p-8">Loading...</div>;
  if (!currentMember || tiers.length === 0) return <div className="p-8">Data tidak tersedia.</div>;

  const currentTier = currentMember.id_tier; 
  const currentMiles = currentMember.total_miles;
  const currentFlights = currentMember.frekuensi_terbang || 0;

  const currentTierIndex = tiers.findIndex(t => t.id_tier === currentTier);
  const nextTier = tiers[currentTierIndex + 1] || null;
  
  const milesNeeded = nextTier 
    ? Math.max(0, nextTier.minimal_tier_miles - currentMiles)
    : 0;
  
  const flightsNeeded = nextTier
    ? Math.max(0, nextTier.minimal_frekuensi_terbang - currentFlights)
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-8 md:p-12 font-sans text-title">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Informasi Tier</h1>
        <p className="text-sm text-text-muted font-medium">Pelajari tingkatan tier dan minimal penerbangan/miles</p>
      </div>

      {nextTier && (
        <div className="bg-bg-subtle border border-border-light rounded-lg p-5 mb-8">
          <div className="space-y-2">
            <p className="text-title font-medium text-sm">
              Untuk naik ke tier <span className="font-bold uppercase tracking-wider text-primary">{nextTier.nama}</span>:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              {milesNeeded > 0 ? (
                <li>Butuh <span className="font-bold text-secondary">{milesNeeded.toLocaleString('id-ID')} miles lagi</span></li>
              ) : (
                <li className="text-success font-medium">Syarat miles terpenuhi!</li>
              )}
              {flightsNeeded > 0 ? (
                <li>Butuh <span className="font-bold text-secondary">{flightsNeeded} penerbangan lagi</span></li>
              ) : (
                <li className="text-success font-medium">Syarat frekuensi terbang terpenuhi!</li>
              )}
            </ul>
            {milesNeeded === 0 && flightsNeeded === 0 && (
              <p className="text-xs text-primary font-bold mt-2 animate-pulse">
                Kamu sudah memenuhi semua syarat! Tier kamu akan segera diperbarui secara otomatis.
              </p>
            )}
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">
              <span>Progres Miles</span>
              <span>{Math.round(Math.min(100, (currentMiles / nextTier.minimal_tier_miles) * 100))}%</span>
            </div>
            <div className="h-2 w-full bg-border-light rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary transition-all" 
                style={{ width: `${Math.min(100, (currentMiles / nextTier.minimal_tier_miles) * 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">
              <span>Progres Frekuensi</span>
              <span>{Math.round(Math.min(100, (currentFlights / nextTier.minimal_frekuensi_terbang) * 100))}%</span>
            </div>
            <div className="h-2 w-full bg-border-light rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all" 
                style={{ width: `${Math.min(100, (currentFlights / nextTier.minimal_frekuensi_terbang) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tiers.map((tier, index) => {
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

