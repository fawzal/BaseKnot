# Product Requirements Document (PRD): UX Logic Thread (Traceability Mapper)

## 1. Ringkasan Eksekutif
UX Logic Thread adalah aplikasi internal berbasis *web* yang berfungsi sebagai sistem pelacakan jejak logika (traceability) antara data riset pengguna, perencanaan fitur, arsitektur informasi (sitemap), dan keputusan komponen UI (*design tokens*). Produk ini menghilangkan kebutuhan pembuatan *wireframe* manual, memungkinkan perancang produk untuk berpindah dari tahap riset awal langsung ke desain *high-fidelity* dengan dokumentasi yang relasional dan argumen yang kuat.

## 2. Definisi Masalah
* Alur kerja yang mengutamakan kecepatan (melewati fase *wireframe* dan langsung ke *high-fidelity*) menyebabkan benang merah antara temuan riset dan hasil UI terputus.
* Tidak ada *single source of truth* untuk menjawab justifikasi desain seperti *"Mengapa komponen ini ditempatkan di halaman ini?"* atau *"Temuan riset apa yang mendasari penggunaan warna token ini?"*.
* Menerjemahkan kerangka logika produk menjadi instruksi *vibe coding* atau *prompt* desain (untuk Claude/Cursor) secara manual memakan terlalu banyak waktu.

## 3. Arsitektur & Tumpukan Teknologi
Sistem ini menggunakan arsitektur relasional murni yang dibalut dengan antarmuka minimalis *zero-friction*.
* **Frontend:** React 19 (Vite) & Tailwind CSS (tema gelap `#0B0B0B`, kontras tinggi, gaya editorial minimalis).
* **Backend & Database:** Supabase (memanfaatkan *Foreign Keys* di PostgreSQL untuk mengikat data dari hulu ke hilir).
* **Output Engine:** Internal text formatter. Fungsi *frontend* sederhana yang mengubah data JSON relasional menjadi *Markdown system prompt*.

## 4. Spesifikasi Fitur MVP

### A. Research Hub & Feature Mapper (Tabel Relasi 1 & 2)
* **Input Instan:** Formulir satu baris tanpa opsi *styling* teks untuk memasukkan keluhan pengguna atau hasil riset lapangan secara cepat.
* **Feature Tagging:** Fitur *dropdown* untuk mendaftarkan fitur baru dan mengikatnya secara langsung ke ID riset menggunakan relasi *Foreign Key* Supabase.

### B. Sitemap Console (Tabel Relasi 3)
* **Node Builder:** Antarmuka visual (bisa menggunakan *list* hierarki atau Kanban *board*) untuk membuat halaman-halaman utama dalam aplikasi.
* **Feature Placement:** Kemampuan untuk memasukkan fitur yang telah dibuat di langkah sebelumnya ke dalam tingkatan hierarki di sebuah halaman (contoh: *Header*, *Hero Section*, *Floating*).

### C. UI Component & Token Definer (Tabel Relasi 4)
* **Token Input:** Kolom pengisian variabel *design token* (misal: `color/background/primary`) dan struktur komponen (misal: *Card*, *Accordion*) yang diikat langsung ke entitas fitur di sitemap.

### D. Context Export (Prompt Generator)
* **Tombol "Export Context":** Fitur ekspor akhir yang men-kueri seluruh data relasional dari tabel ujung ke ujung.
* **Markdown Output:** Sistem merangkai teks berdasarkan data relasional menjadi struktur instruksi siap pakai. Output ini tinggal di-*copy* dan di-*paste* ke dalam Claude (via Figma MCP) atau Cursor untuk memulai *vibe coding*.

## 5. Alur Data Supabase (Skema Relasional)

| Nama Tabel | Kolom Utama | Relasi (Foreign Key) |
| :--- | :--- | :--- |
| `ux_research` | `id`, `insight_text`, `created_at` | - |
| `ux_features` | `id`, `feature_name`, `description` | `research_id` (Merujuk ke `ux_research.id`) |
| `ux_sitemap` | `id`, `page_name`, `hierarchy_level` | `feature_id` (Merujuk ke `ux_features.id`) |
| `ux_ui_tokens` | `id`, `component_type`, `design_token` | `sitemap_id` (Merujuk ke `ux_sitemap.id`) |

## 6. Target Metrik Keberhasilan (MVP)
* **Waktu Eksekusi:** Penyusunan struktur logika produk baru (dari *insight* hingga ekspor *prompt*) dapat diselesaikan di bawah 15 menit.
* **Akurasi Prompt:** Hasil ekspor dapat langsung dipahami oleh Claude/Cursor tanpa memerlukan lebih dari satu kali iterasi manual untuk perbaikan komponen dasar.

## 7. Fase Pengembangan (Alokasi 3 Jam/Hari)
1. **Hari 1-2:** Pengaturan skema PostgreSQL di Supabase dan inisialisasi proyek Vite/Tailwind.
2. **Hari 3-4:** Pembuatan antarmuka *Research Hub* dan *Feature Mapper* dengan gaya *dark mode* murni.
3. **Hari 5-6:** Pembuatan *Sitemap Console* dan *UI Definer*.
4. **Hari 7:** Pembuatan fungsi penyusun *String/Markdown* untuk fitur "Export Context".