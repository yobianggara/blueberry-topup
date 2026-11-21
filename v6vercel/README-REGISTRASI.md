# V19 - Registrasi + Auto Email ke raffmong@gmail.com

## Yang sudah jalan TANPA setup tambahan
- Customer klik Daftar di toko -> isi Nama, WA, Email -> data tersimpan di Admin (menu Registrasi Customer)
- Admin bisa lihat semua pendaftar + klik "Kirim ke Email" untuk kirim manual via mailto

## Biar AUTO kirim email (tanpa klik manual)
1. Daftar gratis di https://resend.com -> buat API Key
2. Di Vercel -> Project blueberry-topup -> Settings -> Environment Variables
   Tambah: RESEND_API_KEY = <key dari Resend>
   (Jangan kirim key-nya di chat)
3. Redeploy
4. Tes: daftar pakai email lain -> cek inbox raffmong@gmail.com -> harus ada email "[Blueberry] Pendaftar Baru"

## Tampilan
- Hanya ada 2 tab: TOP UP dan VOUCHER. Pulsa / Paket Data / PLN / E-Money sudah tidak tampil.
