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
async function checkFieldContrast(field, background) {
  const border = await field.evaluate((el) => getComputedStyle(el).borderTopColor);
  const surface = await background.evaluate((el) => getComputedStyle(el).backgroundColor);
  const luminance = (color) => color.match(/\d+/g).slice(0, 3).map((channel) => {
    const value = Number(channel) / 255;
    return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  }).reduce((sum, channel, index) => sum + channel * [.2126, .7152, .0722][index], 0);
  const [light, dark] = [luminance(border), luminance(surface)].sort((a, b) => b - a);
  assert.ok((light + .05) / (dark + .05) >= 3, `Field contrast: ${border} on ${surface}`);
}

async function checkMobileFocus(page) {
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').textContent(), 'Pular para o conteúdo');
  await page.keyboard.press('Enter');
  const swatches = await page.locator('.related-products .swatches button').count();
  let visited = 0;
  for (let i = 0; i < 70 && visited < swatches; i++) {
    await page.keyboard.press('Tab');
    const focus = await page.evaluate(async () => {
      await new Promise(requestAnimationFrame);
      const element = document.activeElement;
      const bounds = element.getBoundingClientRect();
      const nav = document.querySelector('.mobile-nav').getBoundingClientRect();
      const track = element.closest('.related-products-list')?.getBoundingClientRect();
      return {
        label: element.getAttribute('aria-label') ?? element.textContent.trim(),
        swatch: element.matches('.related-products .swatches button'),
        visible: bounds.top >= 0 && bounds.bottom <= nav.top && (!track || (bounds.left >= track.left - 1 && bounds.right <= track.right + 1)),
        inContent: Boolean(element.closest('main')),
      };
    });
    if (focus.inContent) assert.ok(focus.visible, `Keyboard focus obscured: ${focus.label}`);
    if (focus.swatch) visited++;
  }
  assert.ok(swatches > 0);
  assert.equal(visited, swatches);
}

try {
  for (const width of [320, 375, 430, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width < 1024, isMobile: width < 768 });
    await context.addInitScript(() => {
      window.qaCspViolations = [];
      document.addEventListener('securitypolicyviolation', (event) => {
        window.qaCspViolations.push(`${event.effectiveDirective}: ${event.blockedURI}`);
      });
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
    const home = await page.goto(base);
    if (width === 375) {
      for (const [header, value] of Object.entries({
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      })) assert.equal(await home.headerValue(header), value);
      const csp = await home.headerValue('content-security-policy');
      assert.match(csp, /frame-ancestors 'none'/);
      const scriptPolicy = csp.match(/script-src ([^;]+)/)[1];
      assert.match(scriptPolicy, /'nonce-[^']+'/);
      assert.doesNotMatch(scriptPolicy, /unsafe-inline|unsafe-eval/);
      assert.equal(await page.locator('script[nonce]').first().evaluate((script) => script.nonce), scriptPolicy.match(/'nonce-([^']+)'/)[1]);
    }
    await page.locator('.hero-media img').evaluate((img) => img.decode());
    await page.waitForTimeout(1300);
    await overflow();
    const homeVitals = await page.evaluate(() => ({ cls: window.qaCLS, lcpMs: Math.round(window.qaLCP) }));
    assert.ok(homeVitals.cls < .1, `home CLS ${homeVitals.cls}`);
    await page.screenshot({ path: `${output}/home-${width}.png`, fullPage: true });
    for (const heading of ['Destaques da coleção', 'Explore por categoria', 'Menos excesso. Mais você.']) {
      const section = page.locator('main > section[data-reveal]').filter({ has: page.getByRole('heading', { name: heading, exact: true }) });
      await section.scrollIntoViewIfNeeded();
      await section.and(page.locator('.reveal-once')).waitFor();
    }
    const reviewBand = page.locator('.review-band');
    assert.equal(await reviewBand.getAttribute('data-reveal'), null);
    for (const author of ['Marina', 'Rafael', 'Beatriz']) {
      const review = reviewBand.locator('figure[data-reveal]').filter({ has: page.locator('figcaption').filter({ hasText: author }) });
      await review.scrollIntoViewIfNeeded();
      await review.and(page.locator('.reveal-once')).waitFor();
      assert.equal(await review.evaluate((el) => getComputedStyle(el).animationName), 'review-enter');
    }
    if (width < 1024) {
      await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
      await page.waitForTimeout(450);
      assert.ok(await page.getByRole('dialog').isVisible());
      await page.keyboard.press('Tab');
      assert.ok(await page.getByRole('dialog').evaluate((el) => el.contains(document.activeElement)));
      assert.equal(await page.getByRole('dialog').getByRole('link', { name: 'Sobre o projeto', exact: true }).getAttribute('href'), '/informacoes/sobre-o-projeto');
      assert.equal(await page.getByRole('dialog').getByRole('link', { name: 'Guia de tamanhos', exact: true }).getAttribute('href'), '/informacoes/guia-de-tamanhos');
      assert.ok(await page.locator('.menu-drawer').isVisible());
      await page.locator('.menu-drawer').screenshot({ path: `${output}/menu-${width}.png` });
      await page.keyboard.press('Escape');
      await page.getByRole('dialog').waitFor({ state: 'detached' });
      assert.ok(await page.getByRole('button', { name: 'Abrir menu', exact: true }).evaluate((el) => el === document.activeElement));
    }
    assert.deepEqual(await page.evaluate(() => window.qaCspViolations), []);
    const product = await page.goto(`${base}/produto/aurora`);
    if (width === 375) assert.notEqual(await home.headerValue('content-security-policy'), await product.headerValue('content-security-policy'));
    if (width < 1024) await checkMobileFocus(page);
    await checkFieldContrast(page.locator('.shipping input'), page.locator('body'));
    const detail = page.locator('.pdp-info');
    const gallery = page.getByRole('group', { name: 'Galeria do produto' });
    const box = await gallery.boundingBox();
    await page.getByRole('button', { name: 'No rosto', exact: true }).click();
    await page.locator('.gallery-incoming').evaluate((img) => img.decode());
    await page.waitForTimeout(400);
    await detail.getByRole('button', { name: 'Preto', exact: true }).click();
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
    await detail.getByRole('button', { name: 'Tartaruga', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: 'Frente', exact: true }).getAttribute('aria-pressed'), 'true');
    for (const color of ['Vinho', 'Tartaruga', 'Preto', 'Tartaruga', 'Vinho']) await detail.getByRole('button', { name: color, exact: true }).click();
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
      await detail.getByRole('button', { name: color, exact: true }).click();
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
    // Information routes are exercised by check-footer.mjs.
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    await overflow();
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
    await page.getByRole('heading', { level: 1, name: /Resultados para.*Aurora/ }).waitFor();
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
    await page.getByRole('heading', { level: 1, name: /Resultados para.*grau/ }).waitFor();
    assert.equal(await page.locator('.product-card').count(), 3);
    if (width >= 1024) {
      await page.locator('.desktop-nav').getByRole('link', { name: 'Óculos de sol', exact: true }).click();
      await page.waitForURL('**/produtos?categoria=Sol');
      await page.getByRole('heading', { level: 1, name: 'Óculos de sol', exact: true }).waitFor();
      const active = page.locator('.desktop-nav [aria-current=page]');
      assert.equal(await active.count(), 1);
      await page.keyboard.press('Tab');
      await active.focus();
      assert.equal(await active.evaluate((el) => getComputedStyle(el).outlineStyle), 'none');
      assert.equal(await active.evaluate((el) => getComputedStyle(el, '::after').height), '3px');
      await page.locator('.site-header').screenshot({ path: `${output}/header-active-${width}.png` });
    }
    await page.getByRole('button', { name: 'Abrir carrinho (6)', exact: true }).click();
    await page.getByRole('textbox', { name: 'Cupom demonstrativo' }).fill('OCULOS10');
    await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
    assert.ok(await page.getByText('Cupom aplicado.', { exact: true }).isVisible());
    await page.getByRole('link', { name: 'Ir para o checkout', exact: true }).click();
    await page.waitForURL('**/checkout');
    await page.getByRole('heading', { level: 1, name: 'Finalizar pedido' }).waitFor();
    assert.equal(await page.locator('.checkout aside .totals').filter({ hasText: 'Aurora' }).count(), 6);
    const checkout = page.locator('.checkout form');
    assert.equal(await checkout.getAttribute('autocomplete'), 'off');
    assert.ok(await page.getByText('Use apenas dados fictícios.', { exact: false }).isVisible());
    assert.ok(await page.getByText('Desconto · OCULOS10', { exact: true }).isVisible());
    await checkFieldContrast(checkout.getByLabel('Nome completo', { exact: true }), checkout);
    await page.getByRole('button', { name: 'Simular finalização', exact: true }).click();
    const name = checkout.getByRole('textbox', { name: 'Nome completo', exact: true });
    assert.ok(await name.evaluate((el) => el === document.activeElement));
    assert.equal(await name.getAttribute('aria-invalid'), 'true');
    assert.equal(await name.getAttribute('aria-describedby'), 'erro-name');
    assert.equal(await checkout.locator('#erro-name').textContent(), 'Informe seu nome.');
    assert.equal(await checkout.locator('label #erro-name').count(), 0);
    await name.fill('Pessoa Exemplo');
    assert.equal(await name.getAttribute('aria-invalid'), null);
    await page.getByLabel(/^E-mail/).fill('exemplo@example.com');
    await page.getByLabel(/^CEP/).fill('01001-000');
    await page.getByLabel(/^Endereço/).fill('Rua Fictícia, 123');
    await page.getByRole('button', { name: 'Simular finalização', exact: true }).click();
    assert.ok(await page.getByText('Simulação concluída.', { exact: true }).isVisible());
    await overflow();
    await page.screenshot({ path: `${output}/checkout-${width}.png`, fullPage: true });
    // Verify reflow with enlarged base type; native browser zoom needs manual QA.
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await overflow();
    assert.deepEqual(await page.evaluate(() => window.qaCspViolations), []);
    assert.deepEqual(errors, []);
    results.push({ width, homeVitals, checks: 'headers, CSP, search, favorites, account, gallery, rapid selection, drawers, focus, Escape, backdrop, reduced motion, enlarged text, field contrast, coupon, checkout', errors });
    console.log(`Passed ${width}px`);
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
      await matrixPage.locator('.pdp-info').getByRole('button', { name: color, exact: true }).click();
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
  const legacyPage = await browser.newPage();
  const legacyCart = {
    items: [{ slug: 'aurora', name: 'Aurora', price: 489, color: 'Vinho', size: 'P', quantity: 2 }],
    coupon: 'FORMA10',
  };
  await legacyPage.addInitScript((state) => {
    if (!localStorage.getItem('forma-cart')) localStorage.setItem('forma-cart', JSON.stringify({ state, version: 0 }));
  }, legacyCart);
  await legacyPage.goto(`${base}/checkout`);
  await legacyPage.getByText('Desconto · OCULOS10', { exact: true }).waitFor();
  assert.deepEqual(await legacyPage.evaluate(() => JSON.parse(localStorage.getItem('forma-cart'))), {
    state: { ...legacyCart, coupon: 'OCULOS10' },
    version: 1,
  });
  await legacyPage.close();
  results.push({ legacyCart: 'items and quantities preserved, coupon migrated' });
  await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
