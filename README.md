# Solivate Project Profit Calculator

Kalkulator internal satu layar untuk memperkirakan harga project, biaya langsung, revenue bersih, margin, dan pembagian hasil usaha tim Solivate Studio.

Pilih kategori, paket, kompleksitas, add-on, dan estimasi biaya melalui dropdown. Seluruh hasil diperbarui secara realtime tanpa perlu mengisi data customer atau melewati quotation wizard.

## Perhitungan utama

```text
Base Package + Add-on + Complexity + Adjustment - Discount
                              ↓
                       Harga Project
                              ↓
Harga Project - Biaya Langsung Project = Revenue Bersih
                              ↓
        Developer 40% + Marketing 30% + Kas 30%
```

Pembagian tim selalu dihitung dari **revenue bersih setelah biaya langsung project dikurangi**.

## Fitur

- Pilihan tiga kategori pricing Solivate Studio.
- 56 paket lengkap dari Wedding Basic sampai Enterprise System.
- Dropdown paket dasar yang dikelompokkan berdasarkan jenis layanan.
- Dukungan harga fixed, range, mulai dari, dan Custom Quotation.
- Estimasi kompleksitas Standard, Moderate, Complex, atau Advanced.
- Add-on picker dengan harga realtime.
- Dependency otomatis dan pencegahan double charge untuk fitur included.
- Diskon, adjustment manual, dan pilihan pembulatan harga.
- Estimasi biaya:
  - domain dan infrastructure;
  - tools, API, dan software;
  - marketing atau acquisition;
  - overhead project;
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
│   ├── data.js       # Package, module, harga, dan dependency defaults
│   ├── main.jsx      # Kalkulasi harga, biaya, profit, dan pembagian
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
