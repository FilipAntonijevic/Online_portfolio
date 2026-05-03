import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import LeftSide from './components/LeftSide';
import RightSide from './components/RightSide';
import BackSide from './components/BackSide';
import CenterMachine from './components/CenterMachine';
import './styles.css';

const GITHUB_USERNAME   = 'FilipAntonijevic';
const MAX_PROJECTS      = 16;
const INCLUDED_PROJECTS = ['Tavern_Tower', 'Mastermind_best_starting_move_proof', 'TicTacToe',
  'Optimal_block_packing', 'score_sheet', 'hand_draw_simulator', 'Grafika-projekat'];
const Daytime = 0;

const MACHINE_NATURAL_W = 900;
const MACHINE_NATURAL_H = 1080;
const MACHINE_DESIGN_VW = 15; // px — gives 103px tiles via clamp

function App() {
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
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const results = await Promise.all(
        INCLUDED_PROJECTS.slice(0, MAX_PROJECTS).map(async (name) => {
          try {
            const r = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${name}`, { headers });
            if (!r.ok) throw new Error(r.status);
            return await r.json();
          } catch {
            return {
              id: `${GITHUB_USERNAME}/${name}`, name,
              full_name: `${GITHUB_USERNAME}/${name}`,
              html_url: `https://github.com/${GITHUB_USERNAME}/${name}`,
              description: '', updated_at: new Date().toISOString(),
              owner: { login: GITHUB_USERNAME },
              stargazers_count: 0, forks_count: 0,
            };
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

  const handleProjectDrop   = (repo) => setDroppedRepo({ ...repo, _droppedAt: Date.now() });
  const handleProjectSelect = (repo) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSelectedRepo(repo);
    setShowDescription(true);
    const len = Math.min((repo?.description || '').length, 200);
    timeoutRef.current = setTimeout(() => setShowDescription(false),
      Math.round(2000 + 6000 * (len / 200)));
  };
  const handleChuteClick  = () => {
    if (droppedRepo) window.open(droppedRepo.html_url, '_blank', 'noopener,noreferrer');
  };
  const handleVideoClose  = () => { setSelectedRepo(null); setShowDescription(false); };

  // ── Layout — reactive to window resize ───────────────────────────────────
  const V_PAD =  100; // 15rem in px (vertical breathing room, top+bottom)
  const [containerW, setContainerW] = useState(() =>
    Math.min(window.innerWidth, (window.innerHeight - V_PAD) * MACHINE_NATURAL_W / MACHINE_NATURAL_H)
  );
  const containerWRef = useRef(containerW);

  useEffect(() => {
    function onResize() {
      const w = Math.min(window.innerWidth, (window.innerHeight - V_PAD) * MACHINE_NATURAL_W / MACHINE_NATURAL_H);
      containerWRef.current = w;
      setContainerW(w);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const containerH   = containerW * MACHINE_NATURAL_H / MACHINE_NATURAL_W;
  const machineScale = containerW / MACHINE_NATURAL_W;
  const offsetLeft   = (window.innerWidth  - containerW) / 2;
  const offsetTop    = (window.innerHeight - containerH) / 2;

  // ── 4-panel carousel — ZERO React state for rotation ─────────────────────
  // Panels: 0=Front, 1=Right, 2=Back, 3=Left
  const visualAngleRef = useRef(270);
  const panelOuterRefs = useRef([null, null, null, null]);
  const panelInnerRefs = useRef([null, null, null, null]);
  const carouselRef    = useRef(null);
  const dotRef         = useRef(null);
  const labelRefs      = useRef([null, null, null, null]);
  const areaRef        = useRef(null);

  // Touch refs
  const touchActive = useRef(false);
  const startXRef   = useRef(0);
  const startYRef   = useRef(0);
  const prevXRef    = useRef(0);
  const dirRef      = useRef(null);

  // Keyboard refs
  const keyIntervalRef = useRef(null);

  function applyAngle(ang) {
    const W    = containerWRef.current;
    const norm = ((ang % 360) + 360) % 360;
    const seg  = Math.floor(norm / 90);

    // Rotate the whole 3D box
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateZ(${-W / 2}px) rotateY(${-ang}deg)`;
    }

    // Position each panel as a face of the box (translateZ depends on W, so update on resize)
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

  // Initial transforms before first paint
  useLayoutEffect(() => { applyAngle(270); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-apply on resize
  useEffect(() => { applyAngle(visualAngleRef.current); }, [containerW]); // eslint-disable-line react-hooks/exhaustive-deps

  // Touch — registered once, reads all values via refs
  useEffect(() => {
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
      const delta = prevXRef.current - currentX;
      prevXRef.current = currentX;
      applyAngle(visualAngleRef.current + delta * (90 / containerWRef.current));
    }
    el.addEventListener('touchmove', onMove, { passive: false });
    return () => el.removeEventListener('touchmove', onMove);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleTouchStart(e) {
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

  // Arrow key rotation — smooth continuous rotation while key held
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (keyIntervalRef.current) return; // already running
      const dir  = e.key === 'ArrowRight' ? 1 : -1;
      const step = () => applyAngle(visualAngleRef.current + dir * 2);
      step();
      keyIntervalRef.current = setInterval(step, 16);
    }
    function onKeyUp(e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        clearInterval(keyIntervalRef.current);
        keyIntervalRef.current = null;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUp);
      clearInterval(keyIntervalRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function snapToFront() {
    applyAngle(Math.round(visualAngleRef.current / 360) * 360);
  }

  function renderPanel(i) {
    switch (i) {
      case 0:
        return (
          <>
            <img src="/images/rest/Vending_machine3.png" alt="" className="mobile-machine-bg" />
            <img src="/images/rest/Vending_machine_bottom3.png" alt="" className="mobile-machine-bg" style={{ zIndex: 1 }} />
            <div className="desktop-front-scaler" data-scaler="true" style={{
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

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#2a2a2a' }}>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Machine carousel */}
        <div
          ref={areaRef}
          style={{ position: 'relative', width: containerW, height: containerH, perspective: `${containerW * 2}px` }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={carouselRef}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transformStyle: 'preserve-3d' }}
          >
            {[0, 1, 2, 3].map(i => (
              <div key={i}
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

          {/* 360° compass indicator — overlay bottom-center of the machine */}
          <div className="desktop-rotation-indicator" style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)' }}>
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

          {/* Arrow key hint */}
          <div style={{
            position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.35)',
            fontSize: 11, fontFamily: 'monospace', letterSpacing: 3,
            pointerEvents: 'none', userSelect: 'none',
          }}>
            ← →
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

// ── Wall background — tiled grid, every other column mirrored ────────────────
function WallBackground({ tileW, tileH, offsetLeft, offsetTop }) {
  if (tileW <= 0 || tileH <= 0) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const startCol = Math.floor(-offsetLeft / tileW) - 1;
  const endCol   = Math.ceil((vw - offsetLeft) / tileW);
  const startRow = Math.floor(-offsetTop  / tileH) - 1;
  const endRow   = Math.ceil((vh - offsetTop)  / tileH);

  const tiles = [];
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const x = offsetLeft + col * tileW;
      const y = offsetTop  + row * tileH;
      if (x + tileW < 0 || x > vw || y + tileH < 0 || y > vh) continue;

      const flipX = ((col % 2) + 2) % 2 === 1;
      const img   = row < 0
        ? "url('/images/rest/upper_wall.png')"
        : "url('/images/rest/Wall.png')";

      tiles.push(
        <div key={`${row}-${col}`} style={{
          position: 'absolute',
          left: x, top: y,
          width: tileW, height: tileH,
          backgroundImage: img,
          backgroundSize: '100% 100%',
          transform: flipX ? 'scaleX(-1)' : undefined,
        }} />
      );
    }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {tiles}
    </div>
  );
}
