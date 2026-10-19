import { chromium } from 'playwright-core';

const OUT = 'test/shots/';
const base = 'http://127.0.0.1:3005';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const fails = [];
  const check = (name, ok, extra) => {
    console.log((ok ? 'PASS  ' : 'FAIL  ') + name + (extra ? '  ' + extra : ''));
    if (!ok) fails.push(name);
  };

  await page.goto(base + '/', { waitUntil: 'networkidle' });

  // --- cursor atmosphere ------------------------------------------------
  await page.mouse.move(700, 300);
  await page.mouse.move(820, 420);
  await page.waitForTimeout(600);
  const glow = await page.evaluate(() => {
    const el = document.querySelector('.kd-cursor-glow');
    const cs = getComputedStyle(el);
    return { gx: parseFloat(cs.getPropertyValue('--gx')), gy: parseFloat(cs.getPropertyValue('--gy')), op: cs.opacity };
  });
  check('cursor glow tracks the pointer', Math.abs(glow.gx - 820) < 3 && Math.abs(glow.gy - 420) < 3 && glow.op === '1', JSON.stringify(glow));

  const navLink = await page.$('.kd-nav-links a');
  await navLink.hover();
  await page.waitForTimeout(450);
  const ring = await page.evaluate(() => {
    const el = document.querySelector('.kd-cursor-ring');
    return { on: el.dataset.on, rw: el.style.getPropertyValue('--rw'), rx: el.style.getPropertyValue('--rx') };
  });
  check('focus ring snaps to the hovered link', ring.on === 'true' && ring.rw !== '', JSON.stringify(ring));

  // --- hero panel parallax ----------------------------------------------
  await page.mouse.move(1180, 500, { steps: 8 });
  await page.waitForTimeout(700);
  const tilt = await page.evaluate(() => {
    const wrap = document.querySelector('.kd-panel');
    return { px: getComputedStyle(wrap).getPropertyValue('--px').trim(), py: getComputedStyle(wrap).getPropertyValue('--py').trim() };
  });
  check('hero panel parallax responds', tilt.px !== '' && tilt.px !== '0', JSON.stringify(tilt));

  // --- data-flow diagram: every layer must be selectable ----------------
  const count = await page.$$eval('.kd-flow-row', (e) => e.length);
  check('four layers render', count === 4, 'count=' + count);

  // The layers run top to bottom, and the network boundary sits between the
  // third and the fourth.
  const order = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.kd-flow-row')];
    const boundary = document.querySelector('.kd-flow-boundary');
    return {
      tops: rows.map((r) => Math.round(r.getBoundingClientRect().top)),
      boundaryTop: boundary ? Math.round(boundary.getBoundingClientRect().top) : null,
      lastIsOut: rows[3] ? rows[3].classList.contains('kd-flow-row-out') : false,
    };
  });
  check('layers are stacked in order', order.tops.every((t, i) => i === 0 || t > order.tops[i - 1]), JSON.stringify(order.tops));
  check('the network boundary sits above the outbound layer',
    order.boundaryTop !== null && order.boundaryTop < order.tops[3] && order.boundaryTop > order.tops[2],
    `boundary=${order.boundaryTop} last=${order.tops[3]}`);
  check('only the last layer is the outbound one', order.lastIsOut === true);

  for (let i = 0; i < count; i++) {
    await page.$$eval('.kd-flow-row', (els, idx) => els[idx].click(), i);
    await page.waitForTimeout(420);
    const state = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.kd-flow-row'));
      return {
        active: rows.findIndex((e) => e.classList.contains('is-active')),
        blurb: document.querySelector('.kd-flow-blurb')?.textContent.trim() || '',
        points: document.querySelectorAll('.kd-flow-points li').length,
        files: document.querySelectorAll('.kd-flow-file').length,
      };
    });
    check(`layer ${i} selects and shows its info`, state.active === i && state.points === 3 && state.files > 0,
      `active=${state.active} points=${state.points} files=${state.files} blurb="${state.blurb.slice(0, 46)}"`);
  }

  // keyboard reachability
  // Wait for the scroll reveal to finish first: the diagram is hidden with
  // `visibility: hidden` until its tween completes, and .focus() on a hidden
  // element is a silent no-op.
  await page.evaluate(() => document.querySelector('.kd-flow')?.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForFunction(() => {
    const el = document.querySelectorAll('.kd-flow-row')[2];
    return el && getComputedStyle(el).visibility === 'visible';
  }, null, { timeout: 5000 });
  await page.evaluate(() => document.querySelectorAll('.kd-flow-row')[2].focus());
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  const kb = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.kd-flow-row')).findIndex((e) => e.classList.contains('is-active')));
  check('layers work from the keyboard', kb === 2, 'active=' + kb);

  // Opening a layer must not resize its row. When it did, the focus ring was
  // laid out against the old box and drew across the middle of the card.
  const stable = await page.evaluate(async () => {
    const row = document.querySelectorAll('.kd-flow-row')[1];
    row.focus();
    const before = Math.round(row.getBoundingClientRect().height);
    row.click();
    await new Promise((r) => setTimeout(r, 500));
    const after = Math.round(row.getBoundingClientRect().height);
    const detailBefore = Math.round(document.querySelector('.kd-flow-detail').getBoundingClientRect().height);
    return { before, after, detailBefore, outline: getComputedStyle(row).outlineStyle };
  });
  check('opening a layer does not resize the row', stable.before === stable.after,
    `height ${stable.before} -> ${stable.after}`);

  // Switching layers must not move the page either.
  const pageStable = await page.evaluate(async () => {
    const detail = document.querySelector('.kd-flow-detail');
    const heights = [];
    for (let i = 0; i < 4; i++) {
      document.querySelectorAll('.kd-flow-row')[i].click();
      await new Promise((r) => setTimeout(r, 500));
      heights.push(Math.round(detail.getBoundingClientRect().height));
    }
    return heights;
  });
  check('the detail panel keeps a constant height across layers',
    new Set(pageStable).size === 1, 'heights=' + JSON.stringify(pageStable));

  // --- FAQ accordion -----------------------------------------------------
  const faqCount = await page.$$eval('.kd-faq-q', (e) => e.length);
  check('every question has a button', faqCount >= 5, 'count=' + faqCount);

  // No <summary> is left anywhere. Chrome paints the native disclosure marker
  // for a summary on top of the first letter and ignores every way of hiding
  // it, so the questions are plain buttons instead.
  const summaryCount = await page.$$eval('summary', (e) => e.length);
  check('no native summary markers are left', summaryCount === 0, 'summaries=' + summaryCount);

  // The first question starts closed and opens on click.
  const faqState = async () => page.evaluate(() => {
    const btn = document.querySelector('.kd-faq-q');
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    return {
      expanded: btn.getAttribute('aria-expanded'),
      panelHeight: Math.round(panel.getBoundingClientRect().height),
      text: btn.textContent.trim().slice(0, 24),
    };
  });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const closed = await faqState();
  check('the first question starts closed', closed.expanded === 'false' && closed.panelHeight === 0, JSON.stringify(closed));

  await page.click('.kd-faq-q');
  await page.waitForTimeout(600);
  const opened = await faqState();
  check('clicking a question opens it', opened.expanded === 'true' && opened.panelHeight > 20, JSON.stringify(opened));

  await page.click('.kd-faq-q');
  await page.waitForTimeout(600);
  const reclosed = await faqState();
  check('clicking it again closes it', reclosed.expanded === 'false' && reclosed.panelHeight === 0, JSON.stringify(reclosed));

  // The search still filters.
  await page.fill('#faq-search', 'free');
  await page.waitForTimeout(400);
  const filtered = await page.$$eval('.kd-faq-q', (e) => e.length);
  check('the FAQ search filters the questions', filtered > 0 && filtered < faqCount, 'showing ' + filtered + ' of ' + faqCount);
  await page.fill('#faq-search', '');

  // --- the outlined button must not flash white on hover -----------------
  // In the dark theme the hover fill used to invert to near-white, which read
  // as a broken button.
  const darkCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const darkPage = await darkCtx.newPage();
  await darkPage.goto(base + '/download', { waitUntil: 'networkidle' });
  await darkPage.waitForTimeout(400);
  const sec = darkPage.locator('.kd-build-actions button').first();
  await sec.scrollIntoViewIfNeeded();
  await sec.hover();
  await darkPage.waitForTimeout(350);
  const secColors = await sec.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { bg: cs.backgroundColor, color: cs.color };
  });
  const lum = (rgb) => {
    const m = rgb.match(/\d+/g).map(Number);
    return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2];
  };
  const bgLum = lum(secColors.bg);
  const fgLum = lum(secColors.color);
  check('the outlined button does not flash white on hover in the dark theme',
    bgLum < 120 || fgLum > 200, JSON.stringify(secColors));
  await darkCtx.close();

  // --- the caret must fade, not switch on and off ------------------------
  const lightCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const lightPage = await lightCtx.newPage();
  await lightPage.goto(base + '/', { waitUntil: 'networkidle' });
  await lightPage.waitForTimeout(500);
  const caret = await lightPage.evaluate(() => {
    const c = document.querySelector('.kd-panel-caret');
    if (!c) return null;
    const cs = getComputedStyle(c);
    return { name: cs.animationName, timing: cs.animationTimingFunction };
  });
  check('the typing caret fades instead of blinking hard',
    !!caret && !/steps/.test(caret.timing), JSON.stringify(caret));

  // A duplicated @keyframes block silently overrides the earlier one, which
  // is how the hard blink came back after being fixed.
  const dupes = await lightPage.evaluate(() => {
    const names = new Map();
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      for (const rule of rules) {
        if (rule.type === CSSRule.KEYFRAMES_RULE) {
          names.set(rule.name, (names.get(rule.name) || 0) + 1);
        }
      }
    }
    return [...names].filter(([, n]) => n > 1).map(([name, n]) => `${name} x${n}`);
  });
  check('no keyframes are defined twice', dupes.length === 0, dupes.join(', '));
  await lightCtx.close();

  // --- orb is gone, no API-costs text anywhere ---------------------------
  const body = await page.content();
  check('orb visual removed', !body.includes('kd-avatar'));
  check('no "API costs may apply" copy', !body.includes('API costs may apply'));

  // --- screenshots --------------------------------------------------------
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: OUT + '-home-hero.png' });
  await page.evaluate(() => document.querySelector('#layers').scrollIntoView());
  await page.waitForTimeout(900);
  await page.screenshot({ path: OUT + '-layers.png' });
  await page.evaluate(() => document.querySelector('#features').scrollIntoView());
  await page.waitForTimeout(700);
  await page.screenshot({ path: OUT + '-features.png' });
  await page.goto(base + '/download', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + '-download.png', fullPage: true });

  await browser.close();
  console.log(fails.length ? '\nFAILURES: ' + fails.join(', ') : '\nALL CHECKS PASSED');
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error('HARNESS ERROR', e); process.exit(1); });
