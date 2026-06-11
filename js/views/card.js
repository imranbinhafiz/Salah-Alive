import { t, has } from '../i18n.js';
import { ui } from '../ui.js';
import { loadSalah } from '../data.js';
import { esc, icon } from '../components.js';

const printSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`;

export async function card() {
  const data = await loadSalah();
  const steps = (data.steps || []).slice().sort((a, b) => a.order - b.order);

  const rows = steps.map((s) => `
    <div class="companion__row">
      <div class="companion__title">${s.order}. ${esc(t(s.title))}${has(s.position) ? ` · ${esc(t(s.position))}` : ''}</div>
      ${has(s.arabic) ? `<p class="ar companion__ar">${esc(s.arabic)}</p>` : ''}
      ${has(s.meaning) ? `<p class="companion__mean">${esc(t(s.meaning))}</p>` : ''}
    </div>`).join('');

  return `
    <a class="backlink" href="#/salah" data-link>${icon('back')} ${esc(t(ui('nav.salah')))}</a>
    <header class="pagehead">
      <div class="pagehead__kicker">${esc(t(ui('card.kicker')))}</div>
      <h1 class="pagehead__title">${esc(t(ui('card.title')))}</h1>
      <p class="pagehead__sub">${esc(t(ui('card.sub')))}</p>
    </header>
    <button class="btn btn--primary btn--block" data-action="print">${printSvg} ${esc(t(ui('card.print')))}</button>
    <div class="card" style="margin-top:var(--s-4)">${rows}</div>
  `;
}
