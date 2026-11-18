# Blueberry Topup — V6 Vercel + VA + Admin Full
## Apa yang aktif di versi ini
- Tampilan V2 bersih, profesional. Customer TIDAK melihat: nama supplier, harga modal, markup, Env, API, kunci, PIN.
- Pembayaran: BCA Virtual Account + DANA Virtual Account via gateway (Tripay). Jalur sudah aktif di /api/create-va.js + /api/tripay-callback.js.
- Admin: /admin-live.html — login PIN server, tombol Perbarui Harga, Laporan Penjualan (Hari Ini / 7 Hari / 30 Hari / Semua), Pesanan Terbaru.
- Harga: /api/storefront-products.js — harga jual = harga internal * (1 + markup). Markup hanya dari Env MARKUP_PCT.

## Keamanan — baca ini
- Semua kunci (supplier, gateway, PIN Admin, SALT) HANYA di Vercel Env. TIDAK PERNAH di file repo, TIDAK PERNAH di chat, TIDAK PERNAH dikirim ke browser.
- Browser hanya menerima: nama produk, harga JUAL, nomor VA (setelah dibuat), status pesanan. Browser TIDAK PERNAH menerima: harga modal, API Key, Secret, Private Key, PIN.
- Callback gateway diverifikasi pakai signature (HMAC). Callback palsu ditolak.
- Jangan commit file .env. Jangan screenshot Env. Jangan paste kunci di chat / GitHub.

## Env yang harus diisi di Vercel (copy dari project lama + baru)
LAMA (10): TOKOWENDIK_BASE_URL, TOKOWENDIK_API_KEY, TOKOWENDIK_SECRET_KEY, TOKOWENDIK_API_PATH_PRODUCTS, TOKOWENDIK_API_PATH_ORDER, ADMIN_PIN, BCA_ACCOUNT, DANA_ACCOUNT, CUSTOMER_SALT, MARKUP_PCT=3
BARU (gateway VA, 4): TRIPAY_API_KEY, TRIPAY_MERCHANT_CODE, TRIPAY_PRIVATE_KEY, SITE_URL=https://blueberrytopup.com
- Ambil 4 yang baru dari dashboard Tripay kamu (Mode Production, bukan Sandbox, kalau mau VA asli). Isi langsung di Vercel Settings > Environment Variables. Jangan kirim ke chat.
- Setelah isi Env: Deployments > Redeploy. Wajib.

## Alur VA (customer)
Pilih Game > Pilih Produk > Daftar Gmail > Isi ID Game > Pilih BCA VA / DANA VA > Buat Virtual Account > Bayar sesuai nominal ke nomor VA yang muncul > Gateway kirim callback PAID > Pesanan diproses otomatis.

## Alur Admin
Login /admin-live.html pakai PIN > Lihat KPI (produk, pesanan hari ini, omzet, menunggu bayar) > Perbarui Harga Sekarang (tarik harga terbaru) > Laporan Penjualan per periode > Pesanan Terbaru.

## Deploy
1. Upload isi ZIP ini ke GitHub (repo baru / repo lama, timpa file lama).
2. Vercel > Import Git Repository > pilih repo > Deploy.
3. Isi Env (di atas) > Redeploy.
4. Domains > blueberrytopup.com + www.blueberrytopup.com > atur DNS di registrar sesuai instruksi Vercel.
5. Tes: buat order kecil, bayar VA, cek callback PAID + laporan Admin.

## Catatan database
File ini memakai gateway + sistem internal sebagai sumber kebenaran pesanan. Untuk laporan 100% real-time tanpa jeda, hubungkan database pesanan (Vercel KV / Postgres / Sheets internal) di /api/admin-dashboard.js, /api/admin-report.js, /api/tripay-callback.js — struktur datanya sudah disiapkan.
