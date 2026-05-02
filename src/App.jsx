import { useState, useEffect, useRef } from 'react';
import LeftColumn from './components/LeftColumn';
import CenterMachine from './components/CenterMachine';
import './styles.css';

// ── Design canvas ────────────────────────────────────────────────────────────
// Use the screen's available dimensions as the reference — this is stable
// regardless of what window size the page was opened in.
const DESIGN_WIDTH  = window.screen.availWidth  || window.innerWidth;
const DESIGN_HEIGHT = window.screen.availHeight || window.innerHeight;
document.documentElement.style.setProperty('--design-vw', `${DESIGN_WIDTH  / 100}px`);
document.documentElement.style.setProperty('--design-vh', `${DESIGN_HEIGHT / 100}px`);
// ─────────────────────────────────────────────────────────────────────────────

// Configuration - Edit these values to customize
const GITHUB_USERNAME = 'FilipAntonijevic';
const MAX_PROJECTS = 20;// 4 columns x 5 rows
const includedProjects = ["Tavern_Tower", "Mastermind_best_starting_move_proof", "TicTacToe","Optimal_block_packing", "score_sheet", "hand_draw_simulator", "Grafika-projekat"]; 

// 0 = lights ON (night), 1 = lights OFF (daytime)
const Daytime = 0;
function App() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [droppedRepo, setDroppedRepo] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const timeoutRef = useRef(null);

  // Contain-scale: preserve aspect ratio, center content.
  // Background tile size matches scaled content so tiles align seamlessly.
  const [layout, setLayout] = useState({ scale: 1, left: 0, top: 0 });
  useEffect(() => {
    function handleResize() {
      const s = Math.min(
        window.innerWidth  / DESIGN_WIDTH,
        window.innerHeight / DESIGN_HEIGHT,
      );
      const left = (window.innerWidth  - DESIGN_WIDTH  * s) / 2;
      // Pin to bottom: content always sits at the bottom of the viewport
      const top  = window.innerHeight - DESIGN_HEIGHT * s;
      setLayout({ scale: s, left, top });
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchGitHubRepos();
    
    // Listen for repo selection events
    const handleSelectRepo = (e) => {
      setSelectedRepo(e.detail);
    };
    window.addEventListener('selectRepo', handleSelectRepo);
    
    return () => {
      window.removeEventListener('selectRepo', handleSelectRepo);
    };
  }, []);

  async function fetchGitHubRepos() {
    try {
      setLoading(true);
      setError(null);
    
      if (includedProjects && includedProjects.length > 0) {
        const headers = {};
        const names = includedProjects.slice(0, MAX_PROJECTS);

        const fetchPromises = names.map(async (name) => {
          try {
            const resp = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${name}`, { headers });
            if (!resp.ok) throw new Error(`GitHub repo fetch failed: ${resp.status}`);
            const data = await resp.json();
            return data;
          } catch (e) {
            // If a single repo fetch fails (private/missing/rate-limited),
            // fall back to a minimal object so the UI can still render.
            return {
              id: `${GITHUB_USERNAME}/${name}`,
              name,
              full_name: `${GITHUB_USERNAME}/${name}`,
              html_url: `https://github.com/${GITHUB_USERNAME}/${name}`,
              description: '',
              updated_at: new Date().toISOString(),
              owner: { login: GITHUB_USERNAME },
              stargazers_count: 0,
              forks_count: 0,
            };
          }
        });

        const results = await Promise.all(fetchPromises);
        setRepos(results);
        return;
      }

      // No included projects configured: default behavior is to show none.
      // To enable automatic fetching from GitHub again, add code here or
      // populate `includedProjects` with the repo names to display.
      setRepos([]);
    } catch (err) {
      console.error('Error fetching GitHub repos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleProjectDrop = (repo) => {
    // Always create a new droppedRepo object so repeated drops of the same project
    // will produce a new reference and trigger downstream effects (animations).
    setDroppedRepo({ ...repo, _droppedAt: Date.now() });
    // Keep the repo in the list (infinite supply)
  };

  const handleProjectSelect = (repo) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setSelectedRepo(repo);
    setShowDescription(true);

    // Prilagodi trajanje na osnovu broja karaktera u opisu
    let desc = repo?.description || "No description available.";
    let len = desc.length;
    if (len > 200) len = 200;
    // Linearno: 0 char -> 2s, 200 char -> 8s
    const minMs = 2000;
    const maxMs = 8000;
    const duration = Math.round(minMs + (maxMs - minMs) * (len / 200));

    timeoutRef.current = setTimeout(() => {
      setShowDescription(false);
    }, duration);
  };

  const handleChuteClick = () => {
    if (droppedRepo) {
      window.open(droppedRepo.html_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleVideoClose = () => {
    setSelectedRepo(null);
    setShowDescription(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <WallBackground
        tileW={DESIGN_WIDTH  * layout.scale}
        tileH={DESIGN_HEIGHT * layout.scale}
        offsetLeft={layout.left}
        offsetTop={layout.top}
      />
      <div data-scaler="true" style={{
        position: 'absolute',
        top:  `${layout.top}px`,
        left: `${layout.left}px`,
        transform: `scale(${layout.scale})`,
        transformOrigin: 'top left',
        width:  `${DESIGN_WIDTH}px`,
        height: `${DESIGN_HEIGHT}px`,
      }}>
        <div className="app">
          <div className="container">
            <LeftColumn />
            <CenterMachine
              repos={repos}
              loading={loading}
              error={error}
              droppedRepo={droppedRepo}
              selectedRepo={selectedRepo}
              showDescription={showDescription}
              onProjectDrop={handleProjectDrop}
              onProjectSelect={handleProjectSelect}
              onChuteClick={handleChuteClick}
              onVideoClose={handleVideoClose}
              designHeight={DESIGN_HEIGHT}
              daytime={Daytime}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

// Renders Wall.png as a tiled grid where every other column is mirrored
// horizontally, creating a seamless zoom-out effect around the content.
function WallBackground({ tileW, tileH, offsetLeft, offsetTop }) {
  if (tileW <= 0 || tileH <= 0) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // col=0 / row=0 is the tile at (offsetLeft, offsetTop) — the "content" tile.
  // Compute range of cols/rows needed to cover the full viewport.
  const startCol = Math.floor(-offsetLeft / tileW) - 1;
  const endCol   = Math.ceil((vw - offsetLeft) / tileW);
  const startRow = Math.floor(-offsetTop  / tileH) - 1;
  const endRow   = Math.ceil((vh - offsetTop)  / tileH);

  const tiles = [];
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const x = offsetLeft + col * tileW;
      const y = offsetTop  + row * tileH;
      if (x + tileW < 0 || x > vw || y + tileH < 0 || y > vh) continue;

      // Mirror every other column so adjacent tiles connect seamlessly.
      const flipX = ((col % 2) + 2) % 2 === 1;
      // Tiles above the main content (row < 0) use upper_wall.png
      const img = row < 0
        ? "url('/images/rest/upper_wall.png')"
        : "url('/images/rest/Wall.png')";

      tiles.push(
        <div
          key={`${row}-${col}`}
          style={{
            position: 'absolute',
            left: x, top: y,
            width: tileW, height: tileH,
            backgroundImage: img,
            backgroundSize: '100% 100%',
            transform: flipX ? 'scaleX(-1)' : undefined,
          }}
        />
      );
    }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {tiles}
    </div>
  );
}
