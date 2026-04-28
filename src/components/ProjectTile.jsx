import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';

const ProjectTile = forwardRef(function ProjectTile({ repo, onDrop, onSelect, style }, ref) {
    // expose imperative methods
    useImperativeHandle(ref, () => ({
      onProjectClick: () => {
        // Primer: animacija klona kao ranije
        if (tileRef.current) {
          const rect = tileRef.current.getBoundingClientRect();
          const cloneId = Date.now();
          setClones(prev => [...prev, { id: cloneId, rect }]);
          setTimeout(() => {
            setClones(prev => prev.filter(c => c.id !== cloneId));
            if (onDrop && repo) onDrop(repo);
          }, 600);
        }
        // Pozovi onSelect ako treba
        if (onSelect) onSelect(repo);
      }
    }), [onDrop, onSelect, repo]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [clones, setClones] = useState([]);
  const tileRef = useRef(null);
  
  // Per-image scale overrides (e.g. reduce Tavern_Tower by 10% -> 0.9)
  // Use keys that exactly match `repo.name` values used below
  const imgScales = {
    Tavern_Tower: 1.1,
    hand_draw_simulator: 1.1,
    'Grafika-projekat': 1.1, 
    Optimal_block_packing: 1.1, 
    Mastermind_best_starting_move_proof: 1.3,
    score_sheet: 1.3,
    TicTacToe: 1.6
  };

  const getScale = (name) => (imgScales[name] ?? 1);


  const defaultDivStyle = { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' };
  const mergedDivStyle = { ...defaultDivStyle, ...style };

  return (
    <>
      <div
        ref={tileRef}
        className={`project-tile ${(repo.name === 'Grafika-projekat' || repo.name === 'Tavern_Tower' || repo.name === 'Optimal_block_packing' || repo.name === 'Mastermind_best_starting_move_proof' || repo.name === 'score_sheet' || repo.name === 'hand_draw_simulator' || repo.name === 'chesseption' || repo.name === 'fun_elections' || repo.name === 'lauz_hack' || repo.name === 'TicTacToe') ? 'project-tile-image' : ''}`}
        style={mergedDivStyle}
        // ...bez onClick/onMouseEnter/onFocus
      >
        {repo.name === 'Grafika-projekat' ? (
          <img 
            src="/images/Mammoth_island.png" 
            alt={repo.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
          />
        ) : repo.name === 'Tavern_Tower' ? (
          <img 
            src="/images/Tavern_tower.png" 
            alt={repo.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
          />
        ) : repo.name === 'Optimal_block_packing' ? (
          <img 
            src="/images/Block_packing.png" 
            alt={repo.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
          />
        ) : repo.name === 'Mastermind_best_starting_move_proof' ? (
          <img 
            src="/images/Mastermind_proof.png" 
            alt={repo.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
          />
        ) : repo.name === 'score_sheet' ? (
          <img 
            src="/images/Score_sheet.png" 
            alt={repo.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
          />
        ) : repo.name === 'hand_draw_simulator' ? (
          <img 
            src="/images/Hand_draw_simulator.png" 
            alt={repo.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
          />
        ) : repo.name === 'TicTacToe' ? (
          <img
            src="/images/TicTacToe2.png"
            alt={repo.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
          />
        ) : (
          <>
            <span className="project-name">{repo.name}</span>
            
            {repo.stargazers_count > 0 && (
            <span className="star-count" aria-label={`${repo.stargazers_count} stars`}>
              {repo.stargazers_count}
            </span>
          )}
        </>
        )}
      </div>      {/* Render clones that will animate and drop */}
      {clones.map(clone => (
        <div
          key={clone.id}
          className={`project-tile project-tile-clone dropping ${(repo.name === 'Grafika-projekat' || repo.name === 'Tavern_Tower' || repo.name === 'Optimal_block_packing' || repo.name === 'Mastermind_best_starting_move_proof' || repo.name === 'score_sheet' || repo.name === 'hand_draw_simulator' || repo.name === 'chesseption' || repo.name === 'fun_elections' || repo.name === 'lauz_hack' || repo.name === 'TicTacToe') ? 'project-tile-image' : ''}`}
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
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `scale(${getScale(repo.name)})`, transformOrigin: 'bottom center' }}
            />
          ) : repo.name === 'Tavern_Tower' ? (
            <img 
              src="/images/Tavern_tower.png" 
              alt={repo.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `scale(${getScale(repo.name)})`, transformOrigin: 'bottom center' }}
            />
          ) : repo.name === 'Optimal_block_packing' ? (
            <img 
              src="/images/Block_packing.png" 
              alt={repo.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `scale(${getScale(repo.name)})`, transformOrigin: 'bottom center' }}
            />
          ) : repo.name === 'Mastermind_best_starting_move_proof' ? (
            <img 
              src="/images/Mastermind_proof.png" 
              alt={repo.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `scale(${getScale(repo.name)})`, transformOrigin: 'bottom center' }}
            />
          ) : repo.name === 'score_sheet' ? (
            <img 
              src="/images/Score_sheet.png" 
              alt={repo.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `scale(${getScale(repo.name)})`, transformOrigin: 'bottom center' }}
            />
          ) : repo.name === 'hand_draw_simulator' ? (
            <img 
              src="/images/Hand_draw_simulator.png" 
              alt={repo.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `scale(${getScale(repo.name)})`, transformOrigin: 'bottom center' }}
            />
          ) : repo.name === 'TicTacToe' ? (
            <img
              src="/images/TicTacToe.png"
              alt={repo.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `scale(${getScale(repo.name)})`, transformOrigin: 'bottom center' }}
            />
          ): (
            <>
              <span className="project-name">{repo.name}</span>
              {repo.stargazers_count > 0 && (
                <span className="star-count" aria-label={`${repo.stargazers_count} stars`}>
                  {repo.stargazers_count}
                </span>
              )}
            </>
          )}
        </div>
      ))}
    </>
  );
});

export default ProjectTile;
