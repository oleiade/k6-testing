import { expect } from "https://github.com/oleiade/k6-testing/releases/download/v0.2.0/index.js";
import { browser } from "k6/browser";

export const options = {
  scenarios: {
    ui: {
      executor: "shared-iterations",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
  thresholds: {
    checks: ["rate==1.0"],
  },
};

export default async function () {
  const page = await browser.newPage();

  try {
    await page.goto("https://test.k6.io/my_messages.php");

    const loc = await page.locator('input[name="login"]');
    await loc.type("test");
    await page.screenshot({ path: "screenshots/screenshot.png" });

    await expect(page.locator('input[name="login"]')).toBeVisible();

    // We're expecting this to fail as we have typed 'test' into the input
    await expect(page.locator('input[name="login"]')).toHaveValue("foo");

    await page.screenshot({ path: "screenshots/screenshot.png" });
  } finally {
    await page.close();
  }
}
