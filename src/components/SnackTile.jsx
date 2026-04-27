
import React from 'react';
import Spring from './Spring';
import ProjectTile from './ProjectTile';

function SnackTile({ repo, style, onProjectDrop, onProjectSelect }) {
  // Uvek prikazuj full_spring.png kao background
  return (
    <div className="snack-tile" style={{ ...style, position: 'relative' }}>
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
      {repo ? (
        <>
          <ProjectTile
            repo={repo}
            onDrop={onProjectDrop}
            onSelect={onProjectSelect}
          />
        </>
      ) : null}
      <Spring
            repo={repo}
            onDrop={onProjectDrop}
            onSelect={onProjectSelect}
    />
    </div>
  );
}

export default SnackTile;
