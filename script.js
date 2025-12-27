/* ============================================================
   CONFIG
============================================================ */
const nomorWA = "6282146212007";

/* ============================================================
   HELPERS
============================================================ */
function formatBerat(gram) {
  if (gram >= 1000) {
    let kg = gram / 1000;
    return (kg % 1 === 0 ? kg : kg.toFixed(2)) + " kg";
  }
  return gram + " gr";
}

/* ============================================================
   ✅ VARIASI / WARNA (FINAL) - pakai #rowVariasi & #detailVariasi (HTML kamu sudah ada)
============================================================ */
function getDefaultVariasi(p) {
  return p?.varian?.default || p?.varian?.items?.[0]?.nama || "";
}

function getGambarUtama(p) {
  if (p?.varian?.items?.length) {
    const pilih = p.selectedVariasi || getDefaultVariasi(p);
    const v = p.varian.items.find(x => x.nama === pilih);
    return v?.gambar || p.gambar?.[0] || "";
  }
  return p.gambar?.[0] || "";
}

function getGambarListDetail(p) {
  if (p?.varian?.items?.length) {
    const utama = getGambarUtama(p);
    const lainnya = Array.isArray(p.gambar) ? p.gambar.filter(x => x !== utama) : [];
    return [utama, ...lainnya];
  }
  return Array.isArray(p.gambar) ? p.gambar : [];
}

function stripNamaVarian(nama) {
  // format cart: "Nama Produk || Variasi: Black"
  return nama.split("||")[0].trim();
}

function parseNamaVarian(nama) {
  const parts = String(nama || "").split("||").map(s => s.trim()).filter(Boolean);
  const namaAsli = (parts[0] || "").trim();

  let variasi = "";
  const vPart = parts.find(p => p.toLowerCase().includes("variasi:"));
  if (vPart) variasi = vPart.split(":").slice(1).join(":").trim();

  return { namaAsli, variasi };
}

function getStokProduk(p, variasi) {
  if (p?.varian?.items?.length) {
    const pilih = variasi || p.selectedVariasi || getDefaultVariasi(p);
    const v = p.varian.items.find(x => x.nama === pilih);
    return v ? (v.stok || 0) : 0;
  }
  return p?.stok || 0;
}

function setStokProduk(p, variasi, nilai) {
  if (p?.varian?.items?.length) {
    const pilih = variasi || p.selectedVariasi || getDefaultVariasi(p);
    const v = p.varian.items.find(x => x.nama === pilih);
    if (v) v.stok = Math.max(0, Number(nilai) || 0);
  } else {
    p.stok = Math.max(0, Number(nilai) || 0);
  }
}

function getStokTotal(p) {
  if (p?.varian?.items?.length) {
    return p.varian.items.reduce((sum, v) => sum + (v?.stok || 0), 0);
  }
  return p?.stok || 0;
}

/* ============================================================
   DATA PRODUK  ✅ WAJIB GLOBAL untuk StockStore
   ⚠️ PENTING: produk yang punya varian jangan didobel nama sama persis.
============================================================ */
window.produkList = [
  {
    nama: "MILD MERAH Papir 1 Bundel 2.000 lembar",
    merk: "OJK",
    rasa: "Manis Sedang",
    isi: 2000,
    size: "4x9 cm",
    harga: 21000,
    stok: 1000,
    berat: 200,
    kategori: "PAPIR / KERTAS LINTING",
    gambar: [
      "gambar/PAPIR/MILD_MERAH/IMG-20251122-WA0042.jpg",
      "gambar/PAPIR/MILD_MERAH/MILD_MERAH 1.jpg",
      "gambar/PAPIR/MILD_MERAH/MILD_MERAH 2.jpg"
    ],
    deskripsi: [
      "Nikmati Citarasa Lintingan Sendiri.",
      "Nyalakan Semangat Mu...",
      "Bangkitkan Inspirasi Mu...",
      "Happy Kaum Lintingers..."
    ],
  },
  {
    nama: "MILD HIJAU Papir 1 Bundel 2.000 lembar",
    merk: "OJK",
    rasa: "Manis Sedang",
    isi: 2000,
    size: "4x9 cm",
    harga: 21000,
    stok: 1000,
    berat: 200,
    kategori: "PAPIR / KERTAS LINTING",
    gambar: [
      "gambar/PAPIR/MILD_HIJAU/MILD_HIJAU-3.jpg",
      "gambar/PAPIR/MILD_HIJAU/MILD_HIJAU-2.jpg",
      "gambar/PAPIR/MILD_HIJAU/MILD_HIJAU-1.jpg"
    ],
    deskripsi: [
      "Nikmati Citarasa Lintingan Sendiri.",
      "Nyalakan Semangat Mu...",
      "Bangkitkan Inspirasi Mu...",
      "Happy Kaum Lintingers..."
    ],
  },
  {
    nama: "LA Papir 1 Bundel 2.000 lembar",
    merk: "OJK",
    rasa: "Manis Sedang",
    isi: 2000,
    size: "4x9 cm",
    harga: 21000,
    stok: 1000,
    berat: 200,
    kategori: "PAPIR / KERTAS LINTING",
    gambar: [
      "gambar/PAPIR/LA_PPAPIR_1_BANDEL_BESAR_UTUH_2.000_LEMBAR/IMG-20251122-WA0048.jpg",
      "gambar/PAPIR/LA_PPAPIR_1_BANDEL_BESAR_UTUH_2.000_LEMBAR/IMG-20251122-WA0049.jpg",
      "gambar/PAPIR/LA_PPAPIR_1_BANDEL_BESAR_UTUH_2.000_LEMBAR/IMG-20251122-WA0030.jpg"
    ],
    deskripsi: [
      "Nikmati Citarasa Lintingan Sendiri.",
      "Nyalakan Semangat Mu...",
      "Bangkitkan Inspirasi Mu...",
      "Happy Kaum Lintingers..."
    ],
  },
  {
    nama: "MBR TAWAR Papir 1 Bundel 2.000 lembar",
    merk: "OJK",
    rasa: "TAWAR",
    isi: 2000,
    size: "4x8 cm",
    harga: 21000,
    stok: 1000,
    berat: 200,
    kategori: "PAPIR / KERTAS LINTING",
    gambar: [
      "gambar/PAPIR/MBR-TAWAR/MBR-TAWAR-3.jpeg",
      "gambar/PAPIR/MBR-TAWAR/MBR-TAWAR-1.jpeg",
      "gambar/PAPIR/MBR-TAWAR/MBR-TAWAR-2.jpeg"
    ],
    deskripsi: [
      "Nikmati Citarasa Lintingan Sendiri.",
      "Nyalakan Semangat Mu...",
      "Bangkitkan Inspirasi Mu...",
      "Happy Kaum Lintingers..."
    ],
  },
  {
    nama: "MBR MANIS Papir 1 Bundel 2.000 lembar",
    merk: "OJK",
    rasa: "MANIS SEDANG",
    isi: 2000,
    size: "4x8 cm",
    harga: 21000,
    stok: 1000,
    berat: 200,
    kategori: "PAPIR / KERTAS LINTING",
    gambar: [
      "gambar/PAPIR/MBR-MANIS/MBR-MANIS-1.jpeg",
      "gambar/PAPIR/MBR-MANIS/MBR-MANIS-2.jpeg",
      "gambar/PAPIR/MBR-MANIS/MBR-MANIS-3.jpeg"
    ],
    deskripsi: [
      "Nikmati Citarasa Lintingan Sendiri.",
      "Nyalakan Semangat Mu...",
      "Bangkitkan Inspirasi Mu...",
      "Happy Kaum Lintingers..."
    ],
  },
  {
    nama: "CLASS MILD Papir 1 Bundel 2.000 lembar",
    merk: "OJK",
    rasa: "Manis Sedang",
    isi: 2000,
    size: "4x9 cm",
    harga: 21000,
    stok: 1000,
    berat: 200,
    kategori: "PAPIR / KERTAS LINTING",
    gambar: [
      "gambar/PAPIR/CLASS_MILD_PAPIR_1_BANDEL_BESAR_UTUH_2.000_LEMBAR/IMG-20251122-WA0037.jpg",
      "gambar/PAPIR/CLASS_MILD_PAPIR_1_BANDEL_BESAR_UTUH_2.000_LEMBAR/IMG-20251122-WA0027.jpg",
      "gambar/PAPIR/CLASS_MILD_PAPIR_1_BANDEL_BESAR_UTUH_2.000_LEMBAR/IMG-20251122-WA0041.jpg"
    ],
    deskripsi: [
      "Nikmati Citarasa Lintingan Sendiri.",
      "Nyalakan Semangat Mu...",
      "Bangkitkan Inspirasi Mu...",
      "Happy Kaum Lintingers..."
    ],
  },
  {
    nama: "DUNMIL Papir 1 Bundel 2.000 lembar",
    merk: "OJK",
    rasa: "Manis Sedang",
    isi: 2000,
    size: "4x9 cm",
    harga: 21000,
    stok: 1000,
    berat: 200,
    kategori: "PAPIR / KERTAS LINTING",
    gambar: [
      "gambar/PAPIR/DUNMIL_Papir_1 Bundel_Besar_Utuh_2.000_Lembar/MILD_PINK-2.jpg",
      "gambar/PAPIR/DUNMIL_Papir_1 Bundel_Besar_Utuh_2.000_Lembar/IMG-20251122-WA0028.jpg",
      "gambar/PAPIR/DUNMIL_Papir_1 Bundel_Besar_Utuh_2.000_Lembar/IMG-20251122-WA0041.jpg"
    ],
    deskripsi: [
      "Nikmati Citarasa Lintingan Sendiri.",
      "Nyalakan Semangat Mu...",
      "Bangkitkan Inspirasi Mu...",
      "Happy Kaum Lintingers..."
    ],
  },
  {
    nama: "SAMSU HITAM Papir 1 Bundel 2.000 lembar",
    merk: "OJK",
    rasa: "Manis Sedang",
    isi: 2000,
    size: "4x9 cm",
    harga: 21000,
    stok: 1000,
    berat: 200,
    kategori: "PAPIR / KERTAS LINTING",
    gambar: [
      "gambar/PAPIR/SAMSU_HITAM_Papir_1_Bundel_Besar_Utuh_2.000_lembar/IMG-20251122-WA0061.jpg",
      "gambar/PAPIR/SAMSU_HITAM_Papir_1_Bundel_Besar_Utuh_2.000_lembar/WhatsApp Image 2025-11-29 at 21.19.09.jpeg",
      "gambar/PAPIR/SAMSU_HITAM_Papir_1_Bundel_Besar_Utuh_2.000_lembar/WhatsApp Image 2025-11-29 at 21.19.10.jpeg"
    ],
    deskripsi: [
      "Nikmati Citarasa Lintingan Sendiri.",
      "Nyalakan Semangat Mu...",
      "Bangkitkan Inspirasi Mu...",
      "Happy Kaum Lintingers..."
    ],
  },
  {
    nama: "EXLUSIVE Papir 1 Bundel 2.000 lembar",
    merk: "OJK",
    rasa: "Manis Sedang",
    isi: 2000,
    size: "4x9 cm",
    harga: 21000,
    stok: 1000,
    berat: 200,
    kategori: "PAPIR / KERTAS LINTING",
    gambar: [
      "gambar/PAPIR/EXLUSIVE-Papir-1-Bundel-Besar-Utuh-2.000-lembar/IMG-20251122-WA0038.jpg",
      "gambar/PAPIR/EXLUSIVE-Papir-1-Bundel-Besar-Utuh-2.000-lembar/IMG-20251122-WA0024.jpg",
      "gambar/PAPIR/EXLUSIVE-Papir-1-Bundel-Besar-Utuh-2.000-lembar/IMG-20251122-WA0025.jpg"
    ],
    deskripsi: [
      "Nikmati Citarasa Lintingan Sendiri.",
      "Nyalakan Semangat Mu...",
      "Bangkitkan Inspirasi Mu...",
      "Happy Kaum Lintingers..."
    ],
  },
  {
    nama: "BLANK Papir 1 Bundel 2.000 lembar",
    merk: "OJK",
    rasa: "Manis Sedang",
    isi: 2000,
    size: "4x9 cm",
    harga: 21000,
    stok: 1000,
    berat: 200,
    kategori: "PAPIR / KERTAS LINTING",
    gambar: [
      "gambar/PAPIR/BLANK_PAPIR_1_BUNDEL_BESAR_UTUH_2.000_LEMBAR/IMG-20251122-WA0052.jpg",
      "gambar/PAPIR/BLANK_PAPIR_1_BUNDEL_BESAR_UTUH_2.000_LEMBAR/IMG-20251122-WA0053.jpg",
      "gambar/PAPIR/BLANK_PAPIR_1_BUNDEL_BESAR_UTUH_2.000_LEMBAR/IMG-20251122-WA0022.jpg",
      "gambar/PAPIR/BLANK_PAPIR_1_BUNDEL_BESAR_UTUH_2.000_LEMBAR/IMG-20251122-WA0054.jpg"
    ],
    deskripsi: [
      "Nikmati Citarasa Lintingan Sendiri.",
      "Nyalakan Semangat Mu...",
      "Bangkitkan Inspirasi Mu...",
      "Happy Kaum Lintingers..."
    ],
  },
  {
    nama: "GF SUPER COKELAT Papir 1 Bundel 2.000 lembar",
    merk: "OJK",
    rasa: "Manis Sedang",
    isi: 2000,
    size: "4,3x8 cm",
    harga: 21000,
    stok: 1000,
    berat: 200,
    kategori: "PAPIR / KERTAS LINTING",
    gambar: [
      "gambar/PAPIR/GF/MILD_COKELAT/COKELAT-3.jpeg",
    ],
    deskripsi: [
      "Nikmati Citarasa Lintingan Sendiri.",
      "Nyalakan Semangat Mu...",
      "Bangkitkan Inspirasi Mu...",
      "Happy Kaum Lintingers..."
    ],
  },
  {
    nama: "GF SAMSU KUNING Papir 1 Bundel 2.000 lembar",
    merk: "OJK",
    rasa: "Manis Sedang",
    isi: 2000,
    size: "4,3x8 cm",
    harga: 21000,
    stok: 1000,
    berat: 200,
    kategori: "PAPIR / KERTAS LINTING",
    gambar: [
      "gambar/PAPIR/GF/SAMSU_KUNING_Papir_1_Bundel_Besar_Utuh_2.000_lembar/SAMSU-KUNING-1.jpg",
      "gambar/PAPIR/GF/SAMSU_KUNING_Papir_1_Bundel_Besar_Utuh_2.000_lembar/SAMSU-KUNING-2.jpg",
      "gambar/PAPIR/GF/SAMSU_KUNING_Papir_1_Bundel_Besar_Utuh_2.000_lembar/SAMSU-KUNING-3.jpg"
    ],
    deskripsi: [
      "Nikmati Citarasa Lintingan Sendiri.",
      "Nyalakan Semangat Mu...",
      "Bangkitkan Inspirasi Mu...",
      "Happy Kaum Lintingers..."
    ],
  },
  {
    nama: "SURYA Papir 1 Bundel Besar Utuh 2.000 lembarr",
    merk: "OJK",
    rasa: "Manis Sedang",
    isi: 2000,
    size: "4x9 cm",
    harga: 21000,
    stok: 1000,
    berat: 200,
    kategori: "PAPIR / KERTAS LINTING",
    gambar: [
      "gambar/PAPIR/SURYA_PAPIR_1_BUNDEL_BESAR_UTUH_2.000_LEMBAR/MILD_ORANGE-2.jpg",
      "gambar/PAPIR/SURYA_PAPIR_1_BUNDEL_BESAR_UTUH_2.000_LEMBAR/IMG-20251122-WA0057.jpg",
      "gambar/PAPIR/SURYA_PAPIR_1_BUNDEL_BESAR_UTUH_2.000_LEMBAR/IMG-20251122-WA0056.jpg"
    ],
    deskripsi: [
      "Nikmati Citarasa Lintingan Sendiri.",
      "Nyalakan Semangat Mu...",
      "Bangkitkan Inspirasi Mu...",
      "Happy Kaum Lintingers..."
    ],
  },

  /* ===========================
     PRODUK BUSA/FILTER
  ============================ */
  {
    nama: "MILD 1 KLIK RASA ANGGUR 30gr",
    merk: "MILD",
    rasa: "Anggur",
    isi: 170,
    harga: 13000,
    stok: 1000,
    berat: 30,
    kategori: "BUSA / FILTER / SPONS",
    gambar: [
      "gambar/BUSA/BUSA_ANGGUR/IMG-20251122-WA0080.jpg",
      "gambar/BUSA/BUSA_ANGGUR/IMG-20251122-WA0074.jpg",
    ],
    deskripsi: [
      "Nikmati Citarasa Lintingan Sendiri.",
      "Nyalakan Semangat Mu...",
      "Bangkitkan Inspirasi Mu...",
      "Happy Kaum Lintingers...",
      "Ukuran: Mild 1 klik · Rasa ANGGUR · Isi 30 gr · Quality Premium."
    ],
  },

  /* ===========================
     AKSESORIS
  ============================ */
  {
    nama: " Hornet 110mm Ukuran MILD",
    merk: "Firetric",
    isi: 1,
    size: "Ukuran Rokok 10 x 110 mm",
    harga: 5000,
    stok: 100,
    berat: 120,
    kategori: "AKSESORIS ROKOK & API",
    gambar: [
      "gambar/AKSESORIS ROKOK & API/Hornet-110mm-Ukuran-MILD/WhatsApp Image 2025-12-02 at 21.10.11.jpeg",
      "gambar/AKSESORIS ROKOK & API/Hornet-110mm-Ukuran-MILD/WhatsApp Image 2025-12-02 at 21.10.41 (1).jpeg",
      "gambar/AKSESORIS ROKOK & API/Hornet-110mm-Ukuran-MILD/WhatsApp Image 2025-12-02 at 21.10.41.jpeg"
    ],
    deskripsi: [
      "Brand: Firetric",
      "Garansi: -",
      "Berat Produk: 0.12 kg",
      "Dimensi Kemasan: -",
      "",
      "Keunggulan Produk:",
      "🔹 Bodinya terbuat dari metal yang kokoh, awet, dan tampak premium.",
      "🔹 Proses linting lebih rapi berkat adanya penutup metal.",
      "🔹 Menghasilkan ukuran rokok 10 x 110 mm yang banyak disukai.",
      "🔹 Desain ringkas sehingga mudah dibawa bepergian.",
      "",
      "Kelengkapan Produk:",
      "1 x Firetric Alat Linting Rokok Manual Tobacco Roller 10x110mm - TN902"
    ],
  },

  /* ===========================
     ✅ PRODUK VARIAN WARNA (1 gambar per warna)
  ============================ */
{
  nama: "Firetric Focus Kotak Rokok 20 Slot dengan Korek Elektrik Pyrotechnic - JD-YH071",
  merk: "Firetric",
  isi: 1,
  size: "Kotak Rokok: 60 x 35 x 94 mm | Panjang Kabel Micro USB: Sekitar 15 cm",
  harga: 5000,

  // stok utama tidak dipakai untuk varian (biar gak nabrak)
  stok: 0,

  berat: 105,
  kategori: "AKSESORIS ROKOK & API",

  varian: {
    default: "Black",
    items: [
      { nama: "Black",  stok: 50, gambar: "gambar/AKSESORIS ROKOK & API/KOTAK-ROKO-20-SLOT/varian-warna.jpg" },
      { nama: "Silver", stok: 50, gambar: "gambar/AKSESORIS ROKOK & API/KOTAK-ROKO-20-SLOT/varian-warna.jpg" },
      { nama: "Golden", stok: 10, gambar: "gambar/AKSESORIS ROKOK & API/KOTAK-ROKO-20-SLOT/varian-warna.jpg" },
    ]
  },

    // optional gambar tambahan
    gambar: [
      "gambar/AKSESORIS ROKOK & API/KOTAK-ROKO-20-SLOT/firetric-kotak-rokok-20-slot-anti-lembap-moisture-proof-jd-yh035d.png",
      "gambar/AKSESORIS ROKOK & API/KOTAK-ROKO-20-SLOT/KOTAK-SLOT-20-1 (3).jpg",
      "gambar/AKSESORIS ROKOK & API/KOTAK-ROKO-20-SLOT/KOTAK-SLOT-20-1 (4).jpg",
      "gambar/AKSESORIS ROKOK & API/KOTAK-ROKO-20-SLOT/KOTAK-SLOT-20-1 (5).jpg",
      "gambar/AKSESORIS ROKOK & API/KOTAK-ROKO-20-SLOT/KOTAK-SLOT-20-1 (1).jpg",
      "gambar/AKSESORIS ROKOK & API/KOTAK-ROKO-20-SLOT/KOTAK-SLOT-20-1 (6).jpg",
      "gambar/AKSESORIS ROKOK & API/KOTAK-ROKO-20-SLOT/KOTAK-SLOT-20-1 (8).jpg",
      "gambar/AKSESORIS ROKOK & API/KOTAK-ROKO-20-SLOT/KOTAK-SLOT-20-1 (9).jpg",
    ],

    deskripsi: [
      "Brand: Firetric",
      "Garansi: -",
      "Berat Produk: 0.15 kg",
      "Dimensi Kemasan: 9 x 6 x 12 cm",
      "",
      "Keunggulan Produk:",
      "🔹 Kotak rokok yang mampu menampung 20 batang rokok dengan panjang 88 mm.",
      "🔹 Dilengkapi fitur moisture proof sehingga menjaga kualitas rokok tidak mudah lembap atau rusak.",
      "🔹 Desain elegan, bentuk minimalis, dan paduan warna mewah yang dapat dipilih sesuai selera.",
      "",
      "Kelengkapan Produk:",
      "1 x Firetric Focus Kotak Rokok 20 Slot dengan Korek Elektrik Pyrotechnic - JD-YH071",
      "1 x Kabel Micro USB"
    ],
  },
];

const produkList = window.produkList; // alias

/* ============================================================
   STATE
============================================================ */
let cart = [];
let currentProduct = null;
let slideIndex = 0;
let autoSlide;

/* DOM */
const grid = document.getElementById("productGrid");

/* ============================================================
   KATEGORI
============================================================ */
function openKategori(kat) {
  document.getElementById("judulKategori").textContent = kat;
  document.getElementById("judulKategori").style.display = "block";

  renderProdukKategori(kat);

  document.getElementById("detail-box").classList.add("hidden");
  grid.style.display = "grid";
}

/* ============================================================
   RENDER GRID PRODUK
============================================================ */
function renderProdukKategori(kat) {
  grid.innerHTML = "";

  const filtered = produkList.filter(p => p.kategori === kat);

  if (filtered.length === 0) {
    grid.innerHTML = "<p>Tidak ada produk.</p>";
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "produk-card";

    const imgUtama = getGambarUtama(p);

    card.innerHTML = `
      <img src="${imgUtama}" onclick="showDetail('${p.nama}')">

      <div class="product-info">
        <h3 class="product-name">${p.nama}</h3>

        <p class="product-stock">Berat: <b>${formatBerat(p.berat)}</b></p>
        <p class="product-price">Rp${p.harga.toLocaleString()}</p>
        <p class="product-stock">Stok: <b>${getStokTotal(p)}</b></p>

        ${
          getStokTotal(p) > 0
            ? `<button class="add-cart-btn" onclick="addToCart('${p.nama}',${p.harga},${p.berat})">+ Keranjang</button>`
            : `<button class="add-cart-btn" disabled style="background:#999">Stok Habis</button>`
        }
      </div>
    `;

    grid.appendChild(card);
  });
}

/* ============================================================
   DETAIL PRODUK + SLIDER + VARIASI
============================================================ */
function showDetail(nama) {
  const p = produkList.find(x => x.nama === nama);
  currentProduct = p;

  // default variasi jika ada
  if (p?.varian?.items?.length) {
    p.selectedVariasi = p.selectedVariasi || getDefaultVariasi(p);
  } else {
    p.selectedVariasi = "";
  }

  slideIndex = 0;
  clearInterval(autoSlide);

  let gambarList = getGambarListDetail(p);

  document.getElementById("detailImg").src = gambarList[0] || "";

  const thumb = document.getElementById("thumbContainer");
  thumb.innerHTML = "";

  gambarList.forEach((g, i) => {
    const t = document.createElement("img");
    t.src = g;
    t.className = i === 0 ? "active" : "";
    t.onclick = () => {
      slideIndex = i;
      updateSlide();
    };
    thumb.appendChild(t);
  });

  let leadText = "";
  let fullDesc = "";

  if (Array.isArray(p.deskripsi)) {
    leadText = p.deskripsi[0] || "";
    fullDesc = p.deskripsi
      .slice(1)
      .map(d => `<p>${d}</p>`)
      .join("");
  } else {
    leadText = p.deskripsi || "";
    fullDesc = `<p>${p.deskripsi || ""}</p>`;
  }

  document.getElementById("detailLead").textContent = leadText;
  document.getElementById("detailDesk").innerHTML = fullDesc;

  document.getElementById("detailNama").textContent = p.nama;
  document.getElementById("detailPrice").textContent =
    "Rp " + p.harga.toLocaleString();
  document.getElementById("detailMerk").textContent = p.merk;

  // ✅ pakai placeholder HTML kamu: rowVariasi + detailVariasi
  const rowVariasi = document.getElementById("rowVariasi");
  const selectVariasi = document.getElementById("detailVariasi");

  if (p?.varian?.items?.length && rowVariasi && selectVariasi) {
    rowVariasi.style.display = "";
    selectVariasi.innerHTML = "";

    p.varian.items.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.nama;
      opt.textContent = v.nama;
      selectVariasi.appendChild(opt);
    });

    selectVariasi.value = p.selectedVariasi;

    selectVariasi.onchange = () => {
      p.selectedVariasi = selectVariasi.value;

      // refresh slider
      slideIndex = 0;
      gambarList = getGambarListDetail(p);

      document.getElementById("detailImg").src = gambarList[0] || "";

      const thumb2 = document.getElementById("thumbContainer");
      thumb2.innerHTML = "";
      gambarList.forEach((g, i) => {
        const t = document.createElement("img");
        t.src = g;
        t.className = i === 0 ? "active" : "";
        t.onclick = () => {
          slideIndex = i;
          updateSlide();
       
      document.getElementById("detailStock").textContent = getStokProduk(p, p.selectedVariasi);
    };
        thumb2.appendChild(t);
      });
    };
  } else {
    if (rowVariasi) rowVariasi.style.display = "none";
  }

  const rasaEl = document.getElementById("detailRasa");
  const rasaRow = rasaEl ? rasaEl.parentElement : null;

  if (p.kategori === "ALAT LINTING") {
    if (rasaRow) rasaRow.style.display = "none";
  } else {
    if (rasaRow) rasaRow.style.display = "";
    if (rasaEl && p.rasa !== undefined) rasaEl.textContent = p.rasa;
  }

  const sizeEl = document.getElementById("detailSize");
  const sizeRow = sizeEl ? sizeEl.parentElement : null;

  let satuanIsi = "lembar";

  if (p.kategori === "BUSA / FILTER / SPONS") {
    satuanIsi = "butir";
    if (sizeRow) sizeRow.style.display = "none";
  } else if (p.kategori === "ALAT LINTING") {
    satuanIsi = "unit";
    if (sizeRow) sizeRow.style.display = "";
  } else {
    satuanIsi = "lembar";
    if (sizeRow) sizeRow.style.display = "";
  }

  document.getElementById("detailIsi").textContent = p.isi + " " + satuanIsi;
  if (sizeEl && p.size) sizeEl.textContent = p.size;

  document.getElementById("detailBerat").textContent = formatBerat(p.berat);
  document.getElementById("detailStock").textContent = getStokProduk(p, p.selectedVariasi);

  document.getElementById("detailQty").value = 1;

  document.getElementById("detailAddCart").onclick = () => {
    let qty = parseInt(document.getElementById("detailQty").value) || 1;
    const stokVar = getStokProduk(p, p.selectedVariasi);
    if (qty > stokVar) return alert(`Stok tidak cukup! Sisa stok: ${stokVar}`);

    const labelVar = p.selectedVariasi ? ` || Variasi: ${p.selectedVariasi}` : "";
    const namaCart = `${p.nama}${labelVar}`;

    for (let i = 0; i < qty; i++) addToCart(namaCart, p.harga, p.berat);

    alert(`${qty} x ${namaCart} ditambahkan ke keranjang`);
  };

  document.getElementById("detail-box").classList.remove("hidden");
  grid.style.display = "none";

  window.scrollTo({ top: 0, behavior: "smooth" });

  autoSlide = setInterval(() => nextSlide(), 3500);
}

/* SLIDER */
function updateSlide() {
  if (!currentProduct) return;
  const list = getGambarListDetail(currentProduct);
  document.getElementById("detailImg").src = list[slideIndex] || "";
  document
    .querySelectorAll("#thumbContainer img")
    .forEach((el, i) => el.classList.toggle("active", i === slideIndex));
}

function nextSlide() {
  const list = getGambarListDetail(currentProduct);
  slideIndex = (slideIndex + 1) % list.length;
  updateSlide();
}
function prevSlide() {
  const list = getGambarListDetail(currentProduct);
  slideIndex = (slideIndex - 1 + list.length) % list.length;
  updateSlide();
}

/* Back */
function backToProduk() {
  document.getElementById("detail-box").classList.add("hidden");
  grid.style.display = "grid";
}

/* ============================================================
   CART
============================================================ */
function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

function addToCart(nama, harga, berat) {
  const { namaAsli, variasi } = parseNamaVarian(nama);
  const produk = produkList.find(p => p.nama === namaAsli);
  if (!produk) return;

  const varFinal = produk?.varian?.items?.length
    ? (variasi || produk.selectedVariasi || getDefaultVariasi(produk))
    : "";

  const stokSekarang = getStokProduk(produk, varFinal);
  if (stokSekarang <= 0) return alert("Stok habis!");

  // ✅ kurangi stok varian / non-varian
  setStokProduk(produk, varFinal, stokSekarang - 1);

  // update stok di detail (kalau sedang dibuka)
  if (currentProduct && currentProduct.nama === namaAsli) {
    const tampilVar = currentProduct?.varian?.items?.length
      ? (currentProduct.selectedVariasi || getDefaultVariasi(currentProduct))
      : "";
    document.getElementById("detailStock").textContent = getStokProduk(currentProduct, tampilVar);

    const btn = document.getElementById("detailAddCart");
    if (btn) btn.disabled = getStokProduk(currentProduct, tampilVar) <= 0;
  }

  // ✅ nama cart unik per varian
  const namaCart = produk?.varian?.items?.length
    ? `${namaAsli} || Variasi: ${varFinal}`
    : namaAsli;

  const exist = cart.find(c => c.nama === namaCart);
  if (exist) {
    exist.qty++;
  } else {
    cart.push({ nama: namaCart, harga, berat, qty: 1 });
  }

  updateCartCount();
  renderCart();

  const currentKat = document.getElementById("judulKategori").textContent;
  if (currentKat) renderProdukKategori(currentKat);

  if (window.StockStore) StockStore.syncNow();
}

/* Floating cart */
document.getElementById("cart-float").onclick = () => {
  document.getElementById("cart-panel").style.display = "flex";
  renderCart();
};
document.getElementById("close-cart").onclick = () =>
  (document.getElementById("cart-panel").style.display = "none");

/* ============================================================
   RENDER CART
============================================================ */
function renderCart() {
  const panel = document.getElementById("cart-items");
  panel.innerHTML = "";

  let total = 0;

  cart.forEach((item, i) => {
    const subtotal = item.harga * item.qty;
    total += subtotal;

    panel.innerHTML += `
      <div class="cart-item">
        <div class="info">
          <b>${item.nama}</b><br>
          Berat total: ${formatBerat(item.berat * item.qty)}<br>
          Rp${item.harga.toLocaleString()}
        </div>

        <div class="qty-box">
          <span class="qty-btn" onclick="changeQty(${i},-1)">−</span>
          <span class="qty-value">${item.qty}</span>
          <span class="qty-btn" onclick="changeQty(${i},1)">+</span>
        </div>

        <span class="delete-btn" onclick="removeItem(${i})">✖</span>
      </div>
    `;
  });

  document.getElementById("cart-total").textContent =
    total.toLocaleString();
}

/* ============================================================
   QTY CART
============================================================ */
function changeQty(i, val) {
  const item = cart[i];
  if (!item) return;

  const { namaAsli, variasi } = parseNamaVarian(item.nama);
  const produk = produkList.find(p => p.nama === namaAsli);
  if (!produk) return;

  const varFinal = produk?.varian?.items?.length
    ? (variasi || getDefaultVariasi(produk))
    : "";

  if (val === 1) {
    const stok = getStokProduk(produk, varFinal);
    if (stok <= 0) return alert("Stok tidak cukup!");
    setStokProduk(produk, varFinal, stok - 1);
    item.qty++;
  } else if (val === -1) {
    const stok = getStokProduk(produk, varFinal);
    setStokProduk(produk, varFinal, stok + 1);
    item.qty--;
    if (item.qty <= 0) cart.splice(i, 1);
  }

  if (currentProduct && currentProduct.nama === namaAsli) {
    const tampilVar = currentProduct?.varian?.items?.length
      ? (currentProduct.selectedVariasi || getDefaultVariasi(currentProduct))
      : "";
    document.getElementById("detailStock").textContent = getStokProduk(currentProduct, tampilVar);

    const btn = document.getElementById("detailAddCart");
    if (btn) btn.disabled = getStokProduk(currentProduct, tampilVar) <= 0;
  }

  updateCartCount();
  renderCart();

  const currentKat = document.getElementById("judulKategori").textContent;
  if (currentKat) renderProdukKategori(currentKat);

  if (window.StockStore) StockStore.syncNow();
}

function removeItem(i) {
  const item = cart[i];
  if (!item) return;

  const { namaAsli, variasi } = parseNamaVarian(item.nama);
  const produk = produkList.find(p => p.nama === namaAsli);

  if (produk) {
    const varFinal = produk?.varian?.items?.length
      ? (variasi || getDefaultVariasi(produk))
      : "";
    const stok = getStokProduk(produk, varFinal);
    setStokProduk(produk, varFinal, stok + item.qty);
  }

  cart.splice(i, 1);

  if (currentProduct && currentProduct.nama === namaAsli) {
    const tampilVar = currentProduct?.varian?.items?.length
      ? (currentProduct.selectedVariasi || getDefaultVariasi(currentProduct))
      : "";
    document.getElementById("detailStock").textContent = getStokProduk(currentProduct, tampilVar);

    const btn = document.getElementById("detailAddCart");
    if (btn) btn.disabled = getStokProduk(currentProduct, tampilVar) <= 0;
  }

  updateCartCount();
  renderCart();

  const kat = document.getElementById("judulKategori").textContent;
  if (kat) renderProdukKategori(kat);

  if (window.StockStore) StockStore.syncNow();
}

/* ============================================================
   FINALIZE ORDER (cart kosong, stok TIDAK dikembalikan)
============================================================ */
function finalizeOrder() {
  cart = [];

  updateCartCount();
  renderCart();

  const kat = document.getElementById("judulKategori")?.textContent || "";
  if (kat) renderProdukKategori(kat);

  if (currentProduct) {
    const stokEl = document.getElementById("detailStock");
    if (stokEl) {
      const tampilVar = currentProduct?.varian?.items?.length
        ? (currentProduct.selectedVariasi || getDefaultVariasi(currentProduct))
        : "";
      stokEl.textContent = getStokProduk(currentProduct, tampilVar);
    }
const btn = document.getElementById("detailAddCart");
    if (btn) btn.disabled = currentProduct.stok <= 0;
  }
}

/* ============================================================
   EVENT BINDING AMAN (tidak null, tidak error)
============================================================ */
window.addEventListener("DOMContentLoaded", async () => {
  // ✅ INIT STOCK dari localStorage / file / firebase
  if (window.StockStore) {
    await StockStore.init(window.produkList);
  }

  const btnCheckout = document.getElementById("checkout");
  const btnCloseAlamat = document.getElementById("close-alamat");
  const btnConfirm = document.getElementById("confirm-alamat");

  if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
      if (cart.length === 0) return alert("Keranjang masih kosong!");
      const cartPanel = document.getElementById("cart-panel");
      const alamatPanel = document.getElementById("alamat-panel");
      if (cartPanel) cartPanel.style.display = "none";
      if (alamatPanel) alamatPanel.style.display = "flex";
    });
  }

  if (btnCloseAlamat) {
    btnCloseAlamat.addEventListener("click", () => {
      const alamatPanel = document.getElementById("alamat-panel");
      if (alamatPanel) alamatPanel.style.display = "none";
    });
  }

  if (btnConfirm) {
    btnConfirm.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const alamat = (document.getElementById("alamat-input")?.value || "").trim();
      const jenisOngkir = (document.getElementById("jenis-ongkir")?.value || "").trim();
      const kurir = (document.getElementById("kurir")?.value || "").trim();
      const payment = (document.getElementById("payment")?.value || "").trim();

      if (cart.length === 0) return alert("Keranjang masih kosong!");
      if (!alamat) return alert("Alamat wajib diisi!");
      if (!jenisOngkir) return alert("Jenis ongkir wajib diisi!");

      let text = "*🛒 PESANAN BARU*%0A%0A*Daftar Produk:*%0A";
      let totalBarang = 0;
      let totalBerat = 0;

      cart.forEach((item, i) => {
        const subtotal = item.harga * item.qty;
        const beratTotal = item.berat * item.qty;

        totalBarang += subtotal;
        totalBerat += beratTotal;

        text +=
          `${i + 1}. ${item.nama} — ${item.qty}x%0A` +
          `   Berat: ${formatBerat(beratTotal)}%0A` +
          `   Rp${subtotal.toLocaleString()}%0A`;
      });

      text += `%0A*Total Berat:* ${formatBerat(totalBerat)}`;
      text += `%0A*Total Barang:* Rp${totalBarang.toLocaleString()}`;
      text += `%0A*Ongkir:* ${kurir} (${jenisOngkir})%0A(Admin akan memberitahu total ongkirnya)`;
      text += `%0A*Alamat:* ${alamat}`;
      text += `%0A*Pembayaran:* ${payment}`;
      text += `%0A%0AMohon diproses 😊`;

      window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(text)}`, "_blank");

      finalizeOrder();

      // ✅ SIMPAN SEKALI LAGI (aman)
      if (window.StockStore) await StockStore.syncNow();

      const alamatPanel = document.getElementById("alamat-panel");
      if (alamatPanel) alamatPanel.style.display = "none";

      alert("Pesanan dikirim ke WhatsApp ✅");
    });
  } else {
    console.error("ERROR: Tombol #confirm-alamat tidak ditemukan!");
  }
});

/* ============================================================
   DETAIL QTY BUTTON
============================================================ */
function changeDetailQty(delta) {
  const el = document.getElementById("detailQty");
  let v = parseInt(el.value) || 1;
  el.value = Math.max(1, v + delta);
}
