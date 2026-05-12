'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function MemberDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard/member');
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

  const { profile, transactions } = data;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Halo, {profile.salutation} {profile.first_mid_name} {profile.last_name}
          </h1>
          <p className="text-gray-500 mt-1">Nomor Member: <span className="font-semibold text-blue-600">{profile.nomor_member}</span></p>
          <p className="text-sm text-gray-400 mt-2">Bergabung sejak: {new Date(profile.tanggal_bergabung).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-50 px-6 py-4 rounded-xl border border-blue-100 text-center">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Tier</p>
            <p className="text-2xl font-black text-blue-700">{profile.tier_name}</p>
          </div>
          <div className="bg-indigo-50 px-6 py-4 rounded-xl border border-indigo-100 text-center">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Award Miles</p>
            <p className="text-2xl font-black text-indigo-700">{profile.award_miles.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 px-6 py-4 rounded-xl border border-purple-100 text-center">
            <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Total Miles</p>
            <p className="text-2xl font-black text-purple-700">{profile.total_miles.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">5 Transaksi Terakhir</h2>
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Keterangan</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.length > 0 ? transactions.map((t: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(t.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      t.tipe.includes('Out') || t.tipe === 'Redeem' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-green-100 text-green-700'
                    }`}>
                      {t.tipe}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{t.keterangan}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${
                    t.amount < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">Belum ada transaksi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
