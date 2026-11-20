# Blueberry V39 - ACC - AoE Unggulan + Gambar Akurat + MLBB-ID-V3 + V9 Klik Game Baru Produk
ACC USER: sampel V39 pertama, UNGGULAN AoE, gambar per game akurat, jangan seperti yang ke-2.
- BACKEND (tidak kelihatan di depan): /api/storefront-products.js fetch MLBB-ID-V3 dulu di offset 0 (dari admin Tokowendik), digabung + dedup. ML jadi produk ASLI, bukan WA-only. Kalau gagal, fallback WA tetap ada.
- UNGGULAN: AoE dipin paling depan. Urutan: AoE, ML, FF, Blood Strike, Honor, Genshin.
- GAMBAR AKURAT (1 game = 1 gambar): img/aoe.webp kastil+ksatria, img/ml.webp MOBA jungle, img/ff.webp battle royale, img/blood.webp tentara kota hancur, img/hok.webp raja Cina, img/genshin.webp traveler. Game tanpa gambar pakai gradient+huruf, tidak pakai gambar game lain.
- 3 SECTION scroll ke BAWAH: UNGGULAN + BARU + TOP UP LANGSUNG. Grid vertikal.
- SISTEM V9: depan HANYA kartu gambar, klik kartu baru muncul detail: 1 Pilih Nominal, 2 Isi ID/Link (ML ID+Server, AoE Link saja, FF ID saja), 3 Bayar. Cari opsional.
- Tetap: loading buah CSS, cache 10 menit, load V32 batch 6, backend V31 fast, harga 3% backend, 1 wadah per game, tanpa bocoran supplier/markup/kode provider di UI.
UPLOAD: Extract -> timpa v6vercel (pastikan v9/img ikut) -> Redeploy -> hard refresh. Cek: UNGGULAN pertama AoE gambar kastil -> ML kedua gambar MOBA produk ASLI -> klik AoE produk + input Link -> klik ML produk + ID+Server.
