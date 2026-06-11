// Fetch + in-memory cache for JSON content.
// Paths resolve against document.baseURI so the site works from any
// GitHub Pages sub-path (e.g. username.github.io/islam/) and on localhost.
const cache = new Map();

export async function loadJSON(path) {
  if (cache.has(path)) return cache.get(path);
  const url = new URL('data/' + path, document.baseURI).href;
  let res;
  try {
    res = await fetch(url, { cache: 'no-store' });
  } catch (e) {
    throw new Error(`Network error loading ${path}. If opening locally, serve over HTTP (see README).`);
  }
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status}).`);
  const json = await res.json();
  cache.set(path, json);
  return json;
}

export const loadUI      = () => loadJSON('ui.json');
export const loadConfig  = () => loadJSON('config.json');
export const loadSurahIndex = () => loadJSON('surahs.json');
export const loadSurah   = (id) => loadJSON(`surahs/${id}.json`);
export const loadSalah   = () => loadJSON('salah.json');
