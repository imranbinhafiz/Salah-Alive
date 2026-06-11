// Tiny hash router. Views are async fns (param) => htmlString.
import { stop as stopAudio } from './audio.js';

let routes = {};
let notFound = (p) => `<div class="card">Not found.</div>`;
let current = { name: 'home', param: null };

const mount = () => document.getElementById('app');

export function defineRoutes(map, nf) { routes = map; if (nf) notFound = nf; }

/** Parse "#/surah/al-fatiha" -> ['surah','al-fatiha']. */
export function parse() {
  const raw = (location.hash || '#/').replace(/^#/, '');
  const [path] = raw.split('?');
  return path.split('/').filter(Boolean);
}

function updateNav(name) {
  document.querySelectorAll('.bottomnav__item').forEach((el) => {
    const n = el.dataset.nav;
    const active = n === name
      || (name === 'surah' && n === 'surahs')
      || (name === 'card' && n === 'salah')
      || (name === 'review' && n === 'review');
    el.classList.toggle('is-active', active);
  });
}

async function render() {
  const segs = parse();
  const name = segs[0] || 'home';
  const param = segs.slice(1).join('/') || null;
  current = { name, param };
  updateNav(name);
  stopAudio();

  const app = mount();
  const handler = routes[name] || notFound;
  let html;
  try {
    html = await handler(param);
  } catch (e) {
    console.error(e);
    html = `<div class="card"><p class="muted">${e.message}</p></div>`;
  }
  app.innerHTML = `<div class="view stack-lg">${html}</div>`;
  window.scrollTo(0, 0);
  app.focus({ preventScroll: true });
}

export function start() {
  window.addEventListener('hashchange', render);
  return render();
}

/** Re-render the current route (used on language / font change). */
export function rerender() { return render(); }
export function currentRoute() { return { ...current }; }
