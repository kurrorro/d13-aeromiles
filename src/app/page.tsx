import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-bg-subtle px-4 text-center">
      <h1 className="text-5xl font-bold text-primary mb-6 tracking-tight">
        Selamat Datang di AeroMiles
      </h1>
      <p className="text-lg text-text-muted max-w-2xl mb-10 leading-relaxed">
        Solusi cerdas untuk mengelola setiap miles perjalanan Anda. 
        Dapatkan keuntungan eksklusif dan tingkatkan tier keanggotaan Anda bersama kami.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/auth/login" 
          className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition-all shadow-md"
        >
          Masuk ke Akun
        </Link>
        <Link 
          href="/auth/register" 
          className="bg-white text-primary border border-primary px-8 py-3 rounded-lg font-bold hover:bg-bg-subtle transition-all"
        >
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
}