import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle, ArrowDown, Calculator, Check, ChevronDown, CircleDollarSign,
  Copy, Database, Globe2, HardDrive, Info, Landmark, Megaphone, Plus,
  Printer, ReceiptText, RefreshCcw, Server, Sparkles, Trash2, TrendingUp, WalletCards, Code2
} from "lucide-react";
import { domainPlans, modules, packagePriceLabel, packages, rupiah, segments, serverPlans } from "./data";
import "./styles.css";

const scaleOptions = [
  ["s1", "S1 · Personal / Micro", 0, "Base · 1–3 admin, traffic rendah"],
  ["s2", "S2 · Small Business", .05, "+5% · panduan master 0–10%"],
  ["s3", "S3 · Mid-Market", .175, "+17,5% · panduan master 10–25%"],
  ["s4", "S4 · Large Business", .375, "+37,5% · panduan master 25–50%"],
  ["s5", "S5 · Enterprise", .5, "+50% estimasi awal · review custom wajib"]
];
const complexityOptions = [
  ["a", "A · Simple", 0, "1 role, 1 workflow, tanpa integrasi"],
  ["b", "B · Standard", .15, "+15% · panduan master 10–20%"],
  ["c", "C · Advanced", .375, "+37,5% · panduan master 25–50%"],
  ["d", "D · Enterprise", .6, "+60% estimasi awal · review custom wajib"]
];
const urgencyOptions = [
  ["normal", "Timeline normal", 0],
  ["urgent", "Urgent · +20%", .2],
  ["priority", "Priority · +35%", .35],
  ["rush", "Rush · +50%", .5]
];
const discountOptions = [[0,"Tanpa diskon"],[.05,"5%"],[.1,"10%"],[.15,"15%"],[.2,"20%"],[.25,"25%"]];
const developerSplit = [["Tech Lead",.35,.14],["Backend Developer",.3,.12],["Frontend Developer",.25,.1],["DevOps Engineer",.1,.04]];
const marketingSplit = [["Marketing Lead",.5,.15],["Content Lead",.3,.09],["Content Creator",.2,.06]];
const companySplit = [["Operasional",.35,.105,"Server, tools, software, kantor"],["Cadangan",.4,.12,"Emergency fund 3–6 bulan"],["Growth Fund",.2,.06,"Reinvestasi, R&D, produk baru"],["Misc / Bonus Pool",.05,.015,"Bonus performa dan team event"]];

function useSavedState(key, initial) {
  const [value, setValue] = useState(() => { try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; } });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}
function TextInput({ label, value, onChange, hint, placeholder }) {
  return <label className="select-field"><span>{label}</span><input className="text-input" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}/>{hint && <small>{hint}</small>}</label>;
}
function SelectField({ label, value, onChange, hint, children }) {
  return <label className="select-field"><span>{label}</span><div className="select-wrap"><select value={value} onChange={onChange}>{children}</select><ChevronDown size={15}/></div>{hint && <small>{hint}</small>}</label>;
}
function MoneyInput({ label, value, onChange, hint }) {
  const [draft, setDraft] = useState(value ? String(value) : "");
  useEffect(() => setDraft(value ? String(value) : ""), [value]);
  const commit = () => { const next = Math.max(0, Number(draft) || 0); setDraft(next ? String(next) : ""); onChange(next); };
  return <label className="select-field"><span>{label}</span><div className="money-input"><b>Rp</b><input inputMode="numeric" placeholder="0" value={draft} onFocus={e => e.target.select()} onChange={e => setDraft(e.target.value.replace(/\D/g,""))} onBlur={commit} onKeyDown={e => e.key === "Enter" && e.currentTarget.blur()}/></div>{hint && <small>{hint}</small>}</label>;
}
function SplitTable({ rows, pool, color, company }) {
  return <div className="split-table">{rows.map(([role,poolRate,totalRate,note]) => <div className="split-row" key={role}><span className="split-dot" style={{background:color}}/><div><strong>{role}</strong>{note && <small>{note}</small>}</div><span>{Math.round(poolRate*100)}% pool<small>{(totalRate*100).toFixed(totalRate*100%1?1:0)}% net</small></span><b>{rupiah(pool*poolRate)}</b></div>)}<div className="split-total"><span>Total {company?"Kas Perusahaan":"Pool"}</span><strong>{rupiah(pool)}</strong></div></div>;
}

function App() {
  const [projectName,setProjectName] = useSavedState("pricing-project-name","");
  const [segment,setSegment] = useSavedState("pricing-segment","personal");
  const initialPackage = packages.find(item => item.segment === segment)?.id || packages[0].id;
  const [packageId,setPackageId] = useSavedState("pricing-package",initialPackage);
  const [scale,setScale] = useSavedState("pricing-scale","s1");
  const [complexity,setComplexity] = useSavedState("pricing-complexity","a");
  const [urgency,setUrgency] = useSavedState("pricing-urgency","normal");
  const [selectedAddonIds,setSelectedAddonIds] = useSavedState("pricing-addons",[]);
  const [addonDraft,setAddonDraft] = useState("");
  const [scopeAddition,setScopeAddition] = useSavedState("pricing-scope-addition",0);
  const [customBenchmark,setCustomBenchmark] = useSavedState("pricing-custom-benchmark",0);
  const [discountRate,setDiscountRate] = useSavedState("pricing-discount-rate",0);
  const [manualDiscount,setManualDiscount] = useSavedState("pricing-manual-discount",0);
  const [domainId,setDomainId] = useSavedState("pricing-domain","included");
  const [serverId,setServerId] = useSavedState("pricing-server","included");
  const [serverMonths,setServerMonths] = useSavedState("pricing-server-months",12);
  const [databaseCost,setDatabaseCost] = useSavedState("pricing-database-cost",0);
  const [operationalCost,setOperationalCost] = useSavedState("pricing-operational-cost",0);
  const [copied,setCopied] = useState(false);

  const segmentPackages = packages.filter(item => item.segment === segment);
  const selectedPackage = packages.find(item => item.id === packageId) || segmentPackages[0];
  useEffect(() => {
    if (!selectedPackage || selectedPackage.segment !== segment) setPackageId(segmentPackages[0]?.id || packages[0].id);
  }, [segment]);

  const compatibleModules = useMemo(() => modules.filter(item => item.solutions.includes(selectedPackage.solution)), [selectedPackage.solution]);
  useEffect(() => {
    const allowed = new Set(compatibleModules.map(item => item.id));
    setSelectedAddonIds(ids => ids.filter(id => allowed.has(id)));
    setAddonDraft("");
  }, [selectedPackage.id]);
  const availableModules = compatibleModules.filter(item => !selectedAddonIds.includes(item.id) && !selectedPackage.included.includes(item.id));
  const selectedAddons = selectedAddonIds.map(id => modules.find(item => item.id === id)).filter(Boolean);

  const basePrice = selectedPackage.custom ? customBenchmark : selectedPackage.price;
  const scaleRate = scaleOptions.find(item => item[0] === scale)?.[2] || 0;
  const complexityRate = complexityOptions.find(item => item[0] === complexity)?.[2] || 0;
  const urgencyRate = urgencyOptions.find(item => item[0] === urgency)?.[2] || 0;
  const scaleAdjustment = Math.round(basePrice * scaleRate);
  const complexityAdjustment = Math.round(basePrice * complexityRate);
  const urgencyAdjustment = Math.round(basePrice * urgencyRate);
  const addOnTotal = selectedAddons.reduce((sum,item) => sum + item.price,0);
  const grossDevelopment = basePrice + scaleAdjustment + complexityAdjustment + urgencyAdjustment + addOnTotal + scopeAddition;
  const percentageDiscount = Math.round(grossDevelopment * Number(discountRate));
  const appliedManualDiscount = Math.min(manualDiscount, Math.max(0,grossDevelopment-percentageDiscount));
  const totalDiscount = Math.min(grossDevelopment,percentageDiscount+appliedManualDiscount);
  const developmentPrice = Math.max(0,grossDevelopment-totalDiscount);
  const belowFloor = selectedPackage.floor > 0 && developmentPrice < selectedPackage.floor;

  const domain = domainPlans.find(item => item.id === domainId) || domainPlans[0];
  const server = serverPlans.find(item => item.id === serverId) || serverPlans[0];
  const serverCost = server.monthly * Number(serverMonths);
  const providerCosts = domain.price + serverCost + databaseCost;
  const clientTotal = developmentPrice + providerCosts;
  const netRevenue = developmentPrice - operationalCost;
  const distributable = Math.max(0,netRevenue);
  const margin = developmentPrice ? netRevenue/developmentPrice*100 : operationalCost ? -100 : 0;
  const developerPool = distributable*.4, marketingPool = distributable*.3, companyPool = distributable*.3;

  const reset = () => {
    setProjectName(""); setSegment("personal"); setPackageId(packages[0].id); setScale("s1"); setComplexity("a"); setUrgency("normal");
    setSelectedAddonIds([]); setScopeAddition(0); setCustomBenchmark(0); setDiscountRate(0); setManualDiscount(0);
    setDomainId("included"); setServerId("included"); setServerMonths(12); setDatabaseCost(0); setOperationalCost(0);
  };
  const addAddon = () => { if (addonDraft) { setSelectedAddonIds(ids => [...ids,addonDraft]); setAddonDraft(""); } };
  const copySummary = async () => {
    const text = `SOLIVATE PRICING ESTIMATE\nProject: ${projectName || "Tanpa nama"}\nPackage: ${selectedPackage.name}\nBenchmark: ${rupiah(basePrice)}\nDevelopment before discount: ${rupiah(grossDevelopment)}\nDiscount: ${rupiah(totalDiscount)}\nDevelopment final: ${rupiah(developmentPrice)}\nProvider cost: ${rupiah(providerCosts)}\nTotal invoice: ${rupiah(clientTotal)}\nInternal operational cost: ${rupiah(operationalCost)}\nNet revenue: ${rupiah(netRevenue)}\n\nDeveloper 40%: ${rupiah(developerPool)}\nMarketing 30%: ${rupiah(marketingPool)}\nKas 30%: ${rupiah(companyPool)}`;
    await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false),1600);
  };

  const groupedPackages = segmentPackages.reduce((groups,item) => {
    (groups[item.solution] ||= []).push(item);
    return groups;
  },{});
  return <div className="calculator-app">
    <header className="app-header"><div className="brand-lockup"><img src="/solivate-logo.webp" alt="Solivate Studio"/><span>Pricing Benchmark Engine</span></div><div className="header-actions"><button onClick={reset}><RefreshCcw size={15}/> Reset</button><button className="print-button" onClick={() => window.print()}><Printer size={15}/> Print</button></div></header>

    <section className="hero-strip compact-hero"><div><span className="overline">SOLIVATE STUDIO · MASTER PRICING 2026</span><h1>Pilih benchmark.<br/><em>Hitung scope nyata.</em></h1><p>Estimator internal berbasis package anchor, skala client, kompleksitas, add-on kompatibel, biaya provider, discount guardrail, dan pembagian hasil usaha.</p></div><div className="hero-formula"><span>BENCHMARK</span><Plus size={16}/><span>ADJUSTMENT</span><ArrowDown size={16}/><strong>FINAL QUOTATION</strong></div></section>

    <main className="calculator-layout">
      <section className="input-column">
        <article className="calc-card project-card">
          <div className="card-heading"><span>01</span><div><p>PACKAGE ANCHOR</p><h2>Pilih kelas project</h2></div><Calculator size={21}/></div>
          <TextInput label="Nama project" value={projectName} onChange={setProjectName} placeholder="Contoh: Sistem Booking Klinik" hint="Opsional · tersimpan otomatis di perangkat"/>
          <span className="section-label segment-label">Kategori utama</span>
          <div className="segment-tabs">{segments.map(item => <button key={item.id} className={segment===item.id?"active":""} onClick={() => setSegment(item.id)}><span>{item.short}</span><small>{item.label}</small></button>)}</div>
          <div className="field-grid">
            <SelectField label="Package benchmark" value={selectedPackage.id} onChange={e => setPackageId(e.target.value)} hint={packagePriceLabel(selectedPackage)}>
              {Object.entries(groupedPackages).map(([solution,items]) => <optgroup label={solution} key={solution}>{items.map(item => <option value={item.id} key={item.id}>{item.name} · {packagePriceLabel(item)}</option>)}</optgroup>)}
            </SelectField>
            {selectedPackage.custom ? <MoneyInput label="Benchmark hasil discovery" value={customBenchmark} onChange={setCustomBenchmark} hint="Wajib diisi untuk custom quotation"/> : <div className="package-brief"><span>COCOK UNTUK</span><strong>{selectedPackage.forWho}</strong><small>{selectedPackage.difference}</small></div>}
          </div>
          {selectedPackage.custom && <div className="custom-quote-notice"><AlertTriangle size={18}/><div><strong>Custom quotation</strong><p>Angka harus dikunci setelah discovery, security review, integration mapping, dan SLA.</p></div></div>}
        </article>

        <article className="calc-card">
          <div className="card-heading"><span>02</span><div><p>SCOPE & COMPLEXITY</p><h2>Adjustment yang transparan</h2></div><Sparkles size={21}/></div>
          <div className="field-grid">
            <SelectField label="Skala client" value={scale} onChange={e => setScale(e.target.value)} hint={scaleOptions.find(x=>x[0]===scale)?.[3]}>{scaleOptions.map(([id,label]) => <option value={id} key={id}>{label}</option>)}</SelectField>
            <SelectField label="Kompleksitas" value={complexity} onChange={e => setComplexity(e.target.value)} hint={complexityOptions.find(x=>x[0]===complexity)?.[3]}>{complexityOptions.map(([id,label]) => <option value={id} key={id}>{label}</option>)}</SelectField>
            <SelectField label="Timeline" value={urgency} onChange={e => setUrgency(e.target.value)} hint="Master guide urgent delivery: +20–50%">{urgencyOptions.map(([id,label]) => <option value={id} key={id}>{label}</option>)}</SelectField>
            <MoneyInput label="Scope tambahan manual" value={scopeAddition} onChange={setScopeAddition} hint="Hanya penambahan effort. Diskon ada di bagian terpisah."/>
          </div>

          <div className="addon-builder"><div className="addon-title"><span className="section-label">ADD-ON KOMPATIBEL</span><span>{selectedPackage.solution}</span></div><div className="addon-guidance"><Info size={16}/><p>Hanya add-on yang cocok untuk tipe solusi ini yang ditampilkan. Fitur yang sudah included oleh package juga tidak ditagih ulang.</p></div>
            <div className="add-row"><div className="select-wrap"><select value={addonDraft} onChange={e => setAddonDraft(e.target.value)}><option value="">Pilih add-on…</option>{availableModules.map(item => <option value={item.id} key={item.id}>{item.name} · mulai {rupiah(item.price)}</option>)}</select><ChevronDown size={15}/></div><button disabled={!addonDraft} onClick={addAddon}><Plus size={15}/> Tambah</button></div>
            <div className="selected-addons">{selectedAddons.length ? selectedAddons.map(item => <div key={item.id}><span><Check size={13}/></span><div><strong>{item.name}</strong><small>{item.description}</small></div><b>{rupiah(item.price)}{item.maxPrice?"+":""}</b><button onClick={() => setSelectedAddonIds(ids => ids.filter(id => id!==item.id))}><Trash2 size={14}/></button></div>) : <p className="empty-addons">Belum ada add-on. Package tetap bisa dihitung tanpa add-on.</p>}</div>
          </div>

          <div className="field-grid price-options"><SelectField label="Diskon persen" value={discountRate} onChange={e => setDiscountRate(Number(e.target.value))}>{discountOptions.map(([rate,label]) => <option value={rate} key={rate}>{label}</option>)}</SelectField><MoneyInput label="Diskon nominal" value={manualDiscount} onChange={setManualDiscount} hint="Dikurangi setelah diskon persen"/></div>
          <div className="formula-line"><span>Benchmark<b>{rupiah(basePrice)}</b></span><Plus size={14}/><span>Adjustment<b>{rupiah(scaleAdjustment+complexityAdjustment+urgencyAdjustment)}</b></span><Plus size={14}/><span>Add-on & scope<b>{rupiah(addOnTotal+scopeAddition)}</b></span><span>Diskon<b>- {rupiah(totalDiscount)}</b></span><ArrowDown size={14}/><span>Development final<b>{rupiah(developmentPrice)}</b></span></div>
          {belowFloor && <div className="floor-warning"><AlertTriangle size={17}/><div><strong>Harga di bawah category floor {rupiah(selectedPackage.floor)}</strong><p>Manager approval wajib sebelum quotation dikirim.</p></div></div>}
        </article>

        <article className="calc-card cost-card">
          <div className="card-heading"><span>03</span><div><p>INFRASTRUCTURE & COST</p><h2>Provider dipisah dari development</h2></div><ReceiptText size={21}/></div>
          <div className="cost-note"><WalletCards size={17}/><p>Domain, VPS, dan database adalah biaya provider yang ditambahkan ke invoice lalu diteruskan ke provider. Biaya operasional internal mengurangi revenue development sebelum pembagian pool.</p></div>
          <div className="field-grid">
            <SelectField label="Domain · IDwebhost" value={domainId} onChange={e => setDomainId(e.target.value)} hint={domain.note}>{domainPlans.map(item => <option value={item.id} key={item.id}>{item.name} · {rupiah(item.price)}</option>)}</SelectField>
            <SelectField label="Server · SumoPod" value={serverId} onChange={e => setServerId(e.target.value)} hint={`${server.specs} · ${rupiah(server.monthly)}/bulan`}>{serverPlans.map(item => <option value={item.id} key={item.id}>{item.name} · {rupiah(item.monthly)}/bln</option>)}</SelectField>
            <SelectField label="Durasi server" value={serverMonths} onChange={e => setServerMonths(Number(e.target.value))} hint="Biaya recurring dihitung sesuai durasi"><option value={1}>1 bulan</option><option value={3}>3 bulan</option><option value={6}>6 bulan</option><option value={12}>12 bulan</option></SelectField>
            <MoneyInput label="Database provider (opsional)" value={databaseCost} onChange={setDatabaseCost} hint="Supabase/managed DB/storage berbayar bila ada"/>
            <MoneyInput label="Biaya operasional internal" value={operationalCost} onChange={setOperationalCost} hint="Tools, outsource, transport, lisensi internal, dll."/>
          </div>
          <div className="cost-breakdown"><div><Globe2 size={15}/><span>Domain</span><b>{rupiah(domain.price)}</b></div><div><Server size={15}/><span>SumoPod · {serverMonths} bln</span><b>{rupiah(serverCost)}</b></div><div><Database size={15}/><span>Database provider</span><b>{rupiah(databaseCost)}</b></div><div><ReceiptText size={15}/><span>Operasional internal</span><b>{rupiah(operationalCost)}</b></div></div>
          <p className="source-note">Harga provider adalah snapshot estimator dan bisa berubah saat checkout. Verifikasi kembali di IDwebhost dan dashboard SumoPod sebelum quotation dikunci.</p>
        </article>
      </section>

      <aside className="result-column"><article className="result-card"><div className="result-label"><span>LIVE ESTIMATE</span><CircleDollarSign size={19}/></div><div className="selling-price"><span>Total estimasi invoice</span><strong>{rupiah(clientTotal)}</strong><small>{projectName || selectedPackage.name}</small></div><div className="result-math"><div><span>Development final</span><b>{rupiah(developmentPrice)}</b></div><div><span>Biaya provider</span><b>+ {rupiah(providerCosts)}</b></div><div><span>Operasional internal</span><b>- {rupiah(operationalCost)}</b></div><div className={`net ${netRevenue<0?"loss":""}`}><span>{netRevenue<0?"Proyeksi rugi":"Revenue bersih"}</span><b>{rupiah(netRevenue)}</b></div></div><div className={`margin-banner ${margin<50?"low":margin<70?"medium":"healthy"}`}><TrendingUp size={17}/><div><span>Dev margin</span><strong>{margin.toFixed(1)}%</strong></div><small>{belowFloor?"Below floor":netRevenue<0?"Rugi":margin<50?"Review harga/biaya":margin<70?"Cukup sehat":"Sehat"}</small></div><div className="pool-preview"><div className="developer"><i/><span>Developer</span><b>{rupiah(developerPool)}</b><small>40%</small></div><div className="marketing"><i/><span>Marketing</span><b>{rupiah(marketingPool)}</b><small>30%</small></div><div className="company"><i/><span>Kas</span><b>{rupiah(companyPool)}</b><small>30%</small></div></div><div className="result-actions"><button onClick={copySummary}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?"Tersalin":"Copy"}</button><button onClick={() => window.print()}><Printer size={15}/> Print</button></div></article></aside>
    </main>

    <section className="distribution-section"><div className="distribution-head"><div><span className="overline">PASAL 3 · PEMBAGIAN HASIL USAHA</span><h2>Pembagian revenue bersih.</h2><p>Biaya provider tidak masuk pool. Operasional internal dikurangi dari revenue development sebelum pembagian 40/30/30.</p></div><div className="net-stamp"><span>AVAILABLE TO DISTRIBUTE</span><strong>{rupiah(distributable)}</strong></div></div><div className="pool-grid"><article className="pool-card developer"><header><div><Code2 size={20}/><span>Developer Pool</span></div><strong>{rupiah(developerPool)}</strong><small>40% NET REVENUE</small></header><SplitTable rows={developerSplit} pool={developerPool} color="#00b4d8"/></article><article className="pool-card marketing"><header><div><Megaphone size={20}/><span>Marketing Pool</span></div><strong>{rupiah(marketingPool)}</strong><small>30% NET REVENUE</small></header><SplitTable rows={marketingSplit} pool={marketingPool} color="#ff5a5f"/></article><article className="pool-card company"><header><div><Landmark size={20}/><span>Kas Perusahaan</span></div><strong>{rupiah(companyPool)}</strong><small>30% NET REVENUE</small></header><SplitTable rows={companySplit} pool={companyPool} color="#d7ff3f" company/></article></div><div className="distribution-note"><Sparkles size={17}/><p><strong>Catatan:</strong> angka master adalah benchmark internal, bukan quotation otomatis. Review scope, category floor, provider cost, security, dan SLA sebelum penawaran dikunci.</p></div></section>
    <footer className="app-footer"><span>Solivate Studio · Pricing Benchmark Engine 2026</span><span>Master pricing internal · data tersimpan otomatis</span></footer>
  </div>;
}

createRoot(document.getElementById("root")).render(<App/>);
