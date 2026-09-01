import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
p.on('console', m => { if (m.type() === 'error' && !m.text().includes('ERR_CONNECTION')) errs.push('CONSOLE: ' + m.text()); });

await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
await p.screenshot({ path: out + '/d1-shelf.png' });

// переключаем на светлую
await p.click('.theme-toggle');
await p.waitForTimeout(800);
await p.screenshot({ path: out + '/l1-shelf.png' });
console.log('theme attr after toggle:', await p.evaluate(() => document.documentElement.dataset.theme));
console.log('stored:', await p.evaluate(() => localStorage.getItem('polina-theme')));

await p.click('a[aria-label^="Тема 6."]');
await p.waitForTimeout(1300);
await p.screenshot({ path: out + '/l2-reader.png' });

await p.keyboard.press('Escape');
await p.waitForTimeout(600);
await p.goto('http://localhost:4173/about', { waitUntil: 'networkidle' });
await p.waitForTimeout(700);
console.log('theme persisted after reload:', await p.evaluate(() => document.documentElement.dataset.theme));
await p.screenshot({ path: out + '/l3-about.png' });

await p.goto('http://localhost:4173/cabinet', { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
await p.screenshot({ path: out + '/l4-cabinet.png' });

await p.setViewportSize({ width: 390, height: 844 });
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await p.waitForTimeout(900);
await p.screenshot({ path: out + '/l5-mobile.png' });
await p.click('a[aria-label^="Тема 1."]');
await p.waitForTimeout(1200);
await p.screenshot({ path: out + '/l6-mobile-reader.png' });

console.log(errs.length ? errs.join('\n') : 'NO JS ERRORS');
await b.close();
