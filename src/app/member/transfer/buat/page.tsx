'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type MemberInfo = {
  email: string;
  salutation: string;
  first_mid_name: string;
  last_name: string;
  nomor_member: string;
  award_miles: number;
};

export default function BuatTransferPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const email = session?.user?.email ?? '';

  const [member, setMember] = useState<MemberInfo | null>(null);
  const [saldo, setSaldo] = useState(0);
  const [form, setForm] = useState({ email_penerima: '', jumlah: '', catatan: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [penerima, setPenerima] = useState<{ nama: string; nomor_member: string } | null>(null);
  const [checkingPenerima, setCheckingPenerima] = useState(false);

  useEffect(() => {
    fetch('/api/member/me')
      .then(r => r.json())
      .then(data => setMember(data))
      .catch(() => {});

    fetch('/api/transfer/saldo')
      .then(res => res.json())
      .then(data => {
        setSaldo(data.saldo || 0);
      });
  }, []);

  const awardMiles = saldo;
  const sisaMiles = awardMiles - (parseInt(form.jumlah) || 0);

  // Live lookup penerima via API
  useEffect(() => {
    if (!form.email_penerima || form.email_penerima === email) {
      setPenerima(null);
      return;
    }
    const timer = setTimeout(async () => {
      setCheckingPenerima(true);
      try {
        const res = await fetch(`/api/member/cari?email=${encodeURIComponent(form.email_penerima)}`);
        if (res.ok) {
          const data = await res.json();
          setPenerima({ nama: `${data.salutation} ${data.first_mid_name} ${data.last_name}`, nomor_member: data.nomor_member });
        } else {
          setPenerima(null);
        }
      } catch {
        setPenerima(null);
      } finally {
        setCheckingPenerima(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.email_penerima, email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.email_penerima) {
      newErrors.email_penerima = 'Email penerima wajib diisi';
    } else if (form.email_penerima === email) {
      newErrors.email_penerima = 'Anda tidak dapat mentransfer miles ke diri sendiri';
    } else if (!penerima) {
      newErrors.email_penerima = 'Email penerima tidak terdaftar sebagai member aktif';
    }
    const jumlahNum = parseInt(form.jumlah);
    if (!form.jumlah) {
      newErrors.jumlah = 'Jumlah miles wajib diisi';
    } else if (isNaN(jumlahNum) || jumlahNum <= 0) {
      newErrors.jumlah = 'Jumlah miles harus lebih dari 0';
    } else if (jumlahNum > awardMiles) {
      newErrors.jumlah = `Saldo tidak mencukupi. Saldo Anda: ${awardMiles.toLocaleString('id-ID')}`;
    }
    return newErrors;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setStep('confirm');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_penerima: form.email_penerima,
          jumlah: parseInt(form.jumlah),
          catatan: form.catatan || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error || 'Gagal melakukan transfer');
        setStep('form');
        return;
      }
      router.push('/member/transfer');
    } catch {
      setSubmitError('Terjadi kesalahan jaringan. Coba lagi.');
      setStep('form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const memberName = member ? `${member.salutation} ${member.first_mid_name} ${member.last_name}` : '...';

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10 font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-6">
        <Link href="/member/transfer" className="hover:text-[var(--color-primary)] transition-colors">Transfer Miles</Link>
        <span>/</span>
        <span>Transfer Baru</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-title)] tracking-tight mb-1">Transfer Miles</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Kirim award miles ke member AeroMiles lain</p>
      </div>

      {/* Balance Card */}
      <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border-light)] rounded-lg p-5 mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Saldo Award Miles Anda</p>
          <p className="text-2xl font-bold text-[var(--color-secondary)]">{awardMiles.toLocaleString('id-ID')}</p>
        </div>
        {form.jumlah && parseInt(form.jumlah) > 0 && parseInt(form.jumlah) <= awardMiles && (
          <div className="text-right">
            <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Sisa Setelah Transfer</p>
            <p className={`text-xl font-bold ${sisaMiles >= 0 ? 'text-[var(--color-title)]' : 'text-[var(--color-danger)]'}`}>
              {sisaMiles.toLocaleString('id-ID')}
            </p>
          </div>
        )}
      </div>

      {submitError && (
        <div className="bg-[var(--color-danger-light)] border-l-4 border-[var(--color-danger)] rounded-lg p-4 mb-6">
          <p className="text-sm text-[var(--color-danger)]">{submitError}</p>
        </div>
      )}

      {step === 'form' ? (
        <div className="bg-white border border-[var(--color-border-light)] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-8">
          <form onSubmit={handleNext} className="space-y-6">

            {/* Email Penerima */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-title)] uppercase tracking-wider mb-1.5">
                Email Penerima <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input type="email" name="email_penerima" value={form.email_penerima} onChange={handleChange}
                placeholder="email@example.com"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-secondary)] transition-colors ${errors.email_penerima ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-light)]'}`} />
              {errors.email_penerima && <p className="text-xs text-[var(--color-danger)] mt-1">{errors.email_penerima}</p>}
              {checkingPenerima && <p className="text-xs text-[var(--color-text-muted)] mt-1 animate-pulse">Mencari member...</p>}
              {penerima && !errors.email_penerima && (
                <div className="mt-2 flex items-center gap-2 p-3 bg-[var(--color-success-light)] rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-white text-xs font-bold">
                    {penerima.nama.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-title)]">{penerima.nama}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{penerima.nomor_member}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Jumlah Miles */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-title)] uppercase tracking-wider mb-1.5">
                Jumlah Miles <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input type="number" name="jumlah" value={form.jumlah} onChange={handleChange}
                placeholder="Masukkan jumlah miles" min={1} max={awardMiles}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-secondary)] transition-colors ${errors.jumlah ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-light)]'}`} />
              {errors.jumlah && <p className="text-xs text-[var(--color-danger)] mt-1">{errors.jumlah}</p>}
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-title)] uppercase tracking-wider mb-1.5">
                Catatan <span className="text-[var(--color-text-muted)] font-normal">(opsional)</span>
              </label>
              <textarea name="catatan" value={form.catatan} onChange={handleChange}
                placeholder="Tulis catatan untuk penerima..." rows={3}
                className="w-full border border-[var(--color-border-light)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-secondary)] transition-colors resize-none" />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Link href="/member/transfer"
                className="px-6 py-2.5 text-sm font-semibold border border-[var(--color-border-light)] rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] transition-colors">
                Batal
              </Link>
              <button type="submit"
                className="flex-1 bg-[var(--color-primary)] text-white py-2.5 rounded-lg font-semibold hover:bg-[var(--color-secondary)] transition-all text-sm">
                Lanjutkan →
              </button>
            </div>
          </form>
        </div>

      ) : (
        /* Confirmation Step */
        <div className="bg-white border border-[var(--color-border-light)] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-8">
          <h2 className="text-base font-bold text-[var(--color-title)] mb-6">Konfirmasi Transfer</h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center py-3 border-b border-[var(--color-border-light)]">
              <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Pengirim</span>
              <span className="text-sm font-semibold text-[var(--color-title)]">{memberName}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[var(--color-border-light)]">
              <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Penerima</span>
              <div className="text-right">
                <p className="text-sm font-semibold text-[var(--color-title)]">{penerima?.nama}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{form.email_penerima}</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[var(--color-border-light)]">
              <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Jumlah Miles</span>
              <span className="text-xl font-bold text-[var(--color-danger)]">-{parseInt(form.jumlah).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[var(--color-border-light)]">
              <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Sisa Setelah Transfer</span>
              <span className="text-lg font-bold text-[var(--color-title)]">{sisaMiles.toLocaleString('id-ID')}</span>
            </div>
            {form.catatan && (
              <div className="flex justify-between items-start py-3">
                <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Catatan</span>
                <span className="text-sm text-[var(--color-title)] text-right max-w-xs italic">&ldquo;{form.catatan}&rdquo;</span>
              </div>
            )}
          </div>

          <div className="bg-[var(--color-warning-light)] border-l-4 border-[var(--color-warning)] rounded-lg p-4 mb-6">
            <p className="text-sm text-[var(--color-title)]">
              Transfer bersifat <strong>permanen</strong> dan tidak dapat dibatalkan setelah dikonfirmasi.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('form')} disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-semibold border border-[var(--color-border-light)] rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] transition-colors disabled:opacity-50">
              ← Ubah
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting}
              className="flex-1 bg-[var(--color-primary)] text-white py-2.5 rounded-lg font-semibold hover:bg-[var(--color-secondary)] transition-all disabled:opacity-50 text-sm">
              {isSubmitting ? 'Mengirim...' : 'Konfirmasi Transfer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
