# Blueberry V8 - Tampilan dari file V2 yang dikirim, Sistem V7 Fixed
- Tampilan: banner ML / AoE / Blood Strike, tabs SEMUA/TOP UP/PULSA/PAKET DATA/VOUCHER/E-MONEY, kartu produk, modal order - direplikasi bersih TANPA React bundle, TANPA harga dummy, TANPA VA palsu, TANPA email pribadi.
- Sistem: /api/storefront-products.js (V7 Fixed, parser robust, markup dari Env) + /api/create-order.js
- Upload isi folder ini ke folder v6vercel di GitHub (timpa index.html + style.css + api/*). Jangan bikin folder dobel. Root Directory tetap v6vercel.
- Env tetap: TOKOWENDIK_BASE_URL=https://tokowendigg.com, TOKOWENDIK_API_PATH_PRODUCTS=/api/prepaid/product, TOKOWENDIK_API_PATH_ORDER=/api/prepaid/transaction/create, TOKOWENDIK_API_KEY, TOKOWENDIK_SECRET_KEY, MARKUP_PCT=3
