# Blueberry V32 - Load Tidak Berhenti di Batch 1 + Lanjut dari Offset Terakhir
BUG V31 (83 produk, terputus batch 1): catch rusak + build/render per batch tidak dibungkus, error 1 batch matikan semua load.
FIX V32: load() ditulis ulang bersih - per-batch fetch dibungkus, per-batch build/render dibungkus, error 1 batch -> dicatat, lanjut batch berikutnya, TIDAK berhenti. Batch 12->6 provider (lebih cepat, jarang timeout). Kalau terputus, tombol "Lanjut Memuat" lanjut dari offset terakhir, bukan ulang dari 0. ALL tidak di-reset kalau attempt>1. Kalau ALL kosong, auto-retry 3x.
Tetap: backend V31 fast (1 endpoint, cache, timeout 6 detik), classify regex bener, badge TOP UP, ML WA fallback, header fungsi, cari game, harga kunci 3% backend, 1 wadah per game, tanpa bocoran supplier.
Upload timpa v6vercel, Redeploy, hard refresh. Tunggu 156 provider. Kalau terputus, klik Lanjut Memuat (bukan reload).
