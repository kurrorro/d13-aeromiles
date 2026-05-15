'use client';

import { useState, useEffect } from 'react';

interface Tier {
  id_tier: string;
  nama: string;
  minimal_frekuensi_terbang: number;
  minimal_tier_miles: number;
}

interface MemberTierInfo {
  id_tier: string;
  nama_tier: string;
  total_miles: number;
  award_miles: number;
  tier_berikutnya: string | null;
  next_tier_miles: number | null;
  sisa_miles: number;
}

export default function InfoTierPage() {
  const [allTiers, setAllTiers] = useState<Tier[]>([]);
  const [myInfo, setMyInfo] = useState<MemberTierInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiersRes, meRes] = await Promise.all([
          fetch('/api/tier'),
          fetch('/api/member/tier/me')
        ]);
        
        const tiersData = await tiersRes.json();
        const meData = await meRes.json();
        
        setAllTiers(Array.isArray(tiersData) ? tiersData : []);
        setMyInfo(meData.error ? null : meData);
      } catch (error) {
        console.error('Failed to fetch tier data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-title font-bold">Memuat Informasi Tier...</div>;
  }

  const currentMiles = myInfo?.total_miles || 0;
  const nextTierMiles = myInfo?.next_tier_miles || 0;
  const milesNeeded = myInfo?.sisa_miles || 0;

  return (
    <div className="max-w-7xl mx-auto p-8 md:p-12 font-sans text-title">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-[var(--color-title)] tracking-tight">Informasi Tier</h1>
        <p className="text-sm text-text-muted font-medium">Pelajari tingkatan tier dan minimal penerbangan/miles</p>
      </div>

      {myInfo?.tier_berikutnya ? (
        <div className="bg-bg-subtle border border-border-light rounded-lg p-5 mb-8">
          <p className="text-title font-medium text-sm">
            Butuh <span className="font-bold text-secondary">{milesNeeded.toLocaleString('id-ID')} miles lagi</span> untuk naik ke tier <span className="font-bold uppercase tracking-wider">{myInfo.tier_berikutnya}</span>
          </p>
          <div className="mt-4 h-2 w-full bg-border-light rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary transition-all" 
              style={{ width: `${Math.min(100, (currentMiles / nextTierMiles) * 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-bg-subtle border border-border-light rounded-lg p-5 mb-8">
          <p className="text-title font-bold text-sm">
            ✨ Selamat! Kamu sudah mencapai tier tertinggi (<span className="uppercase text-secondary">{myInfo?.nama_tier}</span>).
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allTiers.map((tier) => {
          const isCurrent = tier.id_tier === myInfo?.id_tier;
          
          return (
            <div
              key={tier.id_tier}
              className={`rounded-lg border p-6 transition-colors ${
                isCurrent
                  ? 'border-secondary bg-bg-subtle ring-1 ring-secondary/20'
                  : 'border-border-light bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold tracking-wider uppercase text-title">{tier.nama}</h2>
                {isCurrent && (
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-2 py-1 rounded">
                    Tier Kamu
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded p-4 border border-border-light shadow-sm">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Min. Frekuensi</p>
                  <p className="text-xl font-bold text-title">
                    {tier.minimal_frekuensi_terbang}x
                  </p>
                </div>
                <div className="bg-white rounded p-4 border border-border-light shadow-sm">
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

