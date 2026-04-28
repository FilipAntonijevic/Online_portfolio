import { useState, useEffect, useRef } from 'react';
import LeftColumn from './components/LeftColumn';
import CenterMachine from './components/CenterMachine';
import RightColumn from './components/RightColumn';
import './styles.css';

// Configuration - Edit these values to customize
const GITHUB_USERNAME = 'FilipAntonijevic';
const MAX_PROJECTS = 20;// 4 columns x 5 rows
const includedProjects = ["Tavern_Tower", "Mastermind_best_starting_move_proof", "TicTacToe","Optimal_block_packing", "score_sheet", "hand_draw_simulator", "Grafika-projekat"]; 
function App() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [droppedRepo, setDroppedRepo] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const timeoutRef = useRef(null);

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
        />
        <RightColumn />
      </div>
    </div>
  );
}

export default App;
