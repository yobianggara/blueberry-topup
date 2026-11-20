# Blueberry V17 - Fix 404 script.js
DIAGNOSA dari screenshot user (Console):
Failed to load resource: /_vercel/insights/script.js -> 404
Penyebab: index.html manggil script Vercel Insights, tapi Vercel Analytics BELUM diaktifkan di project blueberry-topup, jadi file itu tidak ada -> 404.
Ini TIDAK bikin toko stuck (produk sudah muncul di V16), tapi bikin merah di Console + kelihatan tidak rapi.
FIX V17: hapus <script src="/_vercel/insights/script.js"> dari index.html.
Kalau mau Analytics: Vercel -> project blueberry-topup -> Analytics -> Enable. Tanpa script manual pun Vercel Analytics jalan lewat integrasi bawaan.
Isi V17 = V16 + fix ini. Upload timpa v6vercel, Redeploy.
