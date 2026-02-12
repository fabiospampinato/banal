
/* MAIN */

type Options = {
  /* ESBUILD OPTIONS */
  external?: string | string[],
  format?: 'iife' | 'cjs' | 'esm',
  platform?: 'browser' | 'node' | 'neutral',
  target?: string,
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
  outputSize: number,
  metafilePath: string,
  analyzerPath: string
};

type OutputWithMetafile = {
  tempPath: string,
  metafilePath: string,
  analyzerPath: string,
  outputSize: number
};

/* EXPORT */

export type {Options, OutputWithModules, OutputWithMetafile};
