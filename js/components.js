// Reusable HTML builders. Interactions are wired via event delegation in app.js.
import { t } from './i18n.js';
import { ui } from './ui.js';

/** Escape for safe insertion into attributes / text. */
export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ---- Icons (inline SVG, currentColor) ---- */
const ICONS = {
  chevron: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  play: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  back: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
};
export const icon = (name) => ICONS[name] || '';

/** Custom disclosure (accordion). `summary` and `content` are HTML strings. */
export function disclose(summary, content, { open = false } = {}) {
  return `
    <section class="disclose${open ? ' is-open' : ''}" data-disclose>
      <button class="disclose__summary" data-action="toggle-disclose" aria-expanded="${open}">
        <span class="disclose__summary-inner">${summary}</span>
        <span class="disclose__chevron" aria-hidden="true">${icon('chevron')}</span>
      </button>
      <div class="disclose__body"><div class="disclose__inner">
        <div class="disclose__content">${content}</div>
      </div></div>
    </section>`;
}

/** Word-by-word: tappable Arabic chips + a reveal panel. */
export function wordByWord(ayahKey, words = []) {
  if (!words.length) return '';
  const chips = words.map((w, i) => `
    <button class="wordchip" data-action="word" data-detail="${esc(ayahKey)}"
            data-ar="${esc(w.ar)}" data-tr="${esc(t(w.tr))}" data-mean="${esc(t(w.meaning))}"
            aria-label="${esc(t(w.meaning))}">
      <span class="wordchip__ar">${esc(w.ar)}</span>
    </button>`).join('');
  return `
    <div class="words" data-wordrow="${esc(ayahKey)}">${chips}</div>
    <div class="word-detail" data-word-detail="${esc(ayahKey)}">
      <span class="word-detail__placeholder">${esc(t(ui('labels.tapWord')))}</span>
    </div>`;
}

/** Audio play/pause button for one ayah. */
export function audioBtn(surahNum, ayahNum, label) {
  const lbl = label != null ? `<span>${esc(label)}</span>` : '';
  return `<button class="audiobtn${label == null ? ' audiobtn--icon' : ''}" data-action="play-ayah"
            data-surah="${surahNum}" data-ayah="${ayahNum}"
            aria-label="${esc(t(ui('labels.playAyah')))}">
            <span class="audiobtn__ico">${icon('play')}</span>${lbl}</button>`;
}

/** "I know this ✓" progress toggle. */
export function knowBtn(id, known) {
  return `<button class="knowbtn${known ? ' is-done' : ''}" data-action="know" data-id="${esc(id)}" aria-pressed="${!!known}">
    <span class="knowbtn__box">${known ? icon('check') : ''}</span>
    <span class="knowbtn__label">${esc(t(known ? ui('labels.known') : ui('labels.iKnowThis')))}</span>
  </button>`;
}

/** Acknowledgement footer — removed. */
export function ackFooter() { return ''; }

/** Review notice — removed. */
export function reviewNotice() { return ''; }

export const sectionLabel = (txt) => `<div class="section-label">${esc(txt)}</div>`;
