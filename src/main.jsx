import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft, ArrowRight, BarChart3, Bot, Building2, Check, CheckCircle2,
  ChevronRight, CircleDollarSign, ClipboardList, FileDown, HeartHandshake,
  Info, LayoutDashboard, Loader2, Menu, PackageCheck, Plus, RotateCcw,
  Save, Sparkles, Store, Users, WandSparkles, X, Zap
} from "lucide-react";
import { complexityLabel, industries, modules, packages, rupiah, segments, solutions } from "./data";
import "./styles.css";

const iconMap = { HeartHandshake, Store, Building2 };
const steps = [
  ["Customer", "Siapa client-nya?", Users],
  ["Solution", "Mau dibangun apa?", LayoutDashboard],
  ["Features", "Pilih requirement", ClipboardList],
  ["Recommendation", "Review hasil engine", Sparkles],
  ["Quotation", "Finalisasi penawaran", FileDown]
];

const initialProfile = {
  customerName: "", projectName: "", customerType: "Sekolah", segment: "umkm",
  industry: "Education", solution: "Operational", salesperson: "", budget: "Rp3–5 juta",
  targetLaunch: "", notes: "", expectedUsers: "100–500", roles: 2, branches: 1
};

function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}

function Field({ label, hint, children, wide = false }) {
  return <label className={wide ? "field wide" : "field"}><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}

function App() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useStoredState("solivate-draft-profile", initialProfile);
  const [baseId, setBaseId] = useStoredState("solivate-draft-base", "operational-pro");
  const [selected, setSelected] = useStoredState("solivate-draft-features", []);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("fixed");
  const [mode, setMode] = useState("internal");
  const [mobileNav, setMobileNav] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [scenarios, setScenarios] = useStoredState("solivate-scenarios", []);

  const availablePackages = useMemo(() => packages.filter(p => p.segment === profile.segment), [profile.segment]);
  const solutionPackages = useMemo(() => {
    const exact = availablePackages.filter(p => p.solution === profile.solution);
    return exact.length ? exact : availablePackages;
  }, [availablePackages, profile.solution]);

  useEffect(() => {
    if (!solutionPackages.some(p => p.id === baseId)) setBaseId(solutionPackages[0]?.id || availablePackages[0]?.id || "");
  }, [profile.segment, profile.solution]);

  const base = packages.find(p => p.id === baseId) || solutionPackages[0] || packages[0];
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const dependencyIds = useMemo(() => {
    const found = new Set();
    const walk = (id) => {
      const item = modules.find(m => m.id === id);
      item?.requires?.forEach(dep => { if (!selectedSet.has(dep) && !found.has(dep)) { found.add(dep); walk(dep); } });
    };
    selected.forEach(walk);
    return [...found];
  }, [selected]);

  const effectiveIds = useMemo(() => [...new Set([...selected, ...dependencyIds])], [selected, dependencyIds]);
  const effectiveModules = effectiveIds.map(id => modules.find(m => m.id === id)).filter(Boolean);
  const chargeableModules = effectiveModules.filter(m => !base.features.includes(m.id));
  const includedSelected = effectiveModules.filter(m => base.features.includes(m.id));
  const addonTotal = chargeableModules.reduce((sum, m) => sum + m.price, 0);
  const rolePoints = profile.roles >= 7 ? 8 : profile.roles >= 4 ? 5 : 0;
  const volumePoints = profile.expectedUsers === "10.000+" ? 8 : profile.expectedUsers === "2.000–10.000" ? 5 : profile.expectedUsers === "500–2.000" ? 3 : 0;
  const branchPoints = profile.branches >= 5 ? 5 : profile.branches > 1 ? 3 : 0;
  const complexity = base.complexity + chargeableModules.reduce((sum, m) => sum + m.points, 0) + rolePoints + volumePoints + branchPoints;
  const rawTotal = base.price + addonTotal;
  const recommended = addonTotal ? Math.max(base.floor, Math.max(base.price, Math.round(rawTotal / 500000) * 500000 - 1000)) : base.price;
  const discountValue = discountType === "percent" ? Math.round(recommended * Math.min(discount, 100) / 100) : Math.min(discount, recommended);
  const finalPrice = Math.max(0, recommended - discountValue);
  const floorStatus = finalPrice < base.floor ? "danger" : finalPrice < base.price ? "warning" : "safe";

  const bundle = useMemo(() => {
    const candidates = packages.filter(p => p.segment === profile.segment && p.price < rawTotal && p.price > base.price);
    return candidates.map(p => ({ p, coverage: effectiveIds.filter(id => p.features.includes(id)).length }))
      .filter(x => x.coverage >= Math.max(2, Math.ceil(effectiveIds.length * .45)))
      .sort((a, b) => b.coverage - a.coverage || a.p.price - b.p.price)[0]?.p;
  }, [base, effectiveIds, profile.segment, rawTotal]);

  const groups = [...new Set(modules.map(m => m.group))];
  const update = (key, value) => setProfile(prev => ({ ...prev, [key]: value }));
  const toggleFeature = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const canContinue = step !== 0 || (profile.customerName.trim() && profile.projectName.trim());

  const reset = () => {
    setProfile(initialProfile); setBaseId("operational-pro"); setSelected([]); setDiscount(0); setStep(0);
  };

  const saveScenario = () => {
    const next = {
      id: crypto.randomUUID(), name: `Scenario ${String.fromCharCode(65 + scenarios.length)}`,
      project: profile.projectName || "Untitled Project", baseId, selected, total: finalPrice, createdAt: new Date().toISOString()
    };
    setScenarios(prev => [...prev, next]);
  };

  const runAi = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true); setAiResult(null);
    try {
      const response = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        requirement: aiInput, profile, availableModuleIds: modules.map(({ id, name }) => ({ id, name })),
        availablePackages: availablePackages.map(({ id, name, price, solution }) => ({ id, name, price, solution }))
      }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI tidak merespons.");
      setAiResult(data);
    } catch (error) { setAiResult({ error: error.message }); }
    finally { setAiLoading(false); }
  };

  const applyAi = () => {
    if (!aiResult) return;
    const valid = (aiResult.moduleIds || []).filter(id => modules.some(m => m.id === id));
    if (valid.length) setSelected(prev => [...new Set([...prev, ...valid])]);
    if (packages.some(p => p.id === aiResult.packageId)) setBaseId(aiResult.packageId);
    setAiOpen(false); setStep(2);
  };

  return <div className="app-shell">
    <aside className={mobileNav ? "sidebar open" : "sidebar"}>
      <div className="brand"><img src="/solivate-logo.webp" alt="Solivate Studio" /><span>Pricing Engine</span></div>
      <div className="workspace-pill"><small>SALES OPS</small><strong>Quotation Workspace</strong></div>
      <nav>
        {steps.map(([name, subtitle, Icon], index) => <button key={name} className={step === index ? "nav-step active" : step > index ? "nav-step done" : "nav-step"} onClick={() => { setStep(index); setMobileNav(false); }}>
          <span className="nav-index">{step > index ? <Check size={13}/> : String(index + 1).padStart(2, "0")}</span>
          <span><strong>{name}</strong><small>{subtitle}</small></span><ChevronRight size={14}/>
        </button>)}
      </nav>
      <div className="sidebar-foot"><span><i></i> Pricing rules active</span><small>Architecture 2026 · v1.0</small></div>
    </aside>

    <main>
      <header className="topbar">
        <button className="menu-button" onClick={() => setMobileNav(v => !v)} aria-label="Buka menu"><Menu size={20}/></button>
        <div><p>Sales Pricing & Quotation Engine</p><h1>{steps[step][0]}</h1></div>
        <div className="top-actions">
          <div className="mode-switch"><button className={mode === "internal" ? "active" : ""} onClick={() => setMode("internal")}>Internal</button><button className={mode === "customer" ? "active" : ""} onClick={() => setMode("customer")}>Customer Preview</button></div>
          <button className="ai-button" onClick={() => setAiOpen(true)}><WandSparkles size={16}/><span>AI Assist</span></button>
        </div>
      </header>

      <div className="page-grid">
        <section className="workspace">
          <div className="step-kicker"><span>STEP {step + 1} / 5</span><i style={{ width: `${(step + 1) * 20}%` }}></i></div>

          {step === 0 && <div className="panel animate-in">
            <div className="panel-head"><div><span className="eyebrow">PROJECT INFORMATION</span><h2>Mulai dari konteks,<br/>bukan sekadar checklist.</h2><p>Data ini otomatis dipakai untuk rekomendasi dan quotation.</p></div><div className="head-number">01</div></div>
            <div className="form-grid">
              <Field label="Nama Customer"><input value={profile.customerName} onChange={e => update("customerName", e.target.value)} placeholder="SMA Al-Falah" /></Field>
              <Field label="Nama Project"><input value={profile.projectName} onChange={e => update("projectName", e.target.value)} placeholder="Sistem Kedisiplinan Siswa" /></Field>
              <Field label="Customer Type"><input value={profile.customerType} onChange={e => update("customerType", e.target.value)} placeholder="Sekolah / UMKM / PT" /></Field>
              <Field label="Industry"><select value={profile.industry} onChange={e => update("industry", e.target.value)}>{industries.map(x => <option key={x}>{x}</option>)}</select></Field>
              <Field label="Sales Person"><input value={profile.salesperson} onChange={e => update("salesperson", e.target.value)} placeholder="Nama sales" /></Field>
              <Field label="Estimasi Budget"><input value={profile.budget} onChange={e => update("budget", e.target.value)} placeholder="Rp3–5 juta" /></Field>
              <Field label="Target Launch"><input type="date" value={profile.targetLaunch} onChange={e => update("targetLaunch", e.target.value)} /></Field>
              <Field label="Expected Users"><select value={profile.expectedUsers} onChange={e => update("expectedUsers", e.target.value)}>{["<100", "100–500", "500–2.000", "2.000–10.000", "10.000+"].map(x => <option key={x}>{x}</option>)}</select></Field>
              <Field label="Notes" wide><textarea value={profile.notes} onChange={e => update("notes", e.target.value)} placeholder="Ceritakan kebutuhan singkat, pain point, atau batas scope…" rows="4" /></Field>
            </div>
          </div>}

          {step === 1 && <div className="panel animate-in">
            <div className="panel-head compact"><div><span className="eyebrow">SOLUTION MAPPING</span><h2>Kebutuhannya masuk<br/>kelas yang mana?</h2></div><div className="head-number">02</div></div>
            <h3 className="section-label">1. Customer segment</h3>
            <div className="segment-grid">{segments.map(segment => { const Icon = iconMap[segment.icon]; return <button key={segment.id} className={profile.segment === segment.id ? "segment-card selected" : "segment-card"} onClick={() => update("segment", segment.id)}><Icon size={22}/><strong>{segment.label}</strong><p>{segment.description}</p><span>{profile.segment === segment.id ? <Check size={14}/> : <Plus size={14}/>}</span></button> })}</div>
            <h3 className="section-label">2. Solution type</h3>
            <div className="chip-grid">{solutions.map(solution => <button key={solution} className={profile.solution === solution ? "solution-chip selected" : "solution-chip"} onClick={() => update("solution", solution)}>{solution}<Check size={13}/></button>)}</div>
            <div className="package-section"><div className="section-title"><div><h3>3. Base package</h3><p>Setiap quotation wajib punya paket dasar.</p></div><PackageCheck size={22}/></div>
              <div className="package-grid">{solutionPackages.map(pkg => <button key={pkg.id} className={base.id === pkg.id ? "package-card selected" : "package-card"} onClick={() => setBaseId(pkg.id)}><span>{pkg.solution}</span><h4>{pkg.name}</h4><strong>{pkg.starting && <small>Mulai </small>}{rupiah(pkg.price)}</strong><p>{pkg.features.length} fitur included · {pkg.warranty} warranty</p><i>{base.id === pkg.id ? <CheckCircle2 size={19}/> : <Plus size={17}/>}</i></button>)}</div>
            </div>
          </div>}

          {step === 2 && <div className="panel animate-in">
            <div className="panel-head compact"><div><span className="eyebrow">REQUIREMENT SELECTOR</span><h2>Apa yang customer<br/>benar-benar butuhkan?</h2><p>Dependency dan fitur included dihitung otomatis.</p></div><button className="inline-ai" onClick={() => setAiOpen(true)}><Bot size={18}/> Jelaskan ke AI</button></div>
            {dependencyIds.length > 0 && <div className="notice dependency"><Zap size={18}/><div><strong>{dependencyIds.length} dependency detected</strong><p>{dependencyIds.map(id => modules.find(m => m.id === id)?.name).join(", ")} otomatis ditambahkan.</p></div></div>}
            <div className="requirement-groups">{groups.map(group => <section key={group}><div className="group-head"><h3>{group}</h3><span>{modules.filter(m => m.group === group && selectedSet.has(m.id)).length} selected</span></div><div className="feature-grid">{modules.filter(m => m.group === group).map(item => {
              const active = selectedSet.has(item.id); const included = base.features.includes(item.id); const dependency = dependencyIds.includes(item.id);
              return <button key={item.id} className={active || dependency ? "feature-card selected" : "feature-card"} onClick={() => !dependency && toggleFeature(item.id)}><span className="feature-check">{active || dependency ? <Check size={15}/> : null}</span><div><strong>{item.name}</strong><p>{item.description}</p><small>{included ? "INCLUDED" : dependency ? "DEPENDENCY" : mode === "internal" ? `+ ${rupiah(item.price)}` : "Optional module"}</small></div>{item.external && <Info size={14}/>}</button>
            })}</div></section>)}</div>
          </div>}

          {step === 3 && <div className="panel animate-in recommendation-page">
            <div className="recommend-hero"><div><span className="eyebrow">ENGINE RECOMMENDATION</span><p>{profile.projectName || "Untitled Project"}</p><h2>{complexityLabel(complexity)} solution,<br/><em>{base.name}</em></h2></div><div className="score-orbit"><strong>{complexity}</strong><span>POINTS</span></div></div>
            {bundle && bundle.id !== base.id && <div className="bundle-callout"><div className="bundle-icon"><Sparkles size={21}/></div><div><span>SMART BUNDLE DETECTED</span><h3>{bundle.name} lebih efisien untuk scope ini.</h3><p>Harga bundle {rupiah(bundle.price)} · hemat {rupiah(rawTotal - bundle.price)} dibanding modular.</p></div><button onClick={() => setBaseId(bundle.id)}>Pakai bundle <ArrowRight size={15}/></button></div>}
            <div className="insight-grid"><article><span>Classification</span><strong>{base.segment === "enterprise" ? "Business / Enterprise" : base.solution}</strong><p>{complexityLabel(complexity)}</p></article><article><span>Complexity</span><strong>{complexity} points</strong><p>{complexity > 50 ? "Perlu custom scoping" : "Masih dalam paket terukur"}</p></article><article><span>Infrastructure</span><strong>Managed Hosting</strong><p>{rawTotal >= 400000 ? ".com 1 tahun included" : "Subdomain included"}</p></article></div>
            <div className="scope-table"><div className="scope-head"><h3>Scope recommendation</h3><span>{effectiveModules.length + base.features.length} items</span></div>
              <div className="scope-row header"><span>Module</span><span>Status</span><span>{mode === "internal" ? "Value" : "Scope"}</span></div>
              {[...new Map([...base.features.map(id => [id, { id, name: modules.find(m => m.id === id)?.name || id.replaceAll("-", " "), included: true }]), ...effectiveModules.map(m => [m.id, { ...m, included: base.features.includes(m.id) }])]).values()].map(item => <div className="scope-row" key={item.id}><span><CheckCircle2 size={15}/>{item.name}</span><span className={item.included ? "status included" : "status addon"}>{item.included ? "Included" : "Add-on"}</span><span>{mode === "internal" && !item.included ? rupiah(item.price) : "In scope"}</span></div>)}
            </div>
          </div>}

          {step === 4 && <div className="panel animate-in quotation-wrap">
            <div className="quotation-toolbar"><div><span className="eyebrow">FINAL QUOTATION</span><h2>Siap dikirim ke customer.</h2></div><div><button className="secondary-button" onClick={saveScenario}><Save size={16}/> Save scenario</button><button className="primary-button" onClick={() => window.print()}><FileDown size={16}/> Print / PDF</button></div></div>
            <article className="quotation" id="quotation"><header><img src="/solivate-logo.webp" alt="Solivate Studio"/><div><span>QUOTATION</span><strong>SV-{new Date().getFullYear()}-{String(Date.now()).slice(-5)}</strong><small>{new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date())}</small></div></header>
              <div className="quote-parties"><section><span>PREPARED FOR</span><h3>{profile.customerName || "Nama Customer"}</h3><p>{profile.customerType} · {profile.industry}</p></section><section><span>PROJECT</span><h3>{profile.projectName || "Nama Project"}</h3><p>Target launch: {profile.targetLaunch || "Menyesuaikan"}</p></section></div>
              <div className="quote-package"><div><span>RECOMMENDED SOLUTION</span><h2>{base.name}</h2><p>{complexityLabel(complexity)} · {complexity} complexity points</p></div><strong>{rupiah(finalPrice)}</strong></div>
              <section className="quote-scope"><h3>Scope pekerjaan</h3><div>{[...new Set([...base.features, ...effectiveIds])].map(id => <span key={id}><Check size={13}/>{modules.find(m => m.id === id)?.name || id.replaceAll("-", " ")}</span>)}</div></section>
              <div className="quote-details"><section><h4>Infrastructure</h4><p>Managed hosting + SSL</p><p>{finalPrice >= 400000 ? ".com 1 tahun included" : "Subdomain Solivate included"}</p></section><section><h4>Warranty</h4><p>{base.warranty} bug warranty</p><p>Feature update tidak termasuk</p></section><section><h4>Third-party fee</h4><p>{effectiveModules.some(m => m.external) ? "Provider fee dibayar client" : "Tidak ada pada scope saat ini"}</p></section></div>
              <div className="quote-total"><div><span>Investment</span><small>Development fee</small></div><strong>{rupiah(finalPrice)}</strong></div>
              <footer><p>Harga berlaku 14 hari. Perubahan scope akan dibuatkan quotation version baru.</p><strong>Solivate Studio</strong></footer>
            </article>
            {scenarios.length > 0 && <section className="scenario-list"><div className="section-title"><div><h3>Saved scenarios</h3><p>Bandingkan opsi tanpa mengubah quotation utama.</p></div></div>{scenarios.map(item => <div className="scenario-row" key={item.id}><span>{item.name}</span><div><strong>{item.project}</strong><small>{new Date(item.createdAt).toLocaleString("id-ID")}</small></div><b>{rupiah(item.total)}</b><button onClick={() => setScenarios(prev => prev.filter(x => x.id !== item.id))}><X size={15}/></button></div>)}</section>}
          </div>}

          <div className="page-actions"><button className="back-button" onClick={() => step ? setStep(step - 1) : reset()}>{step ? <><ArrowLeft size={16}/> Kembali</> : <><RotateCcw size={16}/> Reset draft</>}</button>{step < 4 && <button className="primary-button" disabled={!canContinue} onClick={() => setStep(step + 1)}>Lanjut ke {steps[step + 1][0]} <ArrowRight size={16}/></button>}</div>
        </section>

        <aside className="estimate-card">
          <div className="estimate-top"><span>LIVE ESTIMATE</span><i><CircleDollarSign size={17}/></i></div>
          <p>{profile.projectName || "Project belum diberi nama"}</p><h2>{rupiah(finalPrice)}</h2><span className={`margin-status ${floorStatus}`}><i></i>{floorStatus === "safe" ? "Safe margin" : floorStatus === "warning" ? "Low margin" : "Manager approval required"}</span>
          <div className="estimate-breakdown"><div><span>Base · {base.name}</span><strong>{rupiah(base.price)}</strong></div><div><span>Modules ({chargeableModules.length})</span><strong>{rupiah(addonTotal)}</strong></div><div><span>Bundle adjustment</span><strong>{rupiah(recommended - rawTotal)}</strong></div>{discountValue > 0 && <div><span>Discount</span><strong>-{rupiah(discountValue)}</strong></div>}</div>
          {mode === "internal" && <div className="discount-box"><div><span>Manual discount</span><select value={discountType} onChange={e => setDiscountType(e.target.value)}><option value="fixed">Nominal</option><option value="percent">Percent</option></select></div><div className="discount-input"><span>{discountType === "fixed" ? "Rp" : "%"}</span><input type="number" min="0" value={discount} onChange={e => setDiscount(Number(e.target.value))}/></div><small>Floor price: {rupiah(base.floor)}</small></div>}
          <div className="complexity-meter"><div><span>Complexity</span><strong>{complexityLabel(complexity)}</strong></div><div className="meter"><i style={{ width: `${Math.min(100, complexity / 60 * 100)}%` }}></i></div><small>{complexity} points · {profile.roles} roles · {profile.expectedUsers} users</small></div>
          <div className="estimate-benefit"><CheckCircle2 size={16}/><div><strong>{finalPrice >= 400000 ? ".com included" : "Subdomain included"}</strong><span>Managed hosting + SSL</span></div></div>
        </aside>
      </div>
    </main>

    {mobileNav && <button className="mobile-backdrop" onClick={() => setMobileNav(false)} aria-label="Tutup menu"/>}
    {aiOpen && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setAiOpen(false)}><section className="ai-modal"><header><div><span><Sparkles size={14}/> SOLIVATE AI</span><h2>Ceritakan kebutuhan client.</h2><p>AI memetakan requirement ke paket dan module yang tersedia—pricing final tetap dihitung rule engine.</p></div><button onClick={() => setAiOpen(false)}><X size={20}/></button></header>
      <textarea rows="6" value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="Contoh: Sekolah punya 800 siswa. Butuh 5 role, absensi, pelanggaran, poin otomatis, portal wali, laporan PDF/Excel, dan opsi QR…" />
      {aiResult && <div className={aiResult.error ? "ai-result error" : "ai-result"}>{aiResult.error ? <p>{aiResult.error}</p> : <><span>AI RECOMMENDATION</span><h3>{aiResult.summary}</h3><p>{aiResult.reasoning}</p>{aiResult.alerts?.map(alert => <small key={alert}>• {alert}</small>)}</>}</div>}
      <footer>{aiResult && !aiResult.error && <button className="secondary-button" onClick={applyAi}><Check size={16}/> Terapkan rekomendasi</button>}<button className="primary-button" onClick={runAi} disabled={aiLoading || !aiInput.trim()}>{aiLoading ? <Loader2 className="spin" size={17}/> : <Sparkles size={17}/>} {aiLoading ? "Menganalisis…" : "Analisis requirement"}</button></footer>
    </section></div>}
  </div>;
}

createRoot(document.getElementById("root")).render(<App />);
