import { t } from '../i18n.js';
import { ui } from '../ui.js';
import { loadSurahIndex, loadSurah, loadSalah } from '../data.js';
import { esc, icon } from '../components.js';

const moonSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

export async function review(param) {
  if (!param) return picker();
  if (param === 'salah') return salahReview();
  return surahReview(param);
}

async function picker() {
  const list = await loadSurahIndex();
  const surahLinks = list.map((s) =>
    `<a class="btn btn--ghost btn--block" href="#/review/${esc(s.id)}" data-link>${esc(t(s.name))} · ${esc(s.name.ar)}</a>`,
  ).join('');

  return `
    <header class="pagehead">
      <div class="pagehead__kicker">${esc(t(ui('review.kicker')))}</div>
      <h1 class="pagehead__title">${esc(t(ui('review.title')))}</h1>
      <p class="pagehead__sub">${esc(t(ui('review.sub')))}</p>
    </header>
    <div class="review-pick">
      <a class="btn btn--primary btn--block btn--lg" href="#/review/salah" data-link>${moonSvg} ${esc(t(ui('review.salah')))}</a>
      <div class="section-label" style="margin-top:var(--s-4)">${esc(t(ui('review.surahsLabel')))}</div>
      ${surahLinks}
    </div>
  `;
}

async function salahReview() {
  const data = await loadSalah();
  const steps = (data.steps || []).slice().sort((a, b) => a.order - b.order);
  const items = steps.filter((s) => s.arabic).map((s) => `
    <div class="review-item">
      <p class="ar">${esc(s.arabic)}</p>
      <p class="review-item__mean">${esc(t(s.meaning))}</p>
    </div>`).join('');
  return `
    <a class="backlink" href="#/review" data-link>${icon('back')} ${esc(t(ui('review.back')))}</a>
    <header class="pagehead center"><h1 class="pagehead__title">${esc(t(ui('review.salah')))}</h1></header>
    <div class="card review-card">${items}</div>
  `;
}

async function surahReview(id) {
  const data = await loadSurah(id);
  const items = data.ayahs.map((a) => `
    <div class="review-item">
      <p class="ar">${esc(a.arabic)}</p>
      <p class="review-item__mean">${esc(t(a.translation))}</p>
    </div>`).join('');
  return `
    <a class="backlink" href="#/review" data-link>${icon('back')} ${esc(t(ui('review.back')))}</a>
    <header class="pagehead center">
      <p class="ar" style="text-align:center">${esc(data.name.ar)}</p>
      <h1 class="pagehead__title">${esc(t(data.name))}</h1>
    </header>
    <div class="card review-card">${items}</div>
  `;
}
