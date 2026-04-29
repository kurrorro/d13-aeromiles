'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react'; 

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setErrorMessage('Email atau password salah.');
      setIsLoading(false);
    } else {
      router.refresh(); 
      router.push('/'); 
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center font-sans pb-10">
      <div className="bg-white p-8 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] w-full max-w-md border border-border-light">
        <h1 className="text-3xl font-bold text-primary mb-2 text-center">AeroMiles</h1>
        <p className="text-text-muted text-center mb-8 font-medium">Masuk ke akun Anda</p>

        {errorMessage && (
          <div className="flex items-center gap-2 bg-danger-light border border-danger text-danger px-4 py-3 rounded-lg mb-6 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" x2="12" y1="9" y2="13"/>
              <line x1="12" x2="12.01" y1="17" y2="17"/>
            </svg>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-title mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border-light rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-title placeholder-text-muted transition-colors"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-title mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border-light rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-title placeholder-text-muted transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary mt-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Sedang Memuat...' : 'Log In'}
          </button>
          <p className="text-center text-sm text-text-muted">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-primary hover:text-secondary font-medium transition-colors">
              Daftar Sekarang
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}