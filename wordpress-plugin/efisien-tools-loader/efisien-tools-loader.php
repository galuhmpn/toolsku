<?php
/**
 * Plugin Name: Efisien Tools Loader
 * Plugin URI: https://github.com/galuhmpn/toolsku
 * Description: Loader universal untuk Kalkulator Material Efisien Tools dari GitHub CDN, dengan shortcode dan integrasi WooCommerce.
 * Version: 1.0.1
 * Author: Galuh
 * Requires PHP: 7.2
 * Text Domain: efisien-tools-loader
 */

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'Efisien_Tools_Loader' ) ) {
    final class Efisien_Tools_Loader {
        const VERSION = '1.0.1';
        const OPTION_KEY = 'efisien_tools_loader_options';

        public static function init() {
            add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
            add_filter( 'script_loader_tag', array( __CLASS__, 'script_loader_tag' ), 10, 3 );
            add_shortcode( 'efisien_tool', array( __CLASS__, 'shortcode_tool' ) );
            add_shortcode( 'efisien_tool_auto', array( __CLASS__, 'shortcode_tool_auto' ) );
            add_action( 'wp', array( __CLASS__, 'register_woocommerce_auto_render' ) );

            if ( is_admin() ) {
                add_action( 'admin_menu', array( __CLASS__, 'admin_menu' ) );
                add_action( 'admin_init', array( __CLASS__, 'register_settings' ) );
                add_filter( 'allowed_options', array( __CLASS__, 'allowed_options' ) );
                add_filter( 'whitelist_options', array( __CLASS__, 'allowed_options' ) );
            }
        }

        public static function defaults() {
            return array(
                'cdn_base'         => 'https://cdn.jsdelivr.net/gh/galuhmpn/toolsku@main',
                'catalog_url'      => '',
                'default_wa'       => '6287785870222',
                'load_mode'        => 'all',
                'auto_product'     => '0',
                'auto_position'    => 'woocommerce_after_single_product_summary',
                'auto_priority'    => '12',
                'default_category' => 'backdrop',
                'show_context'     => '1',
            );
        }

        public static function options() {
            $saved = get_option( self::OPTION_KEY, array() );
            if ( ! is_array( $saved ) ) {
                $saved = array();
            }
            return wp_parse_args( $saved, self::defaults() );
        }

        public static function cdn_base() {
            $options = self::options();
            return untrailingslashit( esc_url_raw( $options['cdn_base'] ) );
        }

        public static function script_url() {
            return self::cdn_base() . '/dist/efisien-material-skins.js';
        }

        public static function catalog_url() {
            $options = self::options();
            $custom = trim( (string) $options['catalog_url'] );
            if ( '' !== $custom ) {
                return esc_url_raw( $custom );
            }
            return self::cdn_base() . '/catalog.json';
        }

        public static function should_enqueue() {
            if ( is_admin() ) {
                return false;
            }

            $options = self::options();
            if ( 'all' === $options['load_mode'] ) {
                return true;
            }

            if ( '1' === $options['auto_product'] && function_exists( 'is_product' ) && is_product() ) {
                return true;
            }

            if ( is_singular() ) {
                $post = get_post();
                $content = $post ? (string) $post->post_content : '';
                return has_shortcode( $content, 'efisien_tool' ) || has_shortcode( $content, 'efisien_tool_auto' );
            }

            return false;
        }

        public static function enqueue_assets() {
            if ( ! self::should_enqueue() ) {
                return;
            }

            wp_enqueue_script(
                'efisien-material-skins',
                self::script_url(),
                array(),
                self::VERSION,
                true
            );

            wp_register_style( 'efisien-tools-loader', false, array(), self::VERSION );
            wp_enqueue_style( 'efisien-tools-loader' );
            wp_add_inline_style( 'efisien-tools-loader', self::inline_css() );
        }

        public static function script_loader_tag( $tag, $handle, $src ) {
            if ( 'efisien-material-skins' !== $handle ) {
                return $tag;
            }

            return sprintf(
                '<script src="%s" data-catalog="%s" id="%s-js"></script>' . "\n",
                esc_url( $src ),
                esc_url( self::catalog_url() ),
                esc_attr( $handle )
            );
        }

        public static function inline_css() {
            return '.efisien-tool-wrap{display:flex;justify-content:center;width:100%;margin:24px 0}.efisien-tool-wrap kalkulator-material{width:100%;max-width:460px}.efisien-tool-section{margin:48px 0;padding:32px;border-radius:24px;background:#fff;box-shadow:0 8px 28px rgba(15,23,42,.06)}.efisien-tool-section__grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,460px);gap:32px;align-items:center}.efisien-tool-section__eyebrow{display:inline-flex;padding:6px 12px;border-radius:999px;background:#e8f3ff;color:#0a2540;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:14px}.efisien-tool-section h2{margin:0 0 12px;font-size:clamp(24px,3vw,36px);line-height:1.16}.efisien-tool-section p{margin:0;color:#526173;font-size:16px;line-height:1.7}.efisien-tool-section__facts{display:grid;gap:8px;margin-top:18px;color:#526173}.efisien-tool-section__facts span:before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:#ff7a18;margin-right:10px}@media(max-width:900px){.efisien-tool-section{padding:24px}.efisien-tool-section__grid{grid-template-columns:1fr}}';
        }

        public static function presets() {
            return array(
                'aspal'        => array( 'desain' => 'dark',      'tema' => 'aspal',   'warna' => '',        'judul' => 'Kalkulator Aspal Hotmix' ),
                'marka'        => array( 'desain' => 'brutalist', 'tema' => 'marka',   'warna' => '',        'judul' => 'Kalkulator Marka Jalan' ),
                'paving-block' => array( 'desain' => 'classic',   'tema' => 'paving',  'warna' => '',        'judul' => 'Kalkulator Paving Block' ),
                'lantai-kayu'  => array( 'desain' => 'luxury',    'tema' => '',        'warna' => '#b8860b', 'judul' => 'Kalkulator Lantai Kayu' ),
                'karpet'       => array( 'desain' => 'minimal',   'tema' => 'minimal', 'warna' => '',        'judul' => 'Kalkulator Karpet' ),
                'backdrop'     => array( 'desain' => 'gradient',  'tema' => 'event',   'warna' => '',        'judul' => 'Kalkulator Backdrop' ),
                'balon-gate'   => array( 'desain' => 'brutalist', 'tema' => 'event',   'warna' => '#ff7a18', 'judul' => 'Kalkulator Balon Gate' ),
                'lighting'     => array( 'desain' => 'dark',      'tema' => 'event',   'warna' => '#facc15', 'judul' => 'Kalkulator Lighting' ),
                'mini-garden'  => array( 'desain' => 'glass',     'tema' => 'teknik',  'warna' => '',        'judul' => 'Kalkulator Mini Garden' ),
            );
        }

        public static function category_labels() {
            return array(
                'aspal'        => 'Aspal Hotmix',
                'marka'        => 'Marka Jalan',
                'paving-block' => 'Paving Block',
                'lantai-kayu'  => 'Lantai Kayu',
                'karpet'       => 'Karpet',
                'backdrop'     => 'Backdrop',
                'balon-gate'   => 'Balon Gate',
                'lighting'     => 'Lighting',
                'mini-garden'  => 'Mini Garden',
            );
        }

        public static function resolve_category_for_product( $product_id ) {
            $product_id = absint( $product_id );
            $options = self::options();
            $fallback = sanitize_key( $options['default_category'] );
            if ( ! $fallback ) {
                $fallback = 'backdrop';
            }

            if ( ! $product_id ) {
                return $fallback;
            }

            $manual = sanitize_key( (string) get_post_meta( $product_id, '_efisien_tool_category', true ) );
            if ( ! $manual ) {
                $manual = sanitize_key( (string) get_post_meta( $product_id, '_jiw_material_calculator_category', true ) );
            }
            if ( $manual ) {
                return $manual;
            }

            $haystack = array( get_post_field( 'post_name', $product_id ), get_the_title( $product_id ) );
            $terms = get_the_terms( $product_id, 'product_cat' );
            if ( $terms && ! is_wp_error( $terms ) ) {
                foreach ( $terms as $term ) {
                    $haystack[] = $term->slug;
                    $haystack[] = $term->name;
                }
            }

            $text = strtolower( implode( ' ', array_filter( array_map( 'wp_strip_all_tags', $haystack ) ) ) );
            $rules = array(
                'aspal'        => array( 'aspal', 'hotmix', 'latasir', 'jalan' ),
                'marka'        => array( 'marka', 'thermoplastic', 'coldplastic' ),
                'paving-block' => array( 'paving', 'conblock', 'grass block', 'grassblock', 'kanstin' ),
                'lantai-kayu'  => array( 'lantai kayu', 'decking', 'parket', 'parquet', 'vinyl', 'spc' ),
                'karpet'       => array( 'karpet', 'carpet' ),
                'lighting'     => array( 'lighting', 'lampu', 'pencahayaan', 'par led', 'moving head', 'sewa lighting', 'instalasi lighting' ),
                'balon-gate'   => array( 'balon gate', 'balon-gate', 'gate balon', 'balon gapura', 'inflatable gate' ),
                'backdrop'     => array( 'backdrop', 'banner', 'spanduk', 'booth', 'event', 'pameran', 'iklan', 'promosi', 'branding' ),
                'mini-garden'  => array( 'taman', 'garden', 'landscape', 'rumput' ),
            );

            foreach ( $rules as $category => $needles ) {
                foreach ( $needles as $needle ) {
                    if ( false !== strpos( $text, $needle ) ) {
                        return $category;
                    }
                }
            }

            return apply_filters( 'efisien_tools_loader_default_category', $fallback, $product_id, $text );
        }

        public static function shortcode_tool( $atts ) {
            $options = self::options();
            $atts = shortcode_atts(
                array(
                    'kategori'          => $options['default_category'],
                    'desain'            => '',
                    'tema'              => '',
                    'warna'             => '',
                    'font'              => '',
                    'wa'                => $options['default_wa'],
                    'cta'               => 'Minta Penawaran via WhatsApp',
                    'judul'             => '',
                    'lead_endpoint'     => '',
                    'sembunyikan_harga' => 'false',
                ),
                $atts,
                'efisien_tool'
            );

            return self::render_tool( $atts );
        }

        public static function shortcode_tool_auto( $atts ) {
            $options = self::options();
            $product_id = get_the_ID();
            $category = self::resolve_category_for_product( $product_id );
            $title = $product_id ? 'Estimasi Kebutuhan ' . wp_strip_all_tags( get_the_title( $product_id ) ) : '';

            $atts = shortcode_atts(
                array(
                    'kategori'          => $category,
                    'desain'            => '',
                    'tema'              => '',
                    'warna'             => '',
                    'font'              => '',
                    'wa'                => $options['default_wa'],
                    'cta'               => 'Minta Penawaran via WhatsApp',
                    'judul'             => $title,
                    'lead_endpoint'     => '',
                    'sembunyikan_harga' => 'false',
                ),
                $atts,
                'efisien_tool_auto'
            );

            return self::render_tool( $atts );
        }

        public static function render_tool( $atts ) {
            $category = sanitize_key( $atts['kategori'] );
            $presets = self::presets();
            $preset = isset( $presets[ $category ] ) ? $presets[ $category ] : array();

            $attrs = array(
                'kategori' => $category,
                'desain'   => $atts['desain'] ? sanitize_key( $atts['desain'] ) : ( isset( $preset['desain'] ) ? $preset['desain'] : 'classic' ),
                'tema'     => $atts['tema'] ? sanitize_key( $atts['tema'] ) : ( isset( $preset['tema'] ) ? $preset['tema'] : '' ),
                'warna'    => $atts['warna'] ? sanitize_hex_color( $atts['warna'] ) : ( isset( $preset['warna'] ) ? $preset['warna'] : '' ),
                'font'     => sanitize_text_field( $atts['font'] ),
                'wa'       => preg_replace( '/[^0-9]/', '', (string) $atts['wa'] ),
                'cta'      => sanitize_text_field( $atts['cta'] ),
                'judul'    => $atts['judul'] ? sanitize_text_field( $atts['judul'] ) : ( isset( $preset['judul'] ) ? $preset['judul'] : '' ),
            );

            if ( ! empty( $atts['lead_endpoint'] ) ) {
                $attrs['lead-endpoint'] = esc_url_raw( $atts['lead_endpoint'] );
            }

            $html_attrs = '';
            foreach ( $attrs as $name => $value ) {
                if ( '' === $value || null === $value ) {
                    continue;
                }
                $html_attrs .= sprintf( ' %s="%s"', esc_attr( $name ), esc_attr( $value ) );
            }

            if ( filter_var( $atts['sembunyikan_harga'], FILTER_VALIDATE_BOOLEAN ) ) {
                $html_attrs .= ' sembunyikan-harga';
            }

            return '<div class="efisien-tool-wrap"><kalkulator-material' . $html_attrs . '></kalkulator-material></div>';
        }

        public static function register_woocommerce_auto_render() {
            $options = self::options();
            if ( '1' !== $options['auto_product'] ) {
                return;
            }
            if ( ! function_exists( 'is_product' ) || ! is_product() ) {
                return;
            }

            $positions = self::woocommerce_positions();
            $position = isset( $positions[ $options['auto_position'] ] ) ? $options['auto_position'] : 'woocommerce_after_single_product_summary';
            $priority = absint( $options['auto_priority'] );
            if ( ! $priority ) {
                $priority = 12;
            }

            add_action( $position, array( __CLASS__, 'render_woocommerce_auto_section' ), $priority );
        }

        public static function render_woocommerce_auto_section() {
            $product_id = get_the_ID();
            $category = self::resolve_category_for_product( $product_id );
            $labels = self::category_labels();
            $label = isset( $labels[ $category ] ) ? $labels[ $category ] : ucwords( str_replace( '-', ' ', $category ) );

            echo '<section class="efisien-tool-section" id="efisien-tool-product-calculator">';
            echo '<div class="efisien-tool-section__grid">';
            echo '<div class="efisien-tool-section__copy">';
            echo '<span class="efisien-tool-section__eyebrow">Kalkulator Estimasi</span>';
            echo '<h2>' . esc_html__( 'Hitung Kebutuhan Sebelum Konsultasi', 'efisien-tools-loader' ) . '</h2>';
            echo '<p>' . esc_html__( 'Masukkan kebutuhan Anda untuk mendapat gambaran awal biaya sebelum menghubungi tim konsultasi.', 'efisien-tools-loader' ) . '</p>';
            if ( '1' === self::options()['show_context'] ) {
                echo '<div class="efisien-tool-section__facts">';
                echo '<span>' . esc_html__( 'Kalkulator:', 'efisien-tools-loader' ) . ' <strong>' . esc_html( $label ) . '</strong></span>';
                echo '<span>' . esc_html__( 'Terhubung ke WhatsApp konsultasi', 'efisien-tools-loader' ) . '</span>';
                echo '<span>' . esc_html__( 'Harga mengikuti katalog Efisien Tools', 'efisien-tools-loader' ) . '</span>';
                echo '</div>';
            }
            echo '</div>';
            echo '<div class="efisien-tool-section__tool">';
            echo do_shortcode( '[efisien_tool_auto]' );
            echo '</div>';
            echo '</div>';
            echo '</section>';
        }

        public static function woocommerce_positions() {
            return array(
                'woocommerce_single_product_summary'       => 'Dalam ringkasan produk',
                'woocommerce_after_add_to_cart_form'       => 'Setelah form/cart produk',
                'woocommerce_after_single_product_summary' => 'Setelah summary produk',
                'woocommerce_after_single_product'         => 'Akhir halaman produk',
            );
        }

        public static function admin_menu() {
            add_options_page(
                'Efisien Tools',
                'Efisien Tools',
                'manage_options',
                'efisien-tools-loader',
                array( __CLASS__, 'settings_page' )
            );
        }

        public static function register_settings() {
            register_setting( 'efisien_tools_loader', self::OPTION_KEY, array( __CLASS__, 'sanitize_options' ) );
        }

        public static function allowed_options( $allowed_options ) {
            if ( ! is_array( $allowed_options ) ) {
                $allowed_options = array();
            }

            if ( ! isset( $allowed_options['efisien_tools_loader'] ) || ! is_array( $allowed_options['efisien_tools_loader'] ) ) {
                $allowed_options['efisien_tools_loader'] = array();
            }

            if ( ! in_array( self::OPTION_KEY, $allowed_options['efisien_tools_loader'], true ) ) {
                $allowed_options['efisien_tools_loader'][] = self::OPTION_KEY;
            }

            return $allowed_options;
        }

        public static function sanitize_options( $input ) {
            $defaults = self::defaults();
            $input = is_array( $input ) ? $input : array();
            $output = array();

            $output['cdn_base'] = ! empty( $input['cdn_base'] ) ? esc_url_raw( $input['cdn_base'] ) : $defaults['cdn_base'];
            $output['catalog_url'] = ! empty( $input['catalog_url'] ) ? esc_url_raw( $input['catalog_url'] ) : '';
            $output['default_wa'] = preg_replace( '/[^0-9]/', '', isset( $input['default_wa'] ) ? (string) $input['default_wa'] : $defaults['default_wa'] );
            $output['load_mode'] = ( isset( $input['load_mode'] ) && 'smart' === $input['load_mode'] ) ? 'smart' : 'all';
            $output['auto_product'] = ! empty( $input['auto_product'] ) ? '1' : '0';
            $positions = self::woocommerce_positions();
            $output['auto_position'] = ( isset( $input['auto_position'] ) && isset( $positions[ $input['auto_position'] ] ) ) ? sanitize_key( $input['auto_position'] ) : $defaults['auto_position'];
            $output['auto_priority'] = isset( $input['auto_priority'] ) ? (string) absint( $input['auto_priority'] ) : $defaults['auto_priority'];
            $output['default_category'] = isset( $input['default_category'] ) ? sanitize_key( $input['default_category'] ) : $defaults['default_category'];
            $output['show_context'] = ! empty( $input['show_context'] ) ? '1' : '0';

            return $output;
        }

        public static function settings_page() {
            if ( ! current_user_can( 'manage_options' ) ) {
                return;
            }
            $options = self::options();
            $positions = self::woocommerce_positions();
            ?>
            <div class="wrap">
                <h1>Efisien Tools Loader</h1>
                <form method="post" action="options.php">
                    <?php settings_fields( 'efisien_tools_loader' ); ?>
                    <table class="form-table" role="presentation">
                        <tr>
                            <th scope="row"><label for="etl-cdn-base">GitHub CDN Base</label></th>
                            <td><input id="etl-cdn-base" class="regular-text" type="url" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[cdn_base]" value="<?php echo esc_attr( $options['cdn_base'] ); ?>"></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="etl-catalog-url">Catalog URL Opsional</label></th>
                            <td><input id="etl-catalog-url" class="regular-text" type="url" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[catalog_url]" value="<?php echo esc_attr( $options['catalog_url'] ); ?>"><p class="description">Kosongkan untuk memakai <code>/catalog.json</code> dari CDN base.</p></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="etl-default-wa">Nomor WhatsApp Default</label></th>
                            <td><input id="etl-default-wa" class="regular-text" type="text" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[default_wa]" value="<?php echo esc_attr( $options['default_wa'] ); ?>"></td>
                        </tr>
                        <tr>
                            <th scope="row">Load Asset</th>
                            <td>
                                <label><input type="radio" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[load_mode]" value="all" <?php checked( $options['load_mode'], 'all' ); ?>> Semua halaman frontend, paling aman untuk Elementor/Divi</label><br>
                                <label><input type="radio" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[load_mode]" value="smart" <?php checked( $options['load_mode'], 'smart' ); ?>> Hanya saat shortcode/produk terdeteksi</label>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">WooCommerce Single Product</th>
                            <td><label><input type="checkbox" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[auto_product]" value="1" <?php checked( $options['auto_product'], '1' ); ?>> Tampilkan otomatis di single product</label></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="etl-auto-position">Posisi Otomatis</label></th>
                            <td>
                                <select id="etl-auto-position" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[auto_position]">
                                    <?php foreach ( $positions as $hook => $label ) : ?>
                                        <option value="<?php echo esc_attr( $hook ); ?>" <?php selected( $options['auto_position'], $hook ); ?>><?php echo esc_html( $label ); ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <input type="number" min="1" style="width:80px" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[auto_priority]" value="<?php echo esc_attr( $options['auto_priority'] ); ?>"> Prioritas
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="etl-default-category">Kategori Fallback</label></th>
                            <td><input id="etl-default-category" class="regular-text" type="text" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[default_category]" value="<?php echo esc_attr( $options['default_category'] ); ?>"></td>
                        </tr>
                        <tr>
                            <th scope="row">Teks Konteks</th>
                            <td><label><input type="checkbox" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[show_context]" value="1" <?php checked( $options['show_context'], '1' ); ?>> Tampilkan teks “Kalkulator: Lighting/Balon Gate” di auto section</label></td>
                        </tr>
                    </table>
                    <?php submit_button(); ?>
                </form>
                <hr>
                <h2>Shortcode</h2>
                <p><code>[efisien_tool kategori="lighting"]</code></p>
                <p><code>[efisien_tool kategori="balon-gate" wa="6287785870222"]</code></p>
                <p><code>[efisien_tool_auto]</code> untuk mengikuti produk WooCommerce saat ini.</p>
            </div>
            <?php
        }
    }
}

Efisien_Tools_Loader::init();
