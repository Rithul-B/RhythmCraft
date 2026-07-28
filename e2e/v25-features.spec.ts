import { test, expect, type Page } from "@playwright/test";

const QUATRAIN = `The sun sets low beyond the hill
A gentle breeze is standing still
The golden light begins to fade
As evening casts its soft brocade`;

async function gotoApp(page: Page) {
  await page.goto("/");
  await expect(page.getByTestId("poetry-editor")).toBeVisible({ timeout: 15_000 });
}

async function selectWordInEditor(page: Page, word: string) {
  const editor = page.getByTestId("poetry-editor");
  await editor.evaluate(
    (el, targetWord) => {
      const textarea = el as HTMLTextAreaElement;
      const start = textarea.value.indexOf(targetWord);
      if (start === -1) return;
      textarea.focus();
      textarea.setSelectionRange(start, start + targetWord.length);
      textarea.dispatchEvent(new Event("select", { bubbles: true }));
      textarea.dispatchEvent(new Event("mouseup", { bubbles: true }));
      textarea.dispatchEvent(new Event("keyup", { bubbles: true }));
    },
    word
  );
}

test.describe("Rhythmic Thesaurus v2.5 — Editorial Zen", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await gotoApp(page);
  });

  test("1. Editor Canvas — type a 4-line quatrain", async ({ page }) => {
    const editor = page.getByTestId("poetry-editor");
    await editor.click();
    await editor.fill(QUATRAIN);

    await expect(editor).toHaveValue(QUATRAIN);
    await expect(page.getByText("4 lines")).toBeVisible();
  });

  test("2. Command Palette (Ctrl+K) — search for friend", async ({ page }) => {
    await page.keyboard.press("Control+k");
    await expect(page.getByTestId("command-palette")).toBeVisible();

    const searchInput = page
      .getByTestId("command-palette")
      .getByPlaceholder(/Search rhymes|Buscar rimas|Rechercher|Reime|Cerca rime/i);
    await searchInput.fill("friend");

    await expect(
      page.getByTestId("command-palette").getByRole("button").filter({ hasText: /syl/ }).first()
    ).toBeVisible({ timeout: 15_000 });
  });

  test("3. Left Drawer (Ctrl+\\) — create poem and switch", async ({ page }) => {
    const editor = page.getByTestId("poetry-editor");
    await editor.fill("First poem content here");

    await page.keyboard.press("Control+\\");
    await expect(page.getByTestId("notebook-drawer")).toBeVisible();

    await page.getByTestId("notebook-drawer").getByRole("button", { name: /Poem|Poema|Poème|Gedicht|Poesia/i }).click();

    await editor.fill("Second poem unique text");
    await expect(editor).toHaveValue("Second poem unique text");

    const poemButtons = page
      .getByTestId("notebook-drawer")
      .getByRole("button")
      .filter({ hasText: /Untitled|Sin título|Sans titre|Ohne Titel|Senza titolo/i });
    await expect(poemButtons).toHaveCount(2);

    await poemButtons.nth(1).click();
    await expect(editor).toHaveValue("First poem content here");
  });

  test("4. Right Drawer (Ctrl+I) — Gothic tone filter updates suggestions", async ({ page }) => {
    await page.keyboard.press("Control+i");
    await expect(page.getByTestId("inspector-drawer")).toBeVisible();

    const drawer = page.getByTestId("inspector-drawer");
    const searchInput = drawer.getByPlaceholder(/Search rhymes|Buscar rimas|Rechercher|Reime|Cerca rime/i);
    await searchInput.fill("night");

    await expect(
      drawer.getByRole("button").filter({ hasText: /syl/ }).first()
    ).toBeVisible({ timeout: 15_000 });

    const beforeGothic = await drawer
      .getByRole("button")
      .filter({ hasText: /syl/ })
      .allTextContents();

    await drawer.getByRole("button", { name: /Gothic|Gótico|Gothique|Gotisch|Gotico/i }).click();

    await page.waitForTimeout(500);

    await searchInput.fill("night");
    await expect(
      drawer.getByRole("button").filter({ hasText: /syl/ }).first()
    ).toBeVisible({ timeout: 15_000 });

    const afterGothic = await drawer
      .getByRole("button")
      .filter({ hasText: /syl/ })
      .allTextContents();

    expect(afterGothic.length).toBeGreaterThan(0);
    const orderChanged =
      beforeGothic.join("|") !== afterGothic.join("|") ||
      afterGothic.some((w) => /shadow|thorn|veil|gloom|dark/i.test(w));
    expect(orderChanged).toBeTruthy();
  });

  test("5. Word Highlight Popover — appears on word selection", async ({ page }) => {
    const editor = page.getByTestId("poetry-editor");
    await editor.fill("friendship grows with time and care");
    await selectWordInEditor(page, "friendship");

    const popover = page.getByTestId("selection-popover");
    await expect(popover).toBeVisible({ timeout: 10_000 });
    await expect(popover).toContainText("friendship");
    await expect(popover.getByText(/Search more|Buscar más|Chercher plus|Mehr suchen|Cerca di più/i)).toBeVisible();

    await expect(
      popover.getByRole("button").first()
    ).toBeVisible({ timeout: 15_000 });
  });
});

test.describe("RhythmCraft v3.0", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await gotoApp(page);
  });

  test("6. Language switch updates UI labels", async ({ page }) => {
    await page.getByTestId("language-selector").click();
    await page.getByRole("option", { name: /Español/i }).click();
    await page.keyboard.press("Control+k");
    await expect(
      page.getByTestId("command-palette").getByPlaceholder(/Buscar rimas/i)
    ).toBeVisible({ timeout: 8_000 });
    await page.keyboard.press("Escape");
    await page.keyboard.press("Control+i");
    await page.getByTestId("inspector-drawer").getByRole("button", { name: /Análisis/i }).click();
    await expect(page.getByText(/Coloca el cursor/i)).toBeVisible();
  });

  test("7. Emoji suggestions appear for night", async ({ page }) => {
    await page.keyboard.press("Control+k");
    const palette = page.getByTestId("command-palette");
    await expect(palette).toBeVisible();
    const input = palette.locator('input[type="text"]');
    await input.fill("night");
    await expect(page.getByTestId("emoji-suggestions")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId("emoji-suggestions")).toContainText("🌙");
  });

  test("8. Grammar check toggle flags misspelling and allows replace", async ({ page }) => {
    const editor = page.getByTestId("poetry-editor");
    await editor.fill("This is an test of grammer.");

    await page.getByTestId("grammar-toolbar-toggle").click();
    await expect(page.getByTestId("grammar-status")).toBeVisible({ timeout: 5_000 });

    await expect
      .poll(async () => page.locator("[data-grammar-match]").count(), { timeout: 25_000 })
      .toBeGreaterThan(0);

    // Click near the misspelled word; caret hit-testing opens the tooltip.
    await editor.click({ position: { x: 200, y: 40 } });
    await editor.evaluate((el) => {
      const textarea = el as HTMLTextAreaElement;
      const idx = textarea.value.indexOf("grammer");
      if (idx >= 0) {
        textarea.focus();
        textarea.setSelectionRange(idx + 2, idx + 2);
        textarea.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      }
    });

    await expect(page.getByTestId("grammar-tooltip")).toBeVisible({ timeout: 8_000 });
    await page.getByTestId("grammar-tooltip").getByRole("button").first().click();
    await expect(editor).not.toHaveValue(/grammer/);
  });

  test("9. Mobile viewport shows bottom sheet drawer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(page.getByTestId("poetry-editor")).toBeVisible({ timeout: 15_000 });
    await page.keyboard.press("Control+i");
    await expect(
      page.getByRole("dialog", { name: /Analysis|Análisis|Analyse|Analisi/i })
    ).toBeVisible({ timeout: 8_000 });
    await expect(page.getByTestId("mobile-bottom-sheet")).toBeVisible();
    await expect(page.getByTestId("inspector-drawer")).toBeVisible();
  });

  test("10. Italian synonyms-only mode returns Free Dictionary results", async ({ page }) => {
    await page.getByTestId("language-selector").click();
    await page.getByRole("option", { name: /Italiano/i }).click();
    await page.keyboard.press("Control+i");
    const drawer = page.getByTestId("inspector-drawer");
    await expect(drawer).toBeVisible();
    await expect(drawer.getByTestId("synonyms-only-note")).toBeVisible();
    await expect(drawer.getByText(/Syllables|Sillabe/i)).toHaveCount(0);
    const input = drawer.getByPlaceholder(/Cerca rime|Search rhymes|Buscar|Rechercher|Reime/i);
    await input.fill("casa");
    await expect(
      drawer.getByRole("button").filter({ hasText: /dimora|abitazione|casa/i }).first()
    ).toBeVisible({ timeout: 15_000 });
  });
});
