
/* IMPORT */

import esbuild from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import Base64 from 'radix64-encoding';
import sanitize from 'sanitize-basename';
import open from 'tiny-open';
import zeptoid from 'zeptoid';
import {castArray, getTempPath, isRelative, partition, shell} from './utils';
import type {Options} from './types';
import { fileURLToPath } from 'node:url';

/* MAIN */

const Banal = {

  /* API */

  analyze: async ( options: Options ): Promise<void> => {

    /* CHECKS */

    if ( !options.module?.length ) throw new Error ( 'You need to specify at least one module to analyze' );

    /* PATHS */

    const distPath = fileURLToPath(new URL('.', import.meta.url))
    const resourcesPath = path.join ( distPath, '..', 'resources' );
    const analyzerTemplatePath = path.join ( resourcesPath, 'analyzer.html' );

    const modules = castArray ( options.module );
    const [modulesLocal, modulesRegistry] = partition ( modules, isRelative );
    const modulesLocalAbsolute = modulesLocal.map ( module => path.resolve ( module ) );
    const title = modulesRegistry.length ? modulesRegistry.join ( ', ' ) : 'bundle';
    const outputName = modulesRegistry.length ? sanitize ( modulesRegistry.join ( '_' ).replaceAll ( '/', '-' ) ) : 'bundle';

    const tempPath = await getTempPath ( 'banal' );
    const inputPath = path.join ( tempPath, 'input.js' );
    const outputPath = path.join ( tempPath, `${outputName}.js` );
    const metafilePath = path.join ( tempPath, 'metafile.json' );
    const analyzerPath = path.join ( tempPath, 'analyzer.html' );

    console.log ( `Temp path: ${tempPath}` );

    /* INSTALLING */

    if ( modulesRegistry.length ) {

      await shell ( `npm install --ignore-scripts --no-audit --no-fund --no-package-lock ${modulesRegistry.join ( ' ' )}`, { cwd: tempPath } );

    }

    /* BUNDLING */

    const inputRegistryAll = modulesRegistry.map ( module => `export * as _${zeptoid ()} from '${module.replace ( /(.)@.*/, '$1' )}';` ).join ( '\n' );
    const inputLocalAll = modulesLocalAbsolute.map ( module => `export * as _${zeptoid ()} from '${module}';` ).join ( '\n' );
    const inputAll = `${inputRegistryAll}\n${inputLocalAll}`;
    const input = options.entry || inputAll;

    await fs.writeFile ( inputPath, input );

    const result = await esbuild.build ({
      absWorkingDir: tempPath,
      entryPoints: [inputPath],
      outfile: outputPath,
      format: options.format ?? 'esm',
      platform: options.platform ?? 'node',
      target: options.target ?? 'esnext',
      bundle: true,
      minify: true,
      metafile: true
    });

    /* ANALYZING */

    const metafile = JSON.stringify ( result.metafile );
    const metafile64 = Base64.encodeStr ( metafile );

    await fs.writeFile ( metafilePath, metafile );

    const analyzerTemplate = await fs.readFile ( analyzerTemplatePath, 'utf8' );
    const analyzer = analyzerTemplate.replace ( `globalThis.METAFILE = '';`, `globalThis.METAFILE = '${metafile64}';` ).replace ( /<title>(.*)<\/title>/, `<title>${title}</title>` );

    await fs.writeFile ( analyzerPath, analyzer );

    /* OPENING */

    open ( analyzerPath );

  }

};

/* EXPORT */

export default Banal;
export type {Options};
