# Blueberry V15 - Fix Stuck Total: Diagnostic + Multi-Fallback
MASALAH V14: masih stuck 'Memuat katalog...' walau deploy Ready. Artinya backend gagal total, frontend tidak tahu kenapa.
FIX V15:
- Backend nyoba 2 KUNCI: TOKOWENDIK_API_KEY dulu, kalau ditolak nyoba TOKOWENDIK_SECRET_KEY.
- Backend nyoba 2 CARA: (A) provider-loop paralel (cara FIX7, dulu raw_count 302), (B) direct /api/prepaid/product?active=1 tanpa provider (kalau endpoint provider berubah).
- Backend balikin debug JUJUR: has_api_key, has_secret, base_used, tried (HTTP + pesan supplier).
- Frontend: tidak pernah muter diam lagi. Kalau gagal, tampil kotak merah + pesan error + tombol Coba Lagi + link 'Lihat Error Detail' (buka /api/storefront-products) + tombol WA manual.
CARA DIAGNOSA SETELAH UPLOAD V15 (1 menit):
1. Buka https://blueberrytopup.com/api/storefront-products di tab baru.
2. Lihat JSON: kalau ok:true + raw_count >0 -> toko harusnya muncul. Kalau ok:false -> baca debug.tried, itu jawaban kenapa ditolak (401 = key salah / expired, 404 = path berubah, 0 = Tokowendik down).
3. Kalau 401, regenerate API Key di Tokowendik -> copy ke Vercel Env TOKOWENDIK_API_KEY -> Redeploy.
Isi V15 = V14 + fix di atas. Upload timpa v6vercel, Redeploy.
