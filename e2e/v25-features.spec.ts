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
      .getByPlaceholder("Search rhymes & synonyms...");
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

    await page.getByTestId("notebook-drawer").getByRole("button", { name: "Poem" }).click();

    await editor.fill("Second poem unique text");
    await expect(editor).toHaveValue("Second poem unique text");

    const poemButtons = page
      .getByTestId("notebook-drawer")
      .getByRole("button")
      .filter({ hasText: "Untitled" });
    await expect(poemButtons).toHaveCount(2);

    await poemButtons.nth(1).click();
    await expect(editor).toHaveValue("First poem content here");
  });

  test("4. Right Drawer (Ctrl+I) — Gothic tone filter updates suggestions", async ({ page }) => {
    await page.keyboard.press("Control+i");
    await expect(page.getByTestId("inspector-drawer")).toBeVisible();

    const drawer = page.getByTestId("inspector-drawer");
    const searchInput = drawer.getByPlaceholder("Search rhymes & synonyms...");
    await searchInput.fill("night");

    await expect(
      drawer.getByRole("button").filter({ hasText: /syl/ }).first()
    ).toBeVisible({ timeout: 15_000 });

    const beforeGothic = await drawer
      .getByRole("button")
      .filter({ hasText: /syl/ })
      .allTextContents();

    await drawer.getByRole("button", { name: "Gothic", exact: true }).click();

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
    await expect(popover.getByText("Search more →")).toBeVisible();

    await expect(
      popover.getByRole("button").first()
    ).toBeVisible({ timeout: 15_000 });
  });
});
