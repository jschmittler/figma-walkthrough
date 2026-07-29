#!/usr/bin/env node
/**
 * Best-effort Chromium download so global / npx installs work out of the box.
 * - Skip with FIGMA_WALKTHROUGH_SKIP_BROWSER=1 (or in CI, which installs browsers
 *   explicitly with `npx playwright install --with-deps chromium`).
 * - Never fails the install; if it can't run, tells the user to run
 *   `figma-walkthrough setup` later.
 */
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

if (process.env.FIGMA_WALKTHROUGH_SKIP_BROWSER === "1" || process.env.CI === "true") {
  console.log("[postinstall] skipping Chromium download (run `figma-walkthrough setup` when needed).");
  process.exit(0);
}

try {
  const require = createRequire(import.meta.url);
  let cli;
  for (const spec of ["playwright/cli.js", "playwright-core/cli.js"]) {
    try {
      cli = require.resolve(spec);
      break;
    } catch {
      /* try next */
    }
  }
  if (cli) {
    execFileSync(process.execPath, [cli, "install", "chromium"], { stdio: "inherit" });
  } else {
    console.log("[postinstall] Playwright CLI not found yet; run `figma-walkthrough setup` after install.");
  }
} catch (e) {
  console.log(
    "[postinstall] Chromium install skipped/failed; run `figma-walkthrough setup` later. (" +
      (e && e.message ? e.message : e) +
      ")"
  );
}
