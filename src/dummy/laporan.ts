export const DUMMY_LAPORAN_STATISTIK = {
  totalMilesBeredar: 1500000,
  totalRedeemBulanIni: 45000,
  totalKlaimDisetujui: 32
};

export const DUMMY_TRANSAKSI = [
  { id: 'T001', tipe: 'Klaim Disetujui', member: 'John Doe (M0001)', jumlah: 2500, timestamp: '2026-04-28 10:15:00' },
  { id: 'T002', tipe: 'Redeem Hadiah', member: 'John Doe (M0001)', jumlah: -5000, timestamp: '2026-04-27 14:30:00' },
  { id: 'T003', tipe: 'Pembelian Package', member: 'Alice Smith (M0002)', jumlah: 10000, timestamp: '2026-04-26 09:00:00' },
  { id: 'T004', tipe: 'Transfer Dikirim', member: 'Alice Smith (M0002)', jumlah: -1000, timestamp: '2026-04-25 11:20:00' },
  { id: 'T005', tipe: 'Transfer Diterima', member: 'John Doe (M0001)', jumlah: 1000, timestamp: '2026-04-25 11:20:00' }
];

export const DUMMY_TOP_MEMBER_MILES = [
  { peringkat: 1, nama: 'Budi Santoso', nomor_member: 'M0015', total_miles: 250000 },
  { peringkat: 2, nama: 'Siti Aminah', nomor_member: 'M0008', total_miles: 210000 },
  { peringkat: 3, nama: 'John Doe', nomor_member: 'M0001', total_miles: 185000 }
];

export const DUMMY_TOP_MEMBER_TRANSFER = [
  { peringkat: 1, nama: 'Alice Smith', nomor_member: 'M0002', frekuensi: 12 },
  { peringkat: 2, nama: 'Budi Santoso', nomor_member: 'M0015', frekuensi: 9 },
  { peringkat: 3, nama: 'Siti Aminah', nomor_member: 'M0008', frekuensi: 5 }
];

export const DUMMY_TOP_MEMBER_REDEEM = [
  { peringkat: 1, nama: 'John Doe', nomor_member: 'M0001', frekuensi: 8 },
  { peringkat: 2, nama: 'Michael Chang', nomor_member: 'M0042', frekuensi: 6 },
  { peringkat: 3, nama: 'Siti Aminah', nomor_member: 'M0008', frekuensi: 4 }
];
