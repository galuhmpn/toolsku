# Kalkulator Material — 1 Tool, 10 Variasi Desain

Satu tool (`<kalkulator-material>`) dengan **10 skin desain** yang bisa dipilih lewat atribut `desain`.
**Mesin hitung, katalog harga, theming, dan lead-capture WhatsApp tetap sama persis** dengan sistem Efisien Tools asli — yang berubah hanya tampilan.

## Isi paket
```
efisien-material-10design/
├─ dist/efisien-material-skins.js   ← engine + 10 skin (file utama yang di-host)
├─ catalog.json                     ← katalog harga (sama dengan sistem asli)
├─ demo/index.html                  ← demo: 10 desain tampil bersamaan + kontrol live
└─ README.md
```

## Cara lihat hasil
Buka `demo/index.html` di browser. Ubah **kategori**, **warna brand**, dan **nomor WhatsApp** — semua kartu ikut berubah serempak, membuktikan satu sistem yang sama.

## Cara pakai (UNIVERSAL — CMS apa pun / HTML statis)
Tool ini adalah **Web Component vanilla**, jadi berjalan di mana saja yang bisa menaruh tag HTML:
HTML statis, Webflow, Wix (embed/custom code), Shopify, Blogger, Ghost, Joomla, Drupal,
landing page builder, framework JS (React/Vue/Svelte/Angular), **maupun WordPress**.

Taruh satu baris script (sekali, idealnya sebelum `</body>`), lalu pasang elemen di section mana pun:
```html
<script src="https://tools.domainmu.com/efisien-material-skins.js" data-catalog="https://tools.domainmu.com/catalog.json"></script>

<kalkulator-material kategori="paving-block" desain="glass"     wa="628123456789"></kalkulator-material>
<kalkulator-material kategori="aspal"        desain="dark"      wa="628123456789"></kalkulator-material>
<kalkulator-material kategori="lantai-kayu"  desain="luxury"    warna="#b8860b"></kalkulator-material>
```
Karena memakai **Shadow DOM**, desain/CSS website host tidak akan saling merusak — cocok untuk ditanam di CMS mana pun.

### Catatan per platform
- **HTML / CMS standalone**: cukup tempel script + elemen di atas. Tidak perlu plugin apa pun.
- **Builder (Webflow/Wix/Shopify/Ghost/dll)**: tempel script di pengaturan “custom code / embed HTML”, lalu pasang elemen `<kalkulator-material …>` di blok Embed/HTML.
- **Framework JS (React/Vue/Svelte)**: pakai elemen seperti tag biasa; muat script sekali (mis. di `index.html` atau via `<script>` dinamis).
- **WordPress (opsional)**: kompatibel dengan plugin `Efisien Tools Loader` yang sudah ada — cukup tambahkan atribut `desain` pada shortcode. WordPress hanyalah salah satu cara distribusi, bukan keharusan.

## 10 Desain yang tersedia
| `desain` | Nama | Karakter |
|---|---|---|
| `1` / `classic`  | Classic Card     | Kartu putih bersih (tampilan asli) |
| `2` / `neumorph` | Neumorphism      | Lembut, bayangan ganda, tanpa garis |
| `3` / `glass`    | Glassmorphism    | Kaca buram di atas gradient |
| `4` / `dark`     | Dark Neon        | Gelap, aksen neon, monospace |
| `5` / `brutalist`| Neo-Brutalist    | Garis tebal, bayangan keras |
| `6` / `minimal`  | Minimal Line     | Tanpa kartu, input garis bawah |
| `7` / `gradient` | Vibrant Gradient | Header gradient cerah |
| `8` / `material` | Material Design  | Filled input, elevation, tombol pill |
| `9` / `retro`    | Retro Warm       | Krem hangat, tepi dashed |
| `10`/ `luxury`   | Luxury Gold      | Gelap elegan, aksen emas, serif |

> Bisa pakai nomor (`desain="3"`) atau nama (`desain="glass"`).

## Atribut (sama dengan sistem asli + 1 baru)
| Atribut | Fungsi |
|---|---|
| `desain` | **(BARU)** pilih skin 1–10 atau nama skin |
| `kategori` | kunci material di katalog (`paving-block`, `aspal`, `marka`, …) |
| `warna` | warna brand custom, menimpa warna default skin |
| `tema` | preset warna (`aspal`, `paving`, `pajak`, …) |
| `font` | font family custom |
| `wa` | nomor WhatsApp tujuan leads |
| `cta` | teks tombol |
| `lead-endpoint` | URL backend penangkap leads (opsional) |
| `sembunyikan-harga` | sembunyikan harga di dropdown |
| `judul` | judul kustom |

## Yang TETAP sama (inti sistem)
- **Mesin hitung**: `mode "luas"` (panjang×lebar) atau `"panjang"`, plus faktor `waste %` → kebutuhan & estimasi biaya.
- **Katalog**: dibaca dari `catalog.json` (atau `DEFAULT_CATALOG` fallback). Ubah harga tanpa sentuh kode.
- **Shadow DOM**: desain website tidak saling merusak.
- **Lead-capture**: tombol membuka WhatsApp berisi ringkasan; opsional kirim ke `lead-endpoint`.

Menambah/mengubah desain = tambah satu entri di objek `SKINS` pada `dist/efisien-material-skins.js`. Struktur DOM & logika tidak perlu disentuh.
