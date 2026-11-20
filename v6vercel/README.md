# Blueberry V29 - Katalog Stabil (Fix 7 -> 27 Game) + ML Tidak Hilang + Loading Jujur
AKAR MASALAH (dari kode V28):
- Backend tiap batch fetch ulang daftar provider, urutan bisa berubah tiap request -> slice offset jadi nggak konsisten, ada provider kelewat / ke-double / ke-drop. Angka lompat 620/827/877.
- Timeout produk cuma 4 detik, tanpa retry -> provider lambat (ML seringnya) langsung dibuang jadi 0, game hilang di load itu.
FIX V29:
- Backend: provider list DI-SORT by code (stabil) + CACHE 5 menit (urutan sama antar batch) + timeout 10 detik + RETRY 2x per provider yang kosong.
- Frontend: batch yang gagal 2x TIDAK dibuang, dicatat -> di-retry di akhir load. Status tunjukkan progress provider X/156.
- Search kosong: kalau masih loading, tampilkan "Masih memuat... tunggu sampai 156/156, game yang dicari mungkin belum ke-load, bukan hilang" (bukan "Belum ada layanan").
- Tetap: badge TOP UP/VOUCHER dari nama game (V28), header fungsi (search/lonceng/daftar), kotak Cari Game, harga kunci 3% backend, 1 wadah per game, tanpa bocoran supplier.
Upload timpa v6vercel, Redeploy, hard refresh. Tunggu sampai status "156 provider" selesai baru cari ML.
