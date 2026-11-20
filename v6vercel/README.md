# Blueberry V30 - Fix Badge VOUCHER Semua (Regex ||) + ML Multi-Endpoint + Kartu ML WA
BUG 1 - Badge VOUCHER semua: regex classify ada "itunes||top" -> alternatif kosong match semua string -> semua game jadi VOUCHER. FIX: hapus ||, regex jadi /^(voucher|gift card|google play|steam|playstation|itunes|top up voucher|voucher game)/. Test: AoE->TOP UP, ML->TOP UP, COD->TOP UP, Steam->VOUCHER.
BUG 2 - ML hilang walau 156/156: ML tidak ada di /api/prepaid/provider saja. FIX backend: coba /api/prepaid/provider + /api/game/provider + /api/topup/provider + /api/product/provider, merge dedup by code. Kalau ML belum ketemu, coba endpoint game khusus. Product juga fallback ke /api/game/product.
FALLBACK: kalau setelah load penuh ML tetap tidak ada, tampilkan kartu "Mobile Legends (Tanya WA)" agar user tidak mikir web tidak jual ML - klik -> WA order.
Tetap: provider sort+cache+retry 10 detik, retry batch gagal, loading jujur, header fungsi, cari game, harga kunci 3% backend, 1 wadah per game, tanpa bocoran supplier.
Upload timpa v6vercel, Redeploy, hard refresh. Tunggu 156 provider, cek badge AoE = TOP UP, cari "mobile" -> ML harus muncul (asli atau kartu WA).
