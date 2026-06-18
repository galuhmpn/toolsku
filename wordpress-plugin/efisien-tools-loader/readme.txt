=== Efisien Tools Loader ===
Contributors: galuh
Requires at least: 5.0
Requires PHP: 7.2
Stable tag: 1.2.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Loader universal untuk Kalkulator Material Efisien Tools dari GitHub CDN.

== Description ==

Efisien Tools Loader memuat Web Component Kalkulator Material dari GitHub CDN dan menyediakan shortcode WordPress yang bisa dipakai di Gutenberg, Elementor, Divi, Classic Editor, dan WooCommerce.

Shortcode utama:

* [efisien_tool kategori="lighting"]
* [efisien_tool kategori="balon-gate"]
* [efisien_tool_auto]

Plugin juga bisa otomatis tampil di single product WooCommerce melalui Settings > Efisien Tools.

== Installation ==

1. Upload folder `efisien-tools-loader` ke `/wp-content/plugins/` atau upload ZIP dari dashboard.
2. Activate plugin.
3. Buka Settings > Efisien Tools.
4. Isi nomor WhatsApp default dan aktifkan auto WooCommerce bila diperlukan.

== Frequently Asked Questions ==

= Apakah perlu edit theme? =

Tidak. Plugin bisa dipakai lewat shortcode atau auto WooCommerce.

= Apakah kompatibel dengan Elementor dan Divi? =

Ya. Gunakan widget/module Shortcode, Text, HTML, atau Code.

= Dari mana script tools dimuat? =

Default dari `https://cdn.jsdelivr.net/gh/galuhmpn/toolsku@main`.

== Changelog ==

= 1.2.0 =
* Menambahkan visual design picker dan live preview di Settings > Efisien Tools.

= 1.1.0 =
* Menambahkan generator shortcode di halaman settings.
* Menambahkan metabox pilihan kategori/desain/tema/warna di editor produk WooCommerce.

= 1.0.1 =
* Memperbaiki allowed options registration pada halaman settings.

= 1.0.0 =
* Rilis awal.
* Shortcode manual dan auto.
* Settings page.
* Auto render WooCommerce single product.
