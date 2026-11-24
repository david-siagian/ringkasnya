import { test, expect, type Page } from "@playwright/test";

function trackRuntimeErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(`console.error: ${msg.text()}`);
    }
  });
  return errors;
}

async function waitForAstroIslands(page: Page) {
  await page.waitForFunction(
    () => document.querySelectorAll("astro-island[ssr]").length === 0
  );
}

test.describe("Ringkasnya Smoke Tests", () => {
  test("beranda: tanpa error, tanpa filter/kotak pencarian, & CTA utama mengarahkan ke /katalog", async ({
    page,
  }) => {
    const errors = trackRuntimeErrors(page);

    await page.goto("/");
    await waitForAstroIslands(page);
    await expect(page).toHaveTitle(/Ringkasnya/i);

    await expect(
      page.getByRole("button", { name: /^Sejarah & Peradaban/i })
    ).toHaveCount(0);

    const searchInput = page.getByPlaceholder(
      "Cari judul buku, penulis, topik..."
    );
    await expect(searchInput).toHaveCount(0);

    await expect(
      page.getByRole("button", { name: "Cari judul buku" })
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /Coba Baca: Sapiens/i })
    ).toHaveCount(0);

    const catalogLink = page.getByRole("link", { name: "Jelajahi Katalog Buku" });
    await catalogLink.click();

    await expect(page).toHaveURL(/\/katalog/);
    await waitForAstroIslands(page);

    await expect(searchInput).toBeVisible();
    await searchInput.fill("Deep Work");
    await expect(
      page.getByRole("heading", { name: "Deep Work" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Hapus pencarian" }).click();
    await expect(searchInput).toHaveValue("");

    expect(errors).toEqual([]);
  });

  test("katalog (/katalog): jumlah kolom proporsional terhadap ukuran layar", async ({
    page,
  }, testInfo) => {
    const errors = trackRuntimeErrors(page);

    await page.goto("/katalog");
    await waitForAstroIslands(page);
    await expect(
      page.getByRole("heading", { name: "Daftar Semua Buku" })
    ).toBeVisible();

    const categoryTrigger = page.getByRole("button", { name: "Filter kategori" });
    await categoryTrigger.click();
    await page.getByRole("option", { name: /Sejarah & Peradaban/i }).click();
    await expect(categoryTrigger).toContainText("Sejarah & Peradaban");
    await categoryTrigger.click();
    await page.getByRole("option", { name: /Semua Kategori/i }).click();
    await expect(categoryTrigger).toContainText("Semua Kategori");

    const grid = page.locator("#katalog .grid").first();
    const getColCount = () =>
      grid.evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length
      );

    if (testInfo.project.name === "mobile") {
      expect(await getColCount()).toBe(2);
    } else {
      await page.setViewportSize({ width: 768, height: 800 });
      expect(await getColCount()).toBe(3);

      await page.setViewportSize({ width: 1024, height: 800 });
      expect(await getColCount()).toBe(4);

      await page.setViewportSize({ width: 1280, height: 800 });
      expect(await getColCount()).toBe(5);
    }

    expect(errors).toEqual([]);
  });

  test("perpustakaan kurasi (/): kartu buku lain responsif maksimal 6 tanpa baris menggantung", async ({
    page,
  }, testInfo) => {
    const errors = trackRuntimeErrors(page);

    await page.goto("/");
    await waitForAstroIslands(page);

    const grid = page.locator("#katalog .grid").first();
    await expect(grid).toBeVisible();
    const getColCount = () =>
      grid.evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length
      );

    if (testInfo.project.name === "mobile") {
      expect(await getColCount()).toBe(2);
      await expect
        .poll(() => grid.locator("> a").count())
        .toBe(6);
    } else {
      await page.setViewportSize({ width: 768, height: 800 });
      expect(await getColCount()).toBe(3);
      await expect
        .poll(() => grid.locator("> a").count())
        .toBe(6);

      await page.setViewportSize({ width: 1024, height: 800 });
      expect(await getColCount()).toBe(4);
      await expect
        .poll(() => grid.locator("> a").count())
        .toBe(4);

      await page.setViewportSize({ width: 1280, height: 800 });
      expect(await getColCount()).toBe(5);
      await expect
        .poll(() => grid.locator("> a").count())
        .toBe(5);
    }

    expect(errors).toEqual([]);
  });

  test("reader (/buku/sapiens): mode baca, konsep kunci, salin kutipan & tema bekerja", async ({
    page,
    context,
  }) => {
    const errors = trackRuntimeErrors(page);

    await context
      .grantPermissions(["clipboard-read", "clipboard-write"])
      .catch(() => {
        // Fallback: BookReader punya execCommand fallback jika permission tidak didukung
      });

    await page.goto("/buku/sapiens");
    await waitForAstroIslands(page);
    await expect(
      page.getByRole("heading", { name: /Sapiens/i })
    ).toBeVisible();

    // Toggle Mode Mendalam vs Mode Kilat
    const deepBtn = page.getByRole("button", { name: /Mendalam/i });
    const quickBtn = page.getByRole("button", { name: /Kilat/i });
    await deepBtn.click();
    await expect(deepBtn).toHaveClass(/shadow-sm/);
    await quickBtn.click();
    await expect(quickBtn).toHaveClass(/bg-amber-500/);

    // Mulai membaca Mode Kilat agar Poin Inti, Kesimpulan, Konsep Kunci, dan Kutipan tampil
    await page.getByRole("button", { name: "Mulai" }).click();

    // Bagian Konsep Kunci tampil menggantikan Action Checklist
    await expect(
      page.getByRole("heading", {
        name: "Gagasan Utama yang Perlu Dibawa Pulang",
      })
    ).toBeVisible();

    // Salin kutipan
    const copyBtn = page
      .getByRole("button", { name: "Salin Kutipan" })
      .first();
    await copyBtn.click();
    await expect(page.getByText("Tersalin!")).toBeVisible();

    // Toggle tema (useTheme)
    const themeToggle = page.getByRole("button", {
      name: /Ubah ke mode (gelap|terang)/i,
    });
    const wasDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    await themeToggle.click();
    await expect
      .poll(() =>
        page.evaluate(() =>
          document.documentElement.classList.contains("dark")
        )
      )
      .toBe(!wasDark);

    expect(errors).toEqual([]);
  });

  test("fase 2: progress bar, bookmark, & buat kartu kutipan PNG bekerja", async ({
    page,
  }) => {
    const errors = trackRuntimeErrors(page);

    await page.goto("/buku/sapiens");
    await waitForAstroIslands(page);

    // 1. Reading Progress Bar
    const progressBar = page.getByRole("progressbar", {
      name: "Progres membaca",
    });
    await expect(progressBar).toBeVisible();

    // Klik Mulai untuk membuka konten Mode Kilat
    await page.getByRole("button", { name: "Mulai" }).click();

    // 2. Buat Kartu Kutipan PNG
    const createCardBtn = page
      .getByRole("button", { name: "Buat Kartu" })
      .first();
    await createCardBtn.scrollIntoViewIfNeeded();
    await expect(createCardBtn).toBeVisible();

    // Setelah scroll ke bagian kutipan, progres membaca harus > 0
    await expect
      .poll(async () => Number(await progressBar.getAttribute("aria-valuenow")))
      .toBeGreaterThan(0);

    await createCardBtn.click();

    const dialog = page.getByRole("dialog", { name: "Buat Kartu Kutipan" });
    await expect(dialog).toBeVisible();

    // Pastikan modal muncul di dalam viewport aktif (bukan di tengah dokumen akibat parent transform)
    const dialogBox = await dialog.boundingBox();
    const viewport = page.viewportSize();
    expect(dialogBox).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(dialogBox!.y).toBeGreaterThanOrEqual(0);
    expect(dialogBox!.y + dialogBox!.height).toBeLessThanOrEqual(
      viewport!.height + 2
    );

    const canvas = dialog.locator("canvas");
    await expect(canvas).toBeVisible();
    expect(await canvas.evaluate((el: HTMLCanvasElement) => el.width)).toBe(1080);
    expect(await canvas.evaluate((el: HTMLCanvasElement) => el.height)).toBe(1080);

    await dialog.getByRole("button", { name: "4:5 Potret" }).click();
    expect(await canvas.evaluate((el: HTMLCanvasElement) => el.height)).toBe(1350);

    await dialog.getByRole("button", { name: "Kertas" }).click();

    const downloadPromise = page.waitForEvent("download");
    await dialog.getByRole("button", { name: "Unduh PNG" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("sapiens-kutipan.png");

    await dialog
      .getByRole("button", { name: "Tutup modal kartu kutipan" })
      .click();
    await expect(dialog).toBeHidden();

    // 3. Bookmark Buku Favorit & Filter di Katalog
    const bookmarkBtn = page.getByRole("button", { name: /Simpan Buku/i });
    await bookmarkBtn.click();
    await expect(
      page.getByRole("button", { name: /Tersimpan/i })
    ).toBeVisible();

    await page.goto("/katalog");
    await waitForAstroIslands(page);
    const savedFilterBtn = page.getByRole("button", {
      name: /Tersimpan \(1\)/i,
    });
    await expect(savedFilterBtn).toBeVisible();
    await savedFilterBtn.click();
    await expect(
      page.getByRole("heading", { name: /Sapiens/i })
    ).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("beranda (/): animasi scroll-reveal muncul saat scroll ke Perpustakaan Kurasi & Mengapa Ringkasnya", async ({
    page,
  }) => {
    const errors = trackRuntimeErrors(page);

    await page.goto("/");
    await waitForAstroIslands(page);

    const catalogReveal = page.locator("[data-reveal]").filter({
      has: page.locator("#katalog"),
    });
    const metodeHeadingReveal = page.locator("#metode [data-reveal]").first();
    const metodeCards = page.locator("#metode .grid [data-reveal]");

    await catalogReveal.scrollIntoViewIfNeeded();
    await expect(catalogReveal).toHaveClass(/is-revealed/);

    await page.locator("#metode").scrollIntoViewIfNeeded();
    await expect(metodeHeadingReveal).toHaveClass(/is-revealed/);
    await expect(metodeCards.first()).toHaveClass(/is-revealed/);
    await metodeCards.last().scrollIntoViewIfNeeded();
    await expect(metodeCards.last()).toHaveClass(/is-revealed/);

    expect(errors).toEqual([]);
  });

  test("api health merespons normal", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject({
      status: "ok",
      service: "Ringkasnya",
    });
  });
});
