export const rupiah = value => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
}).format(value || 0);

export const segments = [
  { id: "personal", label: "Personal / Non-Profit", short: "Personal" },
  { id: "umkm", label: "UMKM / Event / Operational", short: "UMKM & Ops" },
  { id: "enterprise", label: "Business / Enterprise", short: "Enterprise" }
];

const pack = (id, segment, solution, name, price, options = {}) => ({
  id, segment, solution, name, price,
  floor: options.custom ? 0 : Math.round((options.floor ?? price * .9) / 1000) * 1000,
  maxPrice: options.maxPrice,
  starting: options.starting || false,
  plus: options.plus || false,
  custom: options.custom || false,
  complexity: options.complexity || 5,
  warranty: options.warranty || "Sesuai scope",
  features: options.features || []
});

export const packages = [
  // 1. Personal / Non-Profit — Website Personal
  pack("personal-basic", "personal", "Website Personal", "Personal Basic", 249000, { complexity: 3, warranty: "1 bulan", features: ["landing", "seo", "hosting", "subdomain"] }),
  pack("personal-standard", "personal", "Website Personal", "Personal Standard", 299000, { complexity: 5, warranty: "5 bulan", features: ["landing", "seo", "maps", "hosting", "subdomain"] }),
  pack("personal-premium", "personal", "Website Personal", "Personal Premium + CMS", 499000, { complexity: 8, warranty: "1 tahun", features: ["landing", "cms", "admin", "seo", "analytics", "hosting", "domain"] }),

  // Personal Blog
  pack("personal-blog-starter", "personal", "Personal Blog", "Personal Blog Starter", 548000, { complexity: 8, warranty: "5 bulan", features: ["landing", "cms", "admin", "blog", "seo", "hosting", "domain"] }),
  pack("personal-blog-plus", "personal", "Personal Blog", "Personal Blog Plus", 699000, { maxPrice: 899000, complexity: 11, warranty: "5 bulan", features: ["cms", "admin", "blog", "search", "gallery", "portfolio", "analytics", "seo", "hosting", "domain"] }),

  // Wedding / Undangan Digital
  pack("wedding-basic", "personal", "Wedding", "Wedding Basic", 99000, { maxPrice: 199000, complexity: 3, warranty: "1 bulan", features: ["landing", "gallery", "maps", "hosting", "subdomain"] }),
  pack("wedding-premium", "personal", "Wedding", "Wedding Premium", 249000, { maxPrice: 399000, complexity: 7, warranty: "1 bulan", features: ["landing", "gallery", "maps", "rsvp", "guest-name", "gift", "hosting", "subdomain"] }),
  pack("wedding-qr", "personal", "Wedding", "Wedding QR", 599000, { complexity: 13, warranty: "1 bulan", features: ["landing", "rsvp", "database", "qr-generator", "qr-scanner", "attendance", "admin", "hosting", "domain"] }),
  pack("wedding-pro", "personal", "Wedding", "Wedding Pro", 899000, { complexity: 18, warranty: "1 bulan", features: ["landing", "rsvp", "database", "qr-generator", "qr-scanner", "attendance", "admin", "multi-admin", "export", "dashboard", "hosting", "domain"] }),

  // Komunitas / Yayasan / Institusi
  pack("institutional-landing", "personal", "Institusi", "Institutional Landing", 299000, { complexity: 4, warranty: "1 bulan", features: ["landing", "gallery", "maps", "hosting", "subdomain"] }),
  pack("institutional-profile", "personal", "Institusi", "Institutional Profile", 499000, { complexity: 7, warranty: "5 bulan", features: ["landing", "gallery", "seo", "analytics", "hosting", "domain"] }),
  pack("institutional-cms", "personal", "Institusi", "Institutional CMS", 749000, { complexity: 11, warranty: "5 bulan", features: ["landing", "cms", "admin", "blog", "gallery", "analytics", "hosting", "domain"] }),
  pack("institutional-pro", "personal", "Institusi", "Institutional Pro", 999000, { complexity: 15, warranty: "5 bulan", features: ["landing", "cms", "admin", "blog", "gallery", "event", "document", "form", "search", "hosting", "domain"] }),

  // 2. UMKM — Website UMKM
  pack("umkm-basic", "umkm", "Website UMKM", "UMKM Basic", 249000, { complexity: 3, warranty: "1 bulan", features: ["landing", "maps", "hosting", "subdomain"] }),
  pack("umkm-standard", "umkm", "Website UMKM", "UMKM Standard", 299000, { complexity: 5, warranty: "5 bulan", features: ["landing", "gallery", "maps", "seo", "hosting", "subdomain"] }),
  pack("umkm-premium", "umkm", "Website UMKM", "UMKM Premium + CMS", 499000, { complexity: 8, warranty: "5 bulan", features: ["landing", "cms", "admin", "product", "gallery", "analytics", "hosting", "domain"] }),

  // Sistem Bisnis UMKM
  pack("business-lite", "umkm", "Sistem Bisnis UMKM", "UMKM Business Lite", 999000, { complexity: 13, warranty: "3 bulan", features: ["landing", "cms", "admin", "product", "lead", "form", "report", "hosting", "domain"] }),
  pack("umkm-business", "umkm", "Sistem Bisnis UMKM", "UMKM Business", 1499000, { complexity: 18, warranty: "3 bulan", features: ["cms", "admin", "database", "customer", "order", "invoice", "status", "report", "hosting", "domain"] }),
  pack("umkm-business-pro", "umkm", "Sistem Bisnis UMKM", "UMKM Business Pro", 1999000, { complexity: 23, warranty: "3 bulan", features: ["cms", "admin", "database", "customer", "booking", "order", "workflow", "notification", "multi-admin", "report", "hosting", "domain"] }),
  pack("umkm-operational", "umkm", "Sistem Bisnis UMKM", "UMKM Operational", 2499000, { starting: true, plus: true, complexity: 29, warranty: "4 bulan", features: ["cms", "admin", "staff", "customer", "transaction", "document", "workflow", "report", "dashboard", "hosting", "domain"] }),

  // Event
  pack("event-landing", "umkm", "Event", "Event Landing", 499000, { complexity: 7, warranty: "1 bulan", features: ["landing", "event", "maps", "gallery", "hosting", "domain"] }),
  pack("event-cms", "umkm", "Event", "Event + CMS", 749000, { complexity: 11, warranty: "3 bulan", features: ["landing", "event", "cms", "admin", "gallery", "blog", "hosting", "domain"] }),
  pack("event-registration", "umkm", "Event", "Event Registration", 1299000, { complexity: 18, warranty: "3 bulan", features: ["landing", "cms", "form", "database", "admin", "status", "export", "email", "hosting", "domain"] }),
  pack("event-qr", "umkm", "Event", "Event Registration + QR", 1799000, { complexity: 24, warranty: "3 bulan", features: ["landing", "cms", "form", "database", "admin", "status", "export", "email", "qr-generator", "qr-scanner", "attendance", "dashboard", "hosting", "domain"] }),
  pack("event-ticketing-qris", "umkm", "Event", "Event Ticketing + QRIS", 2499000, { starting: true, plus: true, complexity: 33, warranty: "4 bulan", features: ["landing", "cms", "database", "order", "checkout", "qris", "qr-generator", "qr-scanner", "admin", "dashboard", "hosting", "domain"] }),

  // Institusi Operasional
  pack("operational-lite", "umkm", "Institusi Operasional", "Institutional Operational Lite", 1499000, { complexity: 18, warranty: "3 bulan", features: ["cms", "database", "admin", "search", "status", "export", "hosting", "domain"] }),
  pack("operational-standard", "umkm", "Institusi Operasional", "Institutional Operational Standard", 2499000, { complexity: 28, warranty: "4 bulan", features: ["cms", "database", "admin", "search", "status", "export", "dashboard", "report", "document", "hosting", "domain"] }),
  pack("operational-pro", "umkm", "Institusi Operasional", "Institutional Operational Pro", 3499000, { starting: true, plus: true, complexity: 38, warranty: "6 bulan", features: ["cms", "database", "admin", "search", "status", "export", "dashboard", "report", "document", "multi-role", "approval", "notification", "hosting", "domain"] }),

  // E-Commerce
  pack("ecommerce-basic", "umkm", "E-Commerce", "E-Commerce Basic", 2499000, { complexity: 27, warranty: "4 bulan", features: ["storefront", "cms", "product", "search", "cart", "checkout", "inventory", "order", "customer", "admin", "hosting", "domain"] }),
  pack("ecommerce-qris", "umkm", "E-Commerce", "E-Commerce QRIS", 2999000, { complexity: 33, warranty: "4 bulan", features: ["storefront", "cms", "product", "search", "cart", "checkout", "inventory", "order", "customer", "admin", "qris", "invoice", "hosting", "domain"] }),
  pack("ecommerce-pro", "umkm", "E-Commerce", "E-Commerce Pro", 3499000, { starting: true, plus: true, complexity: 39, warranty: "5 bulan", features: ["storefront", "cms", "product", "search", "cart", "checkout", "inventory", "order", "customer", "admin", "qris", "invoice", "voucher", "report", "shipping", "notification", "hosting", "domain"] }),

  // POS
  pack("pos-lite", "umkm", "POS", "POS Lite", 1999000, { complexity: 23, warranty: "3 bulan", features: ["product", "inventory", "cashier", "transaction", "receipt", "report", "admin", "hosting", "domain"] }),
  pack("pos-business", "umkm", "POS", "POS Business", 2999000, { complexity: 32, warranty: "4 bulan", features: ["product", "inventory", "cashier", "transaction", "receipt", "customer", "supplier", "purchase", "expense", "staff", "report", "admin", "hosting", "domain"] }),
  pack("pos-pro", "umkm", "POS", "POS Pro", 3999000, { starting: true, plus: true, complexity: 42, warranty: "5 bulan", features: ["product", "inventory", "cashier", "transaction", "receipt", "customer", "supplier", "purchase", "expense", "multi-role", "qris", "report", "audit", "admin", "hosting", "domain"] }),

  // Booking
  pack("booking-basic", "umkm", "Booking", "Booking Basic", 999000, { maxPrice: 1499000, complexity: 15, warranty: "3 bulan", features: ["booking", "availability", "database", "admin", "status", "hosting", "domain"] }),
  pack("booking-business", "umkm", "Booking", "Booking Business", 1999000, { starting: true, plus: true, complexity: 25, warranty: "4 bulan", features: ["booking", "calendar", "timeslot", "capacity", "customer", "notification", "qris", "admin", "hosting", "domain"] }),

  // CRM
  pack("crm-lite", "umkm", "CRM", "CRM Lite", 1999000, { complexity: 23, warranty: "3 bulan", features: ["lead", "customer", "pipeline", "notes", "dashboard", "report", "admin", "hosting", "domain"] }),
  pack("crm-business", "umkm", "CRM", "CRM Business", 2999000, { starting: true, plus: true, complexity: 33, warranty: "4 bulan", features: ["lead", "customer", "pipeline", "assignment", "followup", "quotation", "multi-role", "report", "dashboard", "admin", "hosting", "domain"] }),

  // 3. Business / Enterprise — Website Corporate
  pack("company-cms", "enterprise", "Website Corporate", "Company Profile CMS", 1299000, { complexity: 15, warranty: "5 bulan", features: ["landing", "cms", "portfolio", "team", "blog", "analytics", "hosting", "domain"] }),
  pack("corporate-pro", "enterprise", "Website Corporate", "Corporate Professional", 1799000, { complexity: 20, warranty: "5 bulan", features: ["landing", "cms", "portfolio", "team", "blog", "careers", "form", "admin", "hosting", "domain"] }),
  pack("corporate-business", "enterprise", "Website Corporate", "Corporate Business", 2499000, { starting: true, plus: true, complexity: 28, warranty: "5 bulan", features: ["landing", "cms", "lead", "customer", "document", "quotation", "report", "admin", "hosting", "domain"] }),

  // Operational / CRM / Internal System
  pack("enterprise-operational-lite", "enterprise", "Operational / CRM", "Operational Lite", 2499000, { complexity: 27, warranty: "4 bulan", features: ["database", "admin", "multi-role", "status", "workflow", "report", "hosting", "domain"] }),
  pack("enterprise-operational-standard", "enterprise", "Operational / CRM", "Operational Standard", 3499000, { complexity: 36, warranty: "5 bulan", features: ["database", "admin", "multi-role", "customer", "staff", "transaction", "document", "workflow", "notification", "report", "hosting", "domain"] }),
  pack("enterprise-operational", "enterprise", "Operational / CRM", "Operational Pro", 4999000, { starting: true, plus: true, complexity: 46, warranty: "6 bulan", features: ["database", "admin", "multi-role", "approval", "finance", "document", "notification", "report", "audit", "hosting", "domain"] }),
  pack("crm-pro", "enterprise", "Operational / CRM", "CRM Pro", 3999000, { starting: true, plus: true, complexity: 40, warranty: "6 bulan", features: ["lead", "customer", "pipeline", "assignment", "followup", "quotation", "multi-role", "automation", "report", "admin", "hosting", "domain"] }),

  // Government / Sektor Publik
  pack("government-cms", "enterprise", "Government", "Government Website + CMS", 1999000, { complexity: 22, warranty: "5 bulan", features: ["landing", "cms", "blog", "event", "document", "gallery", "admin", "hosting", "domain"] }),
  pack("government-professional", "enterprise", "Government", "Government Professional", 2999000, { complexity: 32, warranty: "5 bulan", features: ["landing", "cms", "blog", "event", "document", "form", "multi-role", "report", "admin", "hosting", "domain"] }),
  pack("public-service", "enterprise", "Government", "Public Service System", 3999000, { starting: true, plus: true, complexity: 43, warranty: "6 bulan", features: ["database", "form", "document", "tracking", "multi-role", "workflow", "notification", "report", "admin", "hosting", "domain"] }),

  // Healthcare
  pack("clinic-cms", "enterprise", "Healthcare", "Clinic Website + CMS", 1499000, { maxPrice: 1999000, complexity: 21, warranty: "5 bulan", features: ["landing", "cms", "doctor", "schedule", "blog", "gallery", "admin", "hosting", "domain"] }),
  pack("clinic-booking", "enterprise", "Healthcare", "Clinic + Booking", 2499000, { maxPrice: 2999000, complexity: 31, warranty: "5 bulan", features: ["cms", "doctor", "schedule", "booking", "patient", "database", "status", "notification", "admin", "hosting", "domain"] }),
  pack("clinic-management", "enterprise", "Healthcare", "Clinic Management Lite", 5999000, { starting: true, plus: true, complexity: 54, warranty: "6 bulan", features: ["patient", "doctor", "visit", "billing", "inventory", "multi-role", "report", "audit", "admin", "hosting", "domain"] }),
  pack("hospital-enterprise", "enterprise", "Healthcare", "Hospital / Healthcare Enterprise", 0, { custom: true, complexity: 80, warranty: "Custom SLA", features: ["patient", "doctor", "pharmacy", "lab", "billing", "integration", "multi-role", "audit", "security", "high-availability"] }),

  // ERP / SaaS / Marketplace / Enterprise
  pack("custom-software", "enterprise", "ERP / SaaS / Custom", "Custom Business Software", 4999000, { starting: true, plus: true, complexity: 48, warranty: "6 bulan", features: ["database", "admin", "multi-role", "workflow", "report", "integration", "hosting", "domain"] }),
  pack("erp-lite", "enterprise", "ERP / SaaS / Custom", "ERP Lite", 5999000, { maxPrice: 7999000, plus: true, complexity: 58, warranty: "6 bulan", features: ["database", "admin", "multi-role", "approval", "sales", "inventory", "purchase", "finance", "report", "audit", "hosting", "domain"] }),
  pack("saas-marketplace", "enterprise", "ERP / SaaS / Custom", "SaaS / Marketplace / Multi-Tenant", 7999000, { starting: true, plus: true, complexity: 68, warranty: "Custom", features: ["database", "multi-user", "authentication", "tenant", "vendor", "subscription", "qris", "dashboard", "admin", "integration"] }),
  pack("enterprise-system", "enterprise", "ERP / SaaS / Custom", "Enterprise System", 0, { custom: true, complexity: 90, warranty: "Custom SLA", features: ["multi-branch", "multi-role", "approval", "security", "audit", "integration", "monitoring", "documentation", "training", "sla"] })
];

export const packagePriceLabel = item => {
  if (item.custom) return "Custom Quotation";
  if (item.maxPrice) return `${rupiah(item.price)} – ${rupiah(item.maxPrice)}${item.plus ? "+" : ""}`;
  return `${item.starting ? "Mulai " : ""}${rupiah(item.price)}${item.plus ? "+" : ""}`;
};

export const modules = [
  { id: "cms", group: "Website & Content", name: "CMS Content", price: 249000, points: 3, description: "Kelola konten dari dashboard." },
  { id: "blog", group: "Website & Content", name: "Berita / Artikel", price: 100000, points: 2, description: "Draft, publish, dan SEO artikel.", requires: ["cms"] },
  { id: "gallery", group: "Website & Content", name: "Galeri Dinamis", price: 75000, points: 1, description: "Upload dan kelola galeri.", requires: ["cms"] },
  { id: "form", group: "Data & Users", name: "Form ke Database", price: 200000, points: 3, description: "Submission tersimpan di dashboard.", requires: ["database"] },
  { id: "database", group: "Data & Users", name: "Database Utama", price: 300000, points: 3, description: "Master data customer, siswa, atau staff." },
  { id: "student", group: "Data & Users", name: "Data Siswa", price: 300000, points: 3, description: "Profil dan administrasi data siswa.", requires: ["database"] },
  { id: "login", group: "Data & Users", name: "User Login", price: 250000, points: 3, description: "Autentikasi user yang aman.", requires: ["database"] },
  { id: "multi-role", group: "Data & Users", name: "Advanced Roles", price: 400000, points: 5, description: "Permission matrix untuk 4–6 role.", requires: ["login"] },
  { id: "parent-portal", group: "Data & Users", name: "Parent Portal", price: 300000, points: 5, description: "Akses wali ke data siswa.", requires: ["student", "multi-role"] },
  { id: "booking", group: "Operations", name: "Booking", price: 300000, points: 3, description: "Jadwal, availability, dan status.", requires: ["database"] },
  { id: "attendance", group: "Operations", name: "Absensi", price: 400000, points: 3, description: "Kehadiran dan rekap data.", requires: ["database"] },
  { id: "violation", group: "Operations", name: "Pelanggaran", price: 400000, points: 3, description: "Pencatatan pelanggaran siswa.", requires: ["student"] },
  { id: "point-system", group: "Operations", name: "Automatic Point Workflow", price: 250000, points: 5, description: "Perhitungan poin dan aturan otomatis.", requires: ["violation"] },
  { id: "order", group: "Operations", name: "Order Management", price: 300000, points: 3, description: "Order, status, dan riwayat.", requires: ["database"] },
  { id: "inventory", group: "Operations", name: "Basic Inventory", price: 400000, points: 5, description: "Stok dan pergerakan barang.", requires: ["database"] },
  { id: "approval", group: "Operations", name: "Approval Workflow", price: 350000, points: 5, description: "Approval bertingkat dan status.", requires: ["multi-role"] },
  { id: "qris", group: "Integration", name: "QRIS Integration", price: 450000, points: 5, description: "Payment status dan webhook.", requires: ["order"], external: "MDR/provider fee dibayar client" },
  { id: "wa-template", group: "Communication", name: "WhatsApp Template", price: 100000, points: 2, description: "Pesan siap kirim via WhatsApp." },
  { id: "wa-api", group: "Communication", name: "WhatsApp API", price: 600000, points: 5, description: "Otomasi notifikasi dan history.", external: "Provider/subscription dibayar client" },
  { id: "email", group: "Communication", name: "Email Notification", price: 200000, points: 3, description: "Notifikasi status via email.", external: "Kuota provider mengikuti pemakaian" },
  { id: "notification", group: "Communication", name: "In-App Notification", price: 200000, points: 3, description: "Pusat notifikasi di dashboard.", requires: ["login"] },
  { id: "report", group: "Reporting", name: "Advanced Reporting", price: 300000, points: 5, description: "Laporan PDF dan Excel." },
  { id: "dashboard", group: "Reporting", name: "Dashboard Analytics", price: 250000, points: 3, description: "Metric dan visual summary." },
  { id: "export", group: "Reporting", name: "Export Excel / CSV", price: 100000, points: 2, description: "Download data operasional." },
  { id: "audit", group: "Advanced", name: "Audit Log", price: 300000, points: 3, description: "Riwayat aksi dan perubahan data.", requires: ["login"] },
  { id: "document", group: "Advanced", name: "Document Upload", price: 200000, points: 3, description: "Upload dan kelola dokumen.", external: "Storage berlebih dihitung terpisah" },
  { id: "qr-generator", group: "Advanced", name: "QR Generator", price: 150000, points: 2, description: "Generate QR unik." },
  { id: "qr-scanner", group: "Advanced", name: "QR Scanner", price: 250000, points: 3, description: "Scan dan validasi QR.", requires: ["qr-generator"] },
  { id: "qr-attendance", group: "Advanced", name: "QR Attendance", price: 350000, points: 5, description: "QR unik, scanner, dan status hadir.", requires: ["attendance", "qr-generator", "qr-scanner"] }
];
