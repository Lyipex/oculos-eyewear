// Run against a production server. Uses an existing Playwright installation.
// PLAYWRIGHT_MODULE=/absolute/path/to/playwright-core/index.mjs node scripts/check-motion.mjs
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
const base = process.env.BASE_URL || 'http://localhost:3100';
const output = process.env.QA_OUTPUT || '/tmp/eyewear-motion-qa';
await mkdir(output, { recursive: true });
const results = [];
try {
  for (const width of [375, 430, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width < 1024, isMobile: width < 768 });
    await context.addInitScript(() => {
      window.qaCLS = 0; window.qaLCP = 0;
      new PerformanceObserver((list) => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.qaCLS += e.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => { for (const e of list.getEntries()) window.qaLCP = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`${message.text()} (${message.location().url})`); });
    page.on('response', (response) => { if (response.status() >= 400 && response.url().includes('/_next/image')) errors.push(`image ${response.status()}: ${response.url()}`); });
    const overflow = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `overflow at ${width}: ${page.url()}`);
    await page.goto(base);
    await page.locator('.hero-media img').evaluate((img) => img.decode());
    await page.waitForTimeout(1300);
    await overflow();
    const homeVitals = await page.evaluate(() => ({ cls: window.qaCLS, lcpMs: Math.round(window.qaLCP) }));
    assert.ok(homeVitals.cls < .1, `home CLS ${homeVitals.cls}`);
    await page.screenshot({ path: `${output}/home-${width}.png`, fullPage: true });
    for (const section of await page.locator('[data-reveal]').all()) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(900);
    assert.equal(await page.locator('[data-reveal].reveal-once').count(), 4);
    if (width < 1024) {
      await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
      await page.waitForTimeout(450);
      assert.ok(await page.getByRole('dialog').isVisible());
      await page.keyboard.press('Tab');
      assert.ok(await page.getByRole('dialog').evaluate((el) => el.contains(document.activeElement)));
      await page.locator('.menu-information summary').filter({ hasText: 'Sobre o projeto' }).click();
      assert.ok(await page.locator('.menu-information details[open] p').isVisible());
      await page.locator('.menu-information summary').filter({ hasText: 'Sobre o projeto' }).click();
      assert.ok(await page.locator('.menu-drawer').isVisible());
      await page.locator('.menu-drawer').screenshot({ path: `${output}/menu-${width}.png` });
      await page.keyboard.press('Escape');
      await page.getByRole('dialog').waitFor({ state: 'detached' });
      assert.ok(await page.getByRole('button', { name: 'Abrir menu', exact: true }).evaluate((el) => el === document.activeElement));
    }
    await page.goto(`${base}/produto/aurora`);
    const gallery = page.getByRole('group', { name: 'Galeria do produto' });
    const box = await gallery.boundingBox();
    await page.getByRole('button', { name: 'No rosto', exact: true }).click();
    await page.locator('.gallery-incoming').evaluate((img) => img.decode());
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Preto', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: 'No rosto', exact: true }).count(), 0);
    assert.equal(await page.getByRole('button', { name: 'Frente', exact: true }).getAttribute('aria-pressed'), 'true');
    assert.ok((await page.locator('.gallery-incoming').getAttribute('src')).includes('aurora-preto-frente'));
    await gallery.focus();
    await page.keyboard.press('ArrowLeft');
    assert.ok((await page.locator('.gallery-incoming').getAttribute('src')).includes('aurora-preto-lateral'));
    await page.keyboard.press('ArrowRight');
    assert.ok((await page.locator('.gallery-incoming').getAttribute('src')).includes('aurora-preto-frente'));
    await page.getByRole('button', { name: 'Frente', exact: true }).click();
    await page.locator('.gallery-incoming').evaluate((img) => img.decode());
    await page.waitForTimeout(400);
    assert.ok((await page.locator('.gallery-incoming').getAttribute('src')).includes('aurora-preto-frente'));
    await gallery.focus();
    await page.keyboard.press('ArrowRight');
    assert.ok((await page.locator('.gallery-incoming').getAttribute('src')).includes('aurora-preto-lateral'));
    await page.getByRole('button', { name: 'Tartaruga', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: 'Frente', exact: true }).getAttribute('aria-pressed'), 'true');
    for (const color of ['Vinho', 'Tartaruga', 'Preto', 'Tartaruga', 'Vinho']) await page.getByRole('button', { name: color, exact: true }).click();
    for (const view of ['No rosto', 'Frente', 'Em ângulo', 'No rosto']) await page.getByRole('button', { name: view, exact: true }).click();
    await page.locator('.gallery-incoming').evaluate((img) => img.decode());
    await page.waitForTimeout(450);
    assert.equal(await gallery.locator('img').count(), 1);
    assert.ok((await page.locator('.gallery-incoming').getAttribute('alt')).includes('Vinho'));
    const after = await gallery.boundingBox();
    assert.equal(after.height, box.height);
    await overflow();
    await page.screenshot({ path: `${output}/product-${width}.png`, fullPage: true });
    // Populate all color/size combinations: enough items to exercise independent scrolling.
    for (const color of ['Vinho', 'Preto', 'Tartaruga']) {
      await page.getByRole('button', { name: color, exact: true }).click();
      for (const size of ['P', 'M']) {
        await page.getByRole('button', { name: size, exact: true }).click();
        await page.locator('.add-to-cart').click();
      }
    }
    assert.equal(await page.locator('.cart-badge').textContent(), '6');
    await page.getByRole('button', { name: 'Abrir carrinho (6)', exact: true }).click();
    await page.waitForTimeout(450);
    const dialog = page.getByRole('dialog');
    assert.equal(await dialog.locator('.cart-item').count(), 6);
    assert.ok(await page.locator('.cart-scroll').evaluate((el) => el.scrollHeight > el.clientHeight));
    assert.ok(await page.evaluate(() => getComputedStyle(document.body).overflow === 'hidden' || document.body.hasAttribute('data-scroll-locked')));
    await page.locator('.cart-scroll').evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await page.getByRole('link', { name: 'Ir para o checkout' }).scrollIntoViewIfNeeded();
    await page.keyboard.press('Tab');
    assert.ok(await dialog.evaluate((el) => el.contains(document.activeElement)));
    await overflow();
    await page.screenshot({ path: `${output}/cart-${width}.png` });
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    assert.ok(await page.getByRole('button', { name: 'Abrir carrinho (6)', exact: true }).evaluate((el) => el === document.activeElement));
    await page.getByRole('button', { name: 'Abrir carrinho (6)', exact: true }).click();
    await page.waitForTimeout(450);
    await page.locator('.overlay').click({ position: { x: 5, y: 5 } });
    await dialog.waitFor({ state: 'detached' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('button', { name: 'Frente', exact: true }).click();
    await page.locator('.gallery-incoming').evaluate((img) => img.decode());
    assert.equal(await page.locator('.gallery-incoming').evaluate((el) => getComputedStyle(el).transitionDuration), '0s');
    assert.equal(await page.locator('.gallery-incoming').evaluate((el) => getComputedStyle(el).opacity), '1');
    await page.getByRole('button', { name: 'Abrir carrinho (6)', exact: true }).click();
    assert.equal(await dialog.evaluate((el) => getComputedStyle(el).animationName), 'none');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    // New footer dialogs, manual announcement, search, favorites and checkout regression.
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    await overflow();
    if (width < 768) await page.locator('.site-footer summary').filter({ hasText: 'Atendimento' }).click();
    for (const topic of ['Perguntas frequentes', 'Frete e entregas', 'Trocas e devoluções', 'Guia de tamanhos', 'Sobre o projeto', 'Privacidade', 'Termos de uso', 'Contato']) {
      const trigger = page.locator('.site-footer').getByRole('button', { name: topic, exact: true });
      await trigger.click();
      await page.getByRole('dialog').waitFor({ state: 'visible' });
      assert.ok(await page.getByRole('dialog').getByRole('heading', { name: topic, exact: true }).isVisible());
      await page.keyboard.press('Escape');
      await page.getByRole('dialog').waitFor({ state: 'detached' });
      await page.waitForFunction((el) => el === document.activeElement, await trigger.elementHandle());
    }
    if (width < 768) await page.locator('.site-footer summary').filter({ hasText: 'Atendimento' }).click();
    await page.locator('.site-footer').screenshot({ path: `${output}/footer-${width}.png` });
    await page.getByRole('button', { name: 'Voltar ao topo', exact: true }).click();
    assert.equal(await page.evaluate(() => window.scrollY), 0);
    assert.ok(await page.locator('.site-header .logo').evaluate((el) => el === document.activeElement));
    if (width < 560) {
      await page.getByRole('button', { name: 'Próxima mensagem', exact: true }).click();
      assert.equal(await page.locator('.announcement-messages span:visible').textContent(), 'Parcelamento ilustrativo');
    }
    await page.getByRole('button', { name: 'Conta demonstrativa', exact: true }).click();
    assert.ok(await page.getByText('O acesso à conta não está disponível', { exact: false }).isVisible());
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    await page.getByRole('button', { name: 'Buscar produtos', exact: true }).click();
    await page.getByRole('searchbox', { name: 'Nome ou tipo de óculos' }).fill('Aurora');
    await page.getByRole('searchbox', { name: 'Nome ou tipo de óculos' }).press('Enter');
    await page.waitForURL('**/produtos?q=Aurora');
    assert.equal(await page.locator('.product-card').count(), 1);
    await page.getByRole('button', { name: 'Favoritar Aurora, Vinho', exact: true }).click();
    await page.getByRole('button', { name: 'Favoritos', exact: true }).click();
    assert.ok(await page.getByRole('dialog').getByRole('link', { name: 'Ver Aurora, Vinho', exact: true }).isVisible());
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    await page.getByRole('button', { name: 'Buscar produtos', exact: true }).click();
    await page.getByRole('searchbox', { name: 'Nome ou tipo de óculos' }).fill('grau');
    await page.getByRole('searchbox', { name: 'Nome ou tipo de óculos' }).press('Enter');
    await page.waitForURL('**/produtos?q=grau');
    assert.equal(await page.locator('.product-card').count(), 3);
    if (width >= 1024) {
      await page.locator('.desktop-nav').getByRole('link', { name: 'Óculos de sol', exact: true }).click();
      await page.waitForURL('**/produtos?categoria=Sol');
      const active = page.locator('.desktop-nav [aria-current=page]');
      assert.equal(await active.count(), 1);
      await page.keyboard.press('Tab');
      await active.focus();
      assert.equal(await active.evaluate((el) => getComputedStyle(el).outlineStyle), 'none');
      assert.equal(await active.evaluate((el) => getComputedStyle(el, '::after').height), '3px');
      await page.locator('.site-header').screenshot({ path: `${output}/header-active-${width}.png` });
    }
    await page.getByRole('button', { name: 'Abrir carrinho (6)', exact: true }).click();
    await page.getByRole('textbox', { name: 'Cupom demonstrativo' }).fill('FORMA10');
    await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
    assert.ok(await page.getByText('Cupom aplicado.', { exact: true }).isVisible());
    await page.getByRole('link', { name: 'Ir para o checkout', exact: true }).click();
    await page.waitForURL('**/checkout');
    assert.equal(await page.locator('.checkout aside .totals').filter({ hasText: 'Aurora' }).count(), 6);
    await page.getByRole('button', { name: 'Simular finalização', exact: true }).click();
    assert.ok(await page.getByLabel('Nome completo').evaluate((el) => el === document.activeElement));
    await page.getByLabel('Nome completo').fill('Pessoa Exemplo');
    await page.getByLabel(/^E-mail/).fill('exemplo@example.com');
    await page.getByLabel(/^CEP/).fill('01001-000');
    await page.getByLabel(/^Endereço/).fill('Rua Fictícia, 123');
    await page.getByRole('button', { name: 'Simular finalização', exact: true }).click();
    assert.ok(await page.getByText('Simulação concluída.', { exact: true }).isVisible());
    await overflow();
    await page.screenshot({ path: `${output}/checkout-${width}.png`, fullPage: true });
    // Verify reflow with enlarged base type; native browser zoom needs manual QA.
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    await overflow();
    assert.deepEqual(errors, []);
    results.push({ width, homeVitals, checks: 'header, footer dialogs, search, favorites, account, gallery, rapid selection, drawers, focus, Escape, backdrop, reduced motion, enlarged text, coupon, checkout', errors });
    await context.close();
  }
  const matrixPage = await browser.newPage({ viewport: { width: 430, height: 900 } });
  const variants = {
    aurora: ['Vinho', 'Preto', 'Tartaruga'], atelier: ['Preto', 'Tartaruga'],
    atlas: ['Preto', 'Vinho'], alma: ['Tartaruga', 'Preto'],
    lume: ['Tartaruga', 'Vinho'], linha: ['Preto', 'Vinho'],
  };
  let available = 0; let missing = 0;
  for (const [slug, colors] of Object.entries(variants)) {
    await matrixPage.goto(`${base}/produto/${slug}`);
    for (const [index, color] of colors.entries()) {
      await matrixPage.getByRole('button', { name: color, exact: true }).click();
      for (const [view, label] of [['frente', 'Frente'], ['lateral', 'Em ângulo'], ['rosto', 'No rosto']]) {
        if (view === 'rosto' && index > 0) {
          assert.equal(await matrixPage.getByRole('button', { name: label, exact: true }).count(), 0);
          assert.equal(await matrixPage.locator('.photo-unavailable').count(), 0);
          missing++;
        } else {
          await matrixPage.getByRole('button', { name: label, exact: true }).click();
          const img = matrixPage.locator('.gallery-incoming');
          await img.evaluate((el) => el.decode());
          const suffix = index === 0 ? '' : `-${color.toLowerCase()}`;
          assert.ok((await img.getAttribute('src')).includes(`${slug}${suffix}-${view}.webp`));
          assert.ok((await img.getAttribute('alt')).includes(color));
          available++;
        }
      }
    }
  }
  assert.equal(available, 32); assert.equal(missing, 7);
  await matrixPage.screenshot({ path: `${output}/gallery-available-only-430.png`, fullPage: true });
  await matrixPage.emulateMedia({ reducedMotion: 'reduce' });
  await matrixPage.goto(base);
  assert.equal(await matrixPage.locator('.hero h1').evaluate((el) => getComputedStyle(el).animationName), 'none');
  await matrixPage.close();
  results.push({ inventory: { available, missing }, reducedHome: true });
  await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
