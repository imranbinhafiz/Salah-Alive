// Surah recitation via EveryAyah. One shared <audio> element.
// URL pattern: https://everyayah.com/data/{reciter}/{SSS}{AAA}.mp3
import { loadConfig } from './data.js';

let reciter = 'Husary_128kbps';
let player = null;
let queue = [];          // [{surah, ayah}]
let qIndex = -1;
let currentKey = null;   // "surah:ayah" or null when stopped/paused
const listeners = new Set();

const pad3 = (n) => String(n).padStart(3, '0');
const urlFor = (s, a) => `https://everyayah.com/data/${reciter}/${pad3(s)}${pad3(a)}.mp3`;
const keyOf = (s, a) => `${s}:${a}`;

export async function initAudio() {
  player = document.getElementById('player');
  try { const cfg = await loadConfig(); if (cfg && cfg.reciter) reciter = cfg.reciter; } catch { /* default */ }
  player.addEventListener('ended', onEnded);
  player.addEventListener('error', () => { currentKey = null; emit(); });
}

function emit() { const playing = isPlaying(); listeners.forEach((fn) => fn(currentKey, playing)); }
export function onAudioChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function isPlaying() { return !!player && !player.paused && currentKey != null; }
export function currentKeyOf() { return currentKey; }

function start(s, a) {
  currentKey = keyOf(s, a);
  player.src = urlFor(s, a);
  const p = player.play();
  if (p && p.catch) p.catch(() => { /* needs user gesture / network */ });
  emit();
}

/** Play one ayah, or pause it if it's the one already playing. */
export function toggleAyah(s, a) {
  if (currentKey === keyOf(s, a) && !player.paused) { player.pause(); currentKey = null; emit(); return; }
  queue = [{ surah: s, ayah: a }]; qIndex = 0;
  start(s, a);
}

/** Play the whole surah, advancing ayah by ayah. */
export function playSurah(s, ayahNums) {
  queue = ayahNums.map((a) => ({ surah: s, ayah: a }));
  qIndex = 0;
  if (queue.length) start(queue[0].surah, queue[0].ayah);
}

/**
 * Play a standalone audio clip from a URL (e.g. a full Salah-step recitation),
 * or pause it if that same clip is already playing. Resolves the URL against
 * document.baseURI so it works under any GitHub Pages sub-path.
 */
export function toggleClip(src) {
  const resolved = new URL(src, document.baseURI).href;
  if (currentKey === resolved && !player.paused) { player.pause(); currentKey = null; emit(); return; }
  queue = []; qIndex = -1;
  currentKey = resolved;
  player.src = resolved;
  const p = player.play();
  if (p && p.catch) p.catch(() => { /* needs user gesture / network */ });
  emit();
}

export function stop() {
  if (player) player.pause();
  currentKey = null; queue = []; qIndex = -1; emit();
}

function onEnded() {
  if (qIndex >= 0 && qIndex < queue.length - 1) {
    qIndex += 1;
    start(queue[qIndex].surah, queue[qIndex].ayah);
  } else {
    currentKey = null; queue = []; qIndex = -1; emit();
  }
}
