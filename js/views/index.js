import { t } from '../i18n.js';
import { ui } from '../ui.js';
import { esc } from '../components.js';

export { home } from './home.js';
export { surahs } from './surahs.js';
export { surah } from './surah.js';
export { salah } from './salah.js';
export { review } from './review.js';

export function notFound() {
  return `<div class="card center">
    <h2>${esc(t(ui('notFound.title')) || 'Not found')}</h2>
    <p class="muted">${esc(t(ui('notFound.body')) || '')}</p>
    <a class="btn btn--primary" href="#/" data-link style="margin-top:var(--s-4)">${esc(t(ui('nav.home')))}</a>
  </div>`;
}
