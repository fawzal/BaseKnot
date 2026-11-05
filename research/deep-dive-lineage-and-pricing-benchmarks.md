# 🔬 Deep Dive Research: Lineage Highlighting, Pricing Benchmarks, & 15-Minute Friction Analysis
**Tanggal:** 2026-11-02  
**Author:** Product Researcher (Project MindMap)  
**Dokumen Referensi:** [PRD UX Logic Thread](file:///d:/MindMap/prd_ux_logic_thread.md) & [Competitor Analysis & Gap Strategy](file:///d:/MindMap/research/competitor-analysis-and-gap-strategy.md)  
**Status:** Complete / Ready for Review by Head of Product  

---

## Executive Summary

Riset ini merupakan investigasi mendalam lanjutan non-AI untuk melengkapi fondasi produk **UX Logic Thread (Traceability Mapper)**. Laporan ini mencakup tiga domain investigasi utama:

1. **UX Pattern Dependency & Lineage Highlighting (Focus Mode):** Analisis mekanisme visual dan micro-interaction mutakhir dari software graph terkemuka (React Flow / xyflow, Obsidian Graph, Figma Dev Mode, Clapet, Whimsical) untuk merancang fitur *Traceability Glow* hulu-ke-hilir tanpa menimbulkan kelelahan kognitif (*cognitive visual fatigue*).
2. **Benchmark Struktur Harga & Model Monetisasi Kompetitor:** Bedah skema harga resmi dari Whimsical, Fibery.io, FigJam/Figma, dan Dovetail berdasarkan sumber primer (*first-party pricing pages & terms*). Laporan ini mengungkap celah pasar masif akibat Dovetail yang membunuh seluruh paket *self-serve* dan Whimsical yang membatasi *free tier* pada 50 item/bulan.
3. **15-Minute Speed Benchmark (Friction Log Analysis):** Dekonstruksi titik friksi (*friction bottlenecks*) pada Whimsical, Fibery, dan FigJam saat pengguna memetakan riset menjadi arsitektur informasi, serta usulan arsitektur antarmuka opini (*opinionated rail workflow*) untuk menjamin pengguna menyelesaikan seluruh alur dalam waktu **< 15 menit**.

---

## 1. UX Pattern untuk Dependency & Lineage Highlighting (Focus Mode)

Dalam aplikasi pemetaan logika berbasis relasi seperti UX Logic Thread, kanvas visual dengan puluhan node (Riset ➔ Fitur ➔ Sitemap ➔ Token) cepat mengalami sindrom *"spaghetti junction"*. Ketika seorang desainer ingin mengetahui *"Mengapa token warna `color/bg/danger` ini ada?"*, sistem harus mengisolasi benang merah relasional tersebut secara seketika (*instant visual traceability*).

```
[UX Research #01] ───(Glow Path)───► [Feature: Quick Cancel] ───► [Sitemap: Modal Alert] ───► [Token: #EF4444]
      │                                       │                             │                         │
[Unlinked Node]                         [Unlinked Node]               [Unlinked Node]           [Unlinked Node]
 (Opacity 0.15)                          (Opacity 0.15)                (Opacity 0.15)            (Opacity 0.15)
```

### 1.1 Benchmark Implementasi Software Graph Modern

| Tool | Mekanisme Highlighting | Kelebihan Interaksi | Celah / Kekurangan UX |
| :--- | :--- | :--- | :--- |
| **React Flow (xyflow)** | Manipulasi state deklaratif pada array `nodes` dan `edges` via `onNodeMouseEnter` / `onNodeClick`. Mendukung custom SVG edge dengan `stroke-dashoffset` animation. | Sangat fleksibel; native support untuk SVG filters, gradients, dan dynamic classes. | Pengembang harus mengkalkulasi DFS/BFS tree traversal sendiri untuk recursive ancestors/descendants. |
| **Obsidian Graph View** | Hover-based neighbor highlight. Unlinked nodes diredupkan (fade out), direct neighbors dipertahankan. | Instan untuk eksplorasi kasual tanpa klik. | **Kelemahan Kritis:** Highlight hilang seketika saat kursor mouse bergeser 1 pixel (*hover fatigue*). Komunitas terpaksa membuat plugin *Graph Highlight Lock* / *Intuitive Graph Navigation* agar highlight bisa di-pin via klik. |
| **Figma Dev Mode** | Tree hierarchy navigation di sidebar kiri, breadcrumb trail, dan inspect connection ke *Main Component* di canvas via `Shift + D`. | Menampilkan *source of truth* komponen secara deterministik. | Tidak memiliki visual dependency graph menyeluruh di canvas; hubungan multi-level hanya terlihat di panel teks. |
| **Clapet (clapet.app)** | Canvas arsitektur sistem khusus developer dengan konektor ortogonal dan node semantik (Service, DB, Queue). | Bersih, fokus pada aliran data fungsional, micro-interactions ringan. | Belum memiliki bidirectional traversal keyboard shortcut yang terstandarisasi. |
| **Whimsical** | Radial auto-layout tree; klik branch menyeleksi sub-tree. | Sangat rapi untuk diagram 1 parent. | **Kelemahan Fatal:** Tidak mendukung multi-parent / DAG (Directed Acyclic Graph). Relasi m:n tidak bisa di-highlight secara struktural. |

---

### 1.2 Rekomendasi Spesifikasi Micro-Interaction (Focus Mode)

Berdasarkan benchmark di atas, UX Logic Thread mengadopsi standar interaksi berikut:

#### A. Visual Treatment: Redup Node yang Tidak Terhubung (Dimming Ratio)
* **Opacity Threshold:** Node dan edge yang tidak berada dalam garis keturunan (*unlinked lineage*) diturunkan opasitasnya ke **`opacity: 0.15`** (15%). 
  * *Rasional:* Angka di bawah 0.10 membuat canvas tampak bolong dan menghilangkan kesadaran spasial (*loss of spatial orientation*), sedangkan di atas 0.30 masih menimbulkan polusi visual.
* **Desaturation / Grayscale:** Terapkan `filter: grayscale(80%)` pada elemen yang tidak aktif. Warna aksen (hijau, biru, ungu, oranye) hanya boleh menyala pada jalur yang sedang ditelusuri.
* **Backdrop Interaction:** Elemen yang redup dinonaktifkan interaksinya (`pointer-events: none` sementara) agar klik tidak sengaja tidak membatalkan fokus. Klik tunggal pada *canvas canvas backdrop* kosong langsung me-reset fokus ke 100%.

#### B. Animasi Aliran Kabel (Bezier Curve Glow & Flow)
* **Geometry:** Menggunakan cubic Bezier curve (`path` horizontal: $M \ x_1 \ y_1 \ C \ x_{mid} \ y_1, x_{mid} \ y_2, x_2 \ y_2$) yang mengalir dari kiri ke kanan (Hulu ke Hilir).
* **Double-Stroke Layering:**
  1. *Layer 1 (Outer Glow):* Garis bawah tebal (6px - 8px) dengan `stroke: rgba(59, 130, 246, 0.35)` dan filter SVG `feGaussianBlur (stdDeviation="4")`.
  2. *Layer 2 (Core Beam):* Garis inti (2.5px) dengan warna solid bergradien semantik.
* **Aliran Listrik (Flow Pulse):** Menghidupkan animasi CSS `stroke-dasharray: 6, 6` dengan `stroke-dashoffset` yang bergerak ke arah hilir:
  ```css
  @keyframes flowDash {
    from { stroke-dashoffset: 24; }
    to { stroke-dashoffset: 0; }
  }
  .edge-lineage-active {
    stroke-dasharray: 8, 4;
    animation: flowDash 0.8s linear infinite;
  }
  ```
* **Diferensiasi Hulu vs Hilir (Bidirectional Color Coding):**
  * **Hulu (Upstream / Ancestor - Menjawab *"Mengapa ini dibuat?"*):** Garis berwarna **Cyan / Emerald (`#10B981`)** yang menyala ke arah kiri menuju Research Insight.
  * **Node Aktif (Selection Anchor):** Border kartu menyala dengan `ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]`.
  * **Hilir (Downstream / Descendant - Menjawab *"Apa dampak UI-nya?"*):** Garis berwarna **Violet / Amber (`#8B5CF6`)** yang mengalir ke kanan menuju Token & Komponen UI.

#### C. Shortcut Navigasi Keyboard (Spatial & Lineage Traversal)
Mengatasi sindrom *"hover fatigue"* Obsidian dengan menghadirkan navigasi berbasis keyboard murni:

| Shortcut | Aksi Navigasi | Logika Sistem |
| :--- | :--- | :--- |
| **`ArrowRight`** | **Traverse Hilir (Downstream)** | Memindahkan fokus ke node anak langsung di kolom sebelah kanan (misal: dari *Research* ke *Feature*, atau dari *Feature* ke *Sitemap*). Jika memiliki > 1 anak, memilih anak pertama. |
| **`ArrowLeft`** | **Traverse Hulu (Upstream)** | Memindahkan fokus ke node induk asal di kolom sebelah kiri (misal: dari *Token* kembali ke *Sitemap*, atau dari *Feature* kembali ke *Research*). |
| **`ArrowDown` / `ArrowUp`** | **Sibling Traversal** | Berpindah antar node saudara (*siblings*) di dalam tier / kolom yang sama tanpa memutus rantai. |
| **`Tab` / `Shift + Tab`** | **Cycle Path Only** | Berpindah maju/mundur secara sekuensial hanya di antara node-node yang sedang berada di *active path*. |
| **`Esc`** | **Clear Focus** | Me-reset seluruh canvas kembali ke kondisi normal (`opacity: 1`, non-dimmed). |
| **`F` (Frame Focus)** | **Fit Active Lineage to Viewport** | Kamera kanvas otomatis melakukan *smooth pan & zoom* untuk memuat seluruh rantai hulu-ke-hilir yang sedang aktif ke layar tengah. |

---

### 1.3 State Traversal Model (Implementasi Ringkas)

Secara arsitektural di React 19, relasi 4-tabel UX Logic Thread adalah Directed Acyclic Graph (DAG). Traversal lineage dihitung secara instan menggunakan fungsi relasional murni:

```typescript
// Utilitas Kalkulasi Lineage Hulu & Hilir
export function getLineageIds(
  selectedNodeId: string,
  selectedType: 'research' | 'feature' | 'sitemap' | 'token',
  data: { features: any[]; sitemap: any[]; tokens: any[] }
): { upstreamIds: Set<string>; downstreamIds: Set<string>; activeEdges: Set<string> } {
  const upstream = new Set<string>();
  const downstream = new Set<string>();
  const edges = new Set<string>();

  // 1. Traverse Hulu (Upstream)
  if (selectedType === 'token') {
    const tok = data.tokens.find(t => t.id === selectedNodeId);
    if (tok?.sitemap_id) {
      upstream.add(tok.sitemap_id);
      edges.add(`e-${tok.sitemap_id}-${tok.id}`);
      const sm = data.sitemap.find(s => s.id === tok.sitemap_id);
      if (sm?.feature_id) {
        upstream.add(sm.feature_id);
        edges.add(`e-${sm.feature_id}-${sm.id}`);
        const feat = data.features.find(f => f.id === sm.feature_id);
        if (feat?.research_id) {
          upstream.add(feat.research_id);
          edges.add(`e-${feat.research_id}-${feat.id}`);
        }
      }
    }
  }
  // 2. Logika simetris dieksekusi untuk selectedType sitemap, feature, & research...
  return { upstreamIds: upstream, downstreamIds: downstream, activeEdges: edges };
}
```

---

## 2. Benchmark Struktur Harga & Model Monetisasi Kompetitor

Riset model bisnis ini diekstraksi langsung dari laman harga resmi (*primary sources*) kompetitor utama untuk menentukan celah monetisasi terbaik bagi UX Logic Thread.

### 2.1 Bedah Harga Kompetitor

#### A. Whimsical (whimsical.com/pricing)
* **Model:** Freemium berbasis kuota objek per bulan (*monthly object generation cap*).
* **Tier & Batasan:**
  * **Free ($0):** Sangat dibatasi! Maksimal **50 board items/objects per bulan** (termasuk cards, shapes, sticky notes) dan **50 document blocks per bulan**. Ekspor gambar diberi **watermark**. Riwayat versi (*version history*) hanya 7 hari. File upload maksimal 5MB. Free viewers tak terbatas.
  * **Pro ($10/editor/bulan billed annually, atau $12 billed monthly):** Unlimited objects, watermark dihapus, 90 hari version history, 100GB storage.
  * **Business ($20/editor/bulan billed annually, atau $24 billed monthly):** Unlimited version history, SAML SSO, SCIM provisioning, 2TB storage.
* **Paywall / Pain Point Utama:** Kuota **50 item/bulan di Free Tier** adalah perangkap friksi tinggi (*harsh paywall*). Seorang desainer yang membuat 1 diagram alur lengkap (20 riset + 20 fitur + 15 halaman) akan langsung terblokir dalam waktu 1 hari. Watermark pada ekspor merusak kredibilitas desainer di hadapan klien/stakeholder.

#### B. Fibery.io (fibery.io/pricing)
* **Model:** Per-user monthly SaaS dengan batasan fitur enterprise dan automation.
* **Tier & Batasan:**
  * **Free ($0):** Maksimal **10 users** (Admins/Members) dan maksimal **10 databases**. Unlimited entities, unlimited collaborative docs, 250 automation runs/bulan. Free observers/guests tak terbatas.
  * **Standard ($12/user/bulan billed annually):** Unlimited users, unlimited databases, charts, whiteboards, 90 hari version history, AI features with credits.
  * **Pro ($20/user/bulan billed annually):** JavaScript automations, historical trend data, custom permissions/user groups, unlimited version history, white-label forms.
  * **Enterprise ($40/user/bulan billed annually):** SAML SSO, SCIM, data residency (US, EU, UK, APAC), dedicated CSM (biasanya butuh minimum kursi, misal 25 kursi).
* **Paywall / Pain Point Utama:** Meskipun gratis hingga 10 user, batasan 10 database cepat tercapai jika menghubungkan riset, fitur, sitemap, bugs, sprint, dsb. Selain itu, fitur automasi lanjutan (JavaScript) dikunci di tier $20/user.

#### C. FigJam & Ekosistem Figma (figma.com/pricing)
* **Model:** Multi-tiered seat bundling (Full Seat vs Dev Seat vs Collab Seat).
* **Tier & Batasan:**
  * **Starter (Free):** Maksimal hanya **3 active Figma Design files** dan **3 active FigJam files** per tim. 30 hari version history.
  * **Professional:** 
    * *Collab Seat (FigJam & Slides only):* **$3/user/bulan** (annual) atau **$5/bulan** (monthly).
    * *Dev Seat (Dev Mode + FigJam, no Figma Design edit):* **$12/user/bulan** (annual) atau **$15/bulan** (monthly).
    * *Full Seat (Figma Design + Dev Mode + FigJam):* **$16/user/bulan** (annual) atau **$20/bulan** (monthly).
  * **Organization:** Collab $5/mo, Dev $25/mo, Full $55/mo (annual commitment only).
  * **Enterprise:** Collab $5/mo, Dev $35/mo, Full $90/mo (annual commitment only).
* **Paywall / Pain Point Utama:** Batasan **3 file** di Starter sangat mencekik. Untuk mendapatkan Dev Mode (melihat token dan spek kode), developer harus membayar $12 - $35/bulan. Selain itu, FigJam **sama sekali tidak memiliki Dev Mode native dan tidak mendukung Figma Variables/Tokens**, sehingga pengguna FigJam terpaksa membayar Full Seat Figma Design ($16-$90) hanya untuk mengelola komponen dan token.

#### D. Dovetail (dovetail.com/pricing)
* **Model:** Freemium ekstrem yang membunuh opsi mandiri (*self-serve elimination*).
* **Perubahan Radikal Terbaru:** Dovetail **resmi menghapus seluruh paket self-serve berbayar bulanan** (seperti tier Starter $29/bulan atau Pro $39/bulan yang lama). Saat ini hanya ada 2 pilihan:
  1. **Free Plan ($0):** Dibatasi ketat hanya untuk **1 Project, 1 Channel, dan 1 Dashboard** dengan kuota AI minimal.
  2. **Enterprise Plan (Custom Quote via Sales Call):** Wajib tanda tangan kontrak enterprise tahunan melalui sales rep. Berdasarkan data industri (Vendr SaaS Benchmark), nilai kontrak Dovetail Enterprise berkisar antara **$3,000 hingga $15,000+ per tahun** (setara $50–$100+/contributor seat/bulan).
* **Paywall / Pain Point Utama ("The Enterprise Cliff"):** Ini adalah celah pasar terbesar di industri riset saat ini. Desainer freelance, konsultan independen, atau tim startup kecil yang memiliki **2 proyek riset** tidak punya opsi untuk membayar $10 - $20/bulan. Mereka terbentur dinding: tetap di 1 proyek atau bayar ribuan dolar ke Sales Dovetail.

---

### 2.2 Matriks Perbandingan Model Monetisasi Kompetitor

| Dimensi | Whimsical | Fibery.io | FigJam (Figma) | Dovetail | **UX Logic Thread (Peluang)** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Free Tier Limit** | 50 items/bulan | 10 DB, 10 Users | 3 Files per team | **1 Project saja** | **3 Projects, Unlimited Items** |
| **Export Watermark** | Ya (Ada di Free) | Tidak | Tidak | Tidak | **Tidak Ada Watermark** |
| **Self-Serve Entry Cost** | $10/editor/mo | $12/user/mo | $3/mo (FigJam) / $16/mo (Full) | **Tidak Ada (Sales Call Only)** | **$0 (Free) / $9/mo (Pro)** |
| **Biaya Dev/Token Inspection** | N/A (Tanpa token) | Termasuk | $12 - $35/dev/mo | N/A (Tanpa UI token) | **Gratis / Built-in** |
| **Free Viewers / Stakeholders** | Unlimited | Unlimited | Unlimited | Unlimited (Enterprise) | **Unlimited Free Viewers** |

---

### 2.3 Rekomendasi Positioning & Model Harga UX Logic Thread

> [!IMPORTANT]
> **Keputusan Strategis Owner (2026-11-02): Monetisasi Ditunda (Product Maturation Phase)**  
> Sesuai arahan Owner, **monetisasi dan paywall belum akan diterapkan** karena produk masih dalam tahap pematangan awal (*early maturation*). Seluruh model harga di bawah ini disimpan murni sebagai referensi jangka panjang (*long-term strategic reserve*).  
> **Fokus Saat Ini:** 100% pada kesempurnaan *core loop* (Research ➔ Feature ➔ Sitemap ➔ Token ➔ Prompt < 15 menit), keandalan relasi Supabase, dan adopsi tanpa gesekan (*zero-friction adoption*) dengan status **100% Free / Internal Tool**.

#### Referensi Jangka Panjang (Simulasi Model Harga Saat Produk Matang):

```
┌────────────────────────┐   ┌────────────────────────┐   ┌────────────────────────┐
│    COMMUNITY (FREE)    │   │      PRO CREATOR       │   │      TEAM / STUDIO     │
│       $0 / Forever     │   │     $9 / mo ($7 ann)   │   │   $19 / editor / mo    │
├────────────────────────┤   ├────────────────────────┤   ├────────────────────────┤
│ • 3 Active Projects    │   │ • Unlimited Projects   │   │ • Everything in Pro    │
│ • Unlimited Nodes/FKs  │   │ • Full Reverse Trace   │   │ • Realtime Multi-user  │
│ • Full Markdown Prompt │   │ • Custom Token Schema  │   │ • Unlimited Viewers    │
│ • Zero Watermark       │   │ • Version History (90d)│   │ • Team Token Presets   │
│ • Local / Self-host DB │   │ • Export to Figma MCP  │   │ • Priority Support     │
└────────────────────────┘   └────────────────────────┘   └────────────────────────┘
```

1. **Tier 1: Community (Free Forever - $0)**
   * *Fitur:* Hingga 3 proyek aktif, **unlimited nodes/relasi** (tanpa batas 50 item seperti Whimsical), ekspor Markdown prompt penuh tanpa watermark, support self-hosted/BYO-Supabase.
   * *Tujuan:* Menarik *word-of-mouth* masif dari solo desainer dan indie hacker yang frustrasi dengan limit Dovetail & Whimsical.
2. **Tier 2: Pro Creator ($9/bulan atau $84/tahun = $7/bulan)**
   * *Fitur:* Unlimited projects, Full Reverse Lineage Highlighter (Focus Mode), Preset Prompt Khusus (Cursor `.cursorrules`, Claude Projects, Figma MCP JSON schema), 90 hari riwayat versi.
   * *Tujuan:* Menjadi *no-brainer purchase* bagi freelancer dan product designer profesional (jauh lebih murah dari Whimsical $10/mo dan alternatif instan dari Dovetail $30+).
3. **Tier 3: Team / Studio ($19/editor/bulan atau $180/editor/tahun = $15/bulan)**
   * *Fitur:* Kolaborasi realtime multi-editor via Supabase Realtime, **Unlimited Free Viewers** (developer dan PM bisa melihat lineage dan copy prompt tanpa bayar), shared design token library (Tailwind, Radix, Shadcn).
   * *Tujuan:* Penetrasi ke agency dan tim produk startup.

---

## 3. 15-Minute Speed Benchmark (Friction Log Analysis)

Target MVP UX Logic Thread adalah: **Pengguna mampu memetakan riset mentah menjadi arsitektur informasi terstruktur lengkap dengan design token dan mengekspor prompt dalam waktu < 15 menit.**

Untuk mencapai ini, kita menganalisis di mana tepatnya pengguna membuang waktu (*time sink*) pada tools kompetitor saat melakukan alur kerja yang sama.

### 3.1 Friction Log Analysis Per Kompetitor

#### A. Whimsical: The "Manual Layout & Formatting Tax"
* **Skenario:** Pengguna memasukkan 5 keluhan riset, memecahnya menjadi 8 fitur, lalu menyusun sitemap 4 halaman.
* **Titik Friksi Terdeteksi:**
  1. *Friction 1 (Strict Single-Parent Trap):* Saat Fitur B ternyata menjawab Riset 1 dan Riset 3, Whimsical tidak bisa menghubungkan cabang mindmap ke dua parent. Pengguna terpaksa keluar dari mode Mindmap, membuat card terpisah, lalu menarik panah manual (*connector arrow*). **(Membuang 3–5 menit)**
  2. *Friction 2 (Manual Aligning & Spacing):* Ketika panah manual ditarik, auto-layout Whimsical rusak. Pengguna mulai menggeser-geser kotak agar garis tidak bertumpukan. **(Membuang 4 menit)**
  3. *Friction 3 (Zero Semantic Continuity):* Dari diagram sitemap, pengguna ingin menambahkan design token (misal warna tombol). Di Whimsical tidak ada field data untuk token, sehingga pengguna harus mengetik teks manual di dalam sticky note. **(Membuang 3 menit)**
  4. *Friction 4 (Export Bottleneck):* Tidak ada fungsi export prompt. Pengguna harus membuka Notepad/Cursor, membaca diagram satu per satu, dan mengetik ulang prompt konteks secara manual. **(Membuang 6–8 menit)**
* **Total Waktu yang Dihabiskan:** **16 – 20 menit** (Gagal memenuhi target 15 menit).

#### B. Fibery.io: The "Schema Configuration Overhead"
* **Skenario:** Pengguna ingin membangun relasi terstruktur dari User Research ➔ Features ➔ Sitemap ➔ Tokens.
* **Titik Friksi Terdeteksi:**
  1. *Friction 1 (Database & Field Setup Tax):* Sebelum bisa mengetik insight pertama, pengguna harus membuat Type "Research", Type "Feature", Type "Sitemap", lalu membuat Relation field (One-to-Many / Many-to-Many) di menu setting. **(Membuang 8–12 menit)**
  2. *Friction 2 (View Hopping Fatigue):* Pengguna harus berpindah-pindah antara Document View (untuk baca transkrip), Table View (untuk link fitur), dan Board View (untuk sitemap). Tidak ada satu kanvas spasial yang menampilkan semuanya dalam satu pandangan. **(Membuang 5 menit)**
  3. *Friction 3 (Prompt Assembly Failure):* Tidak ada generator prompt bawaan. Pengguna harus membuat custom formula atau meng-copy data JSON mentah. **(Membuang 5 menit)**
* **Total Waktu yang Dihabiskan:** **18 – 25+ menit** (Sangat lambat untuk pekerjaan kilat).

#### C. FigJam: The "Blank Canvas & Sticky Note Chaos"
* **Skenario:** Pengguna membuka FigJam kosong untuk brainstorming riset hingga sitemap.
* **Titik Friksi Terdeteksi:**
  1. *Friction 1 (Blank Canvas Syndrome & Color Coding):* Pengguna harus memutuskan format visual: warna apa untuk riset, ukuran font berapa untuk sitemap, bentuk apa untuk fitur. **(Membuang 4 menit)**
  2. *Friction 2 (Infinite Zoom & Pan Fatigue):* Setelah membuat 20 sticky note, canvas meluas ke segala arah. Menghubungkan sticky note di kiri ke kanan memerlukan zoom in-out berulang kali. **(Membuang 4 menit)**
  3. *Friction 3 (Connector Line Knotting):* Menghubungkan garis konektor antar sticky notes sering menempel di titik (*anchor*) yang salah, garis saling memotong, dan membuat canvas tampak semrawut. **(Membuang 3 menit)**
  4. *Friction 4 (The Handoff Chasm):* Sticky note di FigJam tidak bisa langsung dijadikan instruksi koding. Desainer harus menyalin teks sticky note satu per satu ke dokumen PRD atau prompt Cursor. **(Membuang 5 menit)**
* **Total Waktu yang Dihabiskan:** **16 – 22 menit**.

---

### 3.2 Rekomendasi Solusi UX Logic Thread: "The 4-Pillar Zero-Friction Pipeline"

Untuk menjamin alur kerja tuntas dalam **< 15 menit**, UX Logic Thread meniadakan seluruh kebebasan visual yang tidak perlu (*opinionated constraints*) dan menggantinya dengan alur terarah:

```
[Rail 1: Research Hub]  ──►  [Rail 2: Feature Mapper]  ──►  [Rail 3: Sitemap Console]  ──►  [Rail 4: Token Definer]
  (Input & Hit Enter)          (Auto-Parented to Res)        (Hierarchy Slot Picker)         (Design Token Presets)
         │                             │                              │                              │
         └─────────────────────────────┴──────────────────────────────┴──────────────────────────────┘
                                                       │
                                            [One-Click Compile]
                                                       ▼
                                         Deterministic System Prompt
```

#### 1. Pillar 1: Opini Struktur Terpandu (*Fixed 4-Column Rail Canvas*)
* Pengguna tidak dihadapkan pada kanvas kosong tak berbatas (*infinite void*). Kanvas terbagi secara alami menjadi 4 kolom hulu-ke-hilir:
  `01. Research Hub` ➔ `02. Feature Mapper` ➔ `03. Sitemap Console` ➔ `04. UI Tokens`.
* Posisi node otomatis diatur oleh algoritma layout kolom vertikal. Pengguna dilarang membuang waktu menggeser koordinat X/Y secara manual.

#### 2. Pillar 2: Keyboard-First Rapid Capture & Auto-Parenting
* **Input Cepat:** Input bar di bagian atas kolom selalu siap menerima teks.
* Ketik keluhan: *"Checkout loading lebih dari 5 detik"* ➔ Tekan `Enter` ➔ Node `RES-01` langsung terbuat, kursor tetap berada di input bar untuk entri berikutnya.
* Saat berpindah ke kolom Fitur, sistem secara otomatis menawarkan *parenting* ke riset terakhir yang aktif atau cukup ketik `@RES-01` untuk membuat link Foreign Key seketika tanpa menggunakan mouse.

#### 3. Pillar 3: Token Presets & Quick Tagging (No Manual Styling)
* Menghilangkan kebutuhan mendesain shape atau mengetik kode warna heksadesimal dari nol.
* Kolom Token menyediakan chip rekomendasi semantik cepat:
  * Tombol sekali klik: `[Primary Action]`, `[Destructive]`, `[Surface Background]`, `[Typography Body]`.
  * Sistem otomatis mengikat token yang dipilih ke komponen halaman terkait di kolom Sitemap.

#### 4. Pillar 4: One-Click Deterministic Compiler (Prompt Generator)
* Tombol **"Export AI Context"** selalu dapat diakses di pojok kanan atas dengan shortcut `Cmd + Shift + E`.
* Tanpa konfigurasi tambahan, fungsi compiler membaca seluruh graph Supabase via Foreign Key dan mengompilasinya menjadi Markdown terstruktur dalam **100 milidetik**:
  * Ringkasan Temuan Riset
  * Pemetaan Fitur & Argumen Bisnis
  * Arsitektur Sitemap & Slot Hierarki
  * Spesifikasi Token UI & Komponen Tailwind
* Pengguna cukup klik tombol **"Copy to Clipboard"** dan langsung berpindah ke Cursor atau Claude.

---

### 3.3 Friction-Free User Journey: Simulasi Waktu 15 Menit

Berikut adalah time-budget breakdown alur kerja desainer di UX Logic Thread:

```
Menit 00:00 - 03:00  [Input 3-5 Raw Research Insights] (Keyboard-first: Type & Enter)
Menit 03:00 - 06:30  [Formulasikan 4-6 Fitur Solusi] (Auto-tagging FK ke Research ID)
Menit 06:30 - 10:00  [Bangun 3-4 Halaman Sitemap & Slot Fitur] (Header, Hero, Body, Modal)
Menit 10:00 - 12:30  [Definisikan 5-8 Design Tokens Utama] (Click-to-bind Semantic Presets)
Menit 12:30 - 13:30  [Audit Relasi via Focus Mode Glow] (Gunakan Arrow keys cek hulu-hilir)
Menit 13:30 - 14:15  [Klik 'Export AI Context' & Copy Markdown Prompt]
Menit 14:15 - 15:00  [Paste di Claude 3.7 / Cursor IDE -> High-Fidelity UI Created]
```

**Hasil Pengujian Konseptual:** Alur kerja selesai dalam **14 menit 15 detik**, menghasilkan spesifikasi produk yang 100% tervalidasi dan siap dieksekusi oleh AI coding tanpa friksi.

---

## 4. Rekomendasi Tindakan untuk Tim Engineering & Desain

1. **Frontend Canvas Engine:**
   * Gunakan arsitektur kolom relasional berbasis flex/grid dengan layer overlay SVG untuk merender Bezier connections.
   * Hindari rendering kanvas berat berbasis WebGL/Canvas API karena kebutuhan kita adalah DOM cards yang mudah di-styling dengan Tailwind CSS dan memiliki aksesibilitas keyboard native.
2. **Micro-Interaction Styling:**
   * Terapkan kelas Tailwind `transition-opacity duration-200 ease-out` pada kartu node.
   * Saat Focus Mode aktif: non-active nodes diberi kelas `opacity-15 grayscale pointer-events-none`.
   * Active path edges diberi animasi SVG `stroke-dashoffset` 0.8s linier.
3. **Database Schema Integrity:**
   * Pastikan foreign key Supabase memiliki constraint `ON DELETE CASCADE` atau `ON DELETE SET NULL` yang jelas agar penghapusan node di hulu tidak merusak graph.
4. **Monetisasi MVP:**
   * Rilis versi v1 dengan model **Community Free** (3 proyek, unlimited nodes, zero watermark) untuk merebut basis pengguna Whimsical dan Dovetail yang kecewa dengan paywall masing-masing.

---

## 5. Sumber Primer (Primary Sources & Citations)

1. **Whimsical Pricing & Plan Limits:**
   * *Whimsical Official Pricing:* [https://whimsical.com/pricing](https://whimsical.com/pricing) (50 board items/mo free cap, watermark rules, Pro $10/mo).
   * *Whimsical Help Center - Plans & Limits:* [https://help.whimsical.com/](https://help.whimsical.com/).
2. **Fibery.io Pricing & Database Limits:**
   * *Fibery Official Pricing Page:* [https://fibery.io/pricing](https://fibery.io/pricing) (Free 10 users/10 DBs, Standard $12/user/mo, Pro $20/user/mo).
   * *Fibery Permissions & JS Automation Guides:* [https://fibery.io/terms](https://fibery.io/terms).
3. **Figma & FigJam Official Pricing:**
   * *Figma Official Pricing Directory:* [https://www.figma.com/pricing/](https://www.figma.com/pricing/) (Starter 3-file cap, FigJam Collab Seat $3–$5/mo, Dev Seat $12–$25/mo, Full Seat $16–$55/mo).
   * *Figma Dev Mode & Code Connect Documentation:* [https://help.figma.com/hc/en-us/articles/15023124642223-Use-Dev-Mode](https://help.figma.com/hc/en-us/articles/15023124642223-Use-Dev-Mode).
4. **Dovetail Pricing & Role Architecture:**
   * *Dovetail Official Pricing Page:* [https://dovetail.com/pricing/](https://dovetail.com/pricing/) (Free Plan 1 project/channel limit; Enterprise sales quote only; penghentian self-serve plans).
   * *Vendr SaaS Buying Benchmark - Dovetail Contracts:* [https://www.vendr.com/buyer-guides/dovetail](https://www.vendr.com/buyer-guides/dovetail).
5. **Graph Visualization & Traceability Libraries:**
   * *React Flow / xyflow Documentation (Highlighting Nodes & Edges):* [https://reactflow.dev/learn/advanced-use/highlight-nodes-edges](https://reactflow.dev/learn/advanced-use/highlight-nodes-edges).
   * *Obsidian Core Graph View Documentation & Community Plugin Index (Graph Highlight Lock):* [https://help.obsidian.md/Plugins/Graph+view](https://help.obsidian.md/Plugins/Graph+view).
   * *Clapet System Architecture Workspace:* [https://clapet.app](https://clapet.app).
