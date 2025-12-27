/* ============================================================
   ADMIN STOCK TOOL (Tambah/Kurang/Set stok)
   Cara pakai: lewat Console (F12)
============================================================ */

(() => {
  const STOCK_KEY = "MBAKO_STOCK_V2"; // harus sama dengan stock-persist.js kamu

  function saveStock() {
    if (typeof produkList === "undefined") return;
    const map = {};
    produkList.forEach(p => (map[p.nama] = p.stok));
    localStorage.setItem(STOCK_KEY, JSON.stringify(map));
  }

  function refreshUI() {
    const kat = document.getElementById("judulKategori")?.textContent || "";
    if (kat && typeof renderProdukKategori === "function") renderProdukKategori(kat);

    if (typeof currentProduct !== "undefined" && currentProduct) {
      const stokEl = document.getElementById("detailStock");
      if (stokEl) stokEl.textContent = currentProduct.stok;

      const btn = document.getElementById("detailAddCart");
      if (btn) btn.disabled = currentProduct.stok <= 0;
    }
  }

  // ✅ tambah stok berdasarkan NAMA produk
  function tambahStok(namaProduk, jumlah) {
    const j = parseInt(jumlah, 10);
    if (!j || j <= 0) return alert("Jumlah harus angka > 0");

    const p = produkList.find(x => x.nama === namaProduk);
    if (!p) return alert("Produk tidak ditemukan!");

    p.stok += j;
    saveStock();
    refreshUI();
    alert(`Stok "${p.nama}" bertambah +${j}. Stok sekarang: ${p.stok}`);
  }

  // ✅ kurangi stok (manual)
  function kurangStok(namaProduk, jumlah) {
    const j = parseInt(jumlah, 10);
    if (!j || j <= 0) return alert("Jumlah harus angka > 0");

    const p = produkList.find(x => x.nama === namaProduk);
    if (!p) return alert("Produk tidak ditemukan!");

    p.stok = Math.max(0, p.stok - j);
    saveStock();
    refreshUI();
    alert(`Stok "${p.nama}" berkurang -${j}. Stok sekarang: ${p.stok}`);
  }

  // ✅ set stok jadi angka tertentu
  function setStok(namaProduk, stokBaru) {
    const s = parseInt(stokBaru, 10);
    if (isNaN(s) || s < 0) return alert("Stok harus angka >= 0");

    const p = produkList.find(x => x.nama === namaProduk);
    if (!p) return alert("Produk tidak ditemukan!");

    p.stok = s;
    saveStock();
    refreshUI();
    alert(`Stok "${p.nama}" diset jadi ${p.stok}`);
  }

  // ✅ lihat list nama produk (biar gampang copas)
  function listProduk() {
    console.log("=== LIST PRODUK (copy nama persis) ===");
    produkList.forEach((p, i) => console.log(`${i + 1}. ${p.nama} | stok: ${p.stok}`));
    alert("List produk ada di Console (F12) ✅");
  }

  // expose ke window biar bisa dipanggil
  window.tambahStok = tambahStok;
  window.kurangStok = kurangStok;
  window.setStok = setStok;
  window.listProduk = listProduk;
})();
