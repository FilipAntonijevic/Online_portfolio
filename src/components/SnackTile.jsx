
import React, { useRef, useState } from 'react';
import Spring from './Spring';
import ProjectTile from './ProjectTile';

function SnackTile({ repo, style, onProjectDrop, onProjectSelect }) {
  const [project, setProject] = useState(null);
  const spring = useRef(null);
  const projectTileRef = useRef(null);

  const handleProjectClick = (...args) => {
    if (spring.current && spring.current.onProjectClick) {
      spring.current.onProjectClick(...args);
    }
    // Pozovi metodu iz ProjectTile preko ref-a ako postoji
    if (projectTileRef.current && projectTileRef.current.onProjectClick) {
      console.log("Calling onProjectClick from ProjectTile via ref");
      projectTileRef.current.onProjectClick(...args);
    }
    if (onProjectDrop && repo) onProjectDrop(repo);
  };
  const handleProjectHover = (...args) => {
    if (spring.current && spring.current.onProjectHover) {
      spring.current.onProjectHover(...args);
    }
    if (project && project.onProjectHover) {
      project.onProjectHover(...args);
    }
  };

  React.useEffect(() => {
    setProject(repo || null);
  }, [repo]);

  return (
    <div
      className="snack-tile"
      style={{ ...style, position: 'relative', cursor: 'pointer' }}
      onMouseEnter={handleProjectHover}
      onClick={handleProjectClick}
    >
      <img
        src="/images/full_spring.png"
        alt="full spring background"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) scale(0.8)',
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
          repo={repo}
          style={{
            zIndex: 4,
            clipPath: 'inset(50% 0 0 0)'
          }}
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
