import { t, has } from '../i18n.js';
import { ui } from '../ui.js';
import { store } from '../store.js';
import { loadSalah } from '../data.js';
import { esc, icon, disclose, wordByWord, knowBtn } from '../components.js';

export async function salah() {
  const data = await loadSalah();
  const steps = (data.steps || []).slice().sort((a, b) => a.order - b.order);
  const stepsHtml = steps.map(stepBlock).join('');

  return `
    <header class="pagehead">
      <div class="pagehead__kicker">${esc(t(ui('salah.kicker')))}</div>
      <h1 class="pagehead__title">${esc(t(ui('salah.title')))}</h1>
      <p class="pagehead__sub">${esc(t(ui('salah.sub')))}</p>
    </header>

    <div class="salah-flow stack">${stepsHtml}</div>
  `;
}

function stepBlock(s) {
  const known = store.isKnown(`salah:${s.id}`);
  const key = `salah-${s.id}`;
  const details = [];

  if (s.words && s.words.length) {
    details.push(disclose(esc(t(ui('labels.wordByWord'))), wordByWord(key, s.words)));
  }
  if (has(s.whyItMatters)) {
    details.push(disclose(esc(t(ui('labels.whyItMatters'))), `<p>${esc(t(s.whyItMatters))}</p>`));
  }

  const link = s.surahRef
    ? `<a class="btn btn--ghost btn--block" href="#/surah/${esc(s.surahRef)}" data-link>${esc(t(ui('labels.openSurah')))} ${icon('arrow')}</a>`
    : '';

  return `
    <article class="step card" id="step-${esc(s.id)}">
      <div class="step__head">
        <span class="step__order">${s.order}</span>
        <div>
          <div class="step__title">${esc(t(s.title))}</div>
          ${has(s.position) ? `<span class="chip-pos">${esc(t(s.position))}</span>` : ''}
        </div>
      </div>
      ${has(s.arabic) ? `<p class="ar">${esc(s.arabic)}</p>` : ''}
      ${has(s.meaning) ? `<p class="ayah__trans">${esc(t(s.meaning))}</p>` : ''}
      ${link}
      ${details.length ? `<div class="stack" style="margin-top:var(--s-3)">${details.join('')}</div>` : ''}
      <div class="row" style="margin-top:var(--s-3)">${knowBtn('salah:' + s.id, known)}</div>
    </article>`;
}
