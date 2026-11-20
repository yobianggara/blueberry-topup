# Blueberry V34 - Sistem Kompetitor (Overlay Diamond + Cache + Kartu Gambar + 3 Section)
MENIRU SISTEM CODASHOP (bukan nyolong gambar):
- Loading overlay: layar gelap + diamond 💎 + bar loading + "Memuat..." + progress provider. User tau lagi loading, bukan mikir rusak. Hilang otomatis kalau sudah selesai / cache tampil.
- Cache: katalog disimpan di localStorage 10 menit. Buka kedua langsung tampil dari cache (instan), harga di-update di background. Tidak lagi fetch 156 provider dari 0 tiap buka (yang bikin 7->27->timeout).
- Kartu gambar: bukan huruf M/A/B lagi. Cover gradient + emoji game (ML ⚔️, FF 🔥, AoE 🏰, Blood Strike 🎯, dll) + badge TOP UP/VOUCHER + nama + "Dari Rp ...". Mirip Codashop (gambar + nama di bawah), tapi pakai emoji/gradient sendiri, bukan gambar berhak cipta mereka.
- 3 Section kayak kompetitor: UNGGULAN (12 pertama) + BARU (12 terakhir) + TOP UP LANGSUNG (semua, scroll horizontal). Kalau lagi cari (ketik di Cari), tampil 1 grid hasil cari.
- Tetap: Cara Order + tombol populer (V33), load V32 (batch 6, lanjut offset), backend V31 fast, classify TOP UP bener, ML WA fallback, harga kunci 3% backend, 1 wadah per game, tanpa bocoran supplier.
Upload timpa v6vercel, Redeploy, hard refresh. Cek: buka -> overlay diamond -> kartu gambar muncul -> scroll -> BARU + TOP UP LANGSUNG.
