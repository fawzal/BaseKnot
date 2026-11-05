# 🔬 Comprehensive Competitor Analysis & Gap Strategy: UX Logic Thread
**Tanggal:** 2026-11-02  
**Author:** Head of Product & Product Researcher  
**Status:** Approved for Product Roadmap  
**Objektif:** Membedah UVP, USP, kelebihan, dan celah/blindspots dari kompetitor langsung dan tidak langsung (Whimsical, Fibery.io, FigJam, Dovetail), serta memetakan strategi diferensiasi dan fitur adaptasi untuk **UX Logic Thread (Traceability Mapper)**.

---

## 1. Executive Summary & Lanskap Kompetitif

Saat ini ada kesenjangan struktural besar (*The Great Product Chasm*) dalam siklus pengembangan produk digital:

```
[Riset Kualitatif / Voice of Customer] 
         │ (Kesenjangan Konteks: Data hilang di slides/Notion)
         ▼
[Perencanaan Fitur & Wireframing]
         │ (Kesenjangan Semantik: Sticky note acak, tanpa design tokens)
         ▼
[Desain High-Fidelity & Coding]
```

Tools yang ada di pasar hanya menguasai salah satu pulau tanpa menghubungkan jembatannya:
1. **Dovetail** menguasai riset, tapi hasilnya terisolasi di repository tertutup.
2. **FigJam** menguasai whiteboard kolaboratif, tapi berbasis sticky notes liar tanpa skema database dan tanpa Dev Mode.
3. **Whimsical** menguasai kecepatan mindmap dan diagram, tapi formatnya kaku (one-to-many only) dan tidak terikat kode/token.
4. **Fibery.io** menguasai relasi database feedback-ke-fitur, tapi tampilannya berupa spreadsheet/tabel berat dengan kurva belajar curam, tanpa kanvas visual fluid dan tanpa prompt generator untuk LLM/Cursor.

**Posisi UX Logic Thread:**  
Satu-satunya **Relational MindMap Canvas** yang mengikat insight riset mentah langsung ke komponen UI & Design Tokens, lalu mengompilasinya menjadi **deterministic LLM system prompts** (Claude / Cursor / Figma MCP) dalam waktu **< 15 menit**.

---

## 2. Analisis Mendalam Per Kompetitor

### A. Whimsical (Indirect Competitor: Visual MindMap & Wireframes)
* **Kategori:** Fast Diagramming, Mind Maps, Flowcharts, Low-Fi Wireframes.
* **UVP (Unique Value Proposition):** *"The visual workspace for fast-moving teams."* — Kecepatan membuat diagram rapi tanpa perlu pusing mengatur alignment manual.
* **USP (Unique Selling Proposition):** Mesin auto-layout dan keyboard-first mindmap tercepat di industri.
* **Kelebihan Utama:**
  - Frictionless mind mapping: ketik Tab/Enter langsung cabang baru rapi otomatis.
  - Komponen wireframe built-in yang sederhana dan mudah dipahami.
* **Celah & Blindspots Kritis (Gaps):**
  1. **Strict Radial Hierarchy (No Multi-Parent / Graph):** Node mind map di Whimsical hanya bisa memiliki 1 parent. Tidak bisa memetakan 1 fitur yang menjawab 2 insight riset berbeda.
  2. **No Data Schemas / No Foreign Keys:** Node hanyalah elemen grafis visual (shapes & strings), bukan entitas database yang punya relasi struktural.
  3. **No Code / Design Token Integration:** Tidak memiliki konsep semantic design tokens (`color/background/primary`), CSS classes, atau component bindings.
  4. **Shallow AI Continuity:** Whimsical AI hanya generate diagram satu kali dari teks singkat, tidak bisa mengekspor context graph menjadi prompt coding sistematis.

---

### B. Fibery.io (Direct Competitor: Relational Traceability & Feedback-to-Feature)
* **Kategori:** Connected Work Management, No-Code Relational Knowledge Graph.
* **UVP (Unique Value Proposition):** *"Connect user research, product strategy, and dev tasks in one flexible knowledge graph."*
* **USP (Unique Selling Proposition):** Fitur **"Highlights"** di mana kalimat spesifik dari transkrip wawancara dapat dipotong dan diikat dengan Foreign Key langsung ke entitas Feature atau Bug di database.
* **Kelebihan Utama:**
  - Arsitektur database relasional PostgreSQL murni yang powerful dengan custom formulas dan bidirectional links.
  - Traceability dua arah: dari feature bisa melihat quote user, dari user bisa melihat feature yang sedang dibangun.
* **Celah & Blindspots Kritis (Gaps):**
  1. **Heavy Spreadsheet/Database Cognitive Load:** UI Fibery berbasis tabel, database grid, dan dokumen. Tidak ada *interactive visual mindmap canvas* yang fluid seperti Clapet/Miro.
  2. **Disconnection from UI Architecture & Tokens:** Fibery berhenti di level Epics/User Stories (Jira/Linear style). Fibery tidak mengerti konsep *Sitemap Hierarchy* (Header vs Floating Hero) atau *Design Tokens*.
  3. **Steep Learning Curve:** Butuh berjam-jam untuk setup relational spaces, types, dan views. Tidak cocok untuk product designer yang ingin serba instan dalam 15 menit.
  4. **No LLM System Prompt Compiler:** Fibery tidak memiliki export engine yang mengubah relasi data menjadi prompt presisi untuk Claude/Cursor *vibe coding*.

---

### C. FigJam by Figma (Direct Competitor: Whiteboard & IA Mapping)
* **Kategori:** Collaborative Whiteboard, Journey Mapping, Brainstorming.
* **UVP (Unique Value Proposition):** *"Where ideas take shape alongside your designs."* — Kanvas ideasi yang terhubung langsung ke ekosistem Figma.
* **USP (Unique Selling Proposition):** Integrasi native tanpa batas ke Figma Design files dan multiplayer canvas dengan interaktivitas tinggi (widgets, voting, stickers).
* **Kelebihan Utama:**
  - Sangat mudah digunakan oleh desainer, kolaborasi real-time mulus.
  - Kemudahan menaruh tangkapan layar, wireframe, dan flow diagram.
* **Celah & Blindspots Kritis (Gaps):**
  1. **"Sticky Note Chaos" (Zero Data Typing):** Catatan di FigJam hanyalah teks visual tak berstruktur. Tidak ada validasi tipe, tidak ada relasi Foreign Key yang terjamin konsistensinya.
  2. **No Token or Variable Binding:** FigJam **tidak mendukung Figma Variables / Design Tokens**. Warna atau shape yang dipakai di FigJam bersifat arbitrer dan sering bentrok dengan design system resmi.
  3. **No Dev Mode or Code Export:** FigJam tidak memiliki Dev Mode. Developer tidak bisa menginspeksi token, CSS, atau mengompilasi diagram menjadi prompt teknis.
  4. **The Manual Translation Tax:** Desainer harus menerjemahkan manual dari sticky notes FigJam ➔ Figma Design ➔ Jira ticket ➔ Prompt koding. Setiap langkah memakan waktu dan berisiko context loss.

---

### D. Dovetail (Indirect Competitor: Customer Research Repository)
* **Kategori:** User Research Repository, Qualitative Data Analysis (QDA).
* **UVP (Unique Value Proposition):** *"Turn customer research into insights you can act on."*
* **USP (Unique Selling Proposition):** Transkripsi otomatis video/audio interview dengan video-highlight tagging dan enterprise taxonomy matrix.
* **Kelebihan Utama:**
  - Repositori pusat yang sangat kaya untuk insight customer jangka panjang.
  - AI summarize dan sentiment analysis yang kuat untuk data kualitatif masif.
* **Celah & Blindspots Kritis (Gaps):**
  1. **The "Research Silo" Trap:** Insight di Dovetail dibuat oleh researcher dan sering berakhir menjadi PDF/laporan slide yang tidak pernah dibaca developer saat menulis kode UI.
  2. **Completely Disconnected from Architecture & Code:** Dovetail sama sekali tidak menyentuh sitemap, struktur hierarki halaman, apalagi design tokens UI.
  3. **Excessive Price & Enterprise Bloat:** Harga per seat sangat mahal ($30 - $100+/seat), menjadikannya *overkill* untuk startup atau tim kecil yang hanya butuh pemetaan cepat.

---

## 3. Matriks Perbandingan Fitur & Gap Analysis

| Dimensi Evaluasi | Whimsical | Fibery.io | FigJam | Dovetail | **UX Logic Thread (Produk Kita)** |
|---|:---:|:---:|:---:|:---:|:---:|
| **Paradigma Tampilan** | Radial Tree / Board | Table / Relational Doc | Freeform Whiteboard | Document / Transkrip List | **Infinite Visual MindMap Canvas (ala Clapet)** |
| **Kecepatan (< 15 Menit)** | ✅ Cepat | ❌ Lambat (Setup berat) | ⚠️ Sedang | ❌ Sangat Lambat | ✅ **Sangat Cepat (Instant Input + Auto-Layout)** |
| **Relational Integrity (FKs)** | ❌ Grafis saja | ✅ Sangat Kuat | ❌ Tidak ada | ⚠️ Parsial (Tags only) | ✅ **Kuat (PostgreSQL 4-tier Foreign Keys)** |
| **Hierarki Sitemap & IA** | ⚠️ Grafis saja | ❌ Tidak ada | ⚠️ Sticky note | ❌ Tidak ada | ✅ **Terstruktur (Header, Hero, Floating, etc.)** |
| **Design Token Binding** | ❌ Tidak ada | ❌ Tidak ada | ❌ Tidak ada | ❌ Tidak ada | ✅ **Native Token & Component Binding** |
| **AI System Prompt Export** | ❌ Generatif gambar | ❌ Tidak ada | ❌ Tidak ada | ⚠️ AI Summarize doc | ✅ **Deterministic Prompt for Cursor/Claude/Figma** |
| **Biaya & Kompleksitas** | Murah | Kompleks | Masuk paket Figma | Sangat Mahal | **Minimalis & Zero-Friction** |

---

## 4. Peluang Emas & Strategi Adaptasi ("Menambal Celah")

Berdasarkan blindspots kompetitor di atas, ini adalah **4 Celah Kritis yang Kita Tambal** untuk memenangkan produk:

### 🎯 1. Dari Dovetail: Ambil Konsep "Atomic Insight", Tapi Hubungkan ke UI
* **Celah Dovetail:** Insight riset berhenti di laporan teks dan tidak pernah sampai ke UI.
* **Adaptasi Kita:** Setiap `Research Node` di kanvas kita adalah *atomic insight* (kutipan singkat / pain point). Namun, di UX Logic Thread, insight ini punya kabel output langsung yang **wajib terikat ke Fitur dan Komponen UI**. Tidak ada riset yang terbuang sia-sia.

### 🎯 2. Dari Fibery.io: Ambil Kekuatan Relasi DB, Tapi Ganti UI Tabel dengan Kanvas Clapet
* **Celah Fibery:** Relasi datanya hebat, tapi antarmukanya spreadsheet yang membosankan dan lambat dipahami.
* **Adaptasi Kita:** Kita menggunakan arsitektur relasional PostgreSQL Supabase yang sama solidnya, tetapi dibalut antarmuka **kanvas interaktif visual (ala Clapet & Whimsical)**. Menghubungkan relasi cukup dengan menarik kabel glowing dari satu card ke card lain.

### 🎯 3. Dari Whimsical & FigJam: Ambil Kemudahan Visual, Tapi Buang "Sticky Note Chaos"
* **Celah FigJam & Whimsical:** Whiteboard mereka cepat kotor, sticky note tidak punya tipe data, dan tidak bisa diekspor jadi spesifikasi teknis.
* **Adaptasi Kita:** Kanvas kita memiliki **Strict 4-Tier Node Typing** (`01. Research` ➔ `02. Feature` ➔ `03. Sitemap` ➔ `04. Token`). Ditambah tombol **Auto-Layout**, kanvas selalu rapi, tidak bisa berantakan, dan memiliki makna semantik yang jelas.

### 🎯 4. Inovasi Unik Kita (Unfair Advantage): "The Vibe-Coding Context Bridge"
* **Tidak Dimiliki Siapapun di Pasar:** Tidak ada satupun dari keempat kompetitor di atas yang bisa mengubah diagram alur logika menjadi **Markdown System Prompt** siap pakai untuk **Claude 3.7**, **Cursor IDE**, dan **Figma MCP**.
* **Keunggulan Nyata:** Pengguna kita tidak perlu lagi mendesain wireframe manual di Figma lalu mengetik prompt manual di Cursor. Cukup susun MindMap di UX Logic Thread ➔ Klik "Export AI Context" ➔ Paste di Claude/Cursor ➔ Aplikasi high-fidelity langsung tercipta dengan argumen riset yang solid.

---

## 5. Rekomendasi Fitur untuk Roadmap Produk Berikutnya

1. **Auto-Generate Node with AI (Adaptasi dari Whimsical & Clapet AI):**
   - Fitur "AI Decomposition": Pengguna mengetik 1 keluhan riset panjang, AI otomatis memecahnya menjadi 1 Research Node + rekomendasi 2 Feature Nodes + usulan Sitemap placement.
2. **Reverse Traceability Inspector (Adaptasi dari Fibery):**
   - Ketika pengguna mengklik sebuah Design Token Node, garis kabel ke belakang menyala terang (*glowing path*) dan menggelapkan node lain, memperlihatkan rujukan asal: *"Warna/komponen ini dibuat karena user mengeluh di Research #1234"*.
3. **Figma MCP Direct Push / Webhook:**
   - Selain Copy Markdown, sediakan endpoint atau webhook yang dapat langsung di-pull oleh Claude via Figma MCP untuk meng-generate layout frame di Figma.
