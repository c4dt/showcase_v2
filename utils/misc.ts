const THRESHOLD_DAYS = 270;
const THRESHOLD = THRESHOLD_DAYS * 1000 * 60 * 60 * 24;

export function isActive(dateLastCommit) {
  return Date() - Date.parse(dateLastCommit) <= THRESHOLD;
}

export function getLabel(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
