# WAJIB: Aktifkan Redis biar Harga Admin + Agen nyambung ke Web (V23)

Kenapa kemarin harga admin tidak ngaruh & agen tidak bisa login?
Karena tiap API Vercel punya ingatan sendiri. V23 sudah diperbaiki: semua API sekarang baca dari 1 gudang bareng: Upstash Redis.

## Cara aktifkan (sekali saja, gratis, 2 menit)

1. Buka Vercel > Project blueberry-topup > tab **Storage**
2. Klik **Create** / **Create Database** > pilih **Redis** (Upstash)
3. Klik **Create** lagi, biarkan nama default
4. Vercel otomatis menambahkan Env: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
5. Buka **Deployments** > titik 3 di deployment terbaru > **Redeploy**
6. Buka Admin > kotak Harga > cek tulisan **Tempat simpan: ✅ Redis — permanen & nyambung ke web**

Kalau belum ada tulisan itu, berarti masih mode Sementara — harga & agen hanya tersimpan di 1 server sesaat dan bisa hilang / tidak nyambung.

## Setelah Redis aktif, tes ulang dari nol

1. Admin > Harga > klik 👤 Edit Harga User Biasa > ubah 1 produk jadi angka yang gampang dikenali, misal 12345 > Simpan
2. Buka blueberrytopup.com di tab Incognito > produk itu harusnya langsung Rp 12.345
3. Admin > Harga > klik ⭐ Edit Harga User Agen > ubah produk yang sama jadi 11111 > Simpan
4. Daftar agen baru (email baru) > Admin > Approve + Buat Kode, misal Test123
5. Buka web > pojok kanan atas > Login > email + Test123 > harusnya muncul bar kuning Mode Agen + harga produk itu jadi Rp 11.111
6. Kalau masih gagal, screenshot tulisan Tempat simpan di Admin + pesan error login-nya.

## Catatan penting

- Harga & data agen lama yang tersimpan sebelum Redis aktif TIDAK ikut pindah. Harus input ulang 1x setelah Redis aktif. Setelah itu permanen.
- Jangan hapus Env UPSTASH_* di Vercel. Kalau dihapus, balik lagi ke mode Sementara.


---

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
