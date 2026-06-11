// Bootstrap + global event wiring (the controller hub).
import { store } from './store.js';
import { getLang, setLang, onLangChange, t } from './i18n.js';
import { setUI, ui } from './ui.js';
import { loadUI, loadConfig, loadSurahIndex } from './data.js';
import { initAudio, onAudioChange, toggleAyah, playSurah } from './audio.js';
import { icon } from './components.js';
import { defineRoutes, start, rerender } from './router.js';
import * as views from './views/index.js';

const FONT_STEPS = [0.9, 1, 1.15, 1.3, 1.5];

async function boot() {
  // 1. Load core data (fail gracefully with a helpful message)
  let uiData, config;
  try {
    [uiData, config] = await Promise.all([loadUI(), loadConfig()]);
    await loadSurahIndex();
  } catch (e) {
    document.getElementById('app').innerHTML =
      `<div class="card"><h2>Couldn't load content</h2>
       <p class="muted">${e.message}</p></div>`;
    return;
  }
  setUI(uiData);
  if (Array.isArray(config?.fontScales) && config.fontScales.length) {
    FONT_STEPS.length = 0; FONT_STEPS.push(...config.fontScales);
  }

  // 2. Apply persisted font scale + language to the document
  applyFontScale(store.getFontScale());
  document.documentElement.lang = getLang();

  // 3. Static chrome strings + control states
  applyUIStrings();
  syncLangToggle();

  // 4. Welcome overlay (first visit only)
  if (!store.isWelcomed()) document.getElementById('welcome').hidden = false;

  // 5. Audio
  await initAudio();
  onAudioChange(updateAudioUI);

  // 6. Routes
  defineRoutes({
    home: views.home,
    salah: views.salah,
    surahs: views.surahs,
    surah: views.surah,
    review: views.review,
  }, views.notFound);

  // 7. React to language changes
  onLangChange(() => { applyUIStrings(); syncLangToggle(); rerender(); });

  // 8. Global click delegation
  document.addEventListener('click', onClick);

  // 9. Go
  start();
}

/* ---------------- helpers ---------------- */

function applyUIStrings() {
  document.querySelectorAll('[data-ui]').forEach((el) => {
    el.textContent = t(ui(el.dataset.ui));
  });
}

function syncLangToggle() {
  const lang = getLang();
  document.querySelectorAll('.langtoggle__btn').forEach((b) =>
    b.classList.toggle('is-active', b.dataset.lang === lang));
}

function applyFontScale(scale) {
  document.documentElement.style.setProperty('--font-scale', String(scale));
}

function stepFont(dir) {
  const cur = store.getFontScale();
  let idx = FONT_STEPS.findIndex((v) => Math.abs(v - cur) < 0.001);
  if (idx === -1) idx = FONT_STEPS.indexOf(1) === -1 ? 0 : FONT_STEPS.indexOf(1);
  idx = Math.min(FONT_STEPS.length - 1, Math.max(0, idx + dir));
  const next = FONT_STEPS[idx];
  store.setFontScale(next);
  applyFontScale(next);
}

function onClick(e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;

  switch (action) {
    case 'lang':
      setLang(el.dataset.lang);
      break;
    case 'welcome-lang':
      setLang(el.dataset.lang);
      store.setWelcomed();
      document.getElementById('welcome').hidden = true;
      rerender();
      break;
    case 'font-inc': stepFont(+1); break;
    case 'font-dec': stepFont(-1); break;

    case 'toggle-disclose': {
      const sec = el.closest('[data-disclose]');
      const open = sec.classList.toggle('is-open');
      el.setAttribute('aria-expanded', String(open));
      break;
    }
    case 'word': {
      const key = el.dataset.detail;
      const panel = document.querySelector(`[data-word-detail="${cssEsc(key)}"]`);
      if (panel) {
        panel.classList.add('is-filled');
        panel.innerHTML =
          `<span class="word-detail__ar">${el.dataset.ar}</span>
           <span class="word-detail__txt">
             <span class="word-detail__tr translit">${el.dataset.tr}</span>
             <span class="word-detail__mean"> — ${el.dataset.mean}</span>
           </span>`;
      }
      const row = document.querySelector(`[data-wordrow="${cssEsc(key)}"]`);
      if (row) row.querySelectorAll('.wordchip').forEach((c) => c.classList.toggle('is-active', c === el));
      break;
    }
    case 'play-ayah':
      toggleAyah(Number(el.dataset.surah), Number(el.dataset.ayah));
      break;
    case 'play-surah': {
      const nums = (el.dataset.ayahs || '').split(',').map(Number).filter(Boolean);
      playSurah(Number(el.dataset.surah), nums);
      break;
    }
    case 'know': {
      const done = store.toggleKnown(el.dataset.id);
      el.classList.toggle('is-done', done);
      el.setAttribute('aria-pressed', String(done));
      el.querySelector('.knowbtn__box').innerHTML = done ? icon('check') : '';
      const lbl = el.querySelector('.knowbtn__label');
      if (lbl) lbl.textContent = t(done ? ui('labels.known') : ui('labels.iKnowThis'));
      refreshProgressBar();
      break;
    }
    case 'print':
      window.print();
      break;
  }
}

function updateAudioUI(key, playing) {
  document.querySelectorAll('.audiobtn[data-surah]').forEach((btn) => {
    const k = `${btn.dataset.surah}:${btn.dataset.ayah}`;
    const on = playing && k === key;
    btn.classList.toggle('is-playing', on);
    const ico = btn.querySelector('.audiobtn__ico');
    if (ico) ico.innerHTML = on ? icon('pause') : icon('play');
  });
  document.querySelectorAll('.ayah[data-ayah-key]').forEach((a) => {
    a.classList.toggle('is-playing', playing && a.dataset.ayahKey === key);
  });
}

// Minimal CSS.escape fallback for attribute selectors with ':' etc.
function cssEsc(s) {
  return (window.CSS && CSS.escape) ? CSS.escape(s) : String(s).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

// Update all progress bars + counters on the current page without a full re-render.
async function refreshProgressBar() {
  const list = await loadSurahIndex(); // already cached — no network hit
  const progress = store.getProgress();
  const total = list.length;
  const known = list.filter((s) => progress.has(`surah:${s.id}`)).length;
  const pct = total ? Math.round((known / total) * 100) : 0;
  document.querySelectorAll('.progress-hint__fill').forEach((fill) => {
    fill.style.width = `${pct}%`;
  });
  document.querySelectorAll('.progress-hint__count').forEach((count) => {
    count.textContent = `${known} / ${total}`;
  });
}

boot();
