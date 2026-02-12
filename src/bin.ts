#!/usr/bin/env node

/* IMPORT */

import {bin} from 'specialist';
import Banal from '.';

/* MAIN */

bin ( 'banal', 'On-demand bundle analyzer, powered by esbuild' )
  /* ESBUILD OPTIONS */
  .option ( '--external <package...>', 'Packages to consider as external' )
  .option ( '--format, -f <format>', 'The bundle format: iife, cjs, esm', { default: 'esm', enum: ['iife', 'cjs', 'esm'] as const } )
  .option ( '--platform, -p <platform>', 'The bundle platform: browser, node, neutral', { default: 'node', enum: ['browser', 'node', 'neutral'] as const } )
  .option ( '--target, -t <target>', 'The bundle target: es2016, es2017, es2018, es2019, es2020, es2021, esnext', { default: 'esnext' } )
  /* BANAL OPTIONS */
  .option ( '--json', 'Output information as JSON' )
  .option ( '--metafile, -M <path>', 'The path to the explicit metadata file to use' )
  .option ( '--modules, --module, -m <modules...>', 'The modules to analyze', { eager: true } )
  .option ( '--input, -i <javascript>', 'The content of the entrypoint file' )
  .option ( '--output <path>', 'The path where to output all the generated files' )
  .option ( '--output-analysis <path>', 'The path where to output the generated analysis' )
  .option ( '--output-metafile <path>', 'The path where to output the generated metafile' )
  .option ( '--no-open', 'Avoid opening the build analyzer automatically', { default: true } )
  /* BANAL ARGUMENTS */
  .argument ( '[modules...]', 'The modules to analyze' )
  /* ACTION */
  .action ( ( options, args ) => {
    return Banal.analyze ({
      ...options,
      module: options['module'] ?? args
    });
  })
  /* RUN */
  .run ();
