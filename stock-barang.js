/* ============================================================
   STOCK STORE (3 MODE):
   - Firebase Firestore (MODE="firebase")  ✅ paling benar
   - localStorage (MODE="local")           ✅ paling gampang
   - stok.json download/upload (MODE="file") ✅ tanpa DB tapi manual upload
============================================================ */

/** Pilih mode di sini */
const STOCK_MODE = "local";
// "firebase" | "local" | "file"

/** Nama key localStorage */
const LS_KEY = "MBAKO_LINTING_STOK_V1";

/** Lokasi file stok.json (untuk MODE="file") */
const STOCK_JSON_URL = "./stok.json";

/** Firebase config (isi kalau MODE="firebase") */
const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
};

let __produkRef = null; // referensi produkList dari script.js

// Set true kalau mau log debug
const STOCK_DEBUG = false;

/* ---------- Helpers ---------- */
function log(...args) {
  if (STOCK_DEBUG) console.log("[StockStore]", ...args);
}

function safeDocId(name) {
  return encodeURIComponent(name).replace(/%/g, "_");
}

function buildStockMapFromProduk(produkList) {
  const map = {};
  produkList.forEach(p => (map[p.nama] = Number(p.stok) || 0));
  return map;
}

function applyStockMapToProduk(produkList, stockMap) {
  produkList.forEach(p => {
    if (stockMap && stockMap[p.nama] !== undefined) {
      p.stok = Number(stockMap[p.nama]) || 0;
    }
  });
}

/* ============================================================
   STORAGE LAYER (localStorage + fallback cookie)
   - Untuk kasus file:// (buka dari folder), localStorage kadang bermasalah
============================================================ */
function cookie_set(key, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    encodeURIComponent(key) +
    "=" +
    encodeURIComponent(value) +
    "; expires=" +
    expires +
    "; path=/";
}

function cookie_get(key) {
  const k = encodeURIComponent(key) + "=";
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(k))
    ?.slice(k.length) || null;
}

function storage_set(key, valueStr) {
  // coba localStorage dulu
  try {
    localStorage.setItem(key, valueStr);
    // test baca balik
    const test = localStorage.getItem(key);
    if (test === valueStr) return true;
  } catch (e) {
    log("localStorage set gagal, fallback cookie:", e);
  }

  // fallback cookie
  try {
    cookie_set(key, valueStr, 365);
    return true;
  } catch (e) {
    console.warn("storage_set cookie gagal:", e);
    return false;
  }
}

function storage_get(key) {
  // coba localStorage dulu
  try {
    const v = localStorage.getItem(key);
    if (v) return v;
  } catch (e) {
    log("localStorage get gagal, coba cookie:", e);
  }

  // fallback cookie
  try {
    const v2 = cookie_get(key);
    return v2 ? decodeURIComponent(v2) : null;
  } catch (e) {
    console.warn("storage_get cookie gagal:", e);
    return null;
  }
}

/* ============================================================
   LOCAL MODE
============================================================ */
function local_load() {
  try {
    const raw = storage_get(LS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data;
  } catch (e) {
    console.warn("local_load error:", e);
    return null;
  }
}

function local_save(stockMap) {
  try {
    const ok = storage_set(LS_KEY, JSON.stringify(stockMap));
    log("local_save ok?", ok);
  } catch (e) {
    console.warn("local_save error:", e);
  }
}

/* ============================================================
   FILE JSON (stok.json)
============================================================ */
async function file_load() {
  try {
    const res = await fetch(STOCK_JSON_URL, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data; // { "Nama Produk": 999, ... }
  } catch (e) {
    console.warn("file_load error:", e);
    return null;
  }
}

function file_download(stockMap) {
  const blob = new Blob([JSON.stringify(stockMap, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "stok.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ============================================================
   FIREBASE (Firestore) - OPTIONAL
============================================================ */
let __fb = { ready: false, db: null };

async function firebase_init() {
  try {
    if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) {
      console.warn("Firebase config kosong. Fallback ke localStorage.");
      return false;
    }

    if (!window.firebaseApp) return false;

    __fb.db = window.firebaseDb;
    __fb.ready = !!__fb.db;
    return __fb.ready;
  } catch (e) {
    console.warn("firebase_init error:", e);
    return false;
  }
}

async function firebase_loadAll() {
  if (!__fb.ready) return null;
  const { collection, getDocs } = window.firebaseFns;
  const snap = await getDocs(collection(__fb.db, "stocks"));
  const map = {};
  snap.forEach(doc => {
    const d = doc.data();
    if (d && d.name) map[d.name] = Number(d.stock) || 0;
  });
  return map;
}

async function firebase_set(name, stock) {
  if (!__fb.ready) return false;
  const { doc, setDoc } = window.firebaseFns;
  const id = safeDocId(name);
  await setDoc(
    doc(__fb.db, "stocks", id),
    { name, stock: Number(stock) || 0 },
    { merge: true }
  );
  return true;
}

/* ============================================================
   PUBLIC API: StockStore
============================================================ */
const StockStore = {
  /** init dipanggil 1x setelah produkList dibuat */
  async init(produkList) {
    __produkRef = produkList;

    // 1) firebase kalau dipilih
    if (STOCK_MODE === "firebase") {
      const ok = await firebase_init();
      if (ok) {
        const map = await firebase_loadAll();
        if (map && Object.keys(map).length) {
          applyStockMapToProduk(produkList, map);
          log("Loaded from firebase");
          return;
        }
        const seed = buildStockMapFromProduk(produkList);
        await Promise.all(Object.keys(seed).map(n => firebase_set(n, seed[n])));
        log("Seed firebase from produkList");
        return;
      }
      console.warn("Firebase tidak siap. Pakai localStorage.");
    }

    // 2) file stok.json kalau dipilih
    if (STOCK_MODE === "file") {
      const map = await file_load();
      if (map) {
        applyStockMapToProduk(produkList, map);
        log("Loaded from stok.json");
        return;
      }
      console.warn("stok.json tidak ditemukan. Pakai localStorage.");
    }

    // 3) local
    const local = local_load();
    if (local) {
      applyStockMapToProduk(produkList, local);
      log("Loaded from local storage");
    } else {
      local_save(buildStockMapFromProduk(produkList));
      log("Seed local storage from produkList");
    }
  },

  /** panggil setiap ada perubahan stok */
  async syncNow() {
    if (!__produkRef) return;
    const map = buildStockMapFromProduk(__produkRef);

    if (STOCK_MODE === "firebase" && __fb.ready) {
      await Promise.all(Object.keys(map).map(n => firebase_set(n, map[n])));
      return;
    }

    if (STOCK_MODE === "file") {
      local_save(map);
      return;
    }

    local_save(map);
  },

  /** khusus MODE=file: download stok.json kapan pun kamu mau */
  downloadJson() {
    if (!__produkRef) return;
    const map = buildStockMapFromProduk(__produkRef);
    file_download(map);
  },

  /** untuk admin tambah stok cepat (bisa kamu panggil dari console) */
  async addStockByName(name, qty) {
    if (!__produkRef) return false;
    const p = __produkRef.find(x => x.nama === name);
    if (!p) return false;
    p.stok = (Number(p.stok) || 0) + (Number(qty) || 0);
    await this.syncNow();
    return true;
  },
};

window.StockStore = StockStore;
