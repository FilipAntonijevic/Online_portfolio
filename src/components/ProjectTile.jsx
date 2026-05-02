
// Animation durations (in ms)
const SCALE_UP_DURATION = 300;
const CLONE_TILT_DURATION = 1000;
const CLONE_SCALE_DURATION = 500;

import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import { imageRepos } from '../includedProjects';

const ProjectTile = forwardRef(function ProjectTile({ repo, onDrop, onSelect, style, overlay, fallDuration }, ref) {
  // fallDuration is in ms and controls how long the drop animation lasts for clones.
  const FALL_ANIMATION_DURATION = fallDuration ?? 250;
  const [scale, setScale] = useState(1);
  const [isDropping, setIsDropping] = useState(false);
  // expose imperative methods
    useImperativeHandle(ref, () => ({
    onProjectClick: () => {
      if (!tileRef.current) return;
      const rect = tileRef.current.getBoundingClientRect();

      // Portal inside the App scaler so z-index works relative to vending-machine-bottom.
      const scaler = document.querySelector('[data-scaler="true"]');
      let appScale = 1;
      let scalerRect = { top: 0, left: 0 };
      if (scaler) {
        appScale = new DOMMatrix(getComputedStyle(scaler).transform).a;
        scalerRect = scaler.getBoundingClientRect();
      }
      // Tile position in design (unscaled) space.
      const designTop  = (rect.top  - scalerRect.top)  / appScale;
      const designLeft = (rect.left - scalerRect.left) / appScale;
      const designW = rect.width  / appScale;
      const designH = rect.height / appScale;

      setScale(1.03);
      setTimeout(() => {
        setScale(1);
        const cloneId = Date.now();
        setClones([{ id: cloneId, scale: 1.03, designTop, designLeft, designW, designH, container: scaler, z: 10, dropping: false, dropY: null, rotation: 0 }]);
        let start = null;
        function animateScale(ts) {
          if (!start) start = ts;
          const elapsed = ts - start;
          const progress = Math.min(elapsed / CLONE_SCALE_DURATION, 1);
          const scaleVal = 1.035 + (1.09 - 1.035) * progress;
          setClones(prev => prev.map(c => c.id === cloneId ? { ...c, scale: scaleVal } : c));
          if (progress < 1) {
            requestAnimationFrame(animateScale);
          } else {
            // Drop target: bottom edge of chute-area in design space.
            // Falls back to 95% of viewport height if chute not found.
            const chuteEl = document.querySelector('.chute-area');
            const chuteBottom = chuteEl
              ? (chuteEl.getBoundingClientRect().bottom - scalerRect.top) / appScale
              : window.innerHeight * 0.95 / appScale;
            const dropY = chuteBottom - designTop - designH;
            requestAnimationFrame(() => {
              setClones(prev => prev.map(c => c.id === cloneId ? { ...c, dropping: true, dropY } : c));
              setTimeout(() => {
                setClones([]);
                if (onDrop && repo) onDrop(repo);
              }, FALL_ANIMATION_DURATION);
            });
          }
        }
        requestAnimationFrame(animateScale);

        // Start tilt at same time as scale animation
        requestAnimationFrame(() => {
          setClones(prev => prev.map(c => c.id === cloneId ? { ...c, rotation: -4 } : c));
        });
      }, SCALE_UP_DURATION);
    },
    onProjectDrop: () => {}, // Više nije potreban, sve je u onProjectClick
  }), [onDrop, repo]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [clones, setClones] = useState([]);
  const tileRef = useRef(null);
  

  // Per-image scale overrides 
  // Use keys that exactly match `repo.name` values used below
  const imgScales = {
    Tavern_Tower: 1.2,
    hand_draw_simulator: 1.2,
    'Grafika-projekat': 1.2, 
    Optimal_block_packing: 1.2, 
    Mastermind_best_starting_move_proof: 1.4,
    score_sheet: 1.4,
    TicTacToe: 1.8
  };

  const getScale = (name) => (imgScales[name] ?? 1);


  const defaultDivStyle = { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' };
  const mergedDivStyle = {
    ...defaultDivStyle,
    ...style,
    zIndex: overlay ? 10 : (style?.zIndex || 2),
    transform: `${style?.transform || ''} scale(${scale}) ${isDropping ? 'translateY(120px)' : ''}`.trim(),
    transition: isDropping ? 'transform 0.2s' : `transform ${SCALE_UP_DURATION}ms ease`,
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
            src="/images/project_images/Mammoth_island.png" 
            alt={repo.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
          />
        ) : repo.name === 'Tavern_Tower' ? (
          <img 
            src="/images/project_images/Tavern_tower.png" 
            alt={repo.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
          />
        ) : repo.name === 'Optimal_block_packing' ? (
          <img 
            src="/images/project_images/Block_packing.png" 
            alt={repo.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
          />
        ) : repo.name === 'Mastermind_best_starting_move_proof' ? (
          <img 
            src="/images/project_images/Mastermind_proof.png" 
            alt={repo.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
          />
        ) : repo.name === 'score_sheet' ? (
          <img 
            src="/images/project_images/Score_sheet.png" 
            alt={repo.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
          />
        ) : repo.name === 'hand_draw_simulator' ? (
          <img 
            src="/images/project_images/Hand_draw_simulator.png" 
            alt={repo.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
          />
        ) : repo.name === 'TicTacToe' ? (
          <img
            src="/images/project_images/TicTacToe.png"
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
      </div>      {/* Render clones via portal to document.body so position:fixed works
               correctly even though the app is inside a transform:scale() container */}
      {clones.map(clone => {
        const targetY = clone.dropY ?? 0;
        if (!clone.container) return null;
        return ReactDOM.createPortal(
          <div
            key={clone.id}
            className={`project-tile project-tile-clone${clone.dropping ? ' dropping' : ''} ${imageRepos.has(repo.name) ? 'project-tile-image' : ''}`}
            style={{
              position: 'absolute',
              top: clone.designTop,
              left: clone.designLeft,
              width: clone.designW,
              height: clone.designH,
              transformOrigin: '50% 50%',
              pointerEvents: 'none',
              zIndex: (clone.z ?? 0) + 10,
              transform: `translateY(${clone.dropping ? targetY : 0}px) scale(${clone.scale || 1})`,
              rotate: `${clone.rotation || 0}deg`,
              transition: clone.dropping
                ? `transform ${FALL_ANIMATION_DURATION}ms linear`
                : `rotate ${CLONE_TILT_DURATION}ms ease`,
            }}
          >
            {repo.name === 'Grafika-projekat' ? (
              <img 
                src="/images/project_images/Mammoth_island.png" 
                alt={repo.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
              />
            ) : repo.name === 'Tavern_Tower' ? (
              <img 
                src="/images/project_images/Tavern_tower.png" 
                alt={repo.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
              />
            ) : repo.name === 'Optimal_block_packing' ? (
              <img 
                src="/images/project_images/Block_packing.png" 
                alt={repo.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
              />
            ) : repo.name === 'Mastermind_best_starting_move_proof' ? (
              <img 
                src="/images/project_images/Mastermind_proof.png" 
                alt={repo.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
              />
            ) : repo.name === 'score_sheet' ? (
              <img 
                src="/images/project_images/Score_sheet.png" 
                alt={repo.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
              />
            ) : repo.name === 'hand_draw_simulator' ? (
              <img 
                src="/images/project_images/Hand_draw_simulator.png" 
                alt={repo.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translateX(-50%) scale(${getScale(repo.name)})`, transformOrigin: 'bottom center', position: 'absolute', left: '50%', bottom: '6px' }}
              />
            ) : repo.name === 'TicTacToe' ? (
              <img
                src="/images/project_images/TicTacToe.png"
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
          </div>,
          clone.container,
          clone.id
        );
      })}
    </>
  );
});

export default ProjectTile;
