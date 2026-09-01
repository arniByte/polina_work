import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await p.waitForTimeout(900);
console.log(await p.evaluate(() => {
  const rows = [];
  document.querySelectorAll('.spine-slot').forEach((slot, i) => {
    if (i > 2) return;
    const foot = slot.querySelector('.spine__foot');
    const title = slot.querySelector('.spine__title');
    if (!foot) return;
    rows.push(`#${i}: title=${getComputedStyle(title).color} foot=${getComputedStyle(foot).color} inkTop=${slot.style.getPropertyValue('--ink-top')} inkBot=${slot.style.getPropertyValue('--ink-bot')}`);
  });
  return rows.join('\n');
}));
await b.close();
