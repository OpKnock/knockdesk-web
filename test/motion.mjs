import { chromium } from 'playwright';

const base = 'http://127.0.0.1:3011';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const fails = [];
  const check = (name, ok, extra) => {
    console.log((ok ? 'PASS  ' : 'FAIL  ') + name + (extra ? '  ' + extra : ''));
    if (!ok) fails.push(name);
  };

  // ---- count-up figures -------------------------------------------------
  await page.evaluate(() => document.querySelector('.kd-proof')?.scrollIntoView());
  await page.waitForTimeout(1600);
  const counts = await page.$$eval('[data-count]', (els) => els.map((e) => e.textContent));
  check('count-up figures reach their real values', counts.join(',') === '9,5', JSON.stringify(counts));

  const jump = (y) => window.scrollTo({ top: y, behavior: 'instant' });

  // ---- scroll reveal: walk the whole page first, then measure ------------
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
  });
  await page.waitForTimeout(1800);
  const reveal = await page.$$eval('[data-reveal]', (els) => els.map((e) => ({
    cls: e.className.includes('in'),
    op: parseFloat(getComputedStyle(e).opacity),
    tag: e.className,
  })));
  const someIn = reveal.filter((r) => r.cls).length;
  const dim = reveal.filter((r) => r.cls && r.op < 0.95).map((r) => r.tag);
  const allIn = dim.length === 0;
  check('reveal marks elements in and lifts them to full opacity', someIn >= 3 && allIn, `${someIn}/${reveal.length} revealed, dim: ${dim.join(' | ').slice(0, 80)}`);

  // stagger: elements share a delay ladder, not one simultaneous pop
  const staggers = await page.$$eval('[data-reveal]', (els) =>
    Array.from(new Set(els.map((e) => e.style.getPropertyValue('--d')))).filter(Boolean).length);
  check('reveal staggers by position', staggers >= 2, staggers + ' distinct delays');

  // ---- hero scroll-linked (copy fades, panel parallaxes) -----------------
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  await page.evaluate(() => window.scrollTo(0, 420));
  await page.waitForTimeout(450);
  const hero = await page.evaluate(() => {
    const copy = document.querySelector('[data-hero-copy]');
    const panel = document.querySelector('[data-hero-panel]');
    return {
      copyOpacity: copy ? parseFloat(getComputedStyle(copy).opacity) : null,
      copyTy: copy ? getComputedStyle(copy).transform : null,
      panelTy: panel ? getComputedStyle(panel).transform : null,
      heroVar: document.documentElement.style.getPropertyValue('--hero'),
    };
  });
  check('hero copy fades and lifts with scroll', hero.copyOpacity !== null && hero.copyOpacity < 0.95, JSON.stringify(hero));

  // ---- parallax drifts ---------------------------------------------------
  const drift = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('[data-parallax]'));
    return els.map((e) => getComputedStyle(e).transform);
  });
  check('parallax elements carry a scroll-linked transform', drift.every((t) => t && t !== 'none'), JSON.stringify(drift));

  // ---- scrollytelling steps ---------------------------------------------
  await page.evaluate(() => document.querySelector('[data-story]')?.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(700);
  const story = await page.evaluate(() => {
    const story = document.querySelector('[data-story]');
    const steps = Array.from(document.querySelectorAll('[data-story-step]'));
    return {
      onCount: steps.filter((s) => s.classList.contains('on')).length,
      onIndex: steps.findIndex((s) => s.classList.contains('on')),
      sp: story.style.getPropertyValue('--sp'),
    };
  });
  check('exactly one story step is active', story.onCount === 1, JSON.stringify(story));

  // scroll through the section and confirm the active step advances
  const progressed = await page.evaluate(async () => {
    const seen = [];
    for (let i = 1; i <= 8; i++) {
      window.scrollBy({ top: 240, behavior: 'instant' });
      await new Promise((res) => setTimeout(res, 240));
      const steps = Array.from(document.querySelectorAll('[data-story-step]'));
      seen.push(steps.findIndex((s) => s.classList.contains('on')));
    }
    return seen;
  });
  check('active step advances as you scroll', progressed.some((i) => i > story.onIndex), `${story.onIndex} -> ${progressed.join(',')}`);

  // ---- magnetic tilt -----------------------------------------------------
  const tilt = await page.evaluate(async () => {
    const card = document.querySelector('.kd-feature');
    const r = card.getBoundingClientRect();
    const opts = { bubbles: true, clientX: r.left + r.width * 0.85, clientY: r.top + r.height * 0.2, pointerType: 'mouse' };
    card.dispatchEvent(new PointerEvent('pointermove', opts));
    await new Promise((res) => setTimeout(res, 200));
    return {
      transform: card.style.transform,
      mx: card.style.getPropertyValue('--mx'),
    };
  });
  check('cards tilt toward the cursor', /rotate[XY]/.test(tilt.transform || ''), JSON.stringify(tilt));

  // ---- reduced motion ----------------------------------------------------
  const rm = await browser.newContext({ reducedMotion: 'reduce' });
  const rmPage = await rm.newPage();
  await rmPage.goto(base + '/', { waitUntil: 'networkidle' });
  const rmState = await rmPage.evaluate(() => {
    const el = document.querySelector('[data-reveal]');
    return { hidden: el ? parseFloat(getComputedStyle(el).opacity) < 0.9 ? 'hidden' : 'shown' : 'none' };
  });
  check('reduced motion: content is visible without animation', rmState.hidden === 'shown', JSON.stringify(rmState));

  await browser.close();
  console.log(fails.length ? '\nFAILURES: ' + fails.join(', ') : '\nALL MOTION CHECKS PASSED');
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error('HARNESS ERROR', e); process.exit(1); });
