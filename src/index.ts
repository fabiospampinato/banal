
/* IMPORT */

import esbuild from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import open from 'open';
import Base64 from 'radix64-encoding';
import sanitize from 'sanitize-basename';
import dirname from 'tiny-dirname';
import {castArray, getTempPath, shell} from './utils';
import type {Options} from './types';

/* MAIN */

const Banal = {

  /* API */

  analyze: async ( options: Options ): Promise<void> => {

    /* CHECKS */

    if ( !options.module ) throw new Error ( 'You need to specify at least one module to analyze' );

    /* PATHS */

    const distPath = dirname ( import.meta.url );
    const resourcesPath = path.join ( distPath, '..', 'resources' );
    const analyzerTemplatePath = path.join ( resourcesPath, 'analyzer.html' );

    const modules = castArray ( options.module );
    const outputName = sanitize ( modules.join ( '_' ).replaceAll ( '/', '-' ) );

    const tempPath = await getTempPath ( 'banal' );
    const inputPath = path.join ( tempPath, 'input.js' );
    const outputPath = path.join ( tempPath, `${outputName}.js` );
    const analyzerPath = path.join ( tempPath, 'analyzer.html' );

    console.log ( `Temp path: ${tempPath}` );

    /* INSTALLING */

    await shell ( `npm install --ignore-scripts --no-audit --no-fund --no-package-lock ${modules.join ( ' ' )}`, { cwd: tempPath } );

    /* BUNDLING */

    const inputAll = modules.map ( module => `export * from '${module}';` ).join ( '\n' );
    const input = options.entry || inputAll;

    await fs.writeFile ( inputPath, input );

    const result = await esbuild.build ({
      absWorkingDir: tempPath,
      entryPoints: [inputPath],
      outfile: outputPath,
      format: options.format ?? 'esm',
      platform: options.platform ?? 'browser',
      target: options.target ?? 'esnext',
      bundle: true,
      minify: true,
      metafile: true
    });

    /* ANALYZING */

    const metafile = JSON.stringify ( result.metafile );
    const metafile64 = Base64.encodeStr ( metafile );

    const analyzerTemplate = await fs.readFile ( analyzerTemplatePath, 'utf8' );
    const analyzer = analyzerTemplate.replace ( `globalThis.METAFILE = '';`, `globalThis.METAFILE = '${metafile64}';` );

    await fs.writeFile ( analyzerPath, analyzer );

    /* OPENING */

    await open ( analyzerPath );

  }

};

/* EXPORT */

export default Banal;
export type {Options};
