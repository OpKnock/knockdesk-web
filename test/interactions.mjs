import { chromium } from 'playwright-core';

const OUT = process.env.TEMP + '\\site-shots';
const base = process.env.KD_BASE || 'http://127.0.0.1:3005';

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
    return { exists: !!el };
  });
  check('no orange hover ring is drawn over options', !ring.exists, JSON.stringify(ring));

  // --- hero showcase -----------------------------------------------------
  const hero = await page.evaluate(() => {
    const frame = document.querySelector('.kd-showcase-frame');
    const wrap = document.querySelector('.kd-showcase');
    return {
      hasFrame: !!frame,
      hasWrap: !!wrap,
      acc: wrap ? getComputedStyle(wrap).getPropertyValue('--acc').trim() : '',
    };
  });
  check('hero renders the app showcase', hero.hasFrame && hero.hasWrap && hero.acc !== '', JSON.stringify(hero));

  // --- app showcase: the themes rotate -----------------------------------
  const shotCount = await page.$$eval('.kd-showcase-shot', (e) => e.length);
  check('four theme captures render', shotCount === 4, 'count=' + shotCount);

  const shown = await page.$$eval('.kd-showcase-shot', (els) =>
    els.filter((e) => e.dataset.on === 'true').length);
  check('exactly one theme is visible', shown === 1, 'visible=' + shown);

  // the frame keeps the capture's native 16:9 ratio
  const ratio = await page.$eval('.kd-showcase-frame', (e) => {
    const r = e.getBoundingClientRect();
    return r.width / r.height;
  });
  check('showcase frame keeps the 1917x1078 ratio', Math.abs(ratio - 1917 / 1078) < 0.02, 'ratio=' + ratio.toFixed(3));

  // clicking a dot switches theme. Hover first: hovering pauses the carousel,
  // so the assertion is not racing the auto-advance.
  await page.hover('.kd-showcase-dots');
  await page.waitForTimeout(400);
  await page.evaluate(() => document.querySelectorAll('.kd-showcase-dots button')[2].click());
  await page.waitForTimeout(800);
  const onDot = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.kd-showcase-dots button')).findIndex((b) => b.getAttribute('aria-pressed') === 'true'));
  check('theme dots switch the capture', onDot === 2, 'dot=' + onDot);

  const shownAfter = await page.$$eval('.kd-showcase-shot', (els) =>
    els.findIndex((e) => e.dataset.on === 'true'));
  check('the matching capture is the visible one', shownAfter === 2, 'shot=' + shownAfter);

  // it also advances on its own, one step at a time
  await page.mouse.move(20, 20);
  await page.waitForTimeout(400);
  const before = await page.evaluate(() => Number(document.querySelector('.kd-showcase')?.dataset.active));
  await page.waitForTimeout(3400);
  const after = await page.evaluate(() => Number(document.querySelector('.kd-showcase')?.dataset.active));
  check('the theme carousel advances on its own, one step at a time',
    after === (before + 1) % 4, `${before} -> ${after}`);

  // --- layer rows: every one must be clickable ----------------------------
  const count = await page.$$eval('.kd-flow-btn', (e) => e.length);
  check('four layer rows render', count === 4, 'count=' + count);

  // nothing is open until the reader picks one
  const initialOpen = await page.$$eval('.kd-flow-row', (els) => els.filter((e) => e.dataset.open === 'true').length);
  check('all layer rows start closed', initialOpen === 0, 'open=' + initialOpen);

  const rects = await page.$$eval('.kd-flow-row', (els) =>
    els.map((e) => {
      const r = e.getBoundingClientRect();
      return { top: Math.round(r.top), h: Math.round(r.height), pos: getComputedStyle(e).position };
    }));
  check('rows sit in normal flow and stack downward',
    rects.every((r) => r.pos !== 'absolute' && r.h > 0) &&
    rects.every((r, i) => i === 0 || r.top > rects[i - 1].top), JSON.stringify(rects.map((r) => r.top)));

  for (let i = 0; i < count; i++) {
    await page.$$eval('.kd-flow-btn', (els, idx) => els[idx].click(), i);
    await page.waitForTimeout(560);
    const state = await page.evaluate((idx) => {
      const rows = Array.from(document.querySelectorAll('.kd-flow-row'));
      const row = rows[idx];
      const panel = row.querySelector('.kd-flow-panel-inner');
      return {
        open: rows.findIndex((r) => r.dataset.open === 'true'),
        expanded: row.querySelector('.kd-flow-btn').getAttribute('aria-expanded'),
        blurb: row.querySelector('.kd-flow-blurb').textContent.trim(),
        points: row.querySelectorAll('.kd-flow-points li').length,
        panelH: Math.round(panel.getBoundingClientRect().height),
        title: row.querySelector('.kd-flow-title').textContent.trim(),
      };
    }, i);
    check(`layer ${i} opens and shows its detail`,
      state.open === i && state.expanded === 'true' && state.points === 3 && state.panelH > 40,
      `open=${state.open} points=${state.points} panelH=${state.panelH} title="${state.title}" blurb="${state.blurb.slice(0, 40)}"`);
  }

  // clicking the open row again closes it
  await page.$$eval('.kd-flow-btn', (els, idx) => els[idx].click(), 3);
  await page.waitForTimeout(560);
  const closed = await page.$$eval('.kd-flow-row', (els) => els.filter((e) => e.dataset.open === 'true').length);
  check('clicking an open row closes it', closed === 0, 'open=' + closed);

  // keyboard reachability (bring the list on screen first, so the rows have
  // finished their reveal and the buttons can take focus)
  await page.evaluate(() => {
    const flow = document.querySelector('.kd-flow');
    const top = flow.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top - window.innerHeight * 0.3, behavior: 'instant' });
  });
  await page.waitForTimeout(900);
  await page.evaluate(() => document.querySelectorAll('.kd-flow-btn')[2].focus());
  const focused = await page.evaluate(() =>
    document.activeElement?.classList.contains('kd-flow-btn') ?? false);
  check('layer row buttons can take focus', focused, 'focused=' + focused);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  const kb = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.kd-flow-row')).findIndex((e) => e.dataset.open === 'true'));
  check('layer rows work from the keyboard', kb === 2, 'open=' + kb);

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
