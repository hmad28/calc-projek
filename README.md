# Solivate Pricing & Quotation Engine

Dashboard kalkulasi harga dan pembuatan quotation untuk tim sales Solivate Studio. Aplikasi ini mengubah kebutuhan customer menjadi rekomendasi paket, modul, tingkat kompleksitas, dan harga jual yang konsisten berdasarkan **Solivate Studio Pricing Architecture 2026**.

Calculator ini bukan sekadar penjumlahan checkbox. Pricing engine menangani base package, fitur included, dependency antarmodul, complexity score, bundle recommendation, floor price, diskon, biaya pihak ketiga, dan quotation siap cetak.

## Fitur utama

- Alur quotation dalam lima tahap: **Customer → Solution → Features → Recommendation → Quotation**.
- Tiga segmentasi utama:
  - Personal / Non-Profit
  - UMKM / Event / Operational
  - Business / Enterprise
- Base package wajib untuk setiap perhitungan.
- Dependency otomatis, misalnya QR Attendance menambahkan database, absensi, QR generator, dan QR scanner yang diperlukan.
- Deteksi fitur yang sudah termasuk paket untuk mencegah double charge.
- Complexity score berdasarkan paket, modul, jumlah role, volume user, dan jumlah cabang.
- Smart bundle recommendation saat susunan modular lebih cocok dipindahkan ke paket lain.
- Kalkulasi harga realtime dengan charm-price adjustment.
- Manual discount dan peringatan ketika harga berada di bawah floor price.
- Pemisahan development fee dan biaya provider pihak ketiga.
- Mode **Internal Pricing** dan **Customer Preview**.
- AI requirement mapper menggunakan Gemini API.
- Penyimpanan draft dan beberapa scenario penawaran.
- Quotation A4 yang dapat dicetak atau disimpan sebagai PDF dari browser.
- Layout responsif untuk desktop, tablet, dan mobile.

## Cara kerja pricing engine

```text
Customer Profile
      ↓
Customer Segment & Solution Type
      ↓
Base Package
      ↓
Feature Modules
      ↓
Dependency & Included Feature Check
      ↓
Complexity & Volume Evaluation
      ↓
Bundle / Package Recommendation
      ↓
Discount & Floor Price Validation
      ↓
Final Price & Quotation
```

AI hanya membantu memetakan deskripsi kebutuhan ke package dan module ID yang tersedia. Semua nominal, dependency, included feature, complexity point, dan floor-price validation tetap dihitung secara deterministik oleh pricing engine di aplikasi.

## Tech stack

- React
- Vite
- Lucide React
- CSS responsif tanpa UI framework
- Vercel Functions
- Gemini Generate Content API
- Browser `localStorage` untuk draft dan saved scenario

## Struktur repository

```text
calc-projek/
├── api/
│   └── ai.js             # Serverless endpoint untuk Gemini
├── public/
│   ├── favicon.ico
│   └── solivate-logo.webp
├── src/
│   ├── data.js           # Package, module, dependency, dan pricing defaults
│   ├── main.jsx          # Calculator flow dan pricing engine UI
│   └── styles.css        # Solivate dashboard design system
├── .env.example
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

## Prasyarat

- Node.js dan npm
- Gemini API key untuk fitur AI
- Vercel CLI jika ingin menjalankan frontend dan serverless function sekaligus secara lokal

## Instalasi

```bash
git clone https://github.com/hmad28/calc-projek.git
cd calc-projek
npm install
```

Salin konfigurasi environment:

```bash
copy .env.example .env.local
```

Kemudian isi nilai berikut:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
```

> Jangan menambahkan prefix `VITE_` pada API key. Variable dengan prefix tersebut akan disertakan ke browser bundle dan dapat mengekspos credential.

## Menjalankan aplikasi

Frontend saja dengan Vite:

```bash
npm run dev
```

Mode ini cukup untuk menguji calculator, dependency engine, scenario, dan quotation. Endpoint AI membutuhkan Vercel Functions.

Untuk menjalankan frontend dan endpoint AI secara lokal:

```bash
npx vercel dev
```

## Scripts

| Command | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan Vite development server |
| `npm run build` | Membuat production build di `dist/` |
| `npm run preview` | Menjalankan preview dari production build |

## Konfigurasi Gemini

Request AI dikirim melalui `/api/ai`, sehingga API key hanya dibaca di server. Endpoint tersebut:

1. menerima deskripsi kebutuhan dan pilihan package/module yang valid;
2. mengirim prompt terstruktur ke Gemini;
3. meminta respons JSON;
4. mengembalikan rekomendasi package, module, reasoning, dan alert;
5. menyerahkan kalkulasi harga akhir kepada pricing engine lokal.

Jika `GEMINI_API_KEY` belum tersedia, calculator tetap dapat digunakan secara manual dan hanya fitur AI Assist yang tidak aktif.

## Deploy ke Vercel

Repository sudah menyertakan `vercel.json` dengan build command dan output directory yang dibutuhkan.

1. Import repository ini ke Vercel.
2. Pilih framework preset **Vite**.
3. Buka **Project Settings → Environment Variables**.
4. Tambahkan:

   ```text
   GEMINI_API_KEY
   GEMINI_MODEL
   ```

5. Deploy project.

Vercel akan menyajikan frontend statis dari `dist/` dan menjalankan `api/ai.js` sebagai serverless function.

## Data dan persistence

Versi saat ini menyimpan draft customer, pilihan fitur, dan saved scenario di `localStorage`. Konsekuensinya:

- data tetap tersedia setelah browser direfresh;
- tidak diperlukan database untuk penggunaan single-device;
- data belum tersinkron antar-user atau antar-device;
- menghapus browser storage akan menghapus draft dan scenario lokal.

Untuk penggunaan tim, entity package, module, rule, customer, dan quotation dapat dipindahkan ke database terpusat. Struktur pricing defaults sudah dipisahkan di `src/data.js` agar migrasi tersebut tidak memerlukan redesign UI.

## Security notes

- Jangan commit `.env` atau `.env.local`.
- Simpan Gemini API key sebagai Vercel Environment Variable.
- Rotasi key jika pernah dibagikan melalui chat, screenshot, atau repository.
- Customer tidak pernah menerima floor price dan breakdown internal ketika menggunakan Customer Preview.
- Provider fee, MDR, subscription, dan biaya eksternal harus tetap dicantumkan terpisah pada quotation.

## Validasi production build

Jalankan sebelum deploy:

```bash
npm run build
```

Production output akan dibuat di folder `dist/`.

---

Built for **Solivate Studio** — custom digital solutions that stay accessible without sacrificing scope discipline.
