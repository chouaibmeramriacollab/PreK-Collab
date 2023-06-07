#!/usr/bin/env zx
import 'zx/globals';

import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

import * as esbuild from 'esbuild';

import { config, electronDir } from './common.mjs';

const NODE_ENV =
  process.env.NODE_ENV === 'development' ? 'development' : 'production';

if (process.platform === 'win32') {
  $.shell = true;
  $.prefix = '';
}

async function buildLayers() {
  console.log('Build infra');

  spawnSync('yarn', ['build'], {
    stdio: 'inherit',
    cwd: resolve(electronDir, '../../packages/infra'),
  });

  const common = config();
  await esbuild.build(common.preload);

  console.log('Build plugins');
  await import('./plugins/build-plugins.mjs');

  await esbuild.build({
    ...common.main,
    define: {
      ...common.main.define,
      'process.env.NODE_ENV': `"${NODE_ENV}"`,
      'process.env.BUILD_TYPE': `"${process.env.BUILD_TYPE || 'stable'}"`,
    },
  });
}

await buildLayers();
echo('Build layers done');
