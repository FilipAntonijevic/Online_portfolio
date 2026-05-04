import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import BackSide from './BackSide';
import CenterMachine from './CenterMachine';
import LoadingScreen from './LoadingScreen';
import '../styles.css';
import '../mobile.css';

const GITHUB_USERNAME   = 'FilipAntonijevic';
const MAX_PROJECTS      = 16;
const INCLUDED_PROJECTS = ['Tavern_Tower', 'Mastermind_best_starting_move_proof', 'TicTacToe',
  'Optimal_block_packing', 'score_sheet', 'hand_draw_simulator', 'Grafika-projekat'];
const Daytime = 0;

// CenterMachine's "natural" render size — matches the real desktop dimensions.
// Desktop: machine max-width=900px, --design-vh=screenH/100≈1080/100=10.8px → height=1080px
// --design-vw set to 15px so tile clamp(60, 15*8=120, 103) = 103px (same as desktop)
const MACHINE_NATURAL_W = 900;
const MACHINE_NATURAL_H = 1080;
const MACHINE_DESIGN_VW  = 15; // px — gives 103px tiles via clamp

function MobileApp() {
  // ── Data state ────────────────────────────────────────────────────────────
  const [repos, setRepos]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [droppedRepo, setDroppedRepo]   = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchRepos();
    const handleSelectRepo = (e) => setSelectedRepo(e.detail);
    window.addEventListener('selectRepo', handleSelectRepo);
    return () => window.removeEventListener('selectRepo', handleSelectRepo);
  }, []);

  async function fetchRepos() {
    try {
      setLoading(true);
      setError(null);
      const results = await Promise.all(
        INCLUDED_PROJECTS.slice(0, MAX_PROJECTS).map(async (name) => {
          try {
            const token = import.meta.env.VITE_GITHUB_TOKEN;
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const r = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${name}`, { headers });
            if (!r.ok) throw new Error(r.status);
            return await r.json();
          } catch {
            return { id: `${GITHUB_USERNAME}/${name}`, name, full_name: `${GITHUB_USERNAME}/${name}`,
              html_url: `https://github.com/${GITHUB_USERNAME}/${name}`, description: '',
              updated_at: new Date().toISOString(), owner: { login: GITHUB_USERNAME },
              stargazers_count: 0, forks_count: 0 };
          }
        })
      );
      setRepos(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleProjectDrop = (repo) => setDroppedRepo({ ...repo, _droppedAt: Date.now() });

  const handleProjectSelect = (repo) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSelectedRepo(repo);
    setShowDescription(true);
    const len = Math.min((repo?.description || '').length, 200);
    const duration = Math.round(2000 + 6000 * (len / 200));
    timeoutRef.current = setTimeout(() => setShowDescription(false), duration);
  };

  const handleChuteClick = () => {
    if (droppedRepo) window.open(droppedRepo.html_url, '_blank', 'noopener,noreferrer');
  };

  const handleVideoClose = () => { setSelectedRepo(null); setShowDescription(false); };

  // ── Machine scale ─────────────────────────────────────────────────────────
  const [containerW, setContainerW] = useState(() =>
    Math.min(window.innerWidth, window.innerHeight * MACHINE_NATURAL_W / MACHINE_NATURAL_H)
  );
  const containerH   = containerW * MACHINE_NATURAL_H / MACHINE_NATURAL_W;
  const machineScale = containerW / MACHINE_NATURAL_W;

  const containerWRef = useRef(containerW);
  containerWRef.current = containerW;

  useEffect(() => {
    function onResize() {
      const w = Math.min(window.innerWidth, window.innerHeight * MACHINE_NATURAL_W / MACHINE_NATURAL_H);
      containerWRef.current = w;
      setContainerW(w);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── 4-panel carousel — ZERO React state for rotation ─────────────────────
  // All 4 panels are always in the DOM. applyAngle() shows the correct 2 and
  // hides the other 2 via imperative DOM writes. No setState ever fires during
  // a swipe gesture, so React never re-renders mid-swipe.
  //
  // Each panel has two DOM levels:
  //   outer (panelOuterRefs[i]): handles X-translation (translateX) via transform
  //   inner (panelInnerRefs[i]): handles perspective + rotateY
  //
  // Panels: 0=Front, 1=Right, 2=Back, 3=Left

  const introRef         = useRef(false);
  const [introPlaying, setIntroPlaying] = useState(false);

  const visualAngleRef  = useRef(270);

  const panelOuterRefs  = useRef([null, null, null, null]);
  const panelInnerRefs  = useRef([null, null, null, null]);
  const carouselRef     = useRef(null);
  const dotRef          = useRef(null);
  const labelRefs       = useRef([null, null, null, null]);
  const areaRef         = useRef(null);

  // Touch state — all refs, never React state
  const touchActive = useRef(false);
  const startXRef   = useRef(0);
  const startYRef   = useRef(0);
  const prevXRef    = useRef(0);
  const dirRef      = useRef(null); // null | 'h' | 'v'

  function applyAngle(ang) {
    const W    = containerWRef.current;
    const norm = ((ang % 360) + 360) % 360;
    const seg  = Math.floor(norm / 90);

    // Rotate the whole 3D box
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateZ(${-W / 2}px) rotateY(${-ang}deg)`;
    }

    // Position each panel as a face of the box
    for (let i = 0; i < 4; i++) {
      const outer = panelOuterRefs.current[i];
      const inner = panelInnerRefs.current[i];
      if (!outer) continue;
      outer.style.transform       = `rotateY(${i * 90}deg) translateZ(${W / 2}px)`;
      outer.style.transformOrigin = '';
      if (inner) {
        inner.style.transform       = '';
        inner.style.transformOrigin = '';
      }
    }

    // Compass dot + labels — imperative, no React
    if (dotRef.current) {
      const rad = (norm - 90) * Math.PI / 180;
      dotRef.current.setAttribute('cx', Math.cos(rad) * 22);
      dotRef.current.setAttribute('cy', Math.sin(rad) * 22);
    }
    labelRefs.current.forEach((el, i) => {
      if (!el) return;
      el.setAttribute('fill',        seg === i ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.28)');
      el.setAttribute('font-weight', seg === i ? 'bold' : 'normal');
    });

    visualAngleRef.current = ang;
  }

  // Apply initial transforms before first paint (no flash of all-4-panels)
  useLayoutEffect(() => { applyAngle(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-apply on orientation/resize (containerW changed)
  useEffect(() => { applyAngle(visualAngleRef.current); }, [containerW]); // eslint-disable-line react-hooks/exhaustive-deps

  // Intro 360° spin — fires once when loading finishes
  useEffect(() => {
    if (loading) return;
    introRef.current = true;
    setIntroPlaying(true);
    const DURATION = 2200;
    const START    = 0;
    const easeOut  = t => 1 - Math.pow(1 - t, 3);
    const startTime = performance.now();
    let rafId;
    function animate(now) {
      const t = Math.min((now - startTime) / DURATION, 1);
      applyAngle(START + easeOut(t) * 360);
      if (t < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        applyAngle(START + 360);
        introRef.current = false;
        setIntroPlaying(false);
      }
    }
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // touchmove — registered after loading finishes (areaRef is in DOM only then)
  useEffect(() => {
    if (loading) return;
    const el = areaRef.current;
    if (!el) return;
    function onMove(e) {
      if (!touchActive.current) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      if (dirRef.current === null) {
        const dx = Math.abs(currentX - startXRef.current);
        const dy = Math.abs(currentY - startYRef.current);
        if (dx < 4 && dy < 4) return;
        dirRef.current   = dx >= dy ? 'h' : 'v';
        prevXRef.current = currentX;
        if (dirRef.current === 'h') e.preventDefault();
        return;
      }
      if (dirRef.current === 'v') return;
      e.preventDefault();
      const delta = prevXRef.current - currentX; // left = clockwise
      prevXRef.current = currentX;
      applyAngle(visualAngleRef.current + delta * (90 / containerWRef.current));
    }
    el.addEventListener('touchmove', onMove, { passive: false });
    return () => el.removeEventListener('touchmove', onMove);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleTouchStart(e) {
    if (introRef.current) return;
    touchActive.current = true;
    startXRef.current   = e.touches[0].clientX;
    startYRef.current   = e.touches[0].clientY;
    prevXRef.current    = e.touches[0].clientX;
    dirRef.current      = null;
  }

  function handleTouchEnd() {
    touchActive.current = false;
    dirRef.current      = null;
  }

  function snapToFront() {
    applyAngle(Math.round(visualAngleRef.current / 360) * 360);
  }

  // Panel content — these never cause rotation re-renders
  function renderPanel(i) {
    switch (i) {
      case 0:
        return (
          <>
            <img src="/images/rest/Vending_machine.png" alt="" className="mobile-machine-bg" />
            <img src="/images/rest/Vending_machine_bottom.png" alt="" className="mobile-machine-bg" style={{ zIndex: 9999 }} />
            <div className="mobile-front-scaler" data-scaler="true" style={{
              transformOrigin: 'top left',
              transform:       `scale(${machineScale})`,
              width:           MACHINE_NATURAL_W,
              height:          MACHINE_NATURAL_H,
              '--design-vh':   `${MACHINE_NATURAL_H / 100}px`,
              '--design-vw':   `${MACHINE_DESIGN_VW}px`,
              position:        'relative',
              zIndex:          2,
            }}>
              <CenterMachine
                repos={repos} loading={loading} error={error}
                droppedRepo={droppedRepo} selectedRepo={selectedRepo}
                showDescription={showDescription}
                onProjectDrop={handleProjectDrop} onProjectSelect={handleProjectSelect}
                onChuteClick={handleChuteClick} onVideoClose={handleVideoClose}
                daytime={Daytime} designHeight={MACHINE_NATURAL_H}
              />
            </div>
          </>
        );
      case 1: return <RightSide onSwipeToFront={snapToFront} />;
      case 2: return <BackSide />;
      case 3:
      default: return <LeftSide onSwipeToFront={snapToFront} />;
    }
  }

  if (loading) return <LoadingScreen />;

  return (
    <div className="mobile-app">
      <div
        ref={areaRef}
        className="mobile-machine-area"
        style={{ perspective: `${containerW * 2}px`, width: containerW, height: containerH }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Input blocker during intro animation */}
        {introPlaying && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 99998, pointerEvents: 'all' }} />
        )}
        <div
          ref={carouselRef}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transformStyle: 'preserve-3d' }}
        >
          {/* All 4 panels always in DOM. */}
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              ref={el => { panelOuterRefs.current[i] = el; }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', willChange: 'transform', backfaceVisibility: 'hidden' }}
            >
              <div
                ref={el => { panelInnerRefs.current[i] = el; }}
                style={{ width: '100%', height: '100%', position: 'relative' }}
              >
                {renderPanel(i)}
              </div>
            </div>
          ))}
        </div>

        {/* Compass indicator — absolute overlay, doesn't affect flex centering */}
        <div className="mobile-rotation-indicator" style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
          <svg width="56" height="56" viewBox="-28 -28 56 56">
            <circle r="22" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            {[
              { deg: 0,   label: 'F', i: 0 },
              { deg: 90,  label: 'R', i: 1 },
              { deg: 180, label: 'B', i: 2 },
              { deg: 270, label: 'L', i: 3 },
            ].map(({ deg, label, i }) => {
              const rad = (deg - 90) * Math.PI / 180;
              return (
                <text key={deg}
                  ref={el => { labelRefs.current[i] = el; }}
                  x={Math.cos(rad) * 14} y={Math.sin(rad) * 14}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="rgba(255,255,255,0.28)"
                  fontSize="7" fontFamily="monospace" fontWeight="normal"
                >{label}</text>
              );
            })}
            <circle ref={dotRef} cx="0" cy="-22" r="3.5" fill="rgba(255,255,255,0.85)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default MobileApp;
