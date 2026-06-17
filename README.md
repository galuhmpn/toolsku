# Kalkulator Material - 1 Tool, 10 Variasi Desain

Satu Web Component (`<kalkulator-material>`) dengan 10 skin desain yang dipilih lewat atribut `desain`. Mesin hitung, katalog harga, theming, dan lead-capture WhatsApp tetap sama; yang berubah hanya tampilan.

## Isi Paket

```text
toolsku/
├─ dist/efisien-material-skins.js   <- engine + 10 skin, file utama yang di-host
├─ catalog.json                     <- katalog harga
├─ demo/index.html                  <- showcase 10 desain + kontrol live
├─ index.html                       <- pintu masuk demo saat di-host
└─ README.md
```

## Cara Melihat Design Tools

Lokal:

```bash
python -m http.server 8010
```

Lalu buka:

```text
http://127.0.0.1:8010/demo/
```

Jika di-host memakai GitHub Pages, Cloudflare Pages, Netlify, Vercel, atau hosting biasa, buka halaman root proyek atau langsung ke `/demo/`.

## Cara Pakai Universal

Host dua file ini di tempat publik yang bisa diakses website:

- `dist/efisien-material-skins.js`
- `catalog.json`

Pasang script sekali, idealnya sebelum `</body>`:

```html
<script
  src="https://tools.domainmu.com/dist/efisien-material-skins.js"
  data-catalog="https://tools.domainmu.com/catalog.json">
</script>
```

Lalu pasang komponen di section mana pun:

```html
<kalkulator-material
  kategori="paving-block"
  desain="glass"
  warna="#1B4DFF"
  wa="628123456789">
</kalkulator-material>
```

Karena memakai Shadow DOM, CSS dari website host tidak mudah merusak tampilan tool, dan CSS tool juga tidak mengotori website host.

## Dipakai di Beberapa Website atau Tema

Pakai satu file script yang sama untuk semua website. Yang dibedakan cukup atribut di tag HTML.

Website kontraktor aspal:

```html
<kalkulator-material kategori="aspal" desain="dark" tema="aspal" wa="628123456789"></kalkulator-material>
```

Website paving block:

```html
<kalkulator-material kategori="paving-block" desain="classic" tema="paving" wa="628123456789"></kalkulator-material>
```

Website event/backdrop:

```html
<kalkulator-material kategori="backdrop" desain="gradient" tema="event" wa="628123456789"></kalkulator-material>
```

Website interior/lantai kayu:

```html
<kalkulator-material kategori="lantai-kayu" desain="luxury" warna="#b8860b" wa="628123456789"></kalkulator-material>
```

## Pilihan Desain

| `desain` | Nama | Karakter |
|---|---|---|
| `1` / `classic` | Classic Card | Kartu putih bersih |
| `2` / `neumorph` | Neumorphism | Lembut, bayangan ganda |
| `3` / `glass` | Glassmorphism | Kaca buram di atas background berwarna |
| `4` / `dark` | Dark Neon | Gelap, aksen neon |
| `5` / `brutalist` | Neo-Brutalist | Garis tebal, bayangan keras |
| `6` / `minimal` | Minimal Line | Tipis, bersih, tanpa kartu besar |
| `7` / `gradient` | Vibrant Gradient | Aksen gradient cerah |
| `8` / `material` | Material Design | Filled input dan elevation |
| `9` / `retro` | Retro Warm | Krem hangat, dashed border |
| `10` / `luxury` | Luxury Gold | Gelap elegan, aksen emas |

## Atribut

| Atribut | Fungsi |
|---|---|
| `desain` | Pilih skin 1-10 atau nama skin |
| `kategori` | Kunci material di katalog, misalnya `paving-block`, `aspal`, `marka` |
| `warna` | Warna brand custom, menimpa warna default skin |
| `tema` | Preset warna: `aspal`, `paving`, `pajak`, `event`, `teknik`, `minimal` |
| `font` | Font family custom |
| `wa` | Nomor WhatsApp tujuan lead |
| `cta` | Teks tombol CTA |
| `lead-endpoint` | URL backend penangkap lead opsional |
| `sembunyikan-harga` | Sembunyikan harga di dropdown |
| `judul` | Judul kustom |

## Catatan Platform

- HTML statis: taruh script + tag komponen langsung di halaman.
- Webflow/Wix/Shopify/Ghost/Joomla/Drupal: taruh script di custom code, lalu tag komponen di blok Embed/HTML.
- WordPress: gunakan plugin installable di `wordpress-plugin/efisien-tools-loader` atau upload `releases/efisien-tools-loader.zip`, lalu pakai shortcode `[efisien_tool kategori="lighting"]`.
- React/Vue/Svelte/Angular: muat script sekali di layout/root HTML, lalu pakai tag `<kalkulator-material>` seperti custom element biasa.

## Plugin WordPress

Plugin universal tersedia di:

```text
wordpress-plugin/efisien-tools-loader/
releases/efisien-tools-loader.zip
```

Fitur plugin:

- Memuat engine dan katalog dari GitHub CDN.
- Shortcode manual: `[efisien_tool kategori="lighting"]`.
- Shortcode auto produk: `[efisien_tool_auto]`.
- Settings page di WordPress Admin > Settings > Efisien Tools.
- Auto tampil di WooCommerce single product, opsional.
- Kompatibel dengan PHP 7.2+.

## Inti Sistem

- Mode hitung luas: panjang x lebar, ditambah waste.
- Mode hitung panjang: panjang saja, cocok untuk marka.
- Katalog harga dibaca dari `catalog.json`, dengan fallback bawaan di bundle JS.
- Tombol CTA membuka WhatsApp berisi ringkasan estimasi.
- `lead-endpoint` bisa dipakai untuk mengirim data lead ke backend sendiri.

Menambah atau mengubah desain dilakukan dengan menambah entri di objek `SKINS` pada `dist/efisien-material-skins.js`. Struktur DOM dan logika hitung tidak perlu disentuh.
