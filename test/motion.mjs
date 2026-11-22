import { chromium } from 'playwright-core';

const base = 'http://127.0.0.1:3005';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
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
    cls: e.hasAttribute('data-revealed'),
    op: parseFloat(getComputedStyle(e).opacity),
    tag: e.className,
    // scrollytelling steps are deliberately dimmed while another one is active
    intentional: e.classList.contains('kd-step'),
  })));
  const someIn = reveal.filter((r) => r.cls).length;
  const dim = reveal.filter((r) => r.cls && !r.intentional && r.op < 0.95).map((r) => r.tag);
  const allIn = dim.length === 0;
  check('GSAP reveals mark elements revealed and lift them to full opacity', someIn >= 3 && allIn, `${someIn}/${reveal.length} revealed, dim: ${dim.join(' | ').slice(0, 80)}`);

  // cards cascade through ScrollTrigger.batch; all must have played by now
  const cards = await page.$$eval('[data-reveal="card"]', (els) => els.map((e) => e.hasAttribute('data-revealed')));
  check('every card in a grid has revealed', cards.length > 0 && cards.every(Boolean), cards.length + ' cards');

  // layer list: collapsed until picked, then exactly one row open with real height
  const flow = await page.evaluate(async () => {
    const rows = Array.from(document.querySelectorAll('.kd-flow-row'));
    const before = rows.filter((r) => r.dataset.open === 'true').length;
    document.querySelectorAll('.kd-flow-btn')[1].click();
    await new Promise((res) => setTimeout(res, 700));
    const open = Array.from(document.querySelectorAll('.kd-flow-row')).filter((r) => r.dataset.open === 'true');
    const panel = open[0]?.querySelector('.kd-flow-panel-inner');
    return {
      rows: rows.length,
      before,
      openCount: open.length,
      panelH: panel ? Math.round(panel.getBoundingClientRect().height) : 0,
      titles: rows.map((r) => r.querySelector('.kd-flow-title').textContent.trim()),
    };
  });
  check('layer list is collapsed until a row is picked, then one row opens',
    flow.rows === 4 && flow.before === 0 && flow.openCount === 1 && flow.panelH > 40, JSON.stringify(flow));

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
  check('hero copy fades and lifts with scroll (GSAP scrub)', hero.copyOpacity !== null && hero.copyOpacity < 0.95, JSON.stringify(hero));

  // ---- parallax drifts ---------------------------------------------------
  const drift = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('[data-parallax]'));
    return els.map((e) => getComputedStyle(e).transform);
  });
  check('parallax elements carry a scroll-linked transform', drift.every((t) => t && t !== 'none'), JSON.stringify(drift));

  // ---- inside the app: the three captures keep their native ratio --------
  const shots = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.kd-shot img').forEach((img) => {
      // offsetWidth/Height is the layout box, so the globe's 3D turn does not
      // skew the measurement the way getBoundingClientRect would.
      out.push({
        w: img.offsetWidth,
        h: img.offsetHeight,
        ratio: +(img.offsetWidth / img.offsetHeight).toFixed(3),
        natural: +(img.naturalWidth / img.naturalHeight).toFixed(3),
      });
    });
    return out;
  });
  check('every capture renders at its native ratio, uncropped',
    shots.length === 3 && shots.every((s) => Math.abs(s.ratio - s.natural) < 0.01), JSON.stringify(shots));

  // the world-monitor globe is turning
  const globe = await page.evaluate(() => {
    const img = document.querySelector('.kd-globe-img');
    if (!img) return null;
    const cs = getComputedStyle(img);
    return { transform: cs.transform, name: cs.animationName };
  });
  check('the world monitor globe animates', globe && globe.name === 'kd-drift' && globe.transform !== 'none', JSON.stringify(globe));

  // ---- scrollytelling steps ---------------------------------------------
  // Start where the trigger starts (story top at 78% of the viewport), so the
  // scroll-through below actually walks the range instead of starting past it.
  await page.evaluate(() => {
    const story = document.querySelector('[data-story]');
    if (!story) return;
    const top = story.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top - window.innerHeight * 0.78, behavior: 'instant' });
  });
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

  // scroll through the section and confirm the active step advances.
  // The assertion has to be "the active step changes", not "it increases":
  // by the time the section is centred the trigger is already well past its
  // start, so the active index is often already at the last step and scrolling
  // further can only leave it there.
  const progressed = await page.evaluate(async () => {
    const story = document.querySelector('[data-story]');
    const steps = Array.from(document.querySelectorAll('[data-story-step]'));
    const seen = new Set();
    // walk from just above the section down past it
    const top = story.getBoundingClientRect().top + window.scrollY;
    for (let y = top - window.innerHeight * 0.9; y <= top + window.innerHeight * 0.9; y += 60) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((res) => setTimeout(res, 45));
      seen.add(steps.findIndex((s) => s.classList.contains('on')));
    }
    return [...seen].sort((a, b) => a - b);
  });
  check(
    'active step advances across the section',
    progressed.length > 1 && progressed[0] === 0 && progressed[progressed.length - 1] === 2,
    'distinct active steps seen = ' + JSON.stringify(progressed)
  );

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
