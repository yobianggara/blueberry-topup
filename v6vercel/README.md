# Blueberry V22 - Metode Per Game dari Data Tokowendik (LINK / ID / ID+Server / Voucher)
CEK ULANG METODE (user: beberapa game pakai link):
- Akar V21: backend cuma kirim {id,name,category,price}. Field note/instruction/type Tokowendik yang isinya "Masukkan Link Profil / User ID + Server / Voucher" DIBUANG. Frontend jadi nebak dari nama doang -> game Link ke-detect ID+Server.
FIX V22:
- Backend storefront-products: forward note (note||description||instruction||how_to||detail||keterangan), ptype (type||product_type||category), raw_name. Jadi frontend bisa baca metode asli Tokowendik.
- Frontend inputKindForProduct: baca gabungan name+category+note+ptype, urutan: VOUCHER (voucher/redeem/kode/tanpa ID) -> LINK (link profil/link akun/login/username/url/http/www) -> PLN/PHONE (sisa) -> ID+SERVER (note ada server/zone) -> ID_ONLY (note ada user id saja) -> fallback nama game pasti.
- gameInputKind: prioritas LINK_ONLY > VOUCHER (kalau semua voucher) > ID_SERVER > ID_ONLY. 1 wadah = 1 cara isi, kalau ada 1 produk Link di game itu, game itu = LINK.
- Detail meta tampilkan METODE: LINK (via Link Akun) / VOUCHER / ID+Server / ID saja, biar customer + owner bisa cek.
- Game only tetap, grouping dari category (V21), tabs SEMUA/TOP UP/VOUCHER.
Upload timpa v6vercel, Redeploy, hard refresh. Cek game yang harusnya Link -> form LINK AKUN, meta METODE: LINK.
