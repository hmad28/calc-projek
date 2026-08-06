export const segments = [
  { id: "personal", label: "Personal / Non-Profit", short: "Personal", description: "Portfolio, komunitas, wedding, dan profil institusi.", icon: "HeartHandshake" },
  { id: "umkm", label: "UMKM / Event / Operational", short: "UMKM & Ops", description: "Bisnis berkembang, event, transaksi, dan operasional.", icon: "Store" },
  { id: "enterprise", label: "Business / Enterprise", short: "Enterprise", description: "Corporate, CRM, ERP, healthcare, dan custom software.", icon: "Building2" }
];

export const packages = [
  { id: "personal-basic", segment: "personal", solution: "Website", name: "Personal Basic", price: 249000, floor: 225000, complexity: 3, warranty: "1 bulan", features: ["landing", "seo", "hosting", "subdomain"] },
  { id: "personal-standard", segment: "personal", solution: "Website", name: "Personal Standard", price: 299000, floor: 270000, complexity: 5, warranty: "5 bulan", features: ["landing", "seo", "hosting", "subdomain", "maps"] },
  { id: "personal-premium", segment: "personal", solution: "CMS", name: "Personal Premium + CMS", price: 499000, floor: 450000, complexity: 8, warranty: "1 tahun", features: ["landing", "cms", "admin", "seo", "analytics", "hosting", "domain"] },
  { id: "institutional-cms", segment: "personal", solution: "CMS", name: "Institutional CMS", price: 749000, floor: 675000, complexity: 10, warranty: "5 bulan", features: ["landing", "cms", "admin", "blog", "gallery", "analytics", "hosting", "domain"] },
  { id: "institutional-pro", segment: "personal", solution: "Operational", name: "Institutional Pro", price: 999000, floor: 900000, complexity: 14, warranty: "5 bulan", features: ["landing", "cms", "admin", "blog", "gallery", "event", "document", "form", "search", "hosting", "domain"] },
  { id: "wedding-qr", segment: "personal", solution: "Event", name: "Wedding QR", price: 599000, floor: 540000, complexity: 12, warranty: "1 bulan", features: ["landing", "rsvp", "guest-db", "qr-generator", "qr-scanner", "admin", "hosting", "domain"] },

  { id: "umkm-premium", segment: "umkm", solution: "Website", name: "UMKM Premium + CMS", price: 499000, floor: 450000, complexity: 8, warranty: "5 bulan", features: ["landing", "cms", "admin", "product", "gallery", "analytics", "hosting", "domain"] },
  { id: "business-lite", segment: "umkm", solution: "Operational", name: "UMKM Business Lite", price: 999000, floor: 900000, complexity: 13, warranty: "3 bulan", features: ["landing", "cms", "admin", "product", "lead", "form", "report", "hosting", "domain"] },
  { id: "event-registration", segment: "umkm", solution: "Event", name: "Event Registration", price: 1299000, floor: 1170000, complexity: 17, warranty: "3 bulan", features: ["landing", "cms", "registration", "participant-db", "admin", "status", "export", "email", "hosting", "domain"] },
  { id: "event-qr", segment: "umkm", solution: "Event", name: "Event Registration + QR", price: 1799000, floor: 1620000, complexity: 22, warranty: "3 bulan", features: ["landing", "cms", "registration", "participant-db", "admin", "status", "export", "email", "qr-generator", "qr-scanner", "attendance", "hosting", "domain"] },
  { id: "operational-lite", segment: "umkm", solution: "Operational", name: "Institutional Operational Lite", price: 1499000, floor: 1350000, complexity: 18, warranty: "3 bulan", features: ["cms", "database", "admin", "search", "status", "export", "hosting", "domain"] },
  { id: "operational-standard", segment: "umkm", solution: "Operational", name: "Institutional Operational Standard", price: 2499000, floor: 2250000, complexity: 28, warranty: "4 bulan", features: ["cms", "database", "admin", "search", "status", "export", "dashboard", "report", "document", "hosting", "domain"] },
  { id: "operational-pro", segment: "umkm", solution: "Operational", name: "Institutional Operational Pro", price: 3499000, floor: 3150000, complexity: 38, warranty: "6 bulan", features: ["cms", "database", "admin", "search", "status", "export", "dashboard", "report", "document", "multi-role", "approval", "notification", "hosting", "domain"] },
  { id: "ecommerce-basic", segment: "umkm", solution: "E-Commerce", name: "E-Commerce Basic", price: 2499000, floor: 2250000, complexity: 27, warranty: "4 bulan", features: ["storefront", "cms", "product", "search", "cart", "checkout", "inventory", "order", "customer", "admin", "hosting", "domain"] },
  { id: "ecommerce-qris", segment: "umkm", solution: "E-Commerce", name: "E-Commerce QRIS", price: 2999000, floor: 2700000, complexity: 33, warranty: "4 bulan", features: ["storefront", "cms", "product", "search", "cart", "checkout", "inventory", "order", "customer", "admin", "qris", "invoice", "hosting", "domain"] },
  { id: "pos-lite", segment: "umkm", solution: "POS", name: "POS Lite", price: 1999000, floor: 1800000, complexity: 23, warranty: "3 bulan", features: ["product", "inventory", "cashier", "transaction", "receipt", "report", "admin", "hosting", "domain"] },
  { id: "crm-lite", segment: "umkm", solution: "CRM", name: "CRM Lite", price: 1999000, floor: 1800000, complexity: 23, warranty: "3 bulan", features: ["lead", "customer", "pipeline", "notes", "dashboard", "report", "admin", "hosting", "domain"] },
  { id: "booking-basic", segment: "umkm", solution: "Booking", name: "Booking Basic", price: 999000, floor: 900000, complexity: 15, warranty: "3 bulan", features: ["booking", "availability", "database", "admin", "status", "hosting", "domain"] },

  { id: "company-cms", segment: "enterprise", solution: "Website", name: "Company Profile CMS", price: 1299000, floor: 1100000, complexity: 15, warranty: "5 bulan", features: ["landing", "cms", "portfolio", "team", "blog", "analytics", "hosting", "domain"] },
  { id: "corporate-pro", segment: "enterprise", solution: "Website", name: "Corporate Professional", price: 1799000, floor: 1550000, complexity: 20, warranty: "5 bulan", features: ["landing", "cms", "portfolio", "team", "blog", "careers", "form", "admin", "hosting", "domain"] },
  { id: "enterprise-operational", segment: "enterprise", solution: "Operational", name: "Operational Pro", price: 4999000, floor: 4250000, complexity: 42, warranty: "6 bulan", features: ["database", "admin", "multi-role", "approval", "finance", "document", "notification", "report", "audit", "hosting", "domain"] },
  { id: "crm-pro", segment: "enterprise", solution: "CRM", name: "CRM Pro", price: 3999000, floor: 3400000, complexity: 38, warranty: "6 bulan", features: ["lead", "customer", "pipeline", "assignment", "followup", "quotation", "multi-role", "automation", "report", "admin", "hosting", "domain"] },
  { id: "clinic-management", segment: "enterprise", solution: "Healthcare", name: "Clinic Management Lite", price: 5999000, floor: 5250000, complexity: 52, warranty: "6 bulan", features: ["patient", "doctor", "visit", "billing", "inventory", "multi-role", "report", "audit", "admin", "hosting", "domain"] },
  { id: "custom-software", segment: "enterprise", solution: "Custom", name: "Custom Business Software", price: 4999000, floor: 4250000, complexity: 45, warranty: "6 bulan", features: ["database", "admin", "multi-role", "workflow", "report", "integration", "hosting", "domain"], starting: true },
  { id: "erp-lite", segment: "enterprise", solution: "ERP", name: "ERP Lite", price: 5999000, floor: 5250000, complexity: 55, warranty: "6 bulan", features: ["database", "admin", "multi-role", "approval", "sales", "inventory", "purchase", "finance", "report", "audit", "hosting", "domain"], starting: true }
];

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

export const industries = ["Education", "Retail & F&B", "Professional Service", "Event", "Non-Profit", "Government", "Healthcare", "Technology", "Other"];
export const solutions = ["Website", "CMS", "Operational", "Event", "E-Commerce", "POS", "Booking", "CRM", "Healthcare", "ERP", "Custom"];
export const complexityLabel = (score) => score <= 10 ? "Simple" : score <= 20 ? "Standard" : score <= 35 ? "Advanced" : score <= 50 ? "Complex" : "Custom / Enterprise";
export const rupiah = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);
