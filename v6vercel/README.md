# Blueberry V10 - Tampilan V9 + Harga REAL + Payment DUITKU (VA Semua Bank)
- Tampilan: Blueberry Store ungu gelap, grid game per provider, detail game -> nominal, ID/Server, payment. SAMA seperti V9.
- Harga: /api/storefront-products.js = FIX7 (provider loop ?provider=CODE&active=1). Markup dari Env MARKUP_PCT=3. TIDAK ada harga dummy.
- Payment: /api/create-order.js -> Duitku v2/inquiry
  Endpoint: POST https://passport.duitku.com/webapi/api/merchant/v2/inquiry
  Signature: MD5(merchantCode + merchantOrderId + paymentAmount + merchantKey)
  Response: reference + paymentUrl + vaNumber (untuk VA). VA ini dari Duitku, bisa dibayar dari bank apapun.
  Mapping: BCA=BC, BNI=I1, BRI=A1, Mandiri=M1, CIMB=B1, Permata=BT, Maybank=VA, DANA=DA, OVO=OV, Gopay=GP, ShopeePay=SP, QRIS=QR
  Jika Env DUITKU belum diisi -> TIDAK ada VA palsu, muncul instruksi transfer manual + kode BB-... + konfirmasi WA.
- Webhook: /api/duitku-webhook.js - verifikasi signature MD5(merchantCode+amount+merchantOrderId+merchantKey), balas SUCCESS jika resultCode 00.
- Env WAJIB di Vercel (JANGAN di GitHub / chat):
  TOKOWENDIK_API_KEY, MARKUP_PCT=3, SITE_URL=https://blueberrytopup.com
  WHATSAPP_NUMBER, BCA_ACCOUNT (untuk manual fallback)
  DUITKU_MERCHANT_CODE (contoh DXXXXX, dari dashboard Duitku -> Merchant)
  DUITKU_MERCHANT_KEY (Merchant Key / API Key dari Duitku)
  Hapus Env TRIPAY_* lama bila sudah tidak dipakai.
- Callback di Duitku: di dashboard Duitku -> Project / Pengaturan -> Callback URL isi https://blueberrytopup.com/api/duitku-webhook
- Upload isi folder ini ke folder v6vercel di GitHub (timpa semua). Root Directory tetap v6vercel. Lalu Redeploy.
