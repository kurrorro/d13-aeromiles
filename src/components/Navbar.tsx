'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  const memberLinks = [
    { name: 'Dashboard', href: '/member/dashboard' },
    { name: 'Identitas Saya', href: '/member/identitas' },
    { name: 'Klaim Miles', href: '/member/klaim' },
    { name: 'Transfer Miles', href: '/member/transfer' },
    { name: 'Redeem Hadiah', href: '/member/redeem' },
    { name: 'Beli Package', href: '/member/package' },
    { name: 'Info Tier', href: '/member/tier' },
  ];

  const staffLinks = [
    { name: 'Dashboard', href: '/staf/dashboard' },
    { name: 'Kelola Member', href: '/staf/member' },
    { name: 'Kelola Klaim', href: '/staf/klaim' },
    { name: 'Kelola Hadiah', href: '/staf/hadiah' },
    { name: 'Kelola Mitra', href: '/staf/mitra' },
    { name: 'Laporan Transaksi', href: '/staf/laporan' },
  ];

  if (!mounted) return null;

  return (
    <nav className="bg-[var(--color-primary)] sticky top-0 z-50 font-sans shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
            AeroMiles
          </Link>

          <div className="hidden lg:flex items-center gap-6 ml-4">
            {status === 'authenticated' && (
              <>
                {(session?.user?.role === 'staf' ? staffLinks : memberLinks).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[13px] font-medium transition-all py-5 border-b-2 ${
                      isActive(link.href) 
                        ? 'text-white border-[var(--color-secondary)]' 
                        : 'text-[rgba(255,255,255,0.7)] border-transparent hover:text-white hover:border-[rgba(255,255,255,0.5)]'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center">
          {status === 'unauthenticated' ? (
            <div className="flex items-center gap-6">
              <Link 
                href="/auth/login" 
                className="text-sm font-medium text-white hover:text-[var(--color-secondary)] transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="text-sm font-bold text-[var(--color-secondary)] hover:opacity-80 transition-colors"
              >
                Registrasi
              </Link>
            </div>
          ) : status === 'authenticated' ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 group focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white leading-none">{session?.user?.name}</p>
                  <p className="text-[10px] text-[var(--color-secondary)] uppercase tracking-widest mt-1 font-bold">{session?.user?.role}</p>
                </div>
                {/* Avatar (Secondary Color Accents) */}
                <div className="w-9 h-9 rounded-full bg-[var(--color-secondary)] flex items-center justify-center font-bold text-sm text-white group-hover:bg-white group-hover:text-[var(--color-secondary)] transition-all">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </div>
              </button>

              {/* DROPDOWN */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-lg border border-[var(--color-border-light)] overflow-hidden py-1">
                  <Link 
                    href={session?.user?.role === 'staf' ? '/staf/profile' : '/member/profile'}
                    className="block px-4 py-3 text-sm text-[var(--color-title)] font-medium hover:bg-[var(--color-bg-subtle)] transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Pengaturan Profil
                  </Link>
                  <button 
                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                    className="w-full text-left px-4 py-3 text-sm text-[var(--color-danger)] font-medium hover:bg-[var(--color-danger-light)] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-5 h-5 border-2 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
          )}
        </div>
      </div>
    </nav>
  );
}