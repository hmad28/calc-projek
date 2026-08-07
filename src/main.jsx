import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDown, Calculator, Check, ChevronDown, CircleDollarSign, Code2,
  Copy, Database, Globe2, HardDrive, Landmark, Megaphone, Minus,
  Printer, ReceiptText, RefreshCcw, Sparkles, TrendingUp, WalletCards
} from "lucide-react";
import { rupiah } from "./data";
import "./styles.css";

const costOptions = {
  domain: [
    ["none", "Tidak ada / sudah termasuk", 0],
    ["standard", "Domain umum (.com / .site / .me)", 150000],
    ["indonesia", "Domain Indonesia (.id / .or.id / .sch.id)", 300000],
    ["premium", "Ekstensi khusus / premium", 500000]
  ],
  hosting: [
    ["none", "Tidak ada / sudah termasuk", 0],
    ["standard", "Managed hosting standard", 200000],
    ["business", "Business hosting", 750000],
    ["vps", "VPS / dedicated server", 1500000]
  ],
  database: [
    ["none", "Tidak ada biaya database", 0],
    ["basic", "Database ringan", 150000],
    ["managed", "Managed database", 500000],
    ["dedicated", "Dedicated database", 1200000]
  ]
};

const discountOptions = [
  [0, "Tanpa diskon persen"], [0.05, "Diskon 5%"], [0.1, "Diskon 10%"],
  [0.15, "Diskon 15%"], [0.2, "Diskon 20%"], [0.25, "Diskon 25%"]
];

const developerSplit = [
  ["Tech Lead", 0.35, 0.14], ["Backend Developer", 0.3, 0.12],
  ["Frontend Developer", 0.25, 0.1], ["DevOps Engineer", 0.1, 0.04]
];
const marketingSplit = [
  ["Marketing Lead", 0.5, 0.15], ["Content Lead", 0.3, 0.09], ["Content Creator", 0.2, 0.06]
];
const companySplit = [
  ["Operasional", 0.35, 0.105, "Server, tools, software, kantor"],
  ["Cadangan", 0.4, 0.12, "Emergency fund 3–6 bulan"],
  ["Growth Fund", 0.2, 0.06, "Reinvestasi, R&D, produk baru"],
  ["Misc / Bonus Pool", 0.05, 0.015, "Bonus performa dan team event"]
];

function useSavedState(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}

function TextInput({ label, value, onChange, hint, placeholder }) {
  return <label className="select-field"><span>{label}</span><input className="text-input" type="text" value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} />{hint && <small>{hint}</small>}</label>;
}

function SelectField({ label, value, onChange, hint, children }) {
  return <label className="select-field"><span>{label}</span><div className="select-wrap"><select value={value} onChange={onChange}>{children}</select><ChevronDown size={15}/></div>{hint && <small>{hint}</small>}</label>;
}

function MoneyInput({ label, value, onChange, hint }) {
  const [draft, setDraft] = useState(value ? String(value) : "");
  useEffect(() => { setDraft(value ? String(value) : ""); }, [value]);

  const commit = () => {
    const nextValue = Math.max(0, Number(draft) || 0);
    setDraft(nextValue ? String(nextValue) : "");
    onChange(nextValue);
  };

  return <label className="select-field"><span>{label}</span><div className="money-input"><b>Rp</b><input type="text" inputMode="numeric" placeholder="0" value={draft} onFocus={event => event.target.select()} onChange={event => setDraft(event.target.value.replace(/\D/g, ""))} onBlur={commit} onKeyDown={event => { if (event.key === "Enter") event.currentTarget.blur(); }} /></div>{hint && <small>{hint}</small>}</label>;
}

function SplitTable({ rows, pool, color, company = false }) {
  return <div className="split-table">
    {rows.map(([role, poolRate, totalRate, note]) => <div className="split-row" key={role}>
      <span className="split-dot" style={{ background: color }}/>
      <div><strong>{role}</strong>{note && <small>{note}</small>}</div>
      <span>{Math.round(poolRate * 100)}% pool<small>{(totalRate * 100).toFixed(totalRate * 100 % 1 ? 1 : 0)}% net</small></span>
      <b>{rupiah(pool * poolRate)}</b>
    </div>)}
    <div className="split-total"><span>Total {company ? "Kas Perusahaan" : "Pool"}</span><strong>{rupiah(pool)}</strong></div>
  </div>;
}

function App() {
  const [projectName, setProjectName] = useSavedState("general-project-name", "");
  const [projectPrice, setProjectPrice] = useSavedState("general-project-price", 0);
  const [discountRate, setDiscountRate] = useSavedState("general-discount-rate", 0);
  const [manualDiscount, setManualDiscount] = useSavedState("general-manual-discount", 0);
  const [domain, setDomain] = useSavedState("general-domain", "none");
  const [hosting, setHosting] = useSavedState("general-hosting", "none");
  const [database, setDatabase] = useSavedState("general-database", "none");
  const [otherCost, setOtherCost] = useSavedState("general-other-cost", 0);
  const [copied, setCopied] = useState(false);

  const percentageDiscount = Math.round(projectPrice * Number(discountRate));
  const appliedManualDiscount = Math.min(manualDiscount, Math.max(0, projectPrice - percentageDiscount));
  const totalDiscount = Math.min(projectPrice, percentageDiscount + appliedManualDiscount);
  const finalPrice = Math.max(0, projectPrice - totalDiscount);

  const domainCost = costOptions.domain.find(item => item[0] === domain)?.[2] || 0;
  const hostingCost = costOptions.hosting.find(item => item[0] === hosting)?.[2] || 0;
  const databaseCost = costOptions.database.find(item => item[0] === database)?.[2] || 0;
  const directCosts = domainCost + hostingCost + databaseCost + otherCost;
  const netRevenue = finalPrice - directCosts;
  const distributableRevenue = Math.max(0, netRevenue);
  const margin = finalPrice ? (netRevenue / finalPrice) * 100 : directCosts ? -100 : 0;
  const developerPool = distributableRevenue * 0.4;
  const marketingPool = distributableRevenue * 0.3;
  const companyPool = distributableRevenue * 0.3;

  const reset = () => {
    setProjectName(""); setProjectPrice(0); setDiscountRate(0); setManualDiscount(0);
    setDomain("none"); setHosting("none"); setDatabase("none"); setOtherCost(0);
  };

  const copySummary = async () => {
    const text = `SOLIVATE PROJECT CALCULATION\nProject: ${projectName || "Tanpa nama"}\nHarga project: ${rupiah(projectPrice)}\nTotal diskon: ${rupiah(totalDiscount)}\nHarga setelah diskon: ${rupiah(finalPrice)}\nBiaya project: ${rupiah(directCosts)}\nRevenue bersih: ${rupiah(netRevenue)}\nMargin bersih: ${margin.toFixed(1)}%\n\nDeveloper 40%: ${rupiah(developerPool)}\nMarketing 30%: ${rupiah(marketingPool)}\nKas Perusahaan 30%: ${rupiah(companyPool)}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return <div className="calculator-app">
    <header className="app-header">
      <div className="brand-lockup"><img src="/solivate-logo.webp" alt="Solivate Studio"/><span>Project Profit Calculator</span></div>
      <div className="header-actions"><button onClick={reset}><RefreshCcw size={15}/> Reset</button><button className="print-button" onClick={() => window.print()}><Printer size={15}/> Print</button></div>
    </header>

    <section className="hero-strip compact-hero">
      <div><span className="overline">GENERAL PROJECT CALCULATOR</span><h1>Masukkan angka.<br/><em>Lihat pembagiannya.</em></h1><p>Hitung harga setelah diskon, kurangi biaya project, lalu bagikan revenue bersih ke Developer, Marketing, dan Kas Perusahaan.</p></div>
      <div className="hero-formula"><span>HARGA FINAL</span><Minus size={16}/><span>BIAYA PROJECT</span><ArrowDown size={16}/><strong>REVENUE BERSIH</strong></div>
    </section>

    <main className="calculator-layout">
      <section className="input-column">
        <article className="calc-card project-card">
          <div className="card-heading"><span>01</span><div><p>NILAI PROJECT</p><h2>Harga dan diskon</h2></div><Calculator size={21}/></div>
          <div className="field-grid general-value-grid">
            <TextInput label="Nama project" value={projectName} onChange={setProjectName} placeholder="Contoh: Website company profile" hint="Nama ini muncul di ringkasan dan hasil print"/>
            <MoneyInput label="Harga project / deal" value={projectPrice} onChange={setProjectPrice} hint="Sebelum diskon · Enter/klik luar untuk terapkan"/>
            <SelectField label="Diskon persen (opsional)" value={discountRate} onChange={event => setDiscountRate(Number(event.target.value))}>
              {discountOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </SelectField>
            <MoneyInput label="Diskon nominal (opsional)" value={manualDiscount} onChange={setManualDiscount} hint="Ditambahkan setelah diskon persen"/>
          </div>
          <div className="formula-line"><span>Harga awal <b>{rupiah(projectPrice)}</b></span><Minus size={14}/><span>Diskon persen <b>{rupiah(percentageDiscount)}</b></span><Minus size={14}/><span>Diskon nominal <b>{rupiah(appliedManualDiscount)}</b></span><ArrowDown size={14}/><span>Harga final <b>{rupiah(finalPrice)}</b></span></div>
        </article>

        <article className="calc-card cost-card">
          <div className="card-heading"><span>02</span><div><p>BIAYA PROJECT</p><h2>Biaya yang dikeluarkan</h2></div><ReceiptText size={21}/></div>
          <div className="cost-note"><WalletCards size={17}/><p>Semua biaya di bawah dikurangi dari harga final. Database dan biaya lain-lain boleh dikosongkan jika memang tidak ada.</p></div>
          <div className="field-grid">
            <SelectField label="Domain" value={domain} onChange={event => setDomain(event.target.value)}>{costOptions.domain.map(([id, label, value]) => <option value={id} key={id}>{label} — {rupiah(value)}</option>)}</SelectField>
            <SelectField label="Hosting / server" value={hosting} onChange={event => setHosting(event.target.value)}>{costOptions.hosting.map(([id, label, value]) => <option value={id} key={id}>{label} — {rupiah(value)}</option>)}</SelectField>
            <SelectField label="Database (opsional)" value={database} onChange={event => setDatabase(event.target.value)}>{costOptions.database.map(([id, label, value]) => <option value={id} key={id}>{label} — {rupiah(value)}</option>)}</SelectField>
            <MoneyInput label="Biaya lain-lain (opsional)" value={otherCost} onChange={setOtherCost} hint="API, tools, outsource, transport, dan lainnya"/>
          </div>
          <div className="cost-breakdown general-cost-breakdown">
            <div><Globe2 size={15}/><span>Domain</span><b>{rupiah(domainCost)}</b></div>
            <div><HardDrive size={15}/><span>Hosting / server</span><b>{rupiah(hostingCost)}</b></div>
            <div><Database size={15}/><span>Database</span><b>{rupiah(databaseCost)}</b></div>
            <div><ReceiptText size={15}/><span>Lain-lain</span><b>{rupiah(otherCost)}</b></div>
          </div>
        </article>
      </section>

      <aside className="result-column">
        <article className="result-card">
          <div className="result-label"><span>LIVE RESULT</span><CircleDollarSign size={19}/></div>
          <div className="selling-price"><span>Harga setelah diskon</span><strong>{rupiah(finalPrice)}</strong><small>{projectName || "Project belum diberi nama"}{totalDiscount > 0 ? ` · diskon -${rupiah(totalDiscount)}` : ""}</small></div>
          <div className="result-math"><div><span>Biaya project</span><b>- {rupiah(directCosts)}</b></div><div className={netRevenue < 0 ? "net loss" : "net"}><span>{netRevenue < 0 ? "Proyeksi rugi" : "Revenue bersih"}</span><b>{rupiah(netRevenue)}</b></div></div>
          <div className={`margin-banner ${margin < 50 ? "low" : margin < 70 ? "medium" : "healthy"}`}><TrendingUp size={17}/><div><span>Net margin</span><strong>{margin.toFixed(1)}%</strong></div><small>{netRevenue < 0 ? "Biaya melebihi harga project" : margin < 50 ? "Margin tipis — review biaya/harga" : margin < 70 ? "Cukup sehat" : "Margin sehat"}</small></div>
          <div className="pool-preview"><div className="developer"><i/><span>Developer</span><b>{rupiah(developerPool)}</b><small>40%</small></div><div className="marketing"><i/><span>Marketing</span><b>{rupiah(marketingPool)}</b><small>30%</small></div><div className="company"><i/><span>Kas</span><b>{rupiah(companyPool)}</b><small>30%</small></div></div>
          <div className="result-actions"><button onClick={copySummary}>{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? "Tersalin" : "Copy ringkasan"}</button><button onClick={() => window.print()}><Printer size={15}/> Print</button></div>
        </article>
      </aside>
    </main>

    <section className="distribution-section">
      <div className="distribution-head"><div><span className="overline">PASAL 3 · PEMBAGIAN HASIL USAHA</span><h2>Pembagian dari revenue bersih.</h2><p>Pool baru dibagikan setelah seluruh diskon dan biaya project dikurangi.</p></div><div className="net-stamp"><span>AVAILABLE TO DISTRIBUTE</span><strong>{rupiah(distributableRevenue)}</strong></div></div>
      <div className="pool-grid">
        <article className="pool-card developer"><header><div><Code2 size={20}/><span>Developer Pool</span></div><strong>{rupiah(developerPool)}</strong><small>40% NET REVENUE</small></header><SplitTable rows={developerSplit} pool={developerPool} color="#00b4d8"/></article>
        <article className="pool-card marketing"><header><div><Megaphone size={20}/><span>Marketing Pool</span></div><strong>{rupiah(marketingPool)}</strong><small>30% NET REVENUE</small></header><SplitTable rows={marketingSplit} pool={marketingPool} color="#ff5a5f"/></article>
        <article className="pool-card company"><header><div><Landmark size={20}/><span>Kas Perusahaan</span></div><strong>{rupiah(companyPool)}</strong><small>30% NET REVENUE</small></header><SplitTable rows={companySplit} pool={companyPool} color="#d7ff3f" company/></article>
      </div>
      <div className="distribution-note"><Sparkles size={17}/><p><strong>Urutan hitung:</strong> harga project dikurangi diskon, lalu dikurangi domain, hosting/server, database, dan biaya lain. Sisa positifnya menjadi revenue bersih untuk pembagian 40/30/30.</p></div>
    </section>

    <footer className="app-footer"><span>Solivate Studio · General Project Calculator</span><span>Seluruh data tersimpan otomatis di perangkat ini.</span></footer>
  </div>;
}

createRoot(document.getElementById("root")).render(<App/>);
