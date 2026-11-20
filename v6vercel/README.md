# Blueberry V24 - FIX Detail Kosong + Metode LINK Age Of Empires
AKAR DARI SCREENSHOT V23:
- Homepage BENAR (29 layanan, 932 produk game, Age Of Empires 90 paket). Detail SALAH: nominal kosong, pembayaran kosong, form ID+Server.
- Penyebab 1 (fatal): function refreshDetailForm() HILANG dari file (kehapus pas patch V19-V23). openGame() manggil refreshDetailForm() -> JS error -> openGame BERHENTI sebelum isi nominalGrid/payGrid. Makanya nominal + pembayaran kosong.
- Penyebab 2: openGame() habis manggil refresh, langsung TIMPA lagi dMeta/dDesc/dHelp dengan teks hardcoded "ID + Server" -> game LINK jadi keliatan ID+Server.
- Penyebab 3: regex LINK tidak kenal "Via Razer Link / Via Unipin Link" (cuma kenal "link profil / link akun"). Age Of Empires Via Razer/Unipin jadi tidak ke-detect LINK.
FIX V24:
- Balikin refreshDetailForm() + detailModeForSelected() (1 wadah = 1 cara isi via gameInputKind).
- Hapus overwrite hardcoded di openGame. Judul step + label + help + meta sekarang dari refreshDetailForm (LINK -> "1. Link Akun / Link Profil (Via Link)", Server hilang).
- Regex LINK: tambah via (razer|unipin).*link, razer link, unipin link, via link. Age Of Empires gabungan (Direct+Razer+Unipin) -> LINK.
- Perbaiki syntax load() yang patah di V23.
- Nominal button label pakai metode game (Via Link / Voucher / ID saja / ID+Server).
Upload timpa v6vercel, Redeploy, hard refresh. Cek Age Of Empires detail: judul LINK, tanpa Server, nominal 90 tombol, pembayaran 9 tombol.
