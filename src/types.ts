
/* MAIN */

type Options = {
  /* ESBUILD OPTIONS */
  format?: 'iife' | 'cjs' | 'esm',
  platform?: 'browser' | 'node' | 'neutral',
  target?: 'es2016' | 'es2017' | 'es2018' | 'es2019' | 'es2020' | 'es2021' | 'esnext',
  /* BANAL OPTIONS */
  module?: string[] | string,
  entry?: string,
  open?: boolean
};

/* EXPORT */

export type {Options};
