
/* IMPORT */

import {spawn, type SpawnOptions} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import zeptoid from 'zeptoid';

/* MAIN */

const castArray = <T> ( value: T | T[] ): T[] => {

  return Array.isArray ( value ) ? value : [value];

};

const getTempPath = async ( prefix: string ): Promise<string> => {

  const tempPath = path.join ( os.tmpdir (), `${prefix}-${zeptoid ()}` );

  await fs.mkdir ( tempPath, { recursive: true } );

  return tempPath;

};

const shell = ( command: string, options: SpawnOptions = {} ): Promise<number> => {

  return new Promise ( ( resolve, reject ) => {

    const process = spawn ( command, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    process.on ( 'close', resolve );
    process.on ( 'error', reject );

  });

};

/* EXPORT */

export {castArray, getTempPath, shell};
