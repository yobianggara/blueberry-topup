V24 FIX REDIS + KATALOG STUCK

Penyebab V23 stuck: api/storefront-products.js manggil loadStore() tapi lupa import -> server 500 -> toko stuck 'Memuat katalog...' & admin 'Tidak ada produk'.

Perbaikan V24:
- Tambah import loadStore + try/catch: Redis down pun toko tetap jalan (harga auto).
- _store.js baru: verifikasi tulis Redis (deteksi token READ_ONLY), fallback aman.
- Baru: /api/diag -> cek Redis baca+tulis + cek supplier + cek env mana yang kebaca.
- Admin: tombol Cek Redis & Supplier.
- Toko: kalau gagal load, ada tombol Coba Lagi, tidak stuck diam.

Cara upload: upload SEMUA file di folder v9/ ini ke GitHub (timpa yang lama), lalu di Vercel Deployments > ... > Redeploy (tanpa centang Build Cache).

PENTING TOKEN: UPSTASH_REDIS_REST_TOKEN harus dari KV_REST_API_TOKEN (tanpa READ_ONLY). Kalau pakai READ_ONLY, admin tidak bisa simpan harga.
Cek: buka blueberrytopup.com/api/diag — harus tulis write_ok:true.
