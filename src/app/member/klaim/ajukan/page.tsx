'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DUMMY_BANDARA, DUMMY_MASKAPAI } from '@/dummy/bandara';

type BandaraItem = { iata_code: string; nama: string; kota: string };
type MaskapaiItem = { kode_maskapai: string; nama_maskapai: string };

export default function AjukanKlaimPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    maskapai: '', bandara_asal: '', bandara_tujuan: '',
    tanggal_penerbangan: '', flight_number: '', nomor_tiket: '', kelas_kabin: '', pnr: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bandara, setBandara] = useState<BandaraItem[]>([]);
  const [maskapai, setMaskapai] = useState<MaskapaiItem[]>([]);

  useEffect(() => {
    fetch('/api/bandara')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const b = d.bandara || [];
        const m = d.maskapai || [];
        // Gunakan dummy sebagai fallback kalau DB belum ada data
        setBandara(b.length > 0 ? b : DUMMY_BANDARA);
        setMaskapai(m.length > 0 ? m : DUMMY_MASKAPAI);
      })
      .catch(() => {
        // API gagal (DB belum jalan) → pakai dummy
        setBandara(DUMMY_BANDARA);
        setMaskapai(DUMMY_MASKAPAI);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.maskapai) newErrors.maskapai = 'Maskapai wajib dipilih';
    if (!form.bandara_asal) newErrors.bandara_asal = 'Bandara asal wajib dipilih';
    if (!form.bandara_tujuan) newErrors.bandara_tujuan = 'Bandara tujuan wajib dipilih';
    if (form.bandara_asal && form.bandara_tujuan && form.bandara_asal === form.bandara_tujuan) {
      newErrors.bandara_tujuan = 'Bandara tujuan tidak boleh sama dengan bandara asal';
    }
    if (!form.tanggal_penerbangan) newErrors.tanggal_penerbangan = 'Tanggal penerbangan wajib diisi';
    if (!form.flight_number) newErrors.flight_number = 'Flight number wajib diisi';
    if (!form.nomor_tiket) newErrors.nomor_tiket = 'Nomor tiket wajib diisi';
    if (!form.kelas_kabin) newErrors.kelas_kabin = 'Kelas kabin wajib dipilih';
    if (!form.pnr) newErrors.pnr = 'PNR wajib diisi';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/klaim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error || 'Gagal mengajukan klaim');
        return;
      }
      router.push('/member/klaim');
    } catch {
      setSubmitError('Terjadi kesalahan jaringan. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputError = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-xs text-[var(--color-danger)] mt-1">{errors[field]}</p> : null;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-3">
          <Link href="/member/klaim" className="hover:text-[var(--color-primary)] transition-colors">Klaim Miles</Link>
          <span>/</span>
          <span>Ajukan Klaim</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-title)] tracking-tight mb-1">Ajukan Klaim Miles</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Isi data penerbangan untuk mengajukan klaim missing miles</p>
      </div>

      {/* Info Note */}
      <div className="bg-[var(--color-success-light)] border-l-4 border-[var(--color-secondary)] rounded-lg p-4 mb-8">
        <p className="text-sm text-[var(--color-title)] font-medium">
          Status klaim akan <strong>Menunggu</strong> hingga diverifikasi oleh staf. Pastikan data penerbangan Anda sudah benar.
        </p>
      </div>

      {submitError && (
        <div className="bg-[var(--color-danger-light)] border-l-4 border-[var(--color-danger)] rounded-lg p-4 mb-6">
          <p className="text-sm text-[var(--color-danger)]">{submitError}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white border border-[var(--color-border-light)] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Maskapai */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-title)] uppercase tracking-wider mb-1.5">
              Maskapai <span className="text-[var(--color-danger)]">*</span>
            </label>
            <select name="maskapai" value={form.maskapai} onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-secondary)] bg-white transition-colors ${errors.maskapai ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-light)]'}`}>
              <option value="">-- Pilih Maskapai --</option>
              {maskapai.map(m => (
                <option key={m.kode_maskapai} value={m.kode_maskapai}>{m.kode_maskapai} — {m.nama_maskapai}</option>
              ))}
            </select>
            <InputError field="maskapai" />
          </div>

          {/* Rute */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-title)] uppercase tracking-wider mb-1.5">
                Bandara Asal <span className="text-[var(--color-danger)]">*</span>
              </label>
              <select name="bandara_asal" value={form.bandara_asal} onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-secondary)] bg-white transition-colors ${errors.bandara_asal ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-light)]'}`}>
                <option value="">-- Pilih Bandara --</option>
                {bandara.map(b => <option key={b.iata_code} value={b.iata_code}>{b.iata_code} — {b.nama} ({b.kota})</option>)}
              </select>
              <InputError field="bandara_asal" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-title)] uppercase tracking-wider mb-1.5">
                Bandara Tujuan <span className="text-[var(--color-danger)]">*</span>
              </label>
              <select name="bandara_tujuan" value={form.bandara_tujuan} onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-secondary)] bg-white transition-colors ${errors.bandara_tujuan ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-light)]'}`}>
                <option value="">-- Pilih Bandara --</option>
                {bandara.map(b => <option key={b.iata_code} value={b.iata_code}>{b.iata_code} — {b.nama} ({b.kota})</option>)}
              </select>
              <InputError field="bandara_tujuan" />
            </div>
          </div>

          {/* Tanggal & Flight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-title)] uppercase tracking-wider mb-1.5">
                Tanggal Penerbangan <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input type="date" name="tanggal_penerbangan" value={form.tanggal_penerbangan} onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-secondary)] bg-white transition-colors ${errors.tanggal_penerbangan ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-light)]'}`} />
              <InputError field="tanggal_penerbangan" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-title)] uppercase tracking-wider mb-1.5">
                Flight Number <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input type="text" name="flight_number" value={form.flight_number} onChange={handleChange} placeholder="Contoh: GA401"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-secondary)] transition-colors ${errors.flight_number ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-light)]'}`} />
              <InputError field="flight_number" />
            </div>
          </div>

          {/* Tiket & Kelas & PNR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-title)] uppercase tracking-wider mb-1.5">
                Nomor Tiket <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input type="text" name="nomor_tiket" value={form.nomor_tiket} onChange={handleChange} placeholder="Contoh: TKT20250101"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-secondary)] transition-colors ${errors.nomor_tiket ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-light)]'}`} />
              <InputError field="nomor_tiket" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-title)] uppercase tracking-wider mb-1.5">
                Kelas Kabin <span className="text-[var(--color-danger)]">*</span>
              </label>
              <select name="kelas_kabin" value={form.kelas_kabin} onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-secondary)] bg-white transition-colors ${errors.kelas_kabin ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-light)]'}`}>
                <option value="">-- Pilih Kelas --</option>
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="First">First</option>
              </select>
              <InputError field="kelas_kabin" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-title)] uppercase tracking-wider mb-1.5">
                PNR <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input type="text" name="pnr" value={form.pnr} onChange={handleChange} placeholder="Contoh: ABC1001"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-secondary)] transition-colors ${errors.pnr ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-light)]'}`} />
              <InputError field="pnr" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Link href="/member/klaim"
              className="px-6 py-2.5 text-sm font-semibold border border-[var(--color-border-light)] rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] transition-colors">
              Batal
            </Link>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 bg-[var(--color-primary)] text-white py-2.5 rounded-lg font-semibold hover:bg-[var(--color-secondary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {isSubmitting ? 'Mengajukan...' : 'Ajukan Klaim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
