# Blueberry V23 - Angka Jujur + 1 Wadah Beneran (Via Razer/Unipin digabung)
MASALAH SCREENSHOT V22:
- Status 1702 produk tapi 48 layanan: 1702 itu total sebelum filter (termasuk pulsa/data/PLN/e-money yang sudah dihapus). Layanan 48 itu wadah game, tapi angka 1702 nipu.
- Age Of Empires pecah 3: Mobile / Via Razer Link / Via Unipin Link. Padahal game sama, metode sama LINK.
FIX V23:
- gameName: buang suffix Via ... (Via Razer Link / Via Unipin Link / Via Login / Via Direct / Via Voucher) -> semua gabung ke base game. Age Of Empires jadi 1 wadah, isinya 44+12+34 paket, metode LINK.
- Angka: tambah gameProductCount() = sum GAMES items (produk game only). Status + header pakai itu, bukan ALL.length. Jadi status jadi "X produk game • Y layanan" yang sinkron dengan yang tampil.
- Kartu: subtitle tampilkan metode (Via LINK / Voucher / ID saja / ID+Server) + "Klik untuk lihat semua paket" biar jelas 1 kartu isi banyak paket.
- Tetap: game only, grouping category, metode dari note Tokowendik (LINK/ID/ID+Server/Voucher), tabs SEMUA/TOP UP/VOUCHER.
Upload timpa v6vercel, Redeploy, hard refresh. Cek: Age Of Empires harusnya 1 kartu, angka produk game = sum paket di kartu-kartu.
