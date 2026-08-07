export const rupiah = value => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
}).format(Number(value) || 0);

export const segments = [
  { id: "personal", label: "Personal / Non-Profit", short: "Personal" },
  { id: "umkm", label: "UMKM / Event / Operasional", short: "UMKM & Ops" },
  { id: "enterprise", label: "Business / Enterprise", short: "Enterprise" }
];

const pack = (id, segment, solution, name, price, forWho, difference, options = {}) => ({
  id, segment, solution, name, price, forWho, difference,
  maxPrice: options.maxPrice, starting: options.starting ?? true,
  custom: options.custom || false, floor: options.floor || 0,
  included: options.included || []
});
const p = (id, solution, name, price, forWho, difference, options) => pack(id, "personal", solution, name, price, forWho, difference, options);
const u = (id, solution, name, price, forWho, difference, options = {}) => pack(id, "umkm", solution, name, price, forWho, difference, { floor: price >= 2000000 ? 2000000 : 0, ...options });
const e = (id, solution, name, price, forWho, difference, options = {}) => pack(id, "enterprise", solution, name, price, forWho, difference, { floor: solution === "Government" ? 5000000 : price >= 2000000 ? 2000000 : 0, ...options });

export const packages = [
  p("personal-basic","Personal Website","Personal Basic",299000,"CV dan portfolio singkat","Landing page tanpa CMS",{starting:false}),
  p("personal-standard","Personal Website","Personal Standard",499000,"Personal brand profesional","Multipage, SEO dan analytics dasar",{starting:false,included:["additional-page"]}),
  p("personal-cms","Personal Website","Personal Premium + CMS",799000,"Kelola konten sendiri","Dashboard dan beberapa tipe konten",{starting:false,included:["cms-content"]}),
  p("personal-blog","Personal Website","Personal Blog Pro",999000,"Blog atau publication personal","Workflow artikel, kategori, pencarian dan SEO",{included:["cms-content"]}),
  p("wedding-basic","Wedding","Wedding Basic",149000,"Undangan digital sederhana","Informasi acara, maps, galeri dan musik",{starting:false,maxPrice:249000}),
  p("wedding-premium","Wedding","Wedding Premium",349000,"Undangan interaktif","Nama tamu, RSVP, gift dan video",{starting:false,maxPrice:499000}),
  p("wedding-rsvp","Wedding","Wedding RSVP",699000,"Database tamu","RSVP tersimpan dan guest management"),
  p("wedding-qr","Wedding","Wedding QR Management",999000,"Check-in digital","QR unik, scanner dan dashboard kehadiran",{included:["qr-scanner"]}),
  p("wedding-pro","Wedding","Wedding Pro",1499000,"Wedding besar","Kategori/pax, bulk import dan multi-scanner",{included:["qr-scanner","data-migration"]}),
  p("institutional-landing","Institutional","Institutional Landing",499000,"Campaign atau program","Satu landing page tanpa CMS",{starting:false}),
  p("institutional-profile","Institutional","Institutional Profile",749000,"Profil lembaga","5–7 halaman, domain dan SEO",{starting:false,included:["additional-page"]}),
  p("institutional-cms","Institutional","Institutional CMS",999000,"Lembaga yang rutin update","Berita, program dan galeri via dashboard",{starting:false,included:["cms-content"]}),
  p("institutional-pro","Institutional","Institutional Pro",1499000,"Lembaga aktif","Event, dokumen, form dan search/filter",{included:["cms-content"]}),

  u("umkm-basic","UMKM Website","UMKM Basic",499000,"Usaha mikro","Landing page tanpa dashboard",{starting:false}),
  u("umkm-standard","UMKM Website","UMKM Standard",749000,"Usaha yang ingin tampil proper","Multipage company profile",{starting:false,included:["additional-page"]}),
  u("umkm-cms","UMKM Website","UMKM Premium + CMS",999000,"Update produk dan konten","CMS dan admin dashboard",{starting:false,included:["cms-content"]}),
  u("business-lite","Business System","UMKM Business Lite",2250000,"Mulai mengelola lead","Website dan database lead/customer"),
  u("business","Business System","UMKM Business",2990000,"Mengelola order","Customer, order, invoice dan status"),
  u("business-pro","Business System","UMKM Business Pro",3990000,"Workflow aktif","Multi-admin, notifikasi, dokumen dan laporan"),
  u("business-operational","Business System","UMKM Operational",4990000,"Sistem kerja internal","Staff, transaksi, workflow, role dan laporan"),
  u("event-landing","Event","Event Landing",749000,"Event informasi","Agenda, speaker, venue, sponsor dan CTA"),
  u("event-cms","Event","Event + CMS",999000,"Event yang sering update","Konten event dikelola dari dashboard",{included:["cms-content"]}),
  u("event-registration","Event","Event Registration",1499000,"Pendaftaran online","Database peserta, export dan konfirmasi"),
  u("event-qr","Event","Event Registration + QR",2499000,"Check-in peserta","QR unik, scanner dan attendance dashboard",{included:["qr-scanner"]}),
  u("event-ticketing","Event","Event Ticketing + QRIS",3499000,"Event berbayar","Ticket, quota, QRIS dan payment lifecycle",{included:["payment-gateway","qr-scanner"]}),
  u("institutional-ops-lite","Institutional Operations","Institutional Operational Lite",2500000,"Satu workflow operasional","Database, dashboard dan satu modul utama"),
  u("institutional-ops-standard","Institutional Operations","Institutional Operational Standard",3500000,"Beberapa modul operasional","Workflow terintegrasi dan basic reporting"),
  u("institutional-ops-pro","Institutional Operations","Institutional Operational Pro",5000000,"Workflow dan role kompleks","Multi-role, approval, notifikasi dan laporan",{included:["extra-role","approval-workflow"]}),
  u("ecommerce-starter","E-Commerce","E-Commerce Starter",2499000,"Toko online tanpa payment otomatis","Storefront, cart, checkout dan order admin"),
  u("ecommerce-payment","E-Commerce","E-Commerce Payment",3499000,"Checkout dengan QRIS","Payment status, webhook dan invoice",{included:["payment-gateway"]}),
  u("ecommerce-business","E-Commerce","E-Commerce Business",4999000,"Commerce operation","Inventory, promo, customer, shipping dan laporan",{included:["shipping-integration"]}),
  u("ecommerce-advanced","E-Commerce","E-Commerce Advanced",7500000,"Retail yang berkembang","Role, stock movement, return dan integrasi"),
  u("pos-lite","POS","POS Lite",2250000,"Satu outlet","Kasir, produk, stok dasar dan transaksi"),
  u("pos-business","POS","POS Business",3500000,"Retail atau F&B aktif","Inventory, supplier, purchase dan expense"),
  u("pos-pro","POS","POS Pro",5000000,"Operasi advanced","Multi-cashier, role, stock movement dan QRIS",{included:["payment-gateway","extra-role"]}),
  u("booking-basic","Booking","Booking Basic",1500000,"Reservasi sederhana","Form, availability dasar dan status"),
  u("booking-business","Booking","Booking Business",2500000,"Calendar/capacity/payment","Time slot, customer dan notifikasi"),
  u("booking-pro","Booking","Booking Pro",4000000,"Multi-resource atau staff","Alokasi resource, rule dan laporan"),
  u("crm-lite","CRM","CRM Lite",2500000,"Pipeline sederhana","Lead, customer, status, notes dan dashboard"),
  u("crm-business","CRM","CRM Business",4000000,"Sales team","Assignment, follow-up, quotation dan activity"),
  u("crm-pro","CRM","CRM Pro",6000000,"Custom workflow","Automation, approval, integrasi dan advanced report"),

  e("corporate-website","Corporate","Corporate Website",2500000,"Company profile corporate","CMS, service, portfolio, team dan news"),
  e("corporate-professional","Corporate","Corporate Professional",3500000,"Corporate content lengkap","Careers dan struktur konten lebih proper"),
  e("corporate-business","Corporate","Corporate Business",5000000,"Corporate dengan fungsi bisnis","Lead, request, dokumen dan quotation"),
  e("ops-lite","Operational System","Operational Lite",5000000,"1–2 workflow internal","Database, role, tracking dan basic report"),
  e("ops-standard","Operational System","Operational Standard",7500000,"3–5 modul","Workflow, dokumen, notifikasi dan transaksi"),
  e("ops-pro","Operational System","Operational Pro",10000000,"Sistem lintas proses","Approval, finance record, audit dan laporan detail"),
  e("government-website","Government","Government Website",5000000,"Portal informasi instansi","CMS, berita, agenda, dokumen dan PPID dasar"),
  e("government-professional","Government","Government Professional",7500000,"Info publik lebih lengkap","Multi-admin, form dan document management"),
  e("public-service","Government","Digital Public Service",10000000,"Layanan publik digital","Submission, tracking dan staff workflow"),
  e("government-integrated","Government","Government Integrated",15000000,"Layanan terintegrasi","Multi-service, role, audit dan integration"),
  e("clinic-website","Healthcare","Clinic Website",2500000,"Profil klinik","Dokter, layanan, jadwal, artikel dan CMS"),
  e("clinic-booking","Healthcare","Clinic Booking",3500000,"Appointment","Doctor schedule, booking dan patient contact DB"),
  e("clinic-management","Healthcare","Clinic Management Lite",7500000,"Operasional klinik ringan","Patient, visit, billing, stock, role dan report"),
  e("healthcare-system","Healthcare","Healthcare System",15000000,"Multi-workflow healthcare","Advanced role, workflow, integration dan security"),
  e("hospital","Healthcare","Hospital / Enterprise",0,"Rumah sakit","Discovery, security review dan SLA wajib",{custom:true}),
  e("custom-software","ERP / SaaS / Custom","Custom Business Software",5000000,"Aplikasi custom terbatas","Workflow, database dan dashboard sesuai scope"),
  e("erp-lite","ERP / SaaS / Custom","ERP Lite",10000000,"3–5 modul","Master data, role, approval dan reporting",{floor:10000000}),
  e("erp-business","ERP / SaaS / Custom","ERP Business",15000000,"5+ modul/proses","Cross-module workflow dan integration",{floor:10000000}),
  e("saas","ERP / SaaS / Custom","SaaS Platform",12500000,"Multi-account product","Tenant, subscription, dashboard dan super admin",{floor:10000000}),
  e("marketplace","ERP / SaaS / Custom","Marketplace",15000000,"Multi-vendor platform","Vendor, catalog, order dan commission flow",{floor:10000000}),
  e("enterprise-platform","ERP / SaaS / Custom","Enterprise Platform",25000000,"Mission critical","Multi-branch, audit, SLA, API dan security",{floor:10000000})
];

export const packagePriceLabel = item => item.custom ? "Custom Quotation" : item.maxPrice
  ? `${rupiah(item.price)} – ${rupiah(item.maxPrice)}`
  : `${item.starting ? "Mulai " : ""}${rupiah(item.price)}`;

const website = ["Personal Website","Institutional","UMKM Website","Corporate","Government","Healthcare"];
const systems = ["Business System","Institutional Operations","E-Commerce","POS","Booking","CRM","Operational System","Government","Healthcare","ERP / SaaS / Custom"];
export const modules = [
  { id:"additional-page",name:"Additional Page",group:"Website & CMS",price:100000,maxPrice:250000,solutions:website,description:"Halaman normal; halaman kompleks diestimasi terpisah." },
  { id:"cms-content",name:"Extra CMS Content Type",group:"Website & CMS",price:250000,maxPrice:500000,solutions:website,description:"Schema, CRUD, validation dan media." },
  { id:"extra-role",name:"Additional Role / Permission",group:"System",price:300000,maxPrice:750000,solutions:systems,description:"Role matrix dan restriction tambahan." },
  { id:"approval-workflow",name:"Approval Workflow",group:"System",price:500000,maxPrice:1500000,solutions:systems,description:"Multi-step approval, status dan history." },
  { id:"payment-gateway",name:"Payment Gateway",group:"Integration",price:750000,maxPrice:1500000,solutions:["E-Commerce","Event","POS","Booking","Business System","ERP / SaaS / Custom"],description:"Integration, webhook dan testing. Provider fee terpisah." },
  { id:"whatsapp-api",name:"WhatsApp / API Integration",group:"Integration",price:500000,maxPrice:1500000,solutions:systems,description:"Otomasi via provider; subscription terpisah." },
  { id:"shipping-integration",name:"Shipping Integration",group:"Integration",price:750000,maxPrice:1500000,solutions:["E-Commerce","ERP / SaaS / Custom"],description:"Rate, AWB dan tracking sesuai provider." },
  { id:"qr-scanner",name:"QR + Scanner",group:"Integration",price:500000,maxPrice:1000000,solutions:["Wedding","Event","Institutional Operations","Business System","Operational System"],description:"QR identity, scan dan check-in." },
  { id:"advanced-report",name:"Advanced Report / Export",group:"Reporting",price:300000,maxPrice:1000000,solutions:systems,description:"Aggregation, filter, PDF/Excel atau export kompleks." },
  { id:"multi-branch",name:"Multi-Branch / Outlet",group:"Advanced",price:1000000,solutions:["Business System","E-Commerce","POS","CRM","Operational System","Government","Healthcare","ERP / SaaS / Custom"],description:"Pemisahan cabang, role dan reporting." },
  { id:"external-api",name:"External API / Custom Integration",group:"Integration",price:500000,solutions:systems,description:"Harga awal; final mengikuti API dan testing effort." },
  { id:"data-migration",name:"Data Migration / Import",group:"Data",price:500000,solutions:systems,description:"Harga awal; final mengikuti volume, cleaning dan mapping." }
];

export const domainPlans = [
  {id:"included",name:"Sudah termasuk / domain existing",price:0,note:"Tidak menambah biaya provider"},
  {id:"com",name:".com",price:209900,note:"IDwebhost · estimasi normal 1 tahun"},
  {id:"id",name:".id",price:249900,note:"IDwebhost · 1 tahun"},
  {id:"coid",name:".co.id",price:270000,note:"IDwebhost · syarat dokumen berlaku"},
  {id:"orid",name:".or.id",price:54900,note:"IDwebhost · syarat dokumen berlaku"},
  {id:"schid",name:".sch.id",price:56060,note:"IDwebhost · syarat dokumen berlaku"},
  {id:"myid",name:".my.id",price:11000,note:"IDwebhost · 1 tahun"},
  {id:"site",name:".site",price:337570,note:"IDwebhost · 1 tahun"},
  {id:"cloud",name:".cloud",price:319240,note:"IDwebhost · 1 tahun"},
  {id:"me",name:".me",price:582370,note:"IDwebhost · 1 tahun"}
];

export const serverPlans = [
  {id:"included",name:"Hosting standard included / existing",monthly:0,specs:"Sesuai ketentuan paket"},
  {id:"2-40",name:"SumoPod Cloud 2GB / 40GB",monthly:60000,specs:"2 vCPU · 2GB RAM · 40GB SSD"},
  {id:"2-50",name:"SumoPod Cloud 2GB / 50GB",monthly:75000,specs:"2 vCPU · 2GB RAM · 50GB SSD"},
  {id:"4-60",name:"SumoPod Cloud 4GB / 60GB",monthly:90000,specs:"2 vCPU · 4GB RAM · 60GB SSD"},
  {id:"4-70",name:"SumoPod Cloud 4GB / 70GB",monthly:125000,specs:"2 vCPU · 4GB RAM · 70GB SSD"}
];
