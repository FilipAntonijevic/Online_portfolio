import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import LeftSide from './components/LeftSide';
import RightSide from './components/RightSide';
import BackSide from './components/BackSide';
import CenterMachine from './components/CenterMachine';
import LoadingScreen from './components/LoadingScreen';
import StarBackground from './components/StarBackground';
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
  const [imagesReady, setImagesReady]   = useState(false);
  const appReady = !loading && imagesReady;
  const [error, setError]               = useState(null);
  const [droppedRepo, setDroppedRepo]   = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchRepos();
    const handleSelectRepo = (e) => setSelectedRepo(e.detail);
    window.addEventListener('selectRepo', handleSelectRepo);
    const blockDrag = (e) => {
      if (e.composedPath().some(el => el.tagName === 'IMG')) e.preventDefault();
    };
    window.addEventListener('dragstart', blockDrag);
    return () => {
      window.removeEventListener('selectRepo', handleSelectRepo);
      window.removeEventListener('dragstart', blockDrag);
    };
  }, []);

  async function fetchRepos() {
    try {
      setLoading(true);
      setError(null);
      const r = await fetch(`${import.meta.env.BASE_URL}repos.json`);
      if (!r.ok) throw new Error(r.status);
      const results = await r.json();
      setRepos(results);
    } catch (err) {
      setError(err.message);
    } finally {
      await new Promise(r => setTimeout(r, 500));
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
    if (droppedRepo) {
      window.open(droppedRepo.html_url, '_blank', 'noopener,noreferrer');
      setDroppedRepo(null);
    }
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
  const introRef         = useRef(false);
  const [introPlaying, setIntroPlaying] = useState(false);

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

  // Mouse drag refs
  const mouseDragActive  = useRef(false);
  const mousePrevXRef    = useRef(0);
  const mouseSamplesRef  = useRef([]);   // [{x,t}] recent pointer positions
  const touchSamplesRef  = useRef([]);   // [{x,t}] recent touch positions
  const momentumRafRef   = useRef(null); // ongoing inertia animation

  // Keyboard refs
  const keyIntervalRef = useRef(null);

  // Background parallax angle
  const bgAngleRef = useRef(0);

  // Input mutex — only one input mode active at a time ('mouse' | 'key' | 'scroll' | null)
  const activeInputRef = useRef(null);

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
    bgAngleRef.current = ang;
  }

  // Initial transforms before first paint
  useLayoutEffect(() => { applyAngle(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-apply on resize
  useEffect(() => { applyAngle(visualAngleRef.current); }, [containerW]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preload key textures after fetch — only then hide LoadingScreen
  useEffect(() => {
    if (loading) return;
    const srcs = [
      `${import.meta.env.BASE_URL}images/rest/Vending_machine.png`,
      `${import.meta.env.BASE_URL}images/rest/Vending_machine_bottom.png`,
      `${import.meta.env.BASE_URL}images/rest/Vending_machine_left2.png`,
      `${import.meta.env.BASE_URL}images/rest/Vending_machine_right2.png`,
      `${import.meta.env.BASE_URL}images/rest/Vending_machine_right_bottom.png`,
      `${import.meta.env.BASE_URL}images/rest/Vending_machine_back.png`,
    ];
    let done = 0;
    const onDone = () => { if (++done === srcs.length) setImagesReady(true); };
    srcs.forEach(src => { const img = new Image(); img.onload = img.onerror = onDone; img.src = src; });
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Intro 325° spin — fires once when app is ready
  useEffect(() => {
    if (!appReady) return;
    introRef.current = true;
    setIntroPlaying(true);
    const DURATION = 3000;
    const START    = 0;
    const easeOut  = t => 1 - Math.pow(1 - t, 2);
    const startTime = performance.now();
    let rafId;
    function animate(now) {
      const t = Math.min((now - startTime) / DURATION, 1);
      applyAngle(START + easeOut(t) * 325);
      if (t < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        applyAngle(START + 325);
        introRef.current = false;
        setIntroPlaying(false);
      }
    }
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [appReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Touch — registered after app is ready
  useEffect(() => {
    if (!appReady) return;
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
      const nowT = performance.now();
      touchSamplesRef.current.push({ x: currentX, t: nowT });
      const cutoff = nowT - 200;
      while (touchSamplesRef.current.length > 1 && touchSamplesRef.current[0].t < cutoff)
        touchSamplesRef.current.shift();
      prevXRef.current = currentX;
      applyAngle(visualAngleRef.current + delta * (90 / containerWRef.current));
    }
    el.addEventListener('touchmove', onMove, { passive: false });
    return () => el.removeEventListener('touchmove', onMove);
  }, [appReady]); // eslint-disable-line react-hooks/exhaustive-deps

  function stopMomentum() {
    if (momentumRafRef.current) {
      cancelAnimationFrame(momentumRafRef.current);
      momentumRafRef.current = null;
    }
  }
  function startMomentum(velDegPerMs) {
    stopMomentum();
    const FRICTION = 0.97; // per 16 ms frame
    const MIN_VEL  = 0.003; // deg/ms — stop below this
    let vel  = velDegPerMs;
    let prevT = performance.now();
    function tick(now) {
      const dt = Math.min(now - prevT, 50);
      prevT = now;
      vel *= Math.pow(FRICTION, dt / 16);
      if (Math.abs(vel) < MIN_VEL) { momentumRafRef.current = null; return; }
      applyAngle(visualAngleRef.current + vel * dt);
      momentumRafRef.current = requestAnimationFrame(tick);
    }
    momentumRafRef.current = requestAnimationFrame(tick);
  }
  function computeVelocity(samples, w) {
    if (samples.length < 2) return 0;
    const newest = samples[samples.length - 1];
    // Velocity from last 50ms
    const recentFloor = newest.t - 50;
    const recent = samples.filter(s => s.t >= recentFloor);
    if (recent.length < 2) return 0;
    const dtR = recent[recent.length - 1].t - recent[0].t;
    if (dtR < 5) return 0;
    const velR = ((recent[0].x - recent[recent.length - 1].x) / dtR) * (90 / w);
    // Velocity from the 50-150ms window before release
    const olderFloor = newest.t - 150;
    const older = samples.filter(s => s.t >= olderFloor && s.t < recentFloor);
    if (older.length >= 2) {
      const dtO = older[older.length - 1].t - older[0].t;
      if (dtO > 5) {
        const velO = ((older[0].x - older[older.length - 1].x) / dtO) * (90 / w);
        // User was decelerating — suppress momentum
        if (Math.abs(velR) < Math.abs(velO) * 0.6) return 0;
      }
    }
    return velR;
  }

  function handleTouchStart(e) {
    if (introRef.current) return;
    stopMomentum();
    touchSamplesRef.current = [];
    touchActive.current = true;
    startXRef.current   = e.touches[0].clientX;
    startYRef.current   = e.touches[0].clientY;
    prevXRef.current    = e.touches[0].clientX;
    dirRef.current      = null;
  }
  function handleTouchEnd() {
    if (!touchActive.current) return;
    touchActive.current = false;
    dirRef.current      = null;
    const vel = computeVelocity(touchSamplesRef.current, containerWRef.current);
    if (Math.abs(vel) > 0.003) startMomentum(vel);
  }

  // Arrow key rotation — smooth continuous rotation while key held
  useEffect(() => {
    function onKeyDown(e) {
      if (introRef.current) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (keyIntervalRef.current) return;
      if (activeInputRef.current && activeInputRef.current !== 'key') return;
      stopMomentum();
      activeInputRef.current = 'key';
      const dir  = e.key === 'ArrowRight' ? 1 : -1;
      const step = () => applyAngle(visualAngleRef.current + dir * 2);
      step();
      keyIntervalRef.current = setInterval(step, 16);
    }
    function onKeyUp(e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        clearInterval(keyIntervalRef.current);
        keyIntervalRef.current = null;
        if (activeInputRef.current === 'key') activeInputRef.current = null;
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

  // Mouse drag rotation
  useEffect(() => {
    if (!appReady) return;
    const el = areaRef.current;
    if (!el) return;
    function onMouseDown(e) {
      if (introRef.current) return;
      if (activeInputRef.current && activeInputRef.current !== 'mouse') return;
      stopMomentum();
      activeInputRef.current  = 'mouse';
      mouseDragActive.current = true;
      mousePrevXRef.current   = e.clientX;
      mouseSamplesRef.current = [{ x: e.clientX, t: performance.now() }];
      document.body.style.cursor = 'grabbing';
    }
    function onMouseMove(e) {
      if (!mouseDragActive.current) return;
      // If button was released outside window, e.buttons will be 0
      if (e.buttons === 0) { onMouseUp(); return; }
      const nowT = performance.now();
      const delta = mousePrevXRef.current - e.clientX;
      mousePrevXRef.current = e.clientX;
      mouseSamplesRef.current.push({ x: e.clientX, t: nowT });
      const cutoff = nowT - 200;
      while (mouseSamplesRef.current.length > 1 && mouseSamplesRef.current[0].t < cutoff)
        mouseSamplesRef.current.shift();
      applyAngle(visualAngleRef.current + delta * (90 / containerWRef.current));
    }
    function onMouseUp() {
      if (!mouseDragActive.current) return;
      mouseDragActive.current = false;
      document.body.style.cursor = '';
      if (activeInputRef.current === 'mouse') activeInputRef.current = null;
      const vel = computeVelocity(mouseSamplesRef.current, containerWRef.current);
      if (Math.abs(vel) > 0.003) startMomentum(vel);
    }
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, [appReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll wheel rotation
  useEffect(() => {
    if (!appReady) return;
    const el = areaRef.current;
    if (!el) return;
    function onWheel(e) {
      if (introRef.current) return;
      if (activeInputRef.current && activeInputRef.current !== 'scroll') return;
      stopMomentum();
      e.preventDefault();
      activeInputRef.current = 'scroll';
      applyAngle(visualAngleRef.current + e.deltaY * 0.07);
      clearTimeout(onWheel._t);
      onWheel._t = setTimeout(() => {
        if (activeInputRef.current === 'scroll') activeInputRef.current = null;
      }, 150);
    }
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [appReady]); // eslint-disable-line react-hooks/exhaustive-deps

  function renderPanel(i) {
    switch (i) {
      case 0:
        return (
          <>
            <img src={import.meta.env.BASE_URL + "images/rest/Vending_machine.png"} alt="" className="mobile-machine-bg" style={{ zIndex: 9997 }} />
            <div className="desktop-front-scaler" data-scaler="true" style={{
              transformOrigin: 'top left',
              transform:       `scale(${machineScale})`,
              width:           MACHINE_NATURAL_W,
              height:          MACHINE_NATURAL_H,
              '--design-vh':   `${MACHINE_NATURAL_H / 100}px`,
              '--design-vw':   `${MACHINE_DESIGN_VW}px`,
              position:        'relative',
              zIndex:          10000,
            }}>
              <img src={import.meta.env.BASE_URL + "images/rest/Vending_machine_bottom.png"} alt="" className="mobile-machine-bg" style={{ zIndex: 800, pointerEvents: 'none' }} />
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
    <div
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#06061a', userSelect: 'none' }}
      onDragStart={e => e.preventDefault()}
    >
      {!appReady && <LoadingScreen />}
      <StarBackground angleRef={bgAngleRef} />
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
        >          {/* Input blocker during intro animation */}
          {introPlaying && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 99998, pointerEvents: 'all' }} />
          )}          <div
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
                  className={['', 'side-panel-right', 'side-panel-back', 'side-panel-left'][i] || undefined}
                >
                  {renderPanel(i)}
                </div>
              </div>
            ))}
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
        ? `url(${import.meta.env.BASE_URL}images/rest/upper_wall.png)`
        : `url(${import.meta.env.BASE_URL}images/rest/Wall.png)`;

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
