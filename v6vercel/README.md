# Blueberry V31 - Fix Timeout Total (V30 Terlalu Lambat) + Auto-Retry
KENAPA V30 JADI "Gagal memuat katalog (timeout)": backend nanya 5 endpoint provider satu-satu @10 detik = >50 detik, lewat batas Vercel 10 detik, diputus sebelum ngasih data. Katalog jadi KOSONG total.
FIX V31:
- Backend: balik ke 1 endpoint prepaid saja, cache provider 5 menit, timeout 6 detik (bukan 10), produk paralel retry 1x, TANPA loop multi-endpoint, TANPA fallback /game/product. Total per batch <8 detik, aman dari batas Vercel.
- Frontend: kalau load gagal, JANGAN langsung tampilkan "Gagal" - auto-retry 3x otomatis (1.5 detik jeda), baru kalau 3x gagal tampilkan tombol Coba Lagi. User tidak perlu klik.
- ML: tetap diselamatkan di frontend (kartu "Mobile Legends (Tanya WA)" kalau ML tidak ada setelah load penuh), bukan dengan bikin backend lambat.
- Tetap: classify regex sudah bener (TOP UP untuk AoE/ML/COD, VOUCHER hanya voucher murni), badge TOP UP, provider sort+cache, retry batch gagal, loading jujur, header fungsi, cari game, harga kunci 3% backend, 1 wadah per game, tanpa bocoran supplier.
Upload timpa v6vercel, Redeploy, hard refresh. Tunggu sampai 156 provider, cek ML + badge TOP UP.
