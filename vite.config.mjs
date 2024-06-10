import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import prismjs from 'vite-plugin-prismjs';
import config from './src/config';

// https://vitejs.dev/config/
export default defineConfig({
  base: config.rootUri,

  plugins: [
    vue(),
    prismjs({
      languages: [
        'bash',
        'c',
        'cmake',
        'cpp',
        'crystal',
        'd',
        'diff',
        'docker',
        'glsl',
        'go',
        'graphql',
        'handlebars',
        'haskell',
        'html',
        'javascript',
        'json',
        'jsx',
        'lisp',
        'lua',
        'makefile',
        'markdown',
        'nim',
        'powershell',
        'python',
        'racket',
        'regex',
        'ruby',
        'rust',
        'scheme',
        'sql',
        'tsx',
        'typescript',
        'yaml',
        'zig',
      ],
      theme: 'tomorrow',
      css: true,
    }),
  ],
});
