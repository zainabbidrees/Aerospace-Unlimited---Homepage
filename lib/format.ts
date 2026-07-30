/* Thousands separators are pinned to en-US rather than left to
   `toLocaleString()`'s default. The server renders in the Node process locale
   and the browser renders in the visitor's, so an unpinned "4,820" can come
   back as "4 820" and React reports a hydration mismatch on a number nobody
   thought was locale-sensitive. */
const FORMATTER = new Intl.NumberFormat("en-US");

export const num = (n: number): string => FORMATTER.format(n);
