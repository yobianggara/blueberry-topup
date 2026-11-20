# Blueberry V26 - Harga Kunci 3% + ML vs AoE Beda Total + Hapus Bocoran Supplier/Channel
FIX:
1. HARGA +3% DIKUNCI: backend markup = jika Env MARKUP_PCT kosong/0/invalid -> paksa 0.03 (3%). Sebelumnya kalau Env kehapus/0, harga balik ke harga seller. Tambah Cache-Control no-store biar harga lama tidak ke-cache. Rumus: ceil(harga supplier * 1.03), tanpa tulisan +3% di depan.
2. ML vs AoE BEDA TOTAL: gameInputKind kunci per game. Mobile Legends -> ID_SERVER selamanya (tidak bisa jadi LINK). Age Of Empires Mobile -> LINK_ONLY selamanya (tidak bisa jadi ID+Server). Game lain pakai deteksi dari data produk.
3. HAPUS BOCORAN: semua kata Tokowendik / Unipin / Razer dihapus dari frontend (help text, label, komentar). Help LINK jadi: "Tempel link profil game kamu. Buka game - Profil - Salin Link Profil - tempel di sini. Pastikan link benar & akun tidak private." Tanpa penjelasan supplier/channel. Nominal card tetap "Via Link" (metode, bukan supplier).
- Tetap: game only, 1 wadah per game, dedup 1 nominal = termurah, load anti-putus, tabs SEMUA/TOP UP/VOUCHER.
Upload timpa v6vercel, Redeploy, hard refresh. Cek: ML detail = ID+Server, AoE detail = LINK saja, tidak ada kata Tokowendik/Unipin/Razer di halaman, harga = harga tampil (sudah +3%, cek di Vercel Env MARKUP_PCT=3).
