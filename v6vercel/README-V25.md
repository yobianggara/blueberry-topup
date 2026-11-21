V25 FIX TOKO KE-CACHE

Gejala: admin sudah V24 (ada tombol Cek Redis), tapi tab toko masih HTML lama 'Memuat katalog...' tanpa tombol Coba Lagi.
Penyebab: browser / CDN masih nyimpen index.html lama.

Perbaikan V25:
- fetch katalog + config pakai cache:'no-store' + ?v=25
- loadConfig timeout 3 detik, tidak bisa menahan load katalog
- vercel.json: header no-cache untuk HTML
- footer bertuliskan V25 (bukti versi yang kebuka)
- status awal bertuliskan (V25) + tombol Coba Lagi langsung tampil

Cara pasang: upload semua file v9/ timpa lama, Redeploy tanpa Build Cache.
Cara buka toko setelah deploy: di tab toko tekan Ctrl+Shift+R (hard refresh) ATAU buka tab Incognito baru ke blueberrytopup.com.
Kalau footer belum tulis V25, berarti yang kebuka masih cache lama.
