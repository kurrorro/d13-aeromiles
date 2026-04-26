'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  if (!session) {
    return (
      <nav className="flex items-center justify-between px-8 py-4 bg-blue-700 text-white shadow-lg">
        <span className="font-bold text-2xl tracking-wide">✈ AeroMiles</span>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 rounded border border-white hover:bg-blue-600">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 rounded bg-white text-blue-700 font-semibold hover:bg-gray-100">
            Registrasi
          </Link>
        </div>
      </nav>
    );
  }

  if (role === 'member') {
    return (
      <nav className="flex items-center justify-between px-8 py-3 bg-blue-700 text-white shadow-lg">
        <span className="font-bold text-xl">✈ AeroMiles</span>
        <div className="flex items-center gap-1 text-sm flex-wrap">
          <Link href="/dashboard" className="px-3 py-2 rounded hover:bg-blue-600">Dashboard</Link>
          <Link href="/identitas" className="px-3 py-2 rounded hover:bg-blue-600">Identitas Saya</Link>
          <Link href="/klaim" className="px-3 py-2 rounded hover:bg-blue-600">Klaim Miles</Link>
          <Link href="/transfer" className="px-3 py-2 rounded hover:bg-blue-600">Transfer Miles</Link>
          <Link href="/redeem" className="px-3 py-2 rounded hover:bg-blue-600">Redeem Hadiah</Link>
          <Link href="/package" className="px-3 py-2 rounded hover:bg-blue-600">Beli Package</Link>
          <Link href="/tier" className="px-3 py-2 rounded hover:bg-blue-600">Info Tier</Link>
          <Link href="/profil" className="px-3 py-2 rounded hover:bg-blue-600">Profil</Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-3 py-2 rounded bg-red-500 hover:bg-red-600 ml-2"
          >
            Logout
          </button>
        </div>
      </nav>
    );
  }

  if (role === 'staf') {
    return (
      <nav className="flex items-center justify-between px-8 py-3 bg-green-700 text-white shadow-lg">
        <span className="font-bold text-xl">✈ AeroMiles — Staf</span>
        <div className="flex items-center gap-1 text-sm flex-wrap">
          <Link href="/dashboard" className="px-3 py-2 rounded hover:bg-green-600">Dashboard</Link>
          <Link href="/staf/member" className="px-3 py-2 rounded hover:bg-green-600">Kelola Member</Link>
          <Link href="/staf/klaim" className="px-3 py-2 rounded hover:bg-green-600">Kelola Klaim</Link>
          <Link href="/staf/hadiah" className="px-3 py-2 rounded hover:bg-green-600">Kelola Hadiah & Penyedia</Link>
          <Link href="/staf/mitra" className="px-3 py-2 rounded hover:bg-green-600">Kelola Mitra</Link>
          <Link href="/staf/laporan" className="px-3 py-2 rounded hover:bg-green-600">Laporan Transaksi</Link>
          <Link href="/profil" className="px-3 py-2 rounded hover:bg-green-600">Profil</Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-3 py-2 rounded bg-red-500 hover:bg-red-600 ml-2"
          >
            Logout
          </button>
        </div>
      </nav>
    );
  }

  return null;
}