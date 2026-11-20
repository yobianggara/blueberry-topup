# Blueberry V25 - Dedup Nominal (1 nominal = 1 termurah) + Load Anti-Putus + Harga +3% Tetap
JAWABAN USER:
- Kenapa ML + Age Of Empires jadi kayak gitu? Karena 1 wadah gabung 3 jalur Tokowendik (Direct + Via Razer Link + Via Unipin Link). Nominal sama (99) muncul 3-4x dengan harga beda tipis. Bukan error, tapi duplikat tidak dirapikan.
- Harga sudah +3%? YA. Backend: price = ceil(harga Tokowendik * (1 + MARKUP_PCT/100)), MARKUP_PCT=3 di Vercel Env. Tidak ada tulisan +3% di depan.
FIX V25:
- buildGames dedup: kunci = angka + kata inti (koin/coins disamakan, via/razer/unipin/link/direct/voucher dibuang). "99 Koin Apex" dan "99 Apex Coins" -> kunci sama. Simpan yang PALING MURAH, buang yang lebih mahal. Age Of Empires: 90 paket -> jadi paket unik saja, 1 nominal 1 kartu.
- Load resilient: batch gagal (timeout Tokowendik) -> retry 1x -> kalau masih gagal, lanjut batch berikutnya, jangan berhenti total. Sebelumnya 1 batch gagal = load berhenti, makanya 932 -> 331, 29 layanan -> 9 layanan.
- Tetap: game only, 1 wadah per game, metode LINK/ID/ID+Server/Voucher dari note Tokowendik, tabs SEMUA/TOP UP/VOUCHER.
Upload timpa v6vercel, Redeploy, hard refresh, tunggu sampai status "932 produk game" balik (bukan 331), cek Age Of Empires: 99 cuma 1 kartu (yang termurah).
