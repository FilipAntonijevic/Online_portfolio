import React, { useState, useEffect, useRef } from 'react';
import ProjectTile from './ProjectTile';
import Spring from './Spring';
import SnackTile from './SnackTile';

const REPOS_WITH_VIDEO = new Set(['Grafika-projekat', 'Optimal_block_packing', 'Tavern_Tower', 'score_sheet', 'TicTacToe']);

function CenterMachine({ repos, loading, error, droppedRepo, onProjectDrop, onProjectSelect, onChuteClick, selectedRepo, showDescription, onVideoClose, designHeight, daytime }) {
  const [chutePressed, setChutePressed] = useState(false);
  // Use design-space height so drop target stays correct when window is resized
  const dropTargetY = (designHeight ?? window.innerHeight) * 0.9;
  const [postSequenceActive, setPostSequenceActive] = useState(false);
  const [noVideoStaticActive, setNoVideoStaticActive] = useState(false);
  const prevShowDescriptionRef = useRef(false);

  useEffect(() => {
    // reset pressed state when droppedRepo changes so animation can run again
    setChutePressed(false);
  }, [droppedRepo]);

  // Detect description end → play static for repos without a video
  useEffect(() => {
    const prev = prevShowDescriptionRef.current;
    prevShowDescriptionRef.current = showDescription;
    if (prev === true && showDescription === false && selectedRepo && !REPOS_WITH_VIDEO.has(selectedRepo.name)) {
      setNoVideoStaticActive(true);
      setPostSequenceActive(false);
    }
  }, [showDescription, selectedRepo]);

  // Reset per-repo state when a new project is selected
  useEffect(() => {
    setNoVideoStaticActive(false);
    setPostSequenceActive(false);
  }, [selectedRepo]);

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
        slotIndex={i}
        style={{ position: 'relative' }}
        onProjectDrop={onProjectDrop}
        onProjectSelect={onProjectSelect}
        dropTargetY={dropTargetY}
      />
    );
  }

  return (
    <main className="column center-column">
      <div className="vending-machine" style={{position: 'relative', backgroundImage: `url(${import.meta.env.BASE_URL}images_webp/rest/Vending_machine.webp)`}}>
        <div className="vending-machine-bottom" 
              style={{position: 'absolute', 
              left: 0, 
              bottom: 0, 
              width: '100%', 
              height: 'calc(var(--design-vh, 1vh) * 100)', 
              zIndex: 9999, 
              pointerEvents: 'none', 
              userSelect: 'none',
              backgroundImage: `url(${import.meta.env.BASE_URL}images_webp/rest/Vending_machine_bottom.webp)`}} />
          
        <div className="snack-box">

          {/* Ceiling light sources — hidden in daytime */}
          {!daytime && <div className="snack-light snack-light--left" />}
          {!daytime && <div className="snack-light snack-light--right snack-light--flicker" />}
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
                  style={{ zIndex: 10000 }}
                  tabIndex={droppedRepo ? 0 : -1}
                  role={droppedRepo ? 'button' : 'status'}
                  aria-label={droppedRepo ? `Open ${droppedRepo.name} on GitHub` : 'Drop a project here'}
                >
                  <div className="chute-opening"></div>
                </div>

              </div>

              {/* Right side: Video preview screen (control area) */}
              <div className="video-screen" style={{ position: 'relative', left: '2px', boxSizing: 'border-box' }}>
                <div className="screen-frame">
                  {selectedRepo && showDescription ? (
                    <div className="description-overlay">
                      <p className="description-text">
                        {selectedRepo.description || 'No description available'}
                      </p>
                      <div className="loading-bar-container">
                        {(() => {
                          let desc = selectedRepo?.description || "No description available.";
                          let len = desc.length;
                          if (len > 200) len = 200;
                          const minMs = 2000;
                          const maxMs = 8000;
                          const duration = Math.round(minMs + (maxMs - minMs) * (len / 200));
                          const durationSec = duration / 1000;
                          const blockCount = 14;
                          const fragment = durationSec / blockCount;
                          return [...Array(blockCount)].map((_, i) => (
                            <div key={`${selectedRepo.id}-${i}`} className="loading-block" style={{ animationDelay: `${i * fragment}s` }}></div>
                          ));
                        })()}
                      </div>
                    </div>
                  ) : noVideoStaticActive ? (
                    <video
                      key="no-video-static"
                      autoPlay
                      muted
                      playsInline
                      controlsList="nodownload nofullscreen noremoteplayback"
                      disablePictureInPicture
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onEnded={() => { setNoVideoStaticActive(false); setPostSequenceActive(true); }}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <source src={import.meta.env.BASE_URL + "videos/TV STATIC (4K 60FPS).mp4"} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : selectedRepo && selectedRepo.name === 'Grafika-projekat' ? (
                    <video
                      key="mamuti-video"
                      autoPlay
                      muted
                      playsInline
                      controlsList="nodownload nofullscreen noremoteplayback"
                      disablePictureInPicture
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onEnded={() => { if (onVideoClose) onVideoClose(); setPostSequenceActive(true); }}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <source src={import.meta.env.BASE_URL + "videos/Mamuti na ostrvu - projekat iz računarske grafike.mp4?v=2"} type="video/mp4" />
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
                      onEnded={() => { if (onVideoClose) onVideoClose(); setPostSequenceActive(true); }}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <source src={import.meta.env.BASE_URL + "videos/Optimal_block_packing.mkv?v=2"} type="video/x-matroska" />
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
                      onEnded={() => { if (onVideoClose) onVideoClose(); setPostSequenceActive(true); }}
                      onContextMenu={(e) => e.preventDefault()}
                      onLoadedMetadata={(e) => e.target.playbackRate = 2.0}
                    >
                      <source src={import.meta.env.BASE_URL + "videos/Tavern_tower.mkv?v=2"} type="video/x-matroska" />
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
                        onEnded={() => { if (onVideoClose) onVideoClose(); setPostSequenceActive(true); }}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <source src={import.meta.env.BASE_URL + "videos/Score_sheet.mp4?v=2"} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : selectedRepo && selectedRepo.name === 'TicTacToe' ? (
                    <video
                      key="tictactoe-video"
                      autoPlay
                      muted
                      playsInline
                      controlsList="nodownload nofullscreen noremoteplayback"
                      disablePictureInPicture
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onEnded={() => { if (onVideoClose) onVideoClose(); setPostSequenceActive(true); }}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <source src={import.meta.env.BASE_URL + "videos/TicTacToe.mp4"} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    postSequenceActive ? <LoopingSequenceVideo initialPhase="static" /> : <LoopingSequenceVideo />
                  )}
                  <div className={`scanline-mask${showDescription ? ' scanline-mask--hidden' : ''}`} aria-hidden="true"></div>
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

function LoopingSequenceVideo({ initialPhase = 'hello' }) {
  const videoRef = useRef(null);
  // 'hello' or 'static' - allow starting phase to be static when requested
  const [phase, setPhase] = useState(initialPhase);
  // remaining times to play hello in this cycle (3..7)
  const randomHelloCount = () => Math.floor(Math.random() * 5) + 3;
  const [helloRemaining, setHelloRemaining] = useState(() => initialPhase === 'hello' ? randomHelloCount() : 0);

  useEffect(() => {
    // ensure video plays when phase or remaining changes
    const vid = videoRef.current;
    if (!vid) return;
    const p = vid.play();
    if (p && p.catch) p.catch(() => {});
  }, [phase, helloRemaining]);

  const onEnded = () => {
    if (phase === 'hello') {
      if (helloRemaining > 1) {
        setHelloRemaining(r => r - 1);
      } else {
        setPhase('static');
      }
    } else if (phase === 'static') {
      // after static, reset random hello count and go back to hello
      setHelloRemaining(randomHelloCount());
      setPhase('hello');
    }
  };

  return (
    <video
      key={`${phase}-${helloRemaining}`}
      ref={videoRef}
      autoPlay
      muted
      playsInline
      controlsList="nodownload nofullscreen noremoteplayback"
      disablePictureInPicture
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      onContextMenu={(e) => e.preventDefault()}
      onEnded={onEnded}
    >
      {phase === 'hello' ? (
        <source src={import.meta.env.BASE_URL + "videos/hello_loop.mp4"} type="video/mp4" />
      ) : (
        <source src={import.meta.env.BASE_URL + "videos/TV STATIC (4K 60FPS).mp4"} type="video/mp4" />
      )}
      Your browser does not support the video tag.
    </video>
  );
}
