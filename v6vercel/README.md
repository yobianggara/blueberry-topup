# Blueberry V27 - AoE 1 Wadah Beneran + Classify dari Nama Game + Tanpa Bocoran
SCREENSHOT V26: AoE masih pecah 2 (Anti Limit 12 paket + Mobile 42 paket), kartu pertama ID+Server, subtitle VOUCHER salah.
FIX V27:
- gameName: strip suffix BERULANG sampai stabil (loop 6x): Via ..., Anti Limit/No Limit, Flash Sale/Promo/Murah/Fast, Q/S/V/Season, ( ... ). "Age Of Empires Mobile Anti Limit" -> "Age Of Empires Mobile". "Age Of Empires Mobile Via Link Anti Limit" juga gabung. Tanpa nama brand di regex.
- gameInputKind: kunci AoE pakai includes('age of empires') (lebih longgar), ML pakai includes('mobile legend'). AoE Anti Limit tetap LINK, tidak jatuh ke ID+Server.
- classifyGame: hanya dari NAMA GAME, bukan dari nama produk. AoE tidak jadi VOUCHER gara-gara 1 produknya ada kata voucher. Voucher murni hanya kalau nama game-nya voucher (Steam, Google Play, dll). AoE -> TOP UP.
- Tetap: harga kunci 3% (backend), dedup 1 nominal termurah, load anti-putus, tanpa kata Tokowendik/Unipin/Razer di depan.
Upload timpa v6vercel, Redeploy, hard refresh. Cek: AoE harusnya 1 kartu, subtitle TOP UP + Via LINK, ML 1 kartu TOP UP + ID+Server.
