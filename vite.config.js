import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fetchReposPlugin from './fetch-repos-plugin.js';

export default defineConfig({
  plugins: [react(), fetchReposPlugin()],
  base: '/Online_portfolio/',
});
