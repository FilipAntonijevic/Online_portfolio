import React, { useState, useRef } from 'react';

function ProjectTile({ repo, onDrop, onSelect }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [clones, setClones] = useState([]);
  const tileRef = useRef(null);

  const handleClick = () => {
    // Debug: log repo name
    console.log('Clicked repo:', repo.name);
    
    // Show video preview immediately
    if (onSelect) {
      onSelect(repo);
    }
    
    // Create a clone for animation
    if (tileRef.current) {
      const rect = tileRef.current.getBoundingClientRect();
      const cloneId = Date.now();
      
      setClones(prev => [...prev, {
        id: cloneId,
        rect: rect
      }]);
      
      // Remove clone after animation and notify parent
      setTimeout(() => {
        setClones(prev => prev.filter(c => c.id !== cloneId));
        onDrop(repo);
      }, 600);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <>
      <div
        ref={tileRef}
        className={`project-tile ${(repo.name === 'Grafika-projekat' || repo.name === 'Tavern_Tower' || repo.name === 'Optimal_block_packing' || repo.name === 'Mastermind_best_starting_move_proof' || repo.name === 'score_sheet' || repo.name === 'hand_draw_simulator' || repo.name === 'chesseption' || repo.name === 'fun_elections' || repo.name === 'lauz_hack') ? 'project-tile-image' : ''}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        tabIndex={0}
        role="button"
        aria-label={`Drop project ${repo.name}`}
        aria-describedby={showTooltip ? `tooltip-${repo.id}` : undefined}
      >
        {repo.name === 'Grafika-projekat' ? (
          <img 
            src="/images/Mammoth_island.png" 
            alt={repo.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : repo.name === 'Tavern_Tower' ? (
          <img 
            src="/images/Tavern_tower.png" 
            alt={repo.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : repo.name === 'Optimal_block_packing' ? (
          <img 
            src="/images/Block_packing.png" 
            alt={repo.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : repo.name === 'Mastermind_best_starting_move_proof' ? (
          <img 
            src="/images/Mastermind_proof.png" 
            alt={repo.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : repo.name === 'score_sheet' ? (
          <img 
            src="/images/Score_sheet.png" 
            alt={repo.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : repo.name === 'hand_draw_simulator' ? (
          <img 
            src="/images/Hand_draw_simulator.png" 
            alt={repo.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : repo.name === 'chesseption' ? (
          <img 
            src="/images/chesseption.png" 
            alt={repo.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : repo.name === 'fun_elections' ? (
          <img 
            src="/images/Fun_elections.png" 
            alt={repo.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : repo.name === 'lauz_hack' ? (
          <img 
            src="/images/Patent_wizard.png" 
            alt={repo.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <>
            <span className="project-name">{repo.name}</span>
            
            {repo.stargazers_count > 0 && (
            <span className="star-count" aria-label={`${repo.stargazers_count} stars`}>
              ⭐ {repo.stargazers_count}
            </span>
          )}\n        </>
        )}
      </div>      {/* Render clones that will animate and drop */}
      {clones.map(clone => (
        <div
          key={clone.id}
          className={`project-tile project-tile-clone dropping ${(repo.name === 'Grafika-projekat' || repo.name === 'Tavern_Tower' || repo.name === 'Optimal_block_packing' || repo.name === 'Mastermind_best_starting_move_proof' || repo.name === 'score_sheet' || repo.name === 'hand_draw_simulator' || repo.name === 'chesseption' || repo.name === 'fun_elections' || repo.name === 'lauz_hack') ? 'project-tile-image' : ''}`}
          style={{
            position: 'fixed',
            top: clone.rect.top,
            left: clone.rect.left,
            width: clone.rect.width,
            height: clone.rect.height,
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          {repo.name === 'Grafika-projekat' ? (
            <img 
              src="/images/Mammoth_island.png" 
              alt={repo.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : repo.name === 'Tavern_Tower' ? (
            <img 
              src="/images/Tavern_tower.png" 
              alt={repo.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : repo.name === 'Optimal_block_packing' ? (
            <img 
              src="/images/Block_packing.png" 
              alt={repo.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : repo.name === 'Mastermind_best_starting_move_proof' ? (
            <img 
              src="/images/Mastermind_proof.png" 
              alt={repo.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : repo.name === 'score_sheet' ? (
            <img 
              src="/images/Score_sheet.png" 
              alt={repo.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : repo.name === 'hand_draw_simulator' ? (
            <img 
              src="/images/Hand_draw_simulator.png" 
              alt={repo.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : repo.name === 'chesseption' ? (
            <img 
              src="/images/chesseption.png" 
              alt={repo.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : repo.name === 'fun_elections' ? (
            <img 
              src="/images/Fun_elections.png" 
              alt={repo.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : repo.name === 'lauz_hack' ? (
            <img 
              src="/images/Patent_wizard.png" 
              alt={repo.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <>
              <span className="project-name">{repo.name}</span>
              {repo.stargazers_count > 0 && (
                <span className="star-count" aria-label={`${repo.stargazers_count} stars`}>
                  ⭐ {repo.stargazers_count}
                </span>
              )}
            </>
          )}
        </div>
      ))}
    </>
  );
}

export default ProjectTile;
