// Holds the loaded UI string table (data/ui.json) and a path accessor.
let UI = {};
export function setUI(obj) { UI = obj || {}; }
/** ui('labels.tafsir') -> {en, bn} (or '' if missing). */
export function ui(path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), UI) ?? '';
}
