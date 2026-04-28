const BG_ROTATE_DURATION = 1250;

import React, { useRef, useState } from 'react';
import Spring from './Spring';
import ProjectTile from './ProjectTile';

function SnackTile({ repo, style, onProjectDrop, onProjectSelect }) {
  const [project, setProject] = useState(null);
  const [bgRotation, setBgRotation] = useState(0);
  const spring = useRef(null);
  const projectTileRef = useRef(null);
  const overlayTileRef = useRef(null);

  const handleProjectClick = async (...args) => {
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
      <img
        src="/images/full_spring_2.png"
        alt="full spring background"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(0.8) rotate(${bgRotation}deg)`,
          transition: `transform ${BG_ROTATE_DURATION}ms cubic-bezier(0.4, 0.2, 0.2, 1)`,
          objectFit: 'contain',
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      />
      
    {repo && (
      <>
        <ProjectTile
          ref={projectTileRef}
          repo={repo}
          style={{ zIndex: 2 }}
          onSelect={onProjectSelect}
        />
        <ProjectTile
          ref={overlayTileRef}
          repo={repo}
          style={{
            zIndex: 4,
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
        style={{ zIndex: 3}}
      />
    </div>
  );
}

export default SnackTile;
