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
  test("beranda: tanpa error, pencarian & filter kategori berfungsi", async ({
    page,
  }) => {
    const errors = trackRuntimeErrors(page);

    await page.goto("/");
    await waitForAstroIslands(page);
    await expect(page).toHaveTitle(/Ringkasnya/i);

    const searchBtn = page.getByRole("button", { name: "Cari judul buku" });
    await searchBtn.click();

    const searchInput = page.getByPlaceholder(
      "Cari judul buku, penulis, topik..."
    );
    await expect(searchInput).toBeVisible();
    await searchInput.fill("Deep Work");
    await expect(
      page.getByRole("heading", { name: "Deep Work" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Hapus pencarian" }).click();
    await expect(searchInput).toHaveValue("");

    const categoryBtn = page
      .getByRole("button", { name: /^Kebiasaan & Produktivitas/i })
      .first();
    await categoryBtn.click();
    await expect(categoryBtn).toHaveClass(/bg-emerald-600/);

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

  test("reader (/buku/atomic-habits): mode baca, checklist, salin kutipan & tema bekerja", async ({
    page,
    context,
  }) => {
    const errors = trackRuntimeErrors(page);

    await context
      .grantPermissions(["clipboard-read", "clipboard-write"])
      .catch(() => {
        // Fallback: BookReader punya execCommand fallback jika permission tidak didukung
      });

    await page.goto("/buku/atomic-habits");
    await waitForAstroIslands(page);
    await expect(
      page.getByRole("heading", { name: "Atomic Habits" })
    ).toBeVisible();

    // Toggle Mode Mendalam vs Mode Kilat
    const deepBtn = page.getByRole("button", { name: /Mendalam/i });
    const quickBtn = page.getByRole("button", { name: /Kilat/i });
    await deepBtn.click();
    await expect(deepBtn).toHaveClass(/shadow-sm/);
    await quickBtn.click();
    await expect(quickBtn).toHaveClass(/bg-amber-500/);

    // Action Checklist tersimpan di localStorage
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await expect(firstCheckbox).not.toBeChecked();
    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();
    await expect(page.getByText(/1 dari \d+ Selesai/)).toBeVisible();

    await page.reload();
    await waitForAstroIslands(page);
    await expect(
      page.locator('input[type="checkbox"]').first()
    ).toBeChecked();

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
