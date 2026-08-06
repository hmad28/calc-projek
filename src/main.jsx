import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDown, Calculator, Check, ChevronDown, CircleDollarSign, Code2,
  Copy, Landmark, Megaphone, Minus, Plus, Printer, ReceiptText,
  RefreshCcw, Server, ShieldCheck, Sparkles, Trash2, TrendingUp,
  WalletCards
} from "lucide-react";
import { modules, packagePriceLabel, packages, rupiah, segments } from "./data";
import "./styles.css";

const complexityOptions = [
  { id: "standard", label: "Standard", note: "Scope jelas, flow umum", rate: 0 },
  { id: "moderate", label: "Moderate", note: "Ada custom flow ringan", rate: 0.1 },
  { id: "complex", label: "Complex", note: "Banyak logic dan role", rate: 0.2 },
  { id: "advanced", label: "Advanced", note: "Integrasi / workflow berat", rate: 0.35 }
];

const fixedCostOptions = {
  infrastructure: [
    ["included", "Sudah termasuk / tidak ada", 0],
    ["standard", "Domain + hosting standard", 350000],
    ["business", "Business hosting", 750000],
    ["vps", "VPS / dedicated setup", 1500000]
  ],
  tools: [
    ["none", "Tidak ada biaya tools", 0],
    ["light", "Tools / API ringan", 250000],
    ["standard", "Tools / API standard", 500000],
    ["heavy", "Tools / API intensif", 1000000]
  ]
};

const percentOptions = [
  [0, "Tidak ada"], [0.05, "5% dari harga project"], [0.1, "10% dari harga project"], [0.15, "15% dari harga project"]
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

const addonCompatibility = {
  "Website Personal": ["cms", "blog", "gallery", "form", "wa-template", "document"],
  "Personal Blog": ["gallery", "form", "wa-template", "email", "document"],
  "Wedding": ["gallery", "form", "wa-template", "qr-generator", "qr-scanner", "qr-attendance", "dashboard", "export"],
  "Institusi": ["cms", "blog", "gallery", "form", "database", "wa-template", "email", "report", "dashboard", "export", "document"],
  "Website UMKM": ["cms", "blog", "gallery", "form", "database", "booking", "order", "wa-template", "email", "report", "dashboard"],
  "Sistem Bisnis UMKM": ["form", "database", "login", "multi-role", "booking", "order", "inventory", "approval", "qris", "wa-template", "wa-api", "email", "notification", "report", "dashboard", "export", "audit", "document", "qr-generator", "qr-scanner"],
  "Event": ["form", "database", "login", "multi-role", "order", "qris", "wa-template", "wa-api", "email", "notification", "report", "dashboard", "export", "audit", "document", "qr-generator", "qr-scanner", "qr-attendance"],
  "Institusi Operasional": modules.map(item => item.id),
  "E-Commerce": ["login", "multi-role", "inventory", "approval", "qris", "wa-template", "wa-api", "email", "notification", "report", "dashboard", "export", "audit", "document"],
  "POS": ["login", "multi-role", "inventory", "approval", "qris", "notification", "report", "dashboard", "export", "audit", "document"],
  "Booking": ["booking", "login", "multi-role", "approval", "qris", "wa-template", "wa-api", "email", "notification", "report", "dashboard", "export", "audit", "document"],
  "CRM": ["form", "database", "login", "multi-role", "approval", "wa-template", "wa-api", "email", "notification", "report", "dashboard", "export", "audit", "document"],
  "Website Corporate": ["cms", "blog", "gallery", "form", "database", "login", "multi-role", "wa-template", "email", "report", "dashboard", "document"],
  "Operational / CRM": ["form", "database", "login", "multi-role", "booking", "order", "inventory", "approval", "qris", "wa-template", "wa-api", "email", "notification", "report", "dashboard", "export", "audit", "document", "qr-generator", "qr-scanner"],
  "Government": ["cms", "blog", "gallery", "form", "database", "login", "multi-role", "approval", "wa-template", "email", "notification", "report", "dashboard", "export", "audit", "document", "qr-generator", "qr-scanner"],
  "Healthcare": ["form", "database", "login", "multi-role", "booking", "approval", "qris", "wa-template", "wa-api", "email", "notification", "report", "dashboard", "export", "audit", "document", "qr-generator", "qr-scanner"],
  "ERP / SaaS / Custom": modules.map(item => item.id)
};

function useSavedState(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}

function SelectField({ label, hint, value, onChange, children }) {
  return <label className="select-field"><span>{label}</span><div className="select-wrap"><select value={value} onChange={onChange}>{children}</select><ChevronDown size={15}/></div>{hint && <small>{hint}</small>}</label>;
}

function MoneyInput({ label, value, onChange, hint }) {
  return <label className="select-field"><span>{label}</span><div className="money-input"><b>Rp</b><input type="number" min="0" step="50000" value={value} onChange={e => onChange(Math.max(0, Number(e.target.value)))} /></div>{hint && <small>{hint}</small>}</label>;
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
  const [segment, setSegment] = useSavedState("calc-segment", "umkm");
  const segmentPackages = useMemo(() => packages.filter(item => item.segment === segment), [segment]);
  const packageGroups = useMemo(() => [...new Set(segmentPackages.map(item => item.solution))], [segmentPackages]);
  const [packageId, setPackageId] = useSavedState("calc-package", "operational-standard");
  const [complexityId, setComplexityId] = useSavedState("calc-complexity", "standard");
  const [selectedModules, setSelectedModules] = useSavedState("calc-modules", []);
  const [moduleDraft, setModuleDraft] = useState("");
  const [rounding, setRounding] = useSavedState("calc-rounding", "exact");
  const [discountRate, setDiscountRate] = useSavedState("calc-discount", 0);
  const [manualAdjustment, setManualAdjustment] = useSavedState("calc-adjustment", 0);
  const [infrastructure, setInfrastructure] = useSavedState("calc-infra", "standard");
  const [tools, setTools] = useSavedState("calc-tools", "none");
  const [marketingCostRate, setMarketingCostRate] = useSavedState("calc-marketing-cost", 0);
  const [overheadRate, setOverheadRate] = useSavedState("calc-overhead", 0.05);
  const [otherCost, setOtherCost] = useSavedState("calc-other-cost", 0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!segmentPackages.some(item => item.id === packageId)) setPackageId(segmentPackages[0]?.id || packages[0].id);
  }, [segment, packageId, segmentPackages]);

  const base = packages.find(item => item.id === packageId) || segmentPackages[0] || packages[0];
  const complexity = complexityOptions.find(item => item.id === complexityId) || complexityOptions[0];
  const compatibleAddonIds = addonCompatibility[base.solution] || [];
  const availableModules = modules.filter(item => compatibleAddonIds.includes(item.id) && !base.features.includes(item.id) && !selectedModules.includes(item.id));
  const availableModuleGroups = [...new Set(availableModules.map(item => item.group))];

  useEffect(() => {
    setSelectedModules(previous => previous.filter(id => compatibleAddonIds.includes(id) && !base.features.includes(id)));
    setModuleDraft("");
  }, [base.id]);

  const dependencyIds = useMemo(() => {
    const found = new Set();
    const walk = id => modules.find(item => item.id === id)?.requires?.forEach(dep => {
      if (!selectedModules.includes(dep) && !found.has(dep)) { found.add(dep); walk(dep); }
    });
    selectedModules.forEach(walk);
    return [...found];
  }, [selectedModules]);

  const effectiveModuleIds = [...new Set([...selectedModules, ...dependencyIds])];
  const selectedItems = effectiveModuleIds.map(id => modules.find(item => item.id === id)).filter(Boolean);
  const chargeableItems = selectedItems.filter(item => !base.features.includes(item.id));
  const addonTotal = chargeableItems.reduce((sum, item) => sum + item.price, 0);
  const complexityCost = Math.round((base.price + addonTotal) * complexity.rate);
  const scopeSubtotal = Math.max(0, base.price + addonTotal + complexityCost);
  const hasScopePriceChange = addonTotal !== 0 || complexityCost !== 0;
  const roundedScopePrice = scopeSubtotal <= 0 ? 0 : !hasScopePriceChange || rounding === "exact" ? scopeSubtotal
    : rounding === "50k" ? Math.ceil(scopeSubtotal / 50000) * 50000
    : Math.max(99000, Math.round(scopeSubtotal / 500000) * 500000 - 1000);
  const adjustedPrice = Math.max(0, roundedScopePrice + manualAdjustment);
  const discount = Math.round(adjustedPrice * Number(discountRate));
  const sellingPrice = Math.max(0, adjustedPrice - discount);

  const infrastructureCost = fixedCostOptions.infrastructure.find(item => item[0] === infrastructure)?.[2] || 0;
  const toolsCost = fixedCostOptions.tools.find(item => item[0] === tools)?.[2] || 0;
  const marketingCost = Math.round(sellingPrice * Number(marketingCostRate));
  const overheadCost = Math.round(sellingPrice * Number(overheadRate));
  const directCosts = infrastructureCost + toolsCost + marketingCost + overheadCost + otherCost;
  const netRevenue = sellingPrice - directCosts;
  const distributableRevenue = Math.max(0, netRevenue);
  const margin = sellingPrice ? (netRevenue / sellingPrice) * 100 : directCosts ? -100 : 0;
  const developerPool = distributableRevenue * 0.4;
  const marketingPool = distributableRevenue * 0.3;
  const companyPool = distributableRevenue * 0.3;

  const addModule = () => {
    if (moduleDraft && !selectedModules.includes(moduleDraft)) setSelectedModules(prev => [...prev, moduleDraft]);
    setModuleDraft("");
  };

  const reset = () => {
    setSegment("umkm"); setPackageId("operational-standard"); setComplexityId("standard");
    setSelectedModules([]); setRounding("exact"); setDiscountRate(0); setManualAdjustment(0);
    setInfrastructure("standard"); setTools("none"); setMarketingCostRate(0); setOverheadRate(0.05); setOtherCost(0);
  };

  const copySummary = async () => {
    const text = `SOLIVATE PROJECT CALCULATION\nHarga project: ${rupiah(sellingPrice)}\nBiaya langsung: ${rupiah(directCosts)}\nRevenue bersih: ${rupiah(netRevenue)}\nMargin bersih: ${margin.toFixed(1)}%\n\nDeveloper 40%: ${rupiah(developerPool)}\nMarketing 30%: ${rupiah(marketingPool)}\nKas Perusahaan 30%: ${rupiah(companyPool)}`;
    await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  return <div className="calculator-app">
    <header className="app-header">
      <div className="brand-lockup"><img src="/solivate-logo.webp" alt="Solivate Studio"/><span>Project Profit Calculator</span></div>
      <div className="header-actions"><button onClick={reset}><RefreshCcw size={15}/> Reset</button><button className="print-button" onClick={() => window.print()}><Printer size={15}/> Print</button></div>
    </header>

    <section className="hero-strip">
      <div><span className="overline">INTERNAL FINANCE TOOL · 2026</span><h1>Hitung project.<br/><em>Sisihkan biaya.</em> Bagi hasil.</h1><p>Satu layar untuk estimasi harga, biaya operasional, keuntungan bersih, dan pembagian otomatis ke seluruh tim.</p></div>
      <div className="hero-formula"><span>REVENUE</span><Minus size={16}/><span>BIAYA</span><ArrowDown size={16}/><strong>NET PROFIT</strong></div>
    </section>

    <main className="calculator-layout">
      <section className="input-column">
        <article className="calc-card project-card">
          <div className="card-heading"><span>01</span><div><p>PROJECT VALUE</p><h2>Tentukan harga project</h2></div><Calculator size={21}/></div>

          <label className="section-label">Kategori project</label>
          <div className="segment-tabs">{segments.map(item => <button key={item.id} className={segment === item.id ? "active" : ""} onClick={() => setSegment(item.id)}><span>{item.short}</span><small>{item.label}</small></button>)}</div>

          <div className="field-grid">
            <SelectField label="Paket dasar" value={base.id} onChange={e => setPackageId(e.target.value)} hint={base.custom ? "Custom quotation — isi Adjustment manual untuk membuat estimasi" : base.maxPrice ? `Range ${packagePriceLabel(base)} · kalkulator memakai batas bawah` : `${base.features.length} fitur included · floor ${rupiah(base.floor)}`}>
              {packageGroups.map(group => <optgroup label={group} key={group}>{segmentPackages.filter(item => item.solution === group).map(item => <option value={item.id} key={item.id}>{item.name} — {packagePriceLabel(item)}</option>)}</optgroup>)}
            </SelectField>
            <SelectField label="Perkiraan kompleksitas" value={complexityId} onChange={e => setComplexityId(e.target.value)} hint={complexity.note}>
              {complexityOptions.map(item => <option value={item.id} key={item.id}>{item.label} {item.rate ? `(+${item.rate * 100}%)` : "(normal)"}</option>)}
            </SelectField>
          </div>

          {base.custom && <div className="custom-quote-notice"><Sparkles size={17}/><div><strong>Custom Quotation</strong><p>Paket ini tidak punya harga otomatis. Masukkan estimasi awal pada Adjustment manual, lalu tambahkan fitur dan biaya sesuai hasil scoping.</p></div></div>}

          <div className="addon-builder">
            <div className="addon-title"><label className="section-label">Add-on project</label><span>{base.solution} · {availableModules.length} pilihan relevan</span></div>
            <div className="addon-guidance"><ShieldCheck size={15}/><p>Hanya menampilkan add-on yang cocok untuk <strong>{base.name}</strong>. Fitur yang sudah included disembunyikan otomatis.</p></div>
            <div className="add-row"><div className="select-wrap"><select value={moduleDraft} onChange={e => setModuleDraft(e.target.value)} disabled={!availableModules.length}><option value="">{availableModules.length ? "Pilih fitur tambahan…" : "Semua fitur relevan sudah dipilih / included"}</option>{availableModuleGroups.map(group => <optgroup label={group} key={group}>{availableModules.filter(item => item.group === group).map(item => <option value={item.id} key={item.id}>{item.name} — {rupiah(item.price)}</option>)}</optgroup>)}</select><ChevronDown size={15}/></div><button onClick={addModule} disabled={!moduleDraft}><Plus size={17}/> Tambah</button></div>
            <div className="selected-addons">{selectedItems.length ? selectedItems.map(item => {
              const included = base.features.includes(item.id); const dependency = dependencyIds.includes(item.id);
              return <div key={item.id}><span><Check size={13}/></span><div><strong>{item.name}</strong><small>{included ? "Sudah termasuk paket" : dependency ? "Dependency otomatis" : "Add-on"}</small></div><b>{included ? "Included" : rupiah(item.price)}</b>{!dependency && <button onClick={() => setSelectedModules(prev => prev.filter(id => id !== item.id))}><Trash2 size={14}/></button>}</div>;
            }) : <p className="empty-addons">Belum ada add-on. Harga dimulai dari paket dasar.</p>}</div>
          </div>

          <div className="field-grid price-options">
            <SelectField label="Diskon" value={discountRate} onChange={e => setDiscountRate(Number(e.target.value))}>
              <option value={0}>Tanpa diskon</option><option value={0.05}>Diskon 5%</option><option value={0.1}>Diskon 10%</option><option value={0.15}>Diskon 15%</option>
            </SelectField>
            <SelectField label="Pembulatan harga" value={rounding} onChange={e => setRounding(e.target.value)} hint="Harga paket tetap exact jika belum ada tambahan scope">
              <option value="exact">Harga sesuai kalkulasi</option><option value="50k">Bulat ke atas 50 ribu</option><option value="charm">Charm price x.999</option>
            </SelectField>
            <MoneyInput label="Adjustment manual" value={manualAdjustment} onChange={setManualAdjustment} hint="Selalu ditambahkan setelah pembulatan harga"/>
          </div>

          <div className="formula-line"><span>Base <b>{base.custom ? "Custom" : rupiah(base.price)}</b></span><Plus size={14}/><span>Add-on <b>{rupiah(addonTotal)}</b></span><Plus size={14}/><span>Complexity <b>{rupiah(complexityCost)}</b></span><Plus size={14}/><span>Adjustment <b>{rupiah(manualAdjustment)}</b></span><Minus size={14}/><span>Diskon <b>{rupiah(discount)}</b></span></div>
        </article>

        <article className="calc-card cost-card">
          <div className="card-heading"><span>02</span><div><p>PROJECT COST</p><h2>Perkirakan biaya langsung</h2></div><ReceiptText size={21}/></div>
          <div className="cost-note"><ShieldCheck size={17}/><p>Biaya ini dikurangi dari harga project terlebih dahulu. Pembagian 40/30/30 dihitung dari <strong>revenue bersih</strong>.</p></div>
          <div className="field-grid">
            <SelectField label="Domain & infrastructure" value={infrastructure} onChange={e => setInfrastructure(e.target.value)}>{fixedCostOptions.infrastructure.map(([id, label, value]) => <option value={id} key={id}>{label} — {rupiah(value)}</option>)}</SelectField>
            <SelectField label="Tools / API / software" value={tools} onChange={e => setTools(e.target.value)}>{fixedCostOptions.tools.map(([id, label, value]) => <option value={id} key={id}>{label} — {rupiah(value)}</option>)}</SelectField>
            <SelectField label="Marketing / acquisition" value={marketingCostRate} onChange={e => setMarketingCostRate(Number(e.target.value))}>{percentOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</SelectField>
            <SelectField label="Overhead project" value={overheadRate} onChange={e => setOverheadRate(Number(e.target.value))} hint="Transport, meeting, listrik, dan kebutuhan kecil">{percentOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</SelectField>
            <MoneyInput label="Biaya lain-lain" value={otherCost} onChange={setOtherCost} hint="Outsource, aset, atau kebutuhan khusus"/>
          </div>
          <div className="cost-breakdown">
            <div><Server size={15}/><span>Infrastructure</span><b>{rupiah(infrastructureCost)}</b></div>
            <div><WalletCards size={15}/><span>Tools / API</span><b>{rupiah(toolsCost)}</b></div>
            <div><Megaphone size={15}/><span>Marketing</span><b>{rupiah(marketingCost)}</b></div>
            <div><ReceiptText size={15}/><span>Overhead + lainnya</span><b>{rupiah(overheadCost + otherCost)}</b></div>
          </div>
        </article>
      </section>

      <aside className="result-column">
        <article className="result-card">
          <div className="result-label"><span>LIVE RESULT</span><CircleDollarSign size={19}/></div>
          <div className="selling-price"><span>Harga project</span><strong>{rupiah(sellingPrice)}</strong><small>{base.name}{discount > 0 ? ` · diskon ${Math.round(Number(discountRate) * 100)}% (-${rupiah(discount)})` : ""}</small></div>
          <div className="result-math"><div><span>Biaya langsung</span><b>- {rupiah(directCosts)}</b></div><div className={netRevenue < 0 ? "net loss" : "net"}><span>{netRevenue < 0 ? "Proyeksi rugi" : "Revenue bersih"}</span><b>{rupiah(netRevenue)}</b></div></div>
          <div className={`margin-banner ${margin < 50 ? "low" : margin < 70 ? "medium" : "healthy"}`}><TrendingUp size={17}/><div><span>Net margin</span><strong>{margin.toFixed(1)}%</strong></div><small>{netRevenue < 0 ? "Biaya melebihi harga project" : margin < 50 ? "Margin tipis — review biaya/harga" : margin < 70 ? "Cukup sehat" : "Margin sehat"}</small></div>
          <div className="pool-preview"><div><i style={{ width: "40%" }}/><span>Developer</span><b>{rupiah(developerPool)}</b><small>40%</small></div><div><i style={{ width: "30%" }}/><span>Marketing</span><b>{rupiah(marketingPool)}</b><small>30%</small></div><div><i style={{ width: "30%" }}/><span>Kas</span><b>{rupiah(companyPool)}</b><small>30%</small></div></div>
          <div className="result-actions"><button onClick={copySummary}>{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? "Tersalin" : "Copy ringkasan"}</button><button onClick={() => window.print()}><Printer size={15}/> Print</button></div>
        </article>
      </aside>
    </main>

    <section className="distribution-section">
      <div className="distribution-head"><div><span className="overline">PASAL 3 · PEMBAGIAN HASIL USAHA</span><h2>Pembagian dari revenue bersih.</h2><p>Nominal otomatis mengikuti hasil positif setelah seluruh biaya langsung project dikurangi.</p></div><div className="net-stamp"><span>AVAILABLE TO DISTRIBUTE</span><strong>{rupiah(distributableRevenue)}</strong></div></div>
      <div className="pool-grid">
        <article className="pool-card developer"><header><div><Code2 size={20}/><span>Developer Pool</span></div><strong>{rupiah(developerPool)}</strong><small>40% NET REVENUE</small></header><SplitTable rows={developerSplit} pool={developerPool} color="#00b4d8"/></article>
        <article className="pool-card marketing"><header><div><Megaphone size={20}/><span>Marketing Pool</span></div><strong>{rupiah(marketingPool)}</strong><small>30% NET REVENUE</small></header><SplitTable rows={marketingSplit} pool={marketingPool} color="#ff5a5f"/></article>
        <article className="pool-card company"><header><div><Landmark size={20}/><span>Kas Perusahaan</span></div><strong>{rupiah(companyPool)}</strong><small>30% NET REVENUE</small></header><SplitTable rows={companySplit} pool={companyPool} color="#d7ff3f" company/></article>
      </div>
      <div className="distribution-note"><Sparkles size={17}/><p><strong>Catatan:</strong> Operasional di Kas Perusahaan adalah alokasi kas untuk operasional perusahaan setelah project selesai. Ini berbeda dari biaya langsung project yang sudah dikurangi di bagian atas.</p></div>
    </section>

    <footer className="app-footer"><span>Solivate Studio · Internal Finance Calculator</span><span>Harga, biaya, dan pembagian tersimpan otomatis di perangkat ini.</span></footer>
  </div>;
}

createRoot(document.getElementById("root")).render(<App/>);
