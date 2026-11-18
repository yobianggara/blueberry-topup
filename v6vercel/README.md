# Blueberry Topup — V6 FIXED (Header Supplier Sudah Benar)

## Key / Value yang harus diisi di Vercel — copy persis ini untuk Key-nya

### 1. Supplier (dari screenshot Dokumentasi API kamu)
| Key di Vercel | Value yang diisi |
|---|---|
| TOKOWENDIK_BASE_URL | https://tokowendigg.com |
| TOKOWENDIK_API_PATH_PRODUCTS | /api/prepaid/product |
| TOKOWENDIK_API_PATH_ORDER | /api/prepaid/transaction/create |
| TOKOWENDIK_API_KEY | (API Key kamu — yang sudah kamu punya, jangan kirim ke chat) |
| TOKOWENDIK_SECRET_KEY | (Secret Key kamu — yang sudah kamu punya, dipakai sebagai Signature di header order) |

Kenapa dipisah BASE + PATH?
- Kode gabung jadi: BASE + PATH = https://tokowendigg.com/api/prepaid/product
- Kalau kamu isi BASE sudah termasuk /api/prepaid/product, nanti jadinya dobel dan gagal.

Header yang dipakai kode (sudah diperbaiki):
- Ambil produk: Authorization: Bearer API_KEY
- Buat order: Authorization: Bearer API_KEY + Signature: SECRET_KEY

### 2. Admin & Toko (kamu yang tentukan)
| Key | Value |
|---|---|
| ADMIN_PIN | PIN baru kamu (6 angka, yang kamu ingat) |
| CUSTOMER_SALT | Kata acak baru, contoh: blueberry-2026-aman |
| MARKUP_PCT | 3 |
| BCA_ACCOUNT | Nomor BCA kamu |
| DANA_ACCOUNT | Nomor DANA kamu |

### 3. Gateway VA (Tripay) — skip dulu kalau belum verif
| Key | Value |
|---|---|
| TRIPAY_API_KEY | Dari dashboard Tripay > API |
| TRIPAY_MERCHANT_CODE | Dari dashboard Tripay > Merchant |
| TRIPAY_PRIVATE_KEY | Dari dashboard Tripay > API |
| SITE_URL | https://blueberrytopup.com |

Kalau 3 Tripay belum ada, VA belum aktif. Toko tetap jalan dengan 10 Env di atas.

## Webhook Supplier
Pasang di dashboard supplier > Member > Settings > Webhook:
https://blueberrytopup.com/api/tokowendik-webhook
Status yang dikirim: unpaid, processing, success, failed, expired, refund.

## Deploy
1. Upload isi folder ini ke GitHub (timpa V6 lama), Root Directory tetap: v6vercel
2. Vercel > Deployments > Redeploy
3. Settings > Environment Variables > isi tabel di atas > Redeploy lagi (wajib setelah isi Env)
