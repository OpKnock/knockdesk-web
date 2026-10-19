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
