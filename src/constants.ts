
/* MAIN */

const EXTERNALS = [ // Known always-external packages
  '@types/*',
  'vscode'
];

const LOADERS = { // Map of extensions to esbuild loaders
  /* DATAURL */
  '.avif': 'dataurl',
  '.bmp': 'dataurl',
  '.eot': 'dataurl',
  '.gif': 'dataurl',
  '.ico': 'dataurl',
  '.jpeg': 'dataurl',
  '.jpg': 'dataurl',
  '.otf': 'dataurl',
  '.png': 'dataurl',
  '.svg': 'dataurl',
  '.ttf': 'dataurl',
  '.webp': 'dataurl',
  '.woff': 'dataurl',
  '.woff2': 'dataurl',
    /* FILE */
  '.node': 'file',
  /* TEXT */
  '.csv': 'text',
  '.toml': 'text',
  '.txt': 'text',
  '.yaml': 'text',
  '.yml': 'text'
} as const;

/* EXPORT */

export {EXTERNALS, LOADERS};
