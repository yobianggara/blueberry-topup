# ADMIN Blueberry V17 - Laporan Harian & Bulanan + Manual -> Otomatis VA
URL ADMIN: https://blueberrytopup.com/admin.html
FITUR:
- Kartu: HARI INI (jumlah order + total Rp + Manual vs VA) & BULAN INI
- Laporan Per Hari: tanggal, jumlah order, total Rp, Manual, VA, Selesai
- Laporan Per Bulan: sama, per bulan
- Daftar Transaksi: kode BB-..., produk, ID, WA, Mode (MANUAL/VA), Total, Status
- Aksi: Diproses / Selesai (untuk order MANUAL, admin klik manual)
- Export CSV: arsip permanen (klik tiap malam, simpan di HP / Drive)

ALUR SEKARANG (MANUAL - VA sedang perbaikan):
1. Customer order di toko -> order masuk ke admin (mode MANUAL, status MENUNGGU KONFIRMASI ADMIN)
2. Admin cek transfer BCA + WA -> klik DIPROSES -> proses di Tokowendik / kirim kode voucher -> klik SELESAI
3. Laporan harian/bulanan otomatis kehitung dari order yang masuk.

ALUR NANTI (OTOMATIS - setelah Duitku ready operasional):
1. Customer bayar via VA Duitku -> webhook Duitku (/api/duitku-webhook) mengubah status jadi SELESAI otomatis
2. Order masuk laporan yang SAMA (kolom VA, bukan Manual) - tidak perlu klik manual
3. Laporan harian/bulanan tetap satu tempat, tidak ada laporan terpisah manual vs VA. Filter Mode bisa dipilih: Semua / Manual / VA.

PENTING - DATA PERMANEN:
- Di Vercel serverless, data di globalThis.__BB_ORDERS reset saat Redeploy / cold start (beberapa jam tidak ada traffic).
- SOLUSI SEMENTARA: Export CSV tiap malam (tombol di admin).
- SOLUSI PERMANEN (disarankan): Aktifkan Vercel KV / Upstash Redis gratis, lalu ganti isi api/admin-orders.js & api/create-order.js untuk baca/tulis ke KV. Tampilan admin TIDAK berubah.
- Alternatif permanen tanpa KV: sambungkan order ke Google Sheet via Apps Script (order dikirim ke Sheet, admin baca Sheet). Bisa diminta di chat berikutnya.

KEAMANAN: admin.html saat ini terbuka untuk siapa saja yang tahu URL. Jangan sebar URL admin ke customer. Kalau mau dikunci, tambahkan password di Vercel Env ADMIN_PIN dan proteksi di api/admin-orders.js (bisa diminta).
