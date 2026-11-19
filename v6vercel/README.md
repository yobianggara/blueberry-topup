# Blueberry V12 - Pilah 2 Sistem Pembelian: DIRECT vs VOUCHER/LINK
KAJIAN:
- Sistem 1 - DIRECT / TOP UP LANGSUNG (ID + Server): Mobile Legends, Free Fire, dll.
  Customer isi User ID (+ Server ID kalau gamenya pakai server). Saldo / Diamond masuk LANGSUNG ke akun game setelah bayar.
  Contoh: Mobile Legends 86 Diamond -> isi ID 123456 + Server 7890 -> diamond masuk ke akun itu.
- Sistem 2 - VOUCHER / LINK (Tanpa ID): UniPin Voucher, Steam Wallet, Google Play Gift Card, dll.
  Customer TIDAK isi ID / Server. Setelah bayar, toko kirim KODE VOUCHER / LINK REDEEM ke WhatsApp customer.
  Customer tukarkan sendiri di situs resmi (misal unipin.com/redeem) atau di dalam game.
  Contoh: UniPin Voucher 100 UC -> bayar -> dapat kode 16 digit via WA -> redeem di unipin.com.
  Kenapa beda? Karena voucher itu produk kode, bukan top up langsung. Supplier (Tokowendik) kirimnya kode, bukan saldo.
- Sistem campuran (MIXED): 1 game punya 2 jenis produk, misal game X ada yang Direct ada yang Voucher.
  Di V12, mode ditentukan PER NOMINAL yang dipilih, bukan per game. Pilih nominal Voucher -> form otomatis ganti ke mode Voucher.

APA YANG BERUBAH DI V12:
- Kartu game: label 'TOP UP' / 'VOUCHER' / 'TOP UP + VOUCHER' sesuai isi produknya.
- Daftar nominal: tiap nominal ada label '🎮 Langsung ke ID' atau '🎟️ Voucher / Link — Tanpa ID'.
- Detail game: kalau pilih nominal Voucher, form ID + Server OTOMATIS HILANG, judul jadi 'Tanpa ID Game — Kode dikirim ke WhatsApp', help text jelaskan cara redeem.
  Kalau pilih nominal Direct, form ID + Server muncul lagi.
- Validasi: Voucher hanya wajib WhatsApp (buat kirim kode). Direct wajib ID + WhatsApp.
- Pesanan sukses: kalau Voucher, ada catatan 'kode akan dikirim ke WhatsApp setelah pembayaran terverifikasi'.
- Backend: productDetails ditandai [VOUCHER] / [DIRECT] biar lu gampang bedain di laporan / saat proses manual.
- Tetap: tanpa tulisan +3% / supplier di depan customer, kategori tab jalan, anti-duplikat, payment Duitku V10.
- Upload: timpa v6vercel, Redeploy, tes 1 game Direct (ML) + 1 produk Voucher (cari 'UniPin' / 'Voucher' di search).


# V13 - Tambah Tokowendik Webhook
- File baru: api/tokowendik-webhook.js
- Isi di Tokowendik -> Pengaturan -> URL Webhook: https://blueberrytopup.com/api/tokowendik-webhook
- Status yang dikirim Tokowendik: unpaid, processing, success, failed, expired, refund.
- Sekarang endpoint ini menerima + balas OK. Versi produksi nanti: update status order di DB + kirim kode voucher via WA kalau success + VOUCHER.
- Upload: timpa v6vercel, Redeploy.
