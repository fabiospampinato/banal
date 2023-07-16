#!/usr/bin/env node

/* IMPORT */

import {bin} from 'specialist';
import Banal from '.';

/* MAIN */

bin ( 'banal', 'On-demand bundle analyzer, powered by esbuild' )
  /* ESBUILD OPTIONS */
  .option ( '--format, -f <format>', 'The bundle format: iife, cjs, esm', { default: 'esm' } )
  .option ( '--platform, -p <platform>', 'The bundle platform: browser, node, neutral', { default: 'browser' } )
  .option ( '--target, -t <target>', 'The bundle target: es2016, es2017, es2018, es2019, es2020, esnext', { default: 'esnext' } )
  /* BANAL OPTIONS */
  .option ( '--modules, --module, -m <modules...>', 'The modules to analyze', { eager: true, required: true } )
  .option ( '--entry, -e <entry>', 'The content of the entry file' )
  /* ACTION */
  .action ( Banal.analyze )
  /* RUN */
  .run ();
