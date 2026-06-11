import { t } from '../i18n.js';
import { ui } from '../ui.js';
import { store } from '../store.js';
import { loadSurahIndex } from '../data.js';
import { esc } from '../components.js';

export async function surahs() {
  const list = await loadSurahIndex();
  const progress = store.getProgress();
  const total = list.length;
  const knownCount = list.filter((s) => progress.has(`surah:${s.id}`)).length;
  const pct = total ? Math.round((knownCount / total) * 100) : 0;

  const tiles = list.map((s) => {
    const known = progress.has(`surah:${s.id}`);
    const oneLine = t(s.oneLineMeaning) || t(s.meaning);
    return `
      <a class="surah-tile" href="#/surah/${esc(s.id)}" data-link>
        <span class="surah-tile__num${known ? ' is-known' : ''}">${s.number}</span>
        <span class="surah-tile__body">
          <span class="surah-tile__name">${esc(t(s.name))}<span class="surah-tile__ar">${esc(s.name.ar)}</span></span>
          <span class="surah-tile__meaning">${esc(oneLine)}</span>
        </span>
      </a>`;
  }).join('');

  return `
    <header class="pagehead">
      <div class="pagehead__kicker">${esc(t(ui('surahs.kicker')))}</div>
      <h1 class="pagehead__title">${esc(t(ui('surahs.title')))}</h1>
      <p class="pagehead__sub">${esc(t(ui('surahs.sub')))}</p>
    </header>
    <div class="progress-hint" role="status">
      <span>${esc(t(ui('home.progressLabel')))}: <strong class="progress-hint__count">${knownCount} / ${total}</strong></span>
      <span class="progress-hint__bar" aria-hidden="true"><span class="progress-hint__fill" style="width:${pct}%"></span></span>
    </div>
    <div class="surah-grid">${tiles}</div>
  `;
}
