/**
 * Vite plugin: fetches GitHub repo data at build time and writes public/repos.json.
 * Uses GITHUB_TOKEN env var (no VITE_ prefix — never exposed to browser).
 */
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const GITHUB_USERNAME   = 'FilipAntonijevic';
const INCLUDED_PROJECTS = [
  'Tavern_Tower', 'Mastermind_best_starting_move_proof', 'TicTacToe',
  'Optimal_block_packing', 'score_sheet', 'hand_draw_simulator', 'Grafika-projekat',
];

function fallback(name) {
  return {
    id: `${GITHUB_USERNAME}/${name}`, name,
    full_name: `${GITHUB_USERNAME}/${name}`,
    html_url: `https://github.com/${GITHUB_USERNAME}/${name}`,
    description: '', updated_at: new Date().toISOString(),
    owner: { login: GITHUB_USERNAME },
    stargazers_count: 0, forks_count: 0,
  };
}

export default function fetchReposPlugin() {
  return {
    name: 'fetch-repos',
    async buildStart() {
      const token = process.env.GITHUB_TOKEN;
      const headers = { 'User-Agent': 'vite-build' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      console.log(token
        ? '[fetch-repos] Fetching GitHub repos with token (5000 req/hr)...'
        : '[fetch-repos] Fetching GitHub repos without token (60 req/hr)...'
      );

      const results = await Promise.all(
        INCLUDED_PROJECTS.map(async (name) => {
          try {
            const res = await fetch(
              `https://api.github.com/repos/${GITHUB_USERNAME}/${name}`,
              { headers }
            );
            if (!res.ok) {
              console.warn(`[fetch-repos] ${name}: HTTP ${res.status}`);
              return fallback(name);
            }
            return await res.json();
          } catch (err) {
            console.warn(`[fetch-repos] ${name}: ${err.message}`);
            return fallback(name);
          }
        })
      );

      const outDir = resolve('public');
      mkdirSync(outDir, { recursive: true });
      writeFileSync(resolve(outDir, 'repos.json'), JSON.stringify(results, null, 2));
      console.log(`[fetch-repos] Wrote public/repos.json (${results.length} repos)`);
    },
  };
}
