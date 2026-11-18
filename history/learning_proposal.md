# Learning Proposal: Menyimpan Dokumen Plan di Folder Kerja Aktif

## 1. Identifikasi Perilaku yang Dipelajari
- **Koreksi / Preferensi Pengguna**: *"Oh ya, tolong ketika membuat sebuah plan, letakkan di folder tempat saya berada"*
- **Akar Masalah**: Secara bawaan, mode `/plan` hanya menulis dokumen rencana ke direktori internal `Artifact Directory` (`<appDataDir>\brain\<conversation-id>`). Pengguna menginginkan agar setiap kali plan dibuat, file rencana tersebut juga disimpan langsung di dalam folder kerja/proyek tempat pengguna berada (misalnya `PLAN.md` di direktori workspace/proyek aktif) agar mudah diakses langsung dari file explorer atau code editor.

## 2. Klasifikasi: Rule vs. Skill
- **Tipe**: **Rule** (`GEMINI.md`)
- **Alasan**: Ini adalah aturan perilaku universal (*behavioral guardrail / formatting invariant*) yang harus selalu aktif setiap kali agen membuat dokumen rencana (plan), bukan prosedur multi-langkah kompleks yang hanya dipanggil sesekali.
- **Lokasi Penyimpanan**:
  - `E:\MyApp\GEMINI.md` (Berlaku untuk seluruh proyek di dalam workspace `E:\MyApp` beserta subdirektorinya seperti `E:\MyApp\ringkasnya`).
  - *(Opsional)* `C:\Users\davids\.gemini\config\GEMINI.md` jika Anda ingin aturan ini juga berlaku secara global di luar `E:\MyApp`.

## 3. Usulan Perubahan File (`E:\MyApp\GEMINI.md`)

#### [NEW] `E:\MyApp\GEMINI.md`
```markdown
# Workspace Rules

## Planning & Documentation
- Setiap kali membuat atau memperbarui dokumen rencana (Implementation Plan / `/plan`), selain menyimpannya di Artifact Directory sistem, **wajib** juga menyimpan salinan file rencana tersebut (misalnya `PLAN.md`) langsung di dalam folder kerja/proyek tempat pengguna berada (working directory / project folder aktif).
```

---

> [!IMPORTANT]
> Silakan tinjau proposal di atas. Apakah Anda ingin aturan ini disimpan di **`E:\MyApp\GEMINI.md`** saja (khusus workspace ini), atau sekaligus secara **Global** (`~/.gemini/config/GEMINI.md`) untuk semua proyek di komputer Anda? Klik **Proceed** atau balas untuk menyetujui.
