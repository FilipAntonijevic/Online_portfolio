import { useState, useEffect, useRef } from 'react';
import LeftColumn from './components/LeftColumn';
import CenterMachine from './components/CenterMachine';
import RightColumn from './components/RightColumn';
import './styles.css';

// Configuration - Edit these values to customize
const GITHUB_USERNAME = 'FilipAntonijevic';
const MAX_PROJECTS = 24; // 4 columns x 6 rows

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

      const headers = {};
      // Note: GitHub token removed for security. API calls will work without auth but with lower rate limits.
      // If you need higher rate limits, use environment variables instead of hardcoding tokens.

      // Fetch both owned repos and repos user has contributed to
      const [ownedResponse, contributedResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, { headers }),
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=all`, { headers })
      ]);

      if (!ownedResponse.ok) {
        throw new Error(`GitHub API error: ${ownedResponse.status}`);
      }

      const ownedData = await ownedResponse.json();
      const contributedData = contributedResponse.ok ? await contributedResponse.json() : [];

      // Combine and deduplicate repos (include forks as they may be contributed projects)
      const allRepos = [...ownedData, ...contributedData];
      const uniqueRepos = Array.from(
        new Map(allRepos.map(repo => [repo.id, repo])).values()
      );

      // Filter out specific projects
      const excludedProjects = ['kk_project', 'Blokejd-GameJam', 'RBS', '8_David_Bader'];
      const filteredRepos = uniqueRepos
        .filter(repo => !excludedProjects.includes(repo.name))
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, MAX_PROJECTS);

      setRepos(filteredRepos);
    } catch (err) {
      console.error('Error fetching GitHub repos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleProjectDrop = (repo) => {
    setDroppedRepo(repo);
    // Keep the repo in the list (infinite supply)
  };

  const handleProjectSelect = (repo) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setSelectedRepo(repo);
    setShowDescription(true);
    
    // After 6 seconds, hide description and show video
    timeoutRef.current = setTimeout(() => {
      setShowDescription(false);
    }, 6000);
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
