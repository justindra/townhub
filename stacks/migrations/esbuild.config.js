#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const files = fs
  .readdirSync(__dirname)
  .filter((val) => val.endsWith('ts'))
  .map((val) => path.join(__dirname, val));

require('esbuild')
  .build({
    entryPoints: files,
    bundle: true,
    outdir: path.join(__dirname, 'dist'),
    platform: 'node',
    target: 'node14',
  })
  .catch(() => process.exit(1));
