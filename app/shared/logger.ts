let debug = false;

export function setDebug(enabled: boolean) {
  debug = enabled;
}

export const logger = {
  log(...args: unknown[]) {
    if (debug) console.log(...args);
  },

  warn(...args: unknown[]) {
    if (debug) console.warn(...args);
  },

  error(...args: unknown[]) {
    console.error(...args);
  },
};