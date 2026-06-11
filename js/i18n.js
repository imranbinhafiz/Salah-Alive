// Language state + the t() helper that powers the whole bilingual UI.
import { store } from './store.js';

const FALLBACK = 'en';
let lang = store.getLang() || FALLBACK;
const listeners = new Set();

export function getLang() { return lang; }

export function setLang(l) {
  if (l !== 'en' && l !== 'bn') return;
  lang = l;
  store.setLang(l);
  document.documentElement.lang = l;
  listeners.forEach((fn) => fn(l));
}

/** Subscribe to language changes. Returns an unsubscribe fn. */
export function onLangChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

/**
 * Pick the current language out of a bilingual value.
 * Accepts {en, bn} objects, plain strings, or nullish.
 */
export function t(val) {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  return val[lang] ?? val[FALLBACK] ?? val.bn ?? '';
}

/** Has the value got real content in the current language? */
export function has(val) {
  const s = t(val);
  return typeof s === 'string' && s.trim().length > 0;
}
