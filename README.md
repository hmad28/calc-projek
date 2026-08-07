# Solivate Project Profit Calculator

Kalkulator umum satu layar untuk menghitung harga project, diskon, biaya langsung, revenue bersih, margin, dan pembagian hasil usaha tim Solivate Studio.

Isi nama project dan harga deal, lalu tambahkan diskon serta biaya yang relevan. Tidak ada kategori, paket, add-on, data customer, atau quotation wizard.

## Perhitungan utama

```text
Harga Project - Diskon Persen - Diskon Nominal = Harga Final
                              ↓
Harga Final - Domain - Hosting - Database - Biaya Lain
                              ↓
                        Revenue Bersih
                              ↓
          Developer 40% + Marketing 30% + Kas 30%
```

Pembagian tim selalu dihitung dari **revenue bersih setelah biaya langsung project dikurangi**.

## Fitur

- Nama project dan harga project/deal.
- Input nominal diterapkan setelah selesai diketik agar harga tidak meloncat pada setiap digit.
- Diskon persen dan diskon nominal opsional.
- Estimasi biaya:
  - domain;
  - hosting atau server;
  - database opsional;
  - biaya lain-lain.
- Revenue bersih dan indikator net margin.
- Pembagian otomatis berdasarkan Pasal 3.
- Copy ringkasan perhitungan.
- Tampilan print-friendly.
- Penyimpanan pilihan otomatis di browser.
- Responsive untuk desktop dan mobile.

## Pembagian hasil usaha

### Developer Pool — 40%

| Role | % Developer Pool | % Revenue Bersih |
| --- | ---: | ---: |
| Tech Lead | 35% | 14% |
| Backend Developer | 30% | 12% |
| Frontend Developer | 25% | 10% |
| DevOps Engineer | 10% | 4% |

### Marketing Pool — 30%

| Role | % Marketing Pool | % Revenue Bersih |
| --- | ---: | ---: |
| Marketing Lead | 50% | 15% |
| Content Lead | 30% | 9% |
| Content Creator | 20% | 6% |

### Kas Perusahaan — 30%

| Alokasi | % Kas Pool | % Revenue Bersih |
| --- | ---: | ---: |
| Operasional | 35% | 10.5% |
| Cadangan | 40% | 12% |
| Growth Fund | 20% | 6% |
| Misc / Bonus Pool | 5% | 1.5% |

Alokasi Operasional pada Kas Perusahaan berbeda dari biaya langsung project. Biaya langsung dikurangi sebelum pembagian, sedangkan alokasi Operasional adalah bagian kas untuk kebutuhan perusahaan setelah revenue bersih tersedia.

## Tech stack

- React
- Vite
- Lucide React
- CSS responsif tanpa UI framework
- Browser `localStorage`
- Vercel-compatible static build

Repository masih menyertakan endpoint Gemini di `api/ai.js` sebagai fondasi integrasi AI. Calculator utama tidak bergantung pada AI dan tetap berfungsi penuh tanpa API key.

## Struktur repository

```text
calc-projek/
├── api/
│   └── ai.js
├── public/
│   ├── favicon.ico
│   └── solivate-logo.webp
├── src/
│   ├── data.js       # Helper format Rupiah dan katalog lama
│   ├── main.jsx      # Kalkulasi umum harga, biaya, profit, dan pembagian
│   └── styles.css    # Solivate dashboard design system
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

## Menjalankan secara lokal

```bash
git clone https://github.com/hmad28/calc-projek.git
cd calc-projek
npm install
npm run dev
```

Vite akan menampilkan alamat local development server di terminal.

## Scripts

| Command | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan development server |
| `npm run build` | Membuat production build di `dist/` |
| `npm run preview` | Menjalankan preview production build |

## Deploy ke Vercel

1. Import repository ke Vercel.
2. Gunakan framework preset **Vite**.
3. Jalankan deployment.

Konfigurasi build sudah tersedia di `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

Jika endpoint AI akan digunakan, tambahkan `GEMINI_API_KEY` dan `GEMINI_MODEL` melalui Vercel Environment Variables. Jangan menggunakan prefix `VITE_` untuk API key.

## Data dan privasi

Pilihan calculator disimpan di `localStorage` perangkat. Tidak ada nama customer, nama sales, atau data personal yang diperlukan.

- Data tidak tersinkron antar-device.
- Membersihkan browser storage akan mereset calculator.
- File `.env` dan `.env.local` tidak boleh di-commit.

## Validasi sebelum deploy

```bash
npm run build
```

---

Built for **Solivate Studio** — estimate clearly, protect the margin, and distribute fairly.
