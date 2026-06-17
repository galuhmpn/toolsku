/*!
 * Efisien Tools — Kalkulator Material (1 tool, 10 desain)
 * Web Component vanilla, tanpa dependency, satu <script>.
 *
 * INTI SISTEM TETAP SAMA dengan efisien-tools.js:
 *   - katalog harga (catalog.json / DEFAULT_CATALOG)
 *   - mesin hitung (mode luas / panjang + waste)
 *   - lead-capture WhatsApp + lead-endpoint
 *   - Shadow DOM + theming via atribut (tema / warna / radius / font)
 * YANG BERUBAH HANYA TAMPILAN, lewat atribut: desain="1".. "10"
 *
 * Pakai:
 *   <script src=".../efisien-material-skins.js" data-catalog=".../catalog.json"></script>
 *   <kalkulator-material kategori="paving-block" desain="glass" wa="628123456789"></kalkulator-material>
 */
(function () {
  "use strict";

  /* =========================================================
   * 1) KATALOG DEFAULT (fallback) — sama persis dengan sistem asli
   * =======================================================*/
  var DEFAULT_CATALOG = {
    material: {
      "aspal": { label: "Aspal Hotmix", mode: "luas", satuan: "m\u00b2", waste: 0, varian: [
        { id: "hotmix-3", nama: "Hotmix tebal 3 cm", harga: 135000 },
        { id: "hotmix-5", nama: "Hotmix tebal 5 cm", harga: 170000 },
        { id: "latasir", nama: "Latasir / lapis tipis", harga: 110000 }
      ]},
      "marka": { label: "Marka Jalan", mode: "panjang", satuan: "m", waste: 0, varian: [
        { id: "thermoplastic", nama: "Thermoplastic", harga: 35000 },
        { id: "cat-biasa", nama: "Cat marka biasa", harga: 18000 },
        { id: "coldplastic", nama: "Cold plastic", harga: 55000 }
      ]},
      "paving-block": { label: "Paving Block", mode: "luas", satuan: "m\u00b2", waste: 5, varian: [
        { id: "bata-natural", nama: "Bata Natural", harga: 95000 },
        { id: "bata-warna", nama: "Bata Warna", harga: 110000 },
        { id: "hexagon", nama: "Hexagon", harga: 125000 },
        { id: "cacing", nama: "Cacing / Topi Uskup", harga: 130000 },
        { id: "grass-block", nama: "Grass Block", harga: 120000 }
      ]},
      "lantai-kayu": { label: "Lantai Kayu", mode: "luas", satuan: "m\u00b2", waste: 8, varian: [
        { id: "decking", nama: "Decking Outdoor", harga: 450000 },
        { id: "parket", nama: "Parket Solid", harga: 550000 },
        { id: "laminate", nama: "Laminate / SPC", harga: 230000 },
        { id: "vinyl", nama: "Vinyl Flooring", harga: 185000 }
      ]},
      "karpet": { label: "Karpet", mode: "luas", satuan: "m\u00b2", waste: 5, varian: [
        { id: "roll-standar", nama: "Karpet Roll Standar", harga: 75000 },
        { id: "tile", nama: "Karpet Tile", harga: 135000 },
        { id: "premium", nama: "Karpet Premium", harga: 220000 }
      ]},
      "backdrop": { label: "Backdrop", mode: "luas", satuan: "m\u00b2", waste: 0, varian: [
        { id: "cetak-only", nama: "Cetak Flexi (tanpa rangka)", harga: 35000 },
        { id: "cetak-rangka", nama: "Cetak + Rangka", harga: 95000 },
        { id: "backlit", nama: "Backlit + Rangka", harga: 165000 }
      ]},
      "mini-garden": { label: "Mini Garden / Taman", mode: "luas", satuan: "m\u00b2", waste: 0, varian: [
        { id: "rumput-gajah", nama: "Rumput Gajah Mini", harga: 85000 },
        { id: "taman-standar", nama: "Taman Standar (rumput+tanaman)", harga: 250000 },
        { id: "taman-premium", nama: "Taman Premium + batu hias", harga: 450000 }
      ]}
    }
  };

  /* =========================================================
   * 2) REGISTRY GLOBAL — sama dengan sistem asli
   * =======================================================*/
  var EfisienTools = window.EfisienTools || {
    version: "1.0.0-skins",
    catalog: DEFAULT_CATALOG,
    setCatalog: function (c) {
      if (c && typeof c === "object") {
        this.catalog = Object.assign({}, DEFAULT_CATALOG, c);
        document.dispatchEvent(new CustomEvent("efisien-catalog-updated"));
      }
    },
    loadCatalog: function (url) {
      var self = this;
      return fetch(url, { cache: "no-cache" })
        .then(function (r) { return r.json(); })
        .then(function (j) { self.setCatalog(j); })
        .catch(function (e) { console.warn("[EfisienTools] Gagal memuat catalog, pakai default.", e); });
    }
  };
  window.EfisienTools = EfisienTools;

  /* =========================================================
   * 3) UTILITAS — sama dengan sistem asli
   * =======================================================*/
  var PRESETS = {
    aspal: { primary: "#1B4DFF" }, marka: { primary: "#F59E0B" }, paving: { primary: "#C0392B" },
    event: { primary: "#7C3AED" }, pajak: { primary: "#0E9F6E" }, teknik: { primary: "#0EA5E9" },
    minimal: { primary: "#111827" }
  };
  function rupiah(n) {
    n = Math.round(Number(n) || 0);
    try { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n); }
    catch (e) { return "Rp " + n.toLocaleString("id-ID"); }
  }
  function angka(n) { return (Number(n) || 0).toLocaleString("id-ID", { maximumFractionDigits: 2 }); }
  function num(v) {
    if (v == null) return 0;
    var x = parseFloat(String(v).replace(/\./g, "").replace(",", "."));
    return isNaN(x) ? 0 : x;
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  /* =========================================================
   * 4) 10 SKIN DESAIN — HANYA TAMPILAN.
   *    Struktur DOM & class sama untuk semua; tiap skin punya CSS sendiri
   *    dan default warna primer (boleh ditimpa atribut warna/tema).
   * =======================================================*/
  var SHARED = [
    "*{box-sizing:border-box}",
    ":host{display:block;font-family:var(--et-font);line-height:1.45;-webkit-text-size-adjust:100%;}",
    ".row{display:flex;gap:12px;flex-wrap:wrap;}.row>div{flex:1;min-width:120px;}",
    ".line{display:flex;justify-content:space-between;gap:10px;padding:3px 0;}",
    "button.cta{cursor:pointer;width:100%;}"
  ].join("");

  var SKINS = {
    // 1) CLASSIC — kartu putih bersih (tampilan asli)
    "classic": { label: "Classic Card", primary: "#1B4DFF", font: "system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif", css:
      ".card{background:#fff;color:#1f2937;border:1px solid #e5e7eb;border-radius:14px;padding:22px;max-width:440px;box-shadow:0 1px 3px rgba(0,0,0,.08);}" +
      ".badge{display:inline-block;font-size:11px;background:color-mix(in srgb,var(--et-primary) 12%,#fff);color:var(--et-primary);padding:3px 9px;border-radius:999px;font-weight:700;margin-bottom:10px;}" +
      ".t{font-size:19px;font-weight:800;margin:0 0 4px;color:#111827;}.sub{font-size:13px;color:#6b7280;margin:0 0 14px;}" +
      "label{display:block;font-size:13px;font-weight:600;margin:12px 0 6px;color:#374151;}" +
      "input,select{width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:10px;font-size:15px;font-family:inherit;background:#fff;color:#111827;}" +
      "input:focus,select:focus{outline:none;border-color:var(--et-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--et-primary) 22%,transparent);}" +
      ".result{margin-top:18px;padding:16px;border-radius:12px;background:color-mix(in srgb,var(--et-primary) 7%,#fff);border:1px solid color-mix(in srgb,var(--et-primary) 25%,#fff);}" +
      ".result .v{font-weight:700;color:#111827;}.big{font-size:27px;font-weight:800;color:var(--et-primary);margin-top:2px;}" +
      "button.cta{margin-top:14px;padding:12px;border:none;border-radius:10px;background:var(--et-primary);color:#fff;font-weight:700;font-size:15px;}button.cta:hover{filter:brightness(.95);}" +
      ".muted{color:#6b7280;font-size:12px;margin-top:10px;}"
    },

    // 2) NEUMORPHISM — lembut, bayangan ganda, tanpa garis
    "neumorph": { label: "Neumorphism", primary: "#5b7cfa", font: "'Segoe UI',system-ui,sans-serif", css:
      ".card{background:#e8ebf3;color:#3a4256;border-radius:24px;padding:24px;max-width:440px;box-shadow:9px 9px 18px #c7ccd8,-9px -9px 18px #ffffff;}" +
      ".badge{display:inline-block;font-size:11px;color:var(--et-primary);padding:6px 12px;border-radius:999px;font-weight:700;margin-bottom:12px;box-shadow:inset 3px 3px 6px #c7ccd8,inset -3px -3px 6px #fff;}" +
      ".t{font-size:19px;font-weight:800;margin:0 0 4px;color:#2b3147;}.sub{font-size:13px;color:#8089a0;margin:0 0 14px;}" +
      "label{display:block;font-size:13px;font-weight:600;margin:12px 0 6px;color:#5a6178;}" +
      "input,select{width:100%;padding:12px 14px;border:none;border-radius:14px;font-size:15px;font-family:inherit;background:#e8ebf3;color:#2b3147;box-shadow:inset 4px 4px 8px #c7ccd8,inset -4px -4px 8px #fff;}" +
      "input:focus,select:focus{outline:none;box-shadow:inset 5px 5px 10px #c2c7d4,inset -5px -5px 10px #fff;}" +
      ".result{margin-top:20px;padding:18px;border-radius:18px;background:#e8ebf3;box-shadow:inset 5px 5px 12px #c7ccd8,inset -5px -5px 12px #fff;}" +
      ".result .v{font-weight:700;color:#2b3147;}.big{font-size:27px;font-weight:800;color:var(--et-primary);margin-top:2px;}" +
      "button.cta{margin-top:18px;padding:14px;border:none;border-radius:14px;background:var(--et-primary);color:#fff;font-weight:700;font-size:15px;box-shadow:5px 5px 12px #c7ccd8,-5px -5px 12px #fff;}button.cta:active{box-shadow:inset 4px 4px 8px rgba(0,0,0,.2);}" +
      ".muted{color:#8089a0;font-size:12px;margin-top:10px;}"
    },

    // 3) GLASSMORPHISM — kaca buram di atas gradient
    "glass": { label: "Glassmorphism", primary: "#ffffff", font: "'Inter',system-ui,sans-serif", css:
      ".card{background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.35);border-radius:22px;padding:24px;max-width:440px;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:0 8px 32px rgba(0,0,0,.25);}" +
      ".badge{display:inline-block;font-size:11px;background:rgba(255,255,255,.25);color:#fff;padding:4px 11px;border-radius:999px;font-weight:700;margin-bottom:12px;border:1px solid rgba(255,255,255,.3);}" +
      ".t{font-size:20px;font-weight:800;margin:0 0 4px;color:#fff;}.sub{font-size:13px;color:rgba(255,255,255,.8);margin:0 0 14px;}" +
      "label{display:block;font-size:13px;font-weight:600;margin:12px 0 6px;color:rgba(255,255,255,.9);}" +
      "input,select{width:100%;padding:11px 13px;border:1px solid rgba(255,255,255,.4);border-radius:12px;font-size:15px;font-family:inherit;background:rgba(255,255,255,.18);color:#fff;}" +
      "input::placeholder{color:rgba(255,255,255,.6);}option{color:#222;}" +
      "input:focus,select:focus{outline:none;border-color:#fff;background:rgba(255,255,255,.28);}" +
      ".result{margin-top:20px;padding:18px;border-radius:16px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.3);}" +
      ".result .v{font-weight:700;color:#fff;}.big{font-size:28px;font-weight:800;color:#fff;margin-top:2px;text-shadow:0 1px 6px rgba(0,0,0,.2);}" +
      "button.cta{margin-top:18px;padding:13px;border:1px solid rgba(255,255,255,.5);border-radius:12px;background:rgba(255,255,255,.9);color:#1f2937;font-weight:800;font-size:15px;}button.cta:hover{background:#fff;}" +
      ".muted{color:rgba(255,255,255,.75);font-size:12px;margin-top:10px;}"
    },

    // 4) DARK NEON — gelap, aksen neon
    "dark": { label: "Dark Neon", primary: "#22e6a8", font: "'JetBrains Mono','Segoe UI',monospace", css:
      ".card{background:#0d1117;color:#c9d1d9;border:1px solid #21262d;border-radius:16px;padding:22px;max-width:440px;box-shadow:0 0 0 1px rgba(34,230,168,.08),0 10px 40px rgba(0,0,0,.6);}" +
      ".badge{display:inline-block;font-size:11px;background:rgba(34,230,168,.12);color:var(--et-primary);padding:4px 11px;border-radius:6px;font-weight:700;margin-bottom:12px;border:1px solid rgba(34,230,168,.3);}" +
      ".t{font-size:19px;font-weight:800;margin:0 0 4px;color:#f0f6fc;}.sub{font-size:13px;color:#8b949e;margin:0 0 14px;}" +
      "label{display:block;font-size:12px;font-weight:600;margin:12px 0 6px;color:#8b949e;text-transform:uppercase;letter-spacing:.5px;}" +
      "input,select{width:100%;padding:11px 13px;border:1px solid #30363d;border-radius:8px;font-size:15px;font-family:inherit;background:#161b22;color:#e6edf3;}" +
      "input:focus,select:focus{outline:none;border-color:var(--et-primary);box-shadow:0 0 0 3px rgba(34,230,168,.2);}" +
      ".result{margin-top:20px;padding:18px;border-radius:12px;background:#161b22;border:1px solid rgba(34,230,168,.25);}" +
      ".result .v{font-weight:700;color:#f0f6fc;}.big{font-size:28px;font-weight:800;color:var(--et-primary);margin-top:2px;text-shadow:0 0 14px rgba(34,230,168,.5);}" +
      "button.cta{margin-top:18px;padding:13px;border:none;border-radius:8px;background:var(--et-primary);color:#04150f;font-weight:800;font-size:15px;box-shadow:0 0 18px rgba(34,230,168,.4);}button.cta:hover{filter:brightness(1.1);}" +
      ".muted{color:#6e7681;font-size:12px;margin-top:10px;}"
    },

    // 5) BRUTALIST — garis tebal, bayangan keras, monospace
    "brutalist": { label: "Neo-Brutalist", primary: "#ffde00", font: "'Space Mono','Courier New',monospace", css:
      ".card{background:#fff;color:#000;border:3px solid #000;border-radius:0;padding:22px;max-width:440px;box-shadow:8px 8px 0 #000;}" +
      ".badge{display:inline-block;font-size:11px;background:var(--et-primary);color:#000;padding:4px 10px;border:2px solid #000;font-weight:800;margin-bottom:12px;text-transform:uppercase;}" +
      ".t{font-size:21px;font-weight:800;margin:0 0 4px;color:#000;text-transform:uppercase;}.sub{font-size:13px;color:#333;margin:0 0 14px;}" +
      "label{display:block;font-size:12px;font-weight:800;margin:12px 0 6px;color:#000;text-transform:uppercase;}" +
      "input,select{width:100%;padding:11px 12px;border:2px solid #000;border-radius:0;font-size:15px;font-family:inherit;background:#fff;color:#000;}" +
      "input:focus,select:focus{outline:none;box-shadow:4px 4px 0 var(--et-primary);}" +
      ".result{margin-top:18px;padding:16px;border:3px solid #000;background:var(--et-primary);}" +
      ".result .v{font-weight:800;color:#000;}.big{font-size:28px;font-weight:800;color:#000;margin-top:2px;}" +
      "button.cta{margin-top:16px;padding:13px;border:3px solid #000;border-radius:0;background:#000;color:#fff;font-weight:800;font-size:15px;text-transform:uppercase;box-shadow:5px 5px 0 var(--et-primary);}button.cta:hover{background:var(--et-primary);color:#000;}" +
      ".muted{color:#444;font-size:12px;margin-top:10px;}"
    },

    // 6) MINIMAL — tanpa kartu, input garis bawah, banyak ruang
    "minimal": { label: "Minimal Line", primary: "#111827", font: "'Helvetica Neue',Arial,sans-serif", css:
      ".card{background:transparent;color:#111;border:none;border-radius:0;padding:8px 4px;max-width:420px;}" +
      ".badge{display:inline-block;font-size:11px;color:#9ca3af;padding:0;font-weight:600;margin-bottom:6px;letter-spacing:2px;text-transform:uppercase;}" +
      ".t{font-size:24px;font-weight:300;margin:0 0 4px;color:#111;letter-spacing:-.5px;}.sub{font-size:13px;color:#9ca3af;margin:0 0 20px;}" +
      "label{display:block;font-size:11px;font-weight:600;margin:18px 0 4px;color:#6b7280;letter-spacing:1px;text-transform:uppercase;}" +
      "input,select{width:100%;padding:8px 2px;border:none;border-bottom:1px solid #d1d5db;border-radius:0;font-size:17px;font-family:inherit;background:transparent;color:#111;}" +
      "input:focus,select:focus{outline:none;border-bottom:2px solid var(--et-primary);}" +
      ".result{margin-top:26px;padding:16px 0 0;border-top:1px solid #e5e7eb;}" +
      ".result .v{font-weight:600;color:#111;}.big{font-size:30px;font-weight:300;color:var(--et-primary);margin-top:4px;letter-spacing:-1px;}" +
      "button.cta{margin-top:22px;padding:13px;border:1px solid #111;border-radius:0;background:transparent;color:#111;font-weight:600;font-size:14px;letter-spacing:1px;text-transform:uppercase;}button.cta:hover{background:#111;color:#fff;}" +
      ".muted{color:#9ca3af;font-size:12px;margin-top:12px;}"
    },

    // 7) GRADIENT — header gradient cerah
    "gradient": { label: "Vibrant Gradient", primary: "#ec4899", font: "'Poppins',system-ui,sans-serif", css:
      ".card{background:linear-gradient(90deg,var(--et-primary),#8b5cf6) top/100% 6px no-repeat,#fff;color:#1f2937;border:1px solid #f3e8ff;border-radius:18px;padding:26px 22px 22px;max-width:440px;box-shadow:0 12px 40px rgba(236,72,153,.18);}" +
      ".badge{display:inline-block;font-size:11px;background:linear-gradient(135deg,var(--et-primary),#8b5cf6);color:#fff;padding:4px 12px;border-radius:999px;font-weight:700;margin-bottom:10px;}" +
      ".t{font-size:21px;font-weight:800;margin:0 0 4px;color:#111827;}.sub{font-size:13px;color:#6b7280;margin:0 0 14px;}" +
      "label{display:block;font-size:13px;font-weight:600;margin:14px 0 6px;color:#374151;}" +
      "input,select{width:100%;padding:11px 13px;border:1px solid #e5e7eb;border-radius:12px;font-size:15px;font-family:inherit;background:#f9fafb;color:#111827;}" +
      "input:focus,select:focus{outline:none;border-color:var(--et-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--et-primary) 20%,transparent);}" +
      ".result{margin-top:18px;padding:18px;border-radius:16px;background:linear-gradient(135deg,color-mix(in srgb,var(--et-primary) 10%,#fff),color-mix(in srgb,#8b5cf6 10%,#fff));}" +
      ".result .v{font-weight:700;color:#111827;}.big{font-size:28px;font-weight:800;background:linear-gradient(135deg,var(--et-primary),#8b5cf6);-webkit-background-clip:text;background-clip:text;color:transparent;margin-top:2px;}" +
      "button.cta{margin-top:16px;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,var(--et-primary),#8b5cf6);color:#fff;font-weight:700;font-size:15px;}button.cta:hover{filter:brightness(1.05);}" +
      ".muted{color:#9ca3af;font-size:12px;margin-top:10px;}"
    },

    // 8) MATERIAL — Material Design, filled input, elevation
    "material": { label: "Material Design", primary: "#6750a4", font: "'Roboto',system-ui,sans-serif", css:
      ".card{background:#fff;color:#1c1b1f;border:none;border-radius:16px;padding:22px;max-width:440px;box-shadow:0 1px 2px rgba(0,0,0,.3),0 2px 6px 2px rgba(0,0,0,.15);}" +
      ".badge{display:inline-block;font-size:11px;background:color-mix(in srgb,var(--et-primary) 14%,#fff);color:var(--et-primary);padding:5px 12px;border-radius:8px;font-weight:600;margin-bottom:12px;}" +
      ".t{font-size:20px;font-weight:500;margin:0 0 4px;color:#1c1b1f;}.sub{font-size:13px;color:#49454f;margin:0 0 16px;}" +
      "label{display:block;font-size:12px;font-weight:500;margin:14px 0 4px;color:var(--et-primary);}" +
      "input,select{width:100%;padding:12px 14px;border:none;border-bottom:2px solid #79747e;border-radius:8px 8px 0 0;font-size:15px;font-family:inherit;background:#f3edf7;color:#1c1b1f;}" +
      "input:focus,select:focus{outline:none;border-bottom:2px solid var(--et-primary);background:#ece6f0;}" +
      ".result{margin-top:20px;padding:18px;border-radius:12px;background:color-mix(in srgb,var(--et-primary) 8%,#fff);}" +
      ".result .v{font-weight:600;color:#1c1b1f;}.big{font-size:28px;font-weight:500;color:var(--et-primary);margin-top:2px;}" +
      "button.cta{margin-top:18px;padding:13px;border:none;border-radius:999px;background:var(--et-primary);color:#fff;font-weight:600;font-size:14px;letter-spacing:.5px;text-transform:uppercase;box-shadow:0 1px 3px rgba(0,0,0,.3);}button.cta:hover{box-shadow:0 2px 6px rgba(0,0,0,.4);filter:brightness(1.05);}" +
      ".muted{color:#79747e;font-size:12px;margin-top:10px;}"
    },

    // 9) RETRO — krem hangat, tepi dashed, ceria
    "retro": { label: "Retro Warm", primary: "#d2691e", font: "'Courier New',monospace", css:
      ".card{background:#fdf3e3;color:#4a3728;border:2px dashed #b07a4a;border-radius:10px;padding:22px;max-width:440px;box-shadow:6px 6px 0 rgba(176,122,74,.3);}" +
      ".badge{display:inline-block;font-size:11px;background:#4a3728;color:#fdf3e3;padding:4px 10px;border-radius:4px;font-weight:700;margin-bottom:12px;letter-spacing:1px;text-transform:uppercase;}" +
      ".t{font-size:20px;font-weight:800;margin:0 0 4px;color:#4a3728;}.sub{font-size:13px;color:#8a6f55;margin:0 0 14px;}" +
      "label{display:block;font-size:12px;font-weight:700;margin:12px 0 6px;color:#6b4f37;text-transform:uppercase;}" +
      "input,select{width:100%;padding:10px 12px;border:2px solid #b07a4a;border-radius:6px;font-size:15px;font-family:inherit;background:#fffaf0;color:#4a3728;}" +
      "input:focus,select:focus{outline:none;border-color:var(--et-primary);box-shadow:3px 3px 0 rgba(210,105,30,.3);}" +
      ".result{margin-top:18px;padding:16px;border-radius:8px;background:#fffaf0;border:2px dashed var(--et-primary);}" +
      ".result .v{font-weight:800;color:#4a3728;}.big{font-size:27px;font-weight:800;color:var(--et-primary);margin-top:2px;}" +
      "button.cta{margin-top:16px;padding:13px;border:2px solid #4a3728;border-radius:6px;background:var(--et-primary);color:#fff;font-weight:800;font-size:15px;box-shadow:4px 4px 0 #4a3728;}button.cta:hover{transform:translate(2px,2px);box-shadow:2px 2px 0 #4a3728;}" +
      ".muted{color:#8a6f55;font-size:12px;margin-top:10px;}"
    },

    // 10) LUXURY — gelap elegan, aksen emas, serif
    "luxury": { label: "Luxury Gold", primary: "#c8a14a", font: "Georgia,'Times New Roman',serif", css:
      ".card{background:#14110d;color:#e8e0d0;border:1px solid #c8a14a;border-radius:6px;padding:26px;max-width:440px;box-shadow:0 14px 50px rgba(0,0,0,.5);}" +
      ".badge{display:inline-block;font-size:10px;background:transparent;color:var(--et-primary);padding:4px 12px;border:1px solid var(--et-primary);border-radius:2px;font-weight:600;margin-bottom:14px;letter-spacing:3px;text-transform:uppercase;}" +
      ".t{font-size:23px;font-weight:600;margin:0 0 4px;color:#f4ecdb;letter-spacing:.3px;}.sub{font-size:13px;color:#9c917c;margin:0 0 18px;font-style:italic;}" +
      "label{display:block;font-size:11px;font-weight:600;margin:14px 0 6px;color:#b9ad95;letter-spacing:2px;text-transform:uppercase;}" +
      "input,select{width:100%;padding:11px 13px;border:1px solid #3a3326;border-radius:3px;font-size:15px;font-family:inherit;background:#1d1913;color:#f4ecdb;}" +
      "input:focus,select:focus{outline:none;border-color:var(--et-primary);box-shadow:0 0 0 2px rgba(200,161,74,.25);}" +
      ".result{margin-top:20px;padding:18px;border-radius:4px;background:#1d1913;border:1px solid #3a3326;border-left:3px solid var(--et-primary);}" +
      ".result .v{font-weight:700;color:#f4ecdb;}.big{font-size:28px;font-weight:600;color:var(--et-primary);margin-top:2px;}" +
      "button.cta{margin-top:20px;padding:14px;border:1px solid var(--et-primary);border-radius:3px;background:var(--et-primary);color:#14110d;font-weight:700;font-size:14px;letter-spacing:2px;text-transform:uppercase;}button.cta:hover{background:transparent;color:var(--et-primary);}" +
      ".muted{color:#7a7060;font-size:12px;margin-top:12px;font-style:italic;}"
    }
  };
  // alias angka -> nama
  var SKIN_BY_INDEX = ["classic","neumorph","glass","dark","brutalist","minimal","gradient","material","retro","luxury"];
  EfisienTools.SKINS = SKINS;
  EfisienTools.SKIN_BY_INDEX = SKIN_BY_INDEX;

  function resolveSkin(val) {
    if (!val) return SKINS["classic"];
    val = String(val).toLowerCase().trim();
    if (SKINS[val]) return SKINS[val];
    var idx = parseInt(val, 10);
    if (!isNaN(idx) && SKIN_BY_INDEX[idx - 1]) return SKINS[SKIN_BY_INDEX[idx - 1]];
    return SKINS["classic"];
  }

  /* =========================================================
   * 5) BASE CLASS — sama dengan sistem asli + pemilihan skin
   * =======================================================*/
  class BaseTool extends HTMLElement {
    connectedCallback() {
      if (this._mounted) return;
      this._mounted = true;
      this.attachShadow({ mode: "open" });
      this._rerender = this._rerender.bind(this);
      document.addEventListener("efisien-catalog-updated", this._rerender);
      this._rerender();
    }
    disconnectedCallback() { document.removeEventListener("efisien-catalog-updated", this._rerender); }
    _readTheme() {
      this._skin = resolveSkin(this.getAttribute("desain"));
      var preset = PRESETS[this.getAttribute("tema")] || {};
      // prioritas warna: atribut warna > tema > default skin
      this._primary = this.getAttribute("warna") || preset.primary || this._skin.primary;
      this._radius = this.getAttribute("radius") || "";
      this._font = this.getAttribute("font") || this._skin.font;
    }
    _rerender() {
      this._readTheme();
      var vars = ":host{--et-primary:" + this._primary + ";--et-font:" + this._font + ";}";
      this.shadowRoot.innerHTML = "<style>" + vars + SHARED + this._skin.css + "</style>" + this.template();
      if (this.afterRender) this.afterRender();
    }
    $(sel) { return this.shadowRoot.querySelector(sel); }
    $all(sel) { return Array.prototype.slice.call(this.shadowRoot.querySelectorAll(sel)); }
    cat() { return EfisienTools.catalog; }
    leadFooter() {
      var label = this.getAttribute("cta") || "Minta Penawaran via WhatsApp";
      return '<button class="cta" id="__cta">' + esc(label) + '</button>' +
        '<p class="muted">Estimasi otomatis. Harga final menyesuaikan survei lokasi &amp; spesifikasi.</p>';
    }
    bindLead(getSummary) {
      var self = this;
      var btn = this.$("#__cta");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var s = getSummary() || {};
        var wa = (self.getAttribute("wa") || "").replace(/[^0-9]/g, "");
        var endpoint = self.getAttribute("lead-endpoint");
        var lines = ["Halo, saya ingin minta penawaran:", "*" + (s.judul || "Estimasi") + "*"];
        (s.lines || []).forEach(function (l) { lines.push("- " + l[0] + ": " + l[1]); });
        if (s.total) lines.push("*Estimasi: " + s.total + "*");
        lines.push("(via kalkulator website)");
        var text = lines.join("\n");
        if (endpoint) {
          try {
            fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tool: self.tagName.toLowerCase(), desain: self.getAttribute("desain") || "classic", summary: s, page: location.href, ts: Date.now() }) });
          } catch (e) {}
        }
        window.open("https://wa.me/" + wa + "?text=" + encodeURIComponent(text), "_blank");
      });
    }
  }

  /* =========================================================
   * 6) KALKULATOR MATERIAL — MESIN HITUNG 100% SAMA dengan sistem asli
   * =======================================================*/
  class KalkulatorMaterial extends BaseTool {
    static get observedAttributes() { return ["desain", "tema", "warna", "kategori"]; }
    attributeChangedCallback() { if (this._mounted) this._rerender(); }
    template() {
      var key = this.getAttribute("kategori");
      var c = (this.cat().material || {})[key];
      if (!c) return '<div class="card"><div class="t">Kalkulator</div><p class="sub">Kategori "' + esc(key || "") + '" tidak ditemukan di katalog.</p></div>';
      this._c = c;
      var judul = this.getAttribute("judul") || ("Kalkulator " + c.label);
      var hideHarga = this.hasAttribute("sembunyikan-harga");
      var opts = c.varian.map(function (v) {
        return '<option value="' + v.id + '">' + esc(v.nama) + (hideHarga ? "" : " \u2014 " + rupiah(v.harga) + "/" + c.satuan) + '</option>';
      }).join("");
      var dims = c.mode === "panjang"
        ? '<div><label>Panjang (m)</label><input id="p" type="number" min="0" value="0" inputmode="decimal"></div>'
        : '<div><label>Panjang (m)</label><input id="p" type="number" min="0" value="0" inputmode="decimal"></div>' +
          '<div><label>Lebar (m)</label><input id="l" type="number" min="0" value="0" inputmode="decimal"></div>';
      return '<div class="card">' +
        '<span class="badge">' + esc(c.label) + '</span>' +
        '<div class="t">' + esc(judul) + '</div>' +
        '<div class="sub">Isi ukuran &amp; pilih jenis \u2014 estimasi biaya muncul otomatis.</div>' +
        '<div class="row">' + dims + '</div>' +
        '<label>Jenis</label><select id="jenis">' + opts + '</select>' +
        '<label>Cadangan / waste (%)</label><input id="waste" type="number" min="0" value="' + (c.waste || 0) + '">' +
        '<div class="result">' +
          '<div class="line"><span>Kebutuhan</span><span class="v" id="r-qty">0 ' + c.satuan + '</span></div>' +
          '<div class="line"><span>Estimasi Biaya</span></div>' +
          '<div class="big" id="r-biaya">Rp 0</div>' +
        '</div>' +
        this.leadFooter() +
        '</div>';
    }
    afterRender() {
      if (!this._c) return;
      var self = this;
      this.$all("input,select").forEach(function (el) { el.addEventListener("input", function () { self.update(); }); });
      this.update();
      this.bindLead(function () { return self._summary; });
    }
    update() {
      var c = this._c, qty;
      if (c.mode === "panjang") { qty = num(this.$("#p").value); }
      else { qty = num(this.$("#p").value) * num(this.$("#l").value); }
      var waste = num(this.$("#waste").value) || 0;
      var qtyW = qty * (1 + waste / 100);
      var sel = this.$("#jenis").value;
      var v = c.varian.filter(function (x) { return x.id === sel; })[0] || c.varian[0];
      var biaya = qtyW * v.harga;
      this.$("#r-qty").textContent = angka(qtyW) + " " + c.satuan;
      this.$("#r-biaya").textContent = rupiah(biaya);
      this._summary = { judul: "Kalkulator " + c.label, lines: [["Jenis", v.nama], ["Kebutuhan", angka(qtyW) + " " + c.satuan]], total: rupiah(biaya) };
    }
  }

  /* =========================================================
   * 7) REGISTRASI
   * =======================================================*/
  if (!customElements.get("kalkulator-material")) customElements.define("kalkulator-material", KalkulatorMaterial);

  try {
    var cs = document.currentScript;
    if (cs && cs.dataset && cs.dataset.catalog) { EfisienTools.loadCatalog(cs.dataset.catalog); }
  } catch (e) {}
})();
