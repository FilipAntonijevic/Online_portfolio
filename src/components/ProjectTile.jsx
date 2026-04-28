
// Animation durations (in ms)
const SCALE_UP_DURATION = 300;
const CLONE_TILT_DURATION = 200;
const CLONE_SCALE_DURATION = 500;
const FALL_ANIMATION_DURATION = 11700;

import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { imageRepos } from '../includedProjects';

const ProjectTile = forwardRef(function ProjectTile({ repo, onDrop, onSelect, style, overlay }, ref) {
  const [scale, setScale] = useState(1);
  const [isDropping, setIsDropping] = useState(false);
  // expose imperative methods
    useImperativeHandle(ref, () => ({
    onProjectClick: () => {
      setScale(1.03);
      setTimeout(() => {
        setScale(1);
        if (tileRef.current) {
          const rect = tileRef.current.getBoundingClientRect();
          const cloneId = Date.now();
          // U trenutku kreiranja klona koristi trenutni scale
          setClones([{ id: cloneId, rect, scale, z: 10, dropping: false, dropY: null, rotation: 0 }]);
          // Animiraj scale klona do 1.08 u CLONE_SCALE_DURATION
          let start = null;
          function animateScale(ts) {
            if (!start) start = ts;
            const elapsed = ts - start;
            const progress = Math.min(elapsed / CLONE_SCALE_DURATION, 1);
            const targetStart = scale; // trenutni scale
            const scaleVal = targetStart + (1.08 - targetStart) * progress;
            setClones(prev => prev.map(c => c.id === cloneId ? { ...c, scale: scaleVal } : c));
            if (progress < 1) {
              requestAnimationFrame(animateScale);
            } else {
              setClones(prev => prev.map(c => {
                if (c.id === cloneId && !c.dropping) {
                  const dropY = window.innerHeight * 0.95 - c.rect.top - c.rect.height / 2;
                  return { ...c, dropping: true, dropY };
                }
                return c;
              }));
              setTimeout(() => {
                setClones([]);
                if (onDrop && repo) onDrop(repo);
              }, FALL_ANIMATION_DURATION);
            }
          }
          requestAnimationFrame(animateScale);

          setTimeout(() => {
            setClones(prev => prev.map(c => c.id === cloneId ? { ...c, rotation: 4 } : c));
          }, CLONE_TILT_DURATION);
        }
      }, SCALE_UP_DURATION);
    },
    onProjectDrop: () => {}, // Više nije potreban, sve je u onProjectClick
  }), [onDrop, repo]);
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
  const mergedDivStyle = {
    ...defaultDivStyle,
    ...style,
    zIndex: overlay ? 10 : (style?.zIndex || 2),
    transform: `${style?.transform || ''} scale(${scale}) ${isDropping ? 'translateY(120px)' : ''}`.trim(),
    transition: isDropping ? 'transform 0.2s' : 'transform 0.6s',
  };

  return (
    <>
      <div
        ref={tileRef}
        className={`project-tile ${imageRepos.has(repo.name) ? 'project-tile-image' : ''}`}
        style={mergedDivStyle}
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
            src="/images/TicTacToe.png"
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
      {clones.map(clone => {
        // Pad do fiksnog Y (95% visine ekrana - visina/2)
        const targetY = clone.dropY ?? 0;
        return (
          <div
            key={clone.id}
            className={`project-tile project-tile-clone${clone.dropping ? ' dropping' : ''} ${imageRepos.has(repo.name) ? 'project-tile-image' : ''}`}
              style={{
              position: 'fixed',
              top: clone.rect.top,
              left: clone.rect.left,
              width: clone.rect.width,
              height: clone.rect.height,
              pointerEvents: 'none',
              zIndex: (clone.z ?? 0) + 10,
              transform: `translateY(${clone.dropping ? targetY : 0}px) scale(${clone.scale || 1}) rotate(${clone.rotation || 0}deg)`,
              transition: clone.dropping
                ? `transform ${FALL_ANIMATION_DURATION}ms linear`
                : `transform ${CLONE_SCALE_DURATION}ms, transform ${CLONE_TILT_DURATION}ms`,
            }}
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
                src="/images/TicTacToe.png"
                alt={repo.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
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
        );
      })}
    </>
  );
});

export default ProjectTile;
