import React, { useState, useEffect } from 'react';
import ProjectTile from './ProjectTile';
import Spring from './Spring';
import SnackTile from './SnackTile';

function CenterMachine({ repos, loading, error, droppedRepo, onProjectDrop, onProjectSelect, onChuteClick, selectedRepo, showDescription, onVideoClose }) {
  const [chutePressed, setChutePressed] = useState(false);
  const [dropTargetY, setDropTargetY] = useState(window.innerHeight * 0.9);

  useEffect(() => {
    function updateDropTargetY() {
      setDropTargetY(window.innerHeight * 0.9);
    }
    updateDropTargetY();
    window.addEventListener('resize', updateDropTargetY);
    return () => window.removeEventListener('resize', updateDropTargetY);
  }, []);

  useEffect(() => {
    // reset pressed state when droppedRepo changes so animation can run again
    setChutePressed(false);
  }, [droppedRepo]);

  const handleChuteClick = (e) => {
    setChutePressed(true);
    if (onChuteClick) onChuteClick(e);
  };

  // Helper function for rendering tiles
  function renderSnackTile(repo, i) {
    return (
      <SnackTile
        key={repo ? repo.id : `placeholder-${i}`}
        repo={repo}
        style={{ position: 'relative' }}
        onProjectDrop={onProjectDrop}
        onProjectSelect={onProjectSelect}
        dropTargetY={dropTargetY}
      />
    );
  }

  return (
    <main className="column center-column">
      <div className="vending-machine">
        <div className="snack-box">
          {/* Left side: Projects (snack) */}
          <div className="projects-section" role="region" aria-label="Project tiles">
            {loading && (
              <div className="status-message" role="status" aria-live="polite">
                Loading projects...
              </div>
            )}
            {error && (
              <div className="status-message error" role="alert">
                Error loading projects: {error}
              </div>
            )}
            {!loading && !error && repos.length === 0 && (
              <div className="status-message">
                No projects found on GitHub.
              </div>
            )}
            {!loading && !error && (
              <div className="project-grid">
                {Array.from({ length: 16 }).map((_, i) => renderSnackTile(repos[i], i))}
              </div>
            )}
          </div>

                {/* Box area (chute) will sit below projects inside the snack-box */}
                {/* chute-area moved down into the snack-box wrapper */}

                <div
                  className={`chute-area ${droppedRepo ? 'active' : ''} ${chutePressed ? 'pressed' : ''}`}
                  onClick={handleChuteClick}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && droppedRepo) {
                      e.preventDefault();
                      setChutePressed(true);
                      if (onChuteClick) onChuteClick(e);
                    }
                  }}
                  tabIndex={droppedRepo ? 0 : -1}
                  role={droppedRepo ? 'button' : 'status'}
                  aria-label={droppedRepo ? `Open ${droppedRepo.name} on GitHub` : 'Drop a project here'}
                >
                  <div className="chute-opening"></div>
                </div>

              </div>

              {/* Right side: Video preview screen (control area) */}
              <div className="video-screen">
                <div className="screen-frame">
                  {selectedRepo && showDescription ? (
                    <div className="description-overlay">
                      <p className="description-text">
                        {selectedRepo.description || 'No description available'}
                      </p>
                      <div className="loading-bar-container">
                        {[...Array(14)].map((_, i) => (
                          <div key={`${selectedRepo.id}-${i}`} className="loading-block" style={{ animationDelay: `${i * 0.4286}s` }}></div>
                        ))}
                      </div>
                    </div>
                  ) : selectedRepo && selectedRepo.name === 'Grafika-projekat' ? (
                    <video
                      key="mamuti-video"
                      autoPlay
                      muted
                      playsInline
                      controlsList="nodownload nofullscreen noremoteplayback"
                      disablePictureInPicture
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onEnded={onVideoClose}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <source src="/videos/Mamuti na ostrvu - projekat iz računarske grafike.mp4?v=2" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : selectedRepo && selectedRepo.name === 'Optimal_block_packing' ? (
                    <video
                      key="optimal-video"
                      autoPlay
                      muted
                      playsInline
                      controlsList="nodownload nofullscreen noremoteplayback"
                      disablePictureInPicture
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onEnded={onVideoClose}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <source src="/videos/Optimal_block_packing.mkv?v=2" type="video/x-matroska" />
                      Your browser does not support the video tag.
                    </video>
                  ) : selectedRepo && selectedRepo.name === 'Tavern_Tower' ? (
                    <video
                      key="tavern-tower-video"
                      autoPlay
                      muted
                      playsInline
                      preload="auto"
                      controlsList="nodownload nofullscreen noremoteplayback"
                      disablePictureInPicture
                      style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'high-quality' }}
                      onEnded={onVideoClose}
                      onContextMenu={(e) => e.preventDefault()}
                      onLoadedMetadata={(e) => e.target.playbackRate = 2.0}
                    >
                      <source src="/videos/Tavern_tower.mkv?v=2" type="video/x-matroska" />
                      Your browser does not support the video tag.
                    </video>
                  ) : selectedRepo && selectedRepo.name === 'score_sheet' ? (
                    <div className="centered-video-container">
                      <video
                        key="score-sheet-video"
                        autoPlay
                        muted
                        playsInline
                        controlsList="nodownload nofullscreen noremoteplayback"
                        disablePictureInPicture
                        className="centered-video"
                        onEnded={onVideoClose}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <source src="/videos/Score_sheet.mp4?v=2" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <video
                      key="static-video"
                      autoPlay
                      loop
                      muted
                      playsInline
                      controlsList="nodownload nofullscreen noremoteplayback"
                      disablePictureInPicture
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <source src="/videos/TV STATIC (4K 60FPS).mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
      </div>
      {/* Single centered Spring instance (one number `SPRING_SCALE` controls its size) */}
      <Spring
        repo={null}
        onSelect={onProjectSelect}
        scale={1.0} /* change this number to resize the central Spring */
        style={{ position: 'absolute', left: '50%', top: '50%', zIndex: 50, pointerEvents: 'auto' }}
      />
    </main>
  );
}

export default CenterMachine;
