
/* IMPORT */

import esbuild from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import Base64 from 'radix64-encoding';
import sanitize from 'sanitize-basename';
import {exit} from 'specialist';
import dirname from 'tiny-dirname';
import open from 'tiny-open';
import zeptoid from 'zeptoid';
import {castArray, getTempPath, isRelative, partition, shell} from './utils';
import type {Options} from './types';

/* MAIN */

//TODO: Reduce code duplication

const Banal = {

  /* API */

  analyze: async ( options: Options ): Promise<void> => {

    if ( !options.module?.length && !options.metafile ) {

      exit ( 'You need to specify either some modules or a metafile to analyze' );

    } else if ( options.module?.length && options.metafile ) {

      exit ( 'You cannot specify both some modules and a metafile to analyze' );

    } else if ( options.module?.length ) {

      await Banal.analyzeWithModule ( options );

    } else {

      await Banal.analyzeWithMetafile ( options );

    }

  },

  analyzeWithModule: async ( options: Options ): Promise<void> => {

    /* CHECKS */

    if ( !options.module?.length ) exit ( 'You need to specify at least one module to analyze' );

    /* PATHS */

    const distPath = dirname ( import.meta.url );
    const resourcesPath = path.join ( distPath, '..', 'resources' );
    const analyzerTemplatePath = path.join ( resourcesPath, 'analyzer.html' );

    const modules = castArray ( options.module );
    const [modulesLocal, modulesRegistry] = partition ( modules, isRelative );
    const modulesLocalAbsolute = modulesLocal.map ( module => path.resolve ( module ) );
    const title = modulesRegistry.length ? modulesRegistry.join ( ', ' ) : 'bundle';
    const outputName = modulesRegistry.length ? sanitize ( modulesRegistry.join ( '_' ).replaceAll ( '/', '-' ) ) : 'bundle';

    const tempPath = options.output ? path.resolve ( options.output ) : await getTempPath ( 'banal' );
    const inputPath = path.join ( tempPath, 'input.js' );
    const outputPath = path.join ( tempPath, `${outputName}.js` );
    const metafilePath = path.join ( tempPath, 'metafile.json' );
    const analyzerPath = path.join ( tempPath, 'analyzer.html' );

    await fs.mkdir ( tempPath, { recursive: true } );

    console.log ( `Temp path: ${tempPath}` );

    /* INSTALLING */

    if ( modulesRegistry.length ) {

      await shell ( `npm install --ignore-scripts --no-audit --no-fund --no-package-lock ${modulesRegistry.join ( ' ' )}`, { cwd: tempPath } );

    }

    /* BUNDLING */

    const inputRegistryAll = modulesRegistry.map ( module => `export * as _${zeptoid ()} from '${module.replace ( /(.)@.*/, '$1' )}';` ).join ( '\n' );
    const inputLocalAll = modulesLocalAbsolute.map ( module => `export * as _${zeptoid ()} from '${module}';` ).join ( '\n' );
    const inputAll = `${inputRegistryAll}\n${inputLocalAll}`;
    const input = options.input || inputAll;

    await fs.writeFile ( inputPath, input );

    const result = await esbuild.build ({
      absWorkingDir: tempPath,
      entryPoints: [inputPath],
      outfile: outputPath,
      external: options.external ? castArray ( options.external ) : undefined,
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

    /* COPYING */

    if ( options.outputAnalysis ) {

      await fs.mkdir ( path.dirname ( options.outputAnalysis ), { recursive: true } );
      await fs.copyFile ( analyzerPath, options.outputAnalysis );

    }

    if ( options.outputMetafile ) {

      await fs.mkdir ( path.dirname ( options.outputMetafile ), { recursive: true } );
      await fs.copyFile ( metafilePath, options.outputMetafile );

    }

    /* OPENING */

    if ( options.open ) {

      open ( analyzerPath );

    }

  },

  analyzeWithMetafile: async ( options: Options ): Promise<void> => {

    /* CHECKS */

    if ( !options.metafile ) exit ( 'You need to specify a path for the metadata file' );

    /* PATHS */

    const distPath = dirname ( import.meta.url );
    const resourcesPath = path.join ( distPath, '..', 'resources' );
    const analyzerTemplatePath = path.join ( resourcesPath, 'analyzer.html' );

    const tempPath = await getTempPath ( 'banal' );
    const analyzerPath = path.join ( tempPath, 'analyzer.html' );

    console.log ( `Temp path: ${tempPath}` );

    /* ANALYZING */

    const title = 'Banal';

    const metafile = await fs.readFile ( options.metafile, 'utf8' );
    const metafile64 = Base64.encodeStr ( metafile );

    const analyzerTemplate = await fs.readFile ( analyzerTemplatePath, 'utf8' );
    const analyzer = analyzerTemplate.replace ( `globalThis.METAFILE = '';`, `globalThis.METAFILE = '${metafile64}';` ).replace ( /<title>(.*)<\/title>/, `<title>${title}</title>` );

    await fs.writeFile ( analyzerPath, analyzer );

    /* COPYING */

    if ( options.outputAnalysis ) {

      await fs.mkdir ( path.dirname ( options.outputAnalysis ), { recursive: true } );
      await fs.copyFile ( analyzerPath, options.outputAnalysis );

    }

    if ( options.outputMetafile ) {

      await fs.mkdir ( path.dirname ( options.outputMetafile ), { recursive: true } );
      await fs.writeFile ( options.outputMetafile, metafile );

    }

    /* OPENING */

    if ( options.open ) {

      open ( analyzerPath );

    }

  },

};

/* EXPORT */

export default Banal;
export type {Options};
