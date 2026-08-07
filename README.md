# Solivate Pricing Benchmark Engine 2026

Kalkulator internal untuk menyusun estimasi project dari package benchmark, scope aktual, biaya provider, diskon, biaya operasional, serta pembagian revenue bersih tim Solivate Studio.

Pricing engine ini menggunakan data dari **Solivate Studio Pricing Master Final 2026**. Angka package adalah anchor untuk discovery, bukan quotation otomatis atau harga fixed untuk semua kebutuhan.

## Yang bisa dihitung

- Tiga kategori utama: Personal / Non-Profit, UMKM / Event / Operasional, dan Business / Enterprise.
- Lebih dari 50 package benchmark dari personal website sampai ERP, SaaS, marketplace, government, dan healthcare.
- Adjustment skala client, kompleksitas, dan urgent delivery.
- Add-on yang difilter berdasarkan tipe solusi.
- Pencegahan double charge untuk add-on yang sudah included dalam package.
- Diskon persen dan diskon nominal yang langsung memengaruhi harga development final.
- Guardrail category floor untuk business, government, dan ERP/enterprise.
- Domain IDwebhost dan server SumoPod sebagai biaya provider terpisah.
- Database provider serta biaya operasional internal opsional.
- Revenue bersih, margin, dan pembagian pool 40/30/30.
- Copy summary, print, responsive layout, dan penyimpanan otomatis di browser.

## Alur perhitungan

```text
Package Benchmark
  + Client Scale
  + Complexity
  + Urgency
  + Compatible Add-ons
  + Additional Scope
  - Percentage Discount
  - Fixed Discount
  = Development Final

Development Final + Domain + Server + Database = Total Invoice
Development Final - Internal Operational Cost = Net Revenue
Net Revenue = Developer 40% + Marketing 30% + Company 30%
```

Biaya domain, VPS, dan database diperlakukan sebagai pass-through provider cost: ditambahkan ke invoice tetapi tidak ikut dibagi ke pool. Harga provider adalah snapshot estimator dan harus diverifikasi lagi sebelum quotation dikunci.

## Pembagian hasil usaha

| Pool | Porsi revenue bersih |
| --- | ---: |
| Developer | 40% |
| Marketing | 30% |
| Kas Perusahaan | 30% |

Developer Pool dibagi ke Tech Lead 35%, Backend 30%, Frontend 25%, dan DevOps 10%. Marketing Pool dibagi ke Marketing Lead 50%, Content Lead 30%, dan Content Creator 20%. Kas Perusahaan dibagi ke Operasional 35%, Cadangan 40%, Growth 20%, dan Misc/Bonus 5%.

## Tech stack

- React 19
- Vite
- Lucide React
- CSS responsive tanpa UI framework
- Browser `localStorage`
- Vercel-compatible static build

## Menjalankan lokal

```bash
git clone https://github.com/hmad28/calc-projek.git
cd calc-projek
npm install
npm run dev
```

## Scripts

| Command | Kegunaan |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build ke `dist/` |
| `npm run preview` | Preview production build |

## Deploy ke Vercel

Import repository ke Vercel dan gunakan framework preset **Vite**. Konfigurasi build sudah tersedia di `vercel.json`.

Calculator utama berjalan penuh tanpa layanan berbayar dan cocok untuk Vercel Free Tier. Endpoint AI yang sudah tersedia di `api/ai.js` bersifat opsional; jika dipakai, simpan `GEMINI_API_KEY` sebagai Vercel Environment Variable dan jangan expose key dengan prefix `VITE_`.

## Catatan pricing

- Harga package adalah benchmark internal, bukan janji harga final.
- Adjustment harus punya alasan scope, workload, risk, atau timeline yang jelas.
- Biaya pihak ketiga dapat berubah sewaktu-waktu.
- Government, healthcare sensitif, enterprise, dan custom quotation wajib melalui discovery/review yang sesuai.
- Periksa category floor sebelum memberikan diskon.

---

Built for **Solivate Studio** — estimate clearly, protect the margin, and distribute fairly.
