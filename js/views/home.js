import { t } from '../i18n.js';
import { ui } from '../ui.js';
import { esc, icon } from '../components.js';

const heroMarkSvg = `<svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><circle cx="17.5" cy="6.5" r="1.3"/></svg>`;
const moonSvg     = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const bookSvg     = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
const reviewSvg   = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

export async function home() {
  return `
    <section class="hero">
      <div class="hero__mark" aria-hidden="true">${heroMarkSvg}</div>
      <h1 class="hero__title">${esc(t(ui('heroTitle')))}</h1>
      <p class="hero__quote">${esc(t(ui('home.quote')))}</p>
    </section>

    <a class="module-card" href="#/surahs" data-link>
      <div class="module-card__icon" aria-hidden="true">${bookSvg}</div>
      <h2 class="module-card__title">${esc(t(ui('home.surahsTitle')))}</h2>
      <p class="module-card__desc">${esc(t(ui('home.surahsDesc')))}</p>
      <span class="module-card__go">${esc(t(ui('home.start')))} ${icon('arrow')}</span>
    </a>

    <a class="module-card" href="#/salah" data-link>
      <div class="module-card__icon" aria-hidden="true">${moonSvg}</div>
      <h2 class="module-card__title">${esc(t(ui('home.salahTitle')))}</h2>
      <p class="module-card__desc">${esc(t(ui('home.salahDesc')))}</p>
      <span class="module-card__go">${esc(t(ui('home.start')))} ${icon('arrow')}</span>
    </a>

    <div class="row">
      <a class="btn btn--ghost" href="#/review" data-link>${reviewSvg} ${esc(t(ui('nav.review')))}</a>
    </div>
  `;
}
