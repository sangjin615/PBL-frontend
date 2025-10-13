import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';
import vsixPlugin from '@codingame/monaco-vscode-rollup-vsix-plugin';
import { resolve } from "path";

export default defineConfig({
  build: {
    target: 'ES2022'
  },
  plugins: [vsixPlugin(), vue()],
  server: {
    port: 5173,
    open: true,
    fs: {
      allow: ['..']
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      vue: "vue/dist/vue.esm-bundler.js",
    },
    dedupe: ['vscode']
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
          importMetaUrlPlugin
      ]
  },
    include: [
      '@codingame/monaco-vscode-standalone-languages',
      '@codingame/monaco-vscode-standalone-css-language-features',
      '@codingame/monaco-vscode-standalone-html-language-features',
      '@codingame/monaco-vscode-standalone-json-language-features',
      '@codingame/monaco-vscode-standalone-typescript-language-features',
      '@testing-library/react',
      'langium',
      'langium/lsp',
      'langium/grammar',
      'vscode/localExtensionHost',
      'vscode-jsonrpc',
      'vscode-languageclient',
      'vscode-languageserver',
      'vscode-languageserver/browser.js',
      'vscode-languageserver-protocol',
      'vscode-oniguruma',
      'vscode-textmate'
  ]
  },
  worker: {
    format: 'es'
  }
});
