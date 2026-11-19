// Focused production checks for the footer. Uses an existing Playwright install.
import assert from 'node:assert/strict';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
const base = process.env.BASE_URL || 'http://localhost:3100';
const output = process.env.QA_OUTPUT || '/tmp/eyewear-footer-qa';
await mkdir(output, { recursive: true });
const results = [];
try {
  for (const width of [320, 375, 430, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width < 1024, isMobile: width < 768 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(base);
    const footer = page.locator('.site-footer');
    await footer.scrollIntoViewIfNeeded();
    const collection = footer.locator('summary').filter({ hasText: 'Coleção' });
    const help = footer.locator('summary').filter({ hasText: 'Atendimento' });
    const noOverflow = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${width}`);
    await noOverflow();
    if (width < 768) {
      assert.equal(await footer.locator('details[open]').count(), 0);
      await collection.focus();
      await page.keyboard.press('Enter');
      assert.ok(await footer.getByRole('link', { name: 'Óculos de sol', exact: true }).isVisible());
      for (const link of await footer.getByRole('link').all()) {
        if (!await link.isVisible()) continue;
        assert.ok((await link.boundingBox()).height >= 44);
      }
      await page.keyboard.press('Space');
      assert.equal(await footer.locator('details[open]').count(), 0);
      await help.click();
    } else {
      assert.equal(await footer.locator('details[open]').count(), 2);
      assert.equal(await collection.getAttribute('tabindex'), '-1');
      assert.ok(await footer.getByRole('link', { name: 'Óculos de grau', exact: true }).isVisible());
    }
    // All destinations are real routes; informational controls preserve their existing dialogs.
    const expected = ['/produtos?categoria=Sol', '/produtos?categoria=Grau', '/produtos?colecao=novidades', '/produtos'];
    assert.deepEqual(await footer.locator('.footer-group-links a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))), expected);
    for (const topic of ['Perguntas frequentes', 'Frete e entregas', 'Trocas e devoluções', 'Guia de tamanhos', 'Sobre o projeto', 'Contato', 'Privacidade', 'Termos de uso']) {
      const trigger = footer.getByRole('button', { name: topic, exact: true });
      await trigger.click();
      const dialog = page.getByRole('dialog');
      assert.ok(await dialog.getByRole('heading', { name: topic, exact: true }).isVisible());
      await page.waitForFunction(() => document.querySelector('.information-dialog')?.contains(document.activeElement));
      await page.keyboard.press('Tab');
      assert.ok(await dialog.evaluate((el) => el.contains(document.activeElement)));
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'detached' });
      await page.waitForFunction((el) => document.activeElement === el, await trigger.elementHandle());
    }
    await page.locator('.overlay').waitFor({ state: 'detached' });
    if (width < 768) await help.click();
    await footer.scrollIntoViewIfNeeded();
    await noOverflow();
    const size = await footer.boundingBox();
    if (width < 768) assert.ok(size.height < 650, `footer too long at ${width}: ${size.height}`);
    // No misleading destinations, social accounts, payment marks or empty anchors were added.
    assert.equal(await footer.locator('a[href="#"]').count(), 0);
    await page.waitForTimeout(950);
    await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
    await footer.screenshot({ path: `${output}/footer-${width}.png` });
    await page.keyboard.press('Tab');
    const privacy = footer.getByRole('button', { name: 'Privacidade', exact: true });
    await privacy.focus();
    assert.equal(await privacy.evaluate((el) => getComputedStyle(el).outlineStyle), 'solid');
    assert.equal(await privacy.evaluate((el) => getComputedStyle(el).outlineColor), 'rgb(246, 241, 235)');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await collection.locator('svg').evaluate((el) => getComputedStyle(el).transitionDuration), '0s');
    await footer.getByRole('button', { name: 'Voltar ao topo', exact: true }).click();
    assert.equal(await page.evaluate(() => scrollY), 0);
    assert.ok(await page.locator('.site-header .logo').evaluate((el) => document.activeElement === el));
    // A breakpoint change keeps the same dialogs/links, and restores compact navigation.
    if (width === 375) {
      await page.setViewportSize({ width: 768, height: 900 });
      await page.waitForFunction(() => document.querySelectorAll('.footer-disclosure[open]').length === 2);
      await footer.scrollIntoViewIfNeeded();
      await noOverflow();
      await page.setViewportSize({ width: 375, height: 900 });
      await page.waitForFunction(() => document.querySelectorAll('.footer-disclosure[open]').length === 0);
    }
    assert.deepEqual(errors, []);
    results.push({ width, height: Math.round(size.height), errors, checks: 'overflow, native disclosures, keyboard, focus, eight dialogs, links, safe space, reduced motion, back to top' });
    console.log(`Passed ${width}px`);
    await context.close();
  }
  const page = await browser.newPage();
  for (const path of ['/produtos?categoria=Sol', '/produtos?categoria=Grau', '/produtos?colecao=novidades', '/produtos']) {
    const response = await page.request.get(base + path);
    assert.equal(response.status(), 200, path);
  }
  await page.close();
  await mkdir('docs/screenshots', { recursive: true });
  for (const width of [375, 768, 1440]) await copyFile(`${output}/footer-${width}.png`, `docs/screenshots/footer-${width}.png`);
  await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
