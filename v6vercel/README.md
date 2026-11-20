# Blueberry V20 - GAME ONLY + 1 Wadah Per Game + Cara Isi Per Game (Tokowendik)
ATURAN BARU (dari user):
- PULSA / PAKET DATA / PLN / E-MONEY DIHILANGKAN. Toko jadi GAME ONLY biar operasional gampang. Tab-nya dihapus, produknya difilter di buildGames (isGameProduct).
- 1 game = 1 wadah: gameNameFromProduct buang varian (Anti Limit, Q2, S8, V3, V4, Season, dll) + potong 4 kata. Contoh: Age Of Empires Mobile Anti Limit Q2/S8/V3/V4/V7 -> 1 kartu Age Of Empires Mobile, semua produk di dalamnya.
- Cara isi per GAME (gameInputKind): dominan dari produk di game itu, bukan per nominal. 1 wadah = 1 cara isi.
  * ID_SERVER: Mobile Legends dll
  * ID_ONLY: Free Fire, PUBG, Blood Strike dll
  * LINK_ONLY (BARU): game via link - tempel Link Akun / Link Profil, tanpa ID
  * VOUCHER: UniPin dll - tanpa ID, kode via WA
- Detail form + order() pakai gameInputKind. Label/placeholder/help ganti otomatis.
Upload timpa v6vercel, Redeploy, cek: tab PULSA/PLN hilang, Age Of Empires jadi 1 kartu, klik game link -> form LINK.
