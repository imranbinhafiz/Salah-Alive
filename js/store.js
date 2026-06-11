// Persisted state (localStorage). Survives reloads & return visits.
const KEYS = {
  lang: 'noor.lang',
  fontScale: 'noor.fontScale',
  progress: 'noor.progress',
  welcomed: 'noor.welcomed',
};

const safeGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };

export const store = {
  getLang() { return safeGet(KEYS.lang); },           // null if never chosen
  setLang(l) { safeSet(KEYS.lang, l); },

  getFontScale() {
    const v = parseFloat(safeGet(KEYS.fontScale));
    return Number.isFinite(v) ? v : 1;
  },
  setFontScale(v) { safeSet(KEYS.fontScale, String(v)); },

  getProgress() {
    try { return new Set(JSON.parse(safeGet(KEYS.progress)) || []); }
    catch { return new Set(); }
  },
  saveProgress(set) { safeSet(KEYS.progress, JSON.stringify([...set])); },
  isKnown(id) { return this.getProgress().has(id); },
  toggleKnown(id) {
    const s = this.getProgress();
    if (s.has(id)) s.delete(id); else s.add(id);
    this.saveProgress(s);
    return s.has(id);
  },

  isWelcomed() { return safeGet(KEYS.welcomed) === '1'; },
  setWelcomed() { safeSet(KEYS.welcomed, '1'); },
};
