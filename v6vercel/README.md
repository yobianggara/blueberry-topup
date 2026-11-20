# Blueberry V41 - FIX UNGGULAN KOSONG: Game Selalu Terlihat, Tidak Pernah Halaman Kosong
BUG: Hero AoE keren, tapi UNGGULAN kosong, Paling dicari kosong, padahal 855 produk ke-load. User bingung mau beli apa.
AKAR: Heading UNGGULAN statis di luar gameGrid, jadi kalau gameGrid gagal ke-render, yang keliatan cuma heading + trust box.
FIX V41: Heading luar jadi "PILIH GAME - KLIK GAME-NYA". Kartu statis AoE/ML/FF/Blood/Honor/Genshin DITANEM di dalam gameGrid dari awal (gambar img/*.webp) - selalu terlihat walau API/render gagal, diganti data asli begitu renderHome berhasil. Paling dicari fallback statis. renderHome defensif (kalau filter tab bikin kosong padahal GAMES ada, pakai GAMES). Watchdog 2 detik: kalau gameGrid kosong padahal GAMES ada, render ulang.
Tetap V40: Tanpa Cari, ML 1 wadah (tanpa Region), AoE Hero, UNGGULAN AoE, gambar akurat, MLBB-ID-V3, 3 section scroll ke bawah, V9 klik kartu baru produk, loading buah CSS, cache, harga 3%.
UPLOAD: Extract -> timpa v6vercel (pastikan v9/img ikut) -> Redeploy -> hard refresh. Cek: abis loading langsung keliatan 6 kartu + Paling dicari terisi, tidak pernah kosong. Klik AoE/ML -> produk muncul.
