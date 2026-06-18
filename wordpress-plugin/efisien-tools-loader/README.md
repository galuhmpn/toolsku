# Efisien Tools Loader

Plugin WordPress universal untuk memuat Kalkulator Material Efisien Tools dari GitHub CDN.

## Kebutuhan

- WordPress modern
- PHP 7.2 atau lebih baru
- Koneksi frontend ke CDN jsDelivr/GitHub

## Sumber Tools

Default plugin mengambil engine dan katalog dari:

```text
https://cdn.jsdelivr.net/gh/galuhmpn/toolsku@main/dist/efisien-material-skins.js
https://cdn.jsdelivr.net/gh/galuhmpn/toolsku@main/catalog.json
```

## Instalasi

1. Zip folder `efisien-tools-loader`.
2. Buka WordPress Admin.
3. Plugins > Add New > Upload Plugin.
4. Upload `efisien-tools-loader.zip`.
5. Activate.
6. Buka Settings > Efisien Tools untuk memilih kategori, desain, tema warna, dan membuat shortcode dari visual picker.

## Visual Picker

Di Settings > Efisien Tools, gunakan panel Buat Tampilan Kalkulator:

1. Pilih kategori produk, misalnya `lighting` atau `balon-gate`.
2. Pilih desain visual dari kartu preview.
3. Cek preview langsung.
4. Klik Salin shortcode, lalu tempel ke Elementor, Divi, Gutenberg, Classic Editor, atau widget Shortcode.

Pengaturan teknis dan auto WooCommerce tetap tersedia di panel lipat pada halaman yang sama.

## Shortcode Manual

```text
[efisien_tool kategori="lighting"]
[efisien_tool kategori="balon-gate"]
[efisien_tool kategori="backdrop" desain="gradient" tema="event" wa="6287785870222"]
```

Atribut yang tersedia:

```text
kategori
desain
tema
warna
font
wa
cta
judul
lead_endpoint
sembunyikan_harga
```

## Auto WooCommerce

Gunakan shortcode ini di single product/template builder:

```text
[efisien_tool_auto]
```

Atau aktifkan di Settings > Efisien Tools:

```text
Tampilkan otomatis di single product
```

Plugin akan membaca judul, slug, dan kategori produk WooCommerce. Contoh:

```text
Sewa Lighting Panggung Jogja -> kategori="lighting"
Balon Gate Vendor Jakarta -> kategori="balon-gate"
Backdrop Event -> kategori="backdrop"
```

Manual override per produk bisa memakai custom field:

```text
_efisien_tool_category = lighting
```

## Elementor

- Pastikan plugin aktif.
- Tambahkan widget Shortcode.
- Isi: `[efisien_tool kategori="lighting"]` atau `[efisien_tool_auto]`.

Mode load default adalah `Semua halaman frontend`, supaya aman untuk Elementor/Divi yang sering menyimpan konten di meta, bukan `post_content` biasa.

## Divi

- Pastikan plugin aktif.
- Tambahkan Code/Text module.
- Isi shortcode atau tag custom sesuai kebutuhan.

## Kategori Bawaan

```text
aspal
marka
paving-block
lantai-kayu
karpet
backdrop
balon-gate
lighting
mini-garden
```

## Catatan

CSS wrapper kecil tetap berasal dari plugin agar layout shortcode rapi. Engine kalkulator dan katalog tetap dari GitHub CDN.
