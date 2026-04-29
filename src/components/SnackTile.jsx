const BG_ROTATE_DURATION = 1000;
const TILE_CLICK_TIMEOUT = 1100;

import React, { useRef, useState } from 'react';
import Spring from './Spring';
import ProjectTile from './ProjectTile';


function SnackTile({ repo, style, onProjectDrop, onProjectSelect }) {
  const [project, setProject] = useState(null);
  const [bgRotation, setBgRotation] = useState(0);
  const [lastClicked, setLastClicked] = useState(0);
  const spring = useRef(null);
  const projectTileRef = useRef(null);
  const overlayTileRef = useRef(null);

  const handleProjectClick = async (...args) => {
    const now = Date.now();
    if (now - lastClicked < TILE_CLICK_TIMEOUT) return;
    setLastClicked(now);
    // Animiraj rotaciju background slike
    setBgRotation(r => r - 360);
    // 1. Pusti video odmah
    if (onProjectSelect) onProjectSelect(repo);
    // 2. Scale ProjectTile i overlay
    if (projectTileRef.current && projectTileRef.current.onProjectClick) {
      projectTileRef.current.onProjectClick();
    }
    if (overlayTileRef.current && overlayTileRef.current.onProjectClick) {
      overlayTileRef.current.onProjectClick();
    }
    // 3. Rotiraj Spring
    if (spring.current && spring.current.onProjectClick) {
      spring.current.onProjectClick();
    }
    // 4. Nakon 0.6s, drop animacija
    setTimeout(() => {
      if (projectTileRef.current && projectTileRef.current.onProjectDrop) {
        projectTileRef.current.onProjectDrop();
      }
      if (overlayTileRef.current && overlayTileRef.current.onProjectDrop) {
        overlayTileRef.current.onProjectDrop();
      }
      if (onProjectDrop && repo) onProjectDrop(repo);
    }, 600);
  };

  // Hover enter/leave za spring animaciju
  const handleProjectHoverEnter = () => {
    if (spring.current && spring.current.onProjectHoverEnter) {
      spring.current.onProjectHoverEnter();
    }
  };
  const handleProjectHoverLeave = () => {
    if (spring.current && spring.current.onProjectHoverLeave) {
      spring.current.onProjectHoverLeave();
    }
  };

  React.useEffect(() => {
    setProject(repo || null);
  }, [repo]);

  return (
    <div
      className="snack-tile"
      style={{ ...style, position: 'relative', cursor: 'pointer' }}
      onMouseEnter={handleProjectHoverEnter}
      onMouseLeave={handleProjectHoverLeave}
      onClick={handleProjectClick}
    >
      {/* Spring background - index -10 (10px right) */}
      <img
        src="/images/rest/full_spring.png"
        alt="full spring background"
        style={{
          position: 'absolute',
          left: 'calc(50% + 10px)',
          top: '50%',
          transform: `translate(-50%, -50%) scale(0.8) rotate(${bgRotation}deg)`,
          transition: `transform ${BG_ROTATE_DURATION}ms linear`,
          objectFit: 'contain',
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      />
      {/* Spring background - index -5 (5px right) */}
      <img
        src="/images/rest/full_spring.png"
        alt="full spring background"
        style={{
          position: 'absolute',
          left: 'calc(50% + 5px)',
          top: '50%',
          transform: `translate(-50%, -50%) scale(0.8) rotate(${bgRotation}deg)`,
          transition: `transform ${BG_ROTATE_DURATION}ms linear`,
          objectFit: 'contain',
          zIndex: 4,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      />
      {/* Spring background - index 0 (original, no offset) */}
      <img
        src="/images/rest/full_spring.png"
        alt="full spring background"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(0.8) rotate(${bgRotation}deg)`,
          transition: `transform ${BG_ROTATE_DURATION}ms linear`,
          objectFit: 'contain',
          zIndex: 6,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      />


    {repo && (
      <>
        {/* Projekat slike iza glavnog, sa offsetima */}
        <ProjectTile
          repo={repo}
          style={{
            zIndex: 1,
            position: 'absolute',
            left: 'calc(50% + 15px)',
            top: '50%',
            transform: 'translate(-50%, -50%) scale(0.8)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          disabled
        />
        <ProjectTile
          repo={repo}
          style={{
            zIndex: 3,
            position: 'absolute',
            left: 'calc(50% + 10px)',
            top: '50%',
            transform: 'translate(-50%, -50%) scale(0.85)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          disabled
        />
        <ProjectTile
          repo={repo}
          style={{
            zIndex: 5,
            position: 'absolute',
            left: 'calc(50% + 5px)',
            top: '50%',
            transform: 'translate(-50%, -50%) scale(0.9)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          disabled
        />
        {/* Glavni projekat */}
        <ProjectTile
          ref={projectTileRef}
          repo={repo}
          style={{ zIndex: 7 }}
          onSelect={onProjectSelect}
        />
        <ProjectTile
          ref={overlayTileRef}
          repo={repo}
          style={{
            zIndex: 9,
            clipPath: 'inset(50% 0 0 0)'
          }}
          overlay
          onSelect={onProjectSelect}
        />
      </>
    )}

      <Spring
        ref={spring}
        repo={repo}
        style={{ zIndex: 8}}
      />
    </div>
  );
}

export default SnackTile;
