import { chromium } from 'playwright';

const OUT = process.env.TEMP + '\\site-shots';
const base = 'http://127.0.0.1:3011';

(async () => {
  const browser = await chromium.launch();
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
    const win = document.querySelector('.kd-panel-window');
    const wrap = document.querySelector('.kd-panel');
    return { px: getComputedStyle(wrap).getPropertyValue('--px').trim(), py: getComputedStyle(wrap).getPropertyValue('--py').trim() };
  });
  check('hero panel parallax responds', tilt.px !== '' && tilt.px !== '0', JSON.stringify(tilt));

  // --- layer slips: every one must be clickable -------------------------
  const count = await page.$$eval('.kd-slip', (e) => e.length);
  check('four slips render', count === 4, 'count=' + count);

  const rects = await page.$$eval('.kd-slip', (els) =>
    els.map((e) => {
      const r = e.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom), pos: getComputedStyle(e).position };
    }));
  check('slips are absolutely stacked (not in flow)', rects.every((r) => r.pos === 'absolute'), JSON.stringify(rects[0]));

  for (let i = 0; i < count; i++) {
    await page.$$eval('.kd-slip', (els, idx) => els[idx].click(), i);
    await page.waitForTimeout(420);
    const state = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('.kd-slip'));
      return {
        active: els.findIndex((e) => e.dataset.active === 'true'),
        blurb: document.querySelector('.kd-layers-blurb').textContent.trim(),
        points: document.querySelectorAll('.kd-layers-info li').length,
        overlap: els.every((e) => {
          const t = getComputedStyle(e).transform;
          return t !== 'none';
        }),
      };
    });
    check(`slip ${i} selects and shows its info`, state.active === i && state.points === 3,
      `active=${state.active} points=${state.points} overlap=${state.overlap} blurb="${state.blurb.slice(0, 46)}"`);
  }

  // keyboard reachability
  await page.evaluate(() => document.querySelectorAll('.kd-slip')[2].focus());
  await page.keyboard.press('Enter');
  await page.waitForTimeout(350);
  const kb = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.kd-slip')).findIndex((e) => e.dataset.active === 'true'));
  check('slips work from the keyboard', kb === 2, 'active=' + kb);

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
