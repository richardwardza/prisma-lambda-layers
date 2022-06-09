const path = require('path');
const esbuild = require('esbuild');

const functionsDir = 'src';
const outDir = 'dist';
const entryPoints = [`${functionsDir}/handler.ts`];

esbuild.build({
  entryPoints,
  bundle: true,
  outdir: path.join(__dirname, outDir),
  outbase: functionsDir,
  platform: 'node',
  sourcemap: 'linked',
  external: ['/opt/nodejs/*'],
  watch: process.argv.includes('--watch'),
});
