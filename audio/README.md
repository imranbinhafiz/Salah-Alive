# Salah-step recitation audio

Each Salah step in the app shows a **"Listen to recitation"** button. It plays a
single mp3 from this folder, named after the step's `id` in `data/salah.json`
(`audio: "audio/<id>.mp3"`). If a file is missing, the button still appears but
won't play — so add files at your own pace. Drop nothing in here and nothing breaks.

## How to get the files

Run the download script (downloads the 8 available files):

```powershell
powershell -ExecutionPolicy Bypass -File audio\download-audio.ps1
```

## Source & mapping

Audio is from **al-hamdoulillah.com** (Hisnul Muslim invocations). Each clip on
that site is sourced to an authentic hadith (al-Bukhari / Muslim / Abu Dawud, etc.),
which is why it was chosen. URL pattern: `https://www.al-hamdoulillah.com/invocations/mp3/<N>.mp3`

| Step file | Source dua # | Phrase |
| --- | --- | --- |
| `thana.mp3` | 28 | Subhanaka-llahumma wa bihamdika... |
| `ruku.mp3` | 33 | Subhana rabbiya-l-azim (×3) |
| `itidal.mp3` | 39 | Rabbana wa laka-l-hamd... |
| `sujood.mp3` | 41 | Subhana rabbiya-l-a'la (×3) |
| `jalsa.mp3` | 48 | Rabbi-ghfir li, Rabbi-ghfir li |
| `tashahhud.mp3` | 52 | At-tahiyyatu lillahi... |
| `durood.mp3` | 53 | Allahumma salli 'ala Muhammad... |
| `dua-before-salam.mp3` | 57 | Allahumma inni zalamtu nafsi... |

## Still needed (no source file — record yourself)

These three short phrases aren't on the source site. Save them here when ready:

- `takbeer.mp3` — Allahu Akbar
- `taawwudh.mp3` — A'udhu billahi... Bismillah...
- `tasleem.mp3` — As-salamu alaykum wa rahmatullah

> Note on `itidal`: the step text combines *Sami'a-llahu liman hamidah* (said while
> rising, dua 38) and *Rabbana wa laka-l-hamd* (dua 39). The download uses dua 39,
> the i'tidal response. Swap to 38, or splice both, if you prefer.

The Fatiha and short-surah steps intentionally have **no** audio here — they link
to the full Surah section, which already has recitation.
