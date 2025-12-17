import React from 'react';
import ProjectTile from './ProjectTile';

function CenterMachine({ repos, loading, error, droppedRepo, onProjectDrop, onProjectSelect, onChuteClick, selectedRepo, showDescription, onVideoClose }) {
  return (
    <main className="column center-column">
      <div className="vending-machine">
        {/* Machine frame and display area */}
        <div className="machine-frame">
          {/* Projects display area with video screen */}
          <div className="projects-display" role="region" aria-label="Project tiles">
            <div className="display-container">
              {/* Left side: Projects (80%) */}
              <div className="projects-section">
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

                {!loading && !error && repos.length > 0 && (
                  <div className="project-grid">
                    {repos.map(repo => (
                      <ProjectTile
                        key={repo.id}
                        repo={repo}
                        onDrop={onProjectDrop}
                        onSelect={onProjectSelect}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right side: Video preview screen (20%) */}
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
          </div>
        </div>

        {/* Chute area at the bottom */}
        <div 
          className={`chute-area ${droppedRepo ? 'active' : ''}`}
          onClick={onChuteClick}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && droppedRepo) {
              e.preventDefault();
              onChuteClick();
            }
          }}
          tabIndex={droppedRepo ? 0 : -1}
          role={droppedRepo ? 'button' : 'status'}
          aria-label={droppedRepo ? `Open ${droppedRepo.name} on GitHub` : 'Drop a project here'}
        >
          <div className="chute-opening"></div>
          <div className="chute-label">
            {droppedRepo ? droppedRepo.name : 'Drop a project here'}
          </div>
        </div>
      </div>
    </main>
  );
}

export default CenterMachine;
