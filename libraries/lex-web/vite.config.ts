/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { viteSingleFile } from 'vite-plugin-singlefile';
import fs from 'fs';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libraries/lex-web',
  server: {
    port: 4200,
    host: '10.0.0.219',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    viteSingleFile(),
    {
      name: "vite-plugin-html-string",
      closeBundle() {
        const bundle = fs.readFileSync('./lib/index.html', 'utf8');

        const escaped = JSON.stringify(bundle);
        const code = `export const htmlString = ${escaped}; export default htmlString;`;

        fs.writeFileSync('./lib/htmlString.ts', code);
      }
    }
  ],
  build: {
    outDir: './lib',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
});
