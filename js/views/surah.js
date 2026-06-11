import { t, has } from '../i18n.js';
import { ui } from '../ui.js';
import { store } from '../store.js';
import { loadSurahIndex, loadSurah } from '../data.js';
import { esc, icon, disclose, wordByWord, audioBtn, knowBtn } from '../components.js';

export async function surah(id) {
  if (!id) { location.hash = '#/surahs'; return ''; }

  const [index, data] = await Promise.all([loadSurahIndex(), loadSurah(id)]);
  const known = store.isKnown(`surah:${id}`);
  const ayahNums = data.ayahs.map((a) => a.number).join(',');

  const ayahsHtml = data.ayahs.map((a) => ayahBlock(data.number, a)).join('');
  const versesLabel = `${data.ayahCount} ${esc(t(ui('labels.ayahs')))}`;
  const versesSection = disclose(versesLabel, `<div class="ayahs-list">${ayahsHtml}</div>`);

  // Surah-level depth sections
  const sections = [];
  if (has(data.background))   sections.push(disclose(esc(t(ui('labels.background'))),  `<p>${esc(t(data.background))}</p>`));
  if (has(data.summary))      sections.push(disclose(esc(t(ui('labels.summary'))),     `<p>${esc(t(data.summary))}</p>`));
  if (has(data.tafsir))       sections.push(disclose(esc(t(ui('labels.tafsir'))),      `<p>${esc(t(data.tafsir))}</p>`));
  if (has(data.lifeLessons))  sections.push(disclose(esc(t(ui('labels.lifeLessons'))), `<p>${esc(t(data.lifeLessons))}</p>`));
  if (Array.isArray(data.reflectionQuestions) && data.reflectionQuestions.length) {
    const qs = data.reflectionQuestions.map((q) => `<li>${esc(t(q))}</li>`).join('');
    sections.push(disclose(esc(t(ui('labels.reflection'))), `<ul class="dotted">${qs}</ul>`));
  }
  if (Array.isArray(data.hadith) && data.hadith.length) {
    sections.push(disclose(esc(t(ui('labels.hadith'))), data.hadith.map(hadithBlock).join('')));
  }

  // Prev / next
  const i = index.findIndex((s) => s.id === id);
  const prev = i > 0 ? index[i - 1] : null;
  const next = i >= 0 && i < index.length - 1 ? index[i + 1] : null;
  const nav = `
    <nav class="row row--between" aria-label="${esc(t(ui('labels.surahNav')))}">
      ${prev ? `<a class="btn btn--ghost" href="#/surah/${esc(prev.id)}" data-link>${icon('back')} ${esc(t(prev.name))}</a>` : '<span></span>'}
      ${next ? `<a class="btn btn--ghost" href="#/surah/${esc(next.id)}" data-link>${esc(t(next.name))} ${icon('arrow')}</a>` : '<span></span>'}
    </nav>`;

  return `
    <a class="backlink" href="#/surahs" data-link>${icon('back')} ${esc(t(ui('labels.allSurahs')))}</a>

    <header class="pagehead center">
      <p class="ar" style="text-align:center">${esc(data.name.ar)}</p>
      <h1 class="pagehead__title">${esc(t(data.name))}</h1>
      <p class="pagehead__sub">${esc(t(data.meaning))} · ${data.ayahCount} ${esc(t(ui('labels.ayahs')))}</p>
      <div class="row" style="justify-content:center;margin-top:var(--s-4)">
        <button class="audiobtn" data-action="play-surah" data-surah="${data.number}" data-ayahs="${ayahNums}">
          ${icon('play')} <span>${esc(t(ui('labels.playSurah')))}</span>
        </button>
        ${knowBtn('surah:' + id, known)}
      </div>
    </header>

    ${versesSection}

    ${sections.length ? `<div class="stack" style="margin-top:var(--s-4)">${sections.join('')}</div>` : ''}

    ${nav}
  `;
}

function ayahBlock(surahNum, a) {
  const key = `${surahNum}:${a.number}`;
  const showPron = has(a.transliteration) || (a.words && a.words.length);
  const inner = `
    ${has(a.transliteration) ? `<p class="ayah__translit translit">${esc(t(a.transliteration))}</p>` : ''}
    ${wordByWord(key, a.words)}
  `;
  return `
    <div class="ayah" data-ayah-key="${key}">
      <div class="ayah__head">
        <span class="ayah__num">${a.number}</span>
        <p class="ar ayah__ar">${esc(a.arabic)}</p>
      </div>
      <p class="ayah__trans">${esc(t(a.translation))}</p>
      <div class="row" style="margin-top:var(--s-3)">
        ${audioBtn(surahNum, a.number, t(ui('labels.listen')))}
      </div>
      ${showPron ? `<div style="margin-top:var(--s-3)">${disclose(esc(t(ui('labels.pronWords'))), inner)}</div>` : ''}
    </div>`;
}

function hadithBlock(h) {
  return `
    <div class="hadith">
      ${has(h.arabic) ? `<p class="ar hadith__ar">${esc(h.arabic)}</p>` : ''}
      ${has(h.transliteration) ? `<p class="translit">${esc(t(h.transliteration))}</p>` : ''}
      <p class="hadith__text">${esc(t(h.text))}</p>
      ${h.source ? `<p class="hadith__src">— ${esc(h.source)}</p>` : ''}
    </div>`;
}
