
/* MAIN */

type Options = {
  /* ESBUILD OPTIONS */
  external?: string | string[],
  format?: 'iife' | 'cjs' | 'esm',
  platform?: 'browser' | 'node' | 'neutral',
  target?: 'es2016' | 'es2017' | 'es2018' | 'es2019' | 'es2020' | 'es2021' | 'esnext',
  /* BANAL OPTIONS */
  json?: boolean,
  metafile?: string,
  module?: string[] | string,
  input?: string,
  output?: string,
  outputAnalysis?: string,
  outputMetafile?: string,
  open?: boolean
};

type OutputWithModules = {
  tempPath: string,
  inputPath: string,
  outputPath: string,
  metafilePath: string,
  analyzerPath: string
};

type OutputWithMetafile = {
  tempPath: string,
  metafilePath: string,
  analyzerPath: string
};

/* EXPORT */

export type {Options, OutputWithModules, OutputWithMetafile};
