import React, { useState, useRef, useEffect } from 'react';
import LeftSide from './LeftSide';
import CenterMachine from './CenterMachine';
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
  const containerW   = Math.min(window.innerWidth, window.innerHeight * MACHINE_NATURAL_W / MACHINE_NATURAL_H);
  const machineScale = containerW / MACHINE_NATURAL_W;

  // ── Swipe / sliding-track state ───────────────────────────────────────────
  // Two panels sit side-by-side in a track of width 2×containerW.
  // offset=0          → LeftSide (side panel) fills the viewport
  // offset=-containerW → CenterMachine (front panel) fills the viewport
  // While dragging, offset follows the finger in real time.
  // On release: if M-edge (right edge of side panel) crossed the midpoint
  //   → snap to front; otherwise snap back to side.

  const [face,        setFace]        = useState('side');
  const [offset,      setOffset]      = useState(0);
  const [isSnapping,  setIsSnapping]  = useState(false);

  const areaRef        = useRef(null);
  const startXRef      = useRef(null);
  const startYRef      = useRef(null);
  const isHoriz        = useRef(false);
  const faceRef        = useRef('side');   // shadow so touchmove closure stays current
  const offsetRef      = useRef(0);        // same for offset
  const isSnappingRef  = useRef(false);    // block input during snap

  useEffect(() => { faceRef.current     = face;      }, [face]);
  useEffect(() => { isSnappingRef.current = isSnapping; }, [isSnapping]);
  useEffect(() => { offsetRef.current = offset; }, [offset]);

  // Attach non-passive touchmove so we can preventDefault (blocks page scroll)
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    function onMove(e) {
      if (isSnappingRef.current) return;
      if (startXRef.current === null) return;
      const dx = e.touches[0].clientX - startXRef.current;
      const dy = e.touches[0].clientY - startYRef.current;
      // First decisive move: decide axis
      if (!isHoriz.current) {
        if (Math.abs(dy) > Math.abs(dx)) { startXRef.current = null; return; }
        isHoriz.current = true;
      }
      e.preventDefault();
      const base = faceRef.current === 'side' ? 0 : -containerW;
      // Clamp: side panel can only go left; front panel can only go right
      const clamped = faceRef.current === 'side'
        ? Math.max(-containerW, Math.min(0, dx))
        : Math.max(0, Math.min(containerW, dx));
      setOffset(base + clamped);
    }
    el.addEventListener('touchmove', onMove, { passive: false });
    return () => el.removeEventListener('touchmove', onMove);
  }, [containerW]);

  function handleTouchStart(e) {
    if (isSnappingRef.current) return;
    startXRef.current  = e.touches[0].clientX;
    startYRef.current  = e.touches[0].clientY;
    isHoriz.current    = false;
  }

  function handleTouchEnd(e) {
    if (startXRef.current === null) return;
    startXRef.current = null;
    if (!isHoriz.current) return;          // was a vertical swipe, nothing to do

    const w         = containerW;
    const base      = faceRef.current === 'side' ? 0 : -w;
    const moved     = offsetRef.current - base;   // how far from rest position
    let targetOffset;
    let newFace = faceRef.current;

    if (faceRef.current === 'side'  && moved < -w / 2) { targetOffset = -w; newFace = 'front'; }
    else if (faceRef.current === 'front' && moved >  w / 2) { targetOffset =  0; newFace = 'side';  }
    else { targetOffset = base; }   // not far enough → snap back

    // Phase 1: enable transition (offset stays at current drag position)
    setIsSnapping(true);
    // Phase 2: one frame later, update offset → CSS transition fires from current → target
    requestAnimationFrame(() => {
      setOffset(targetOffset);
      setTimeout(() => {
        setFace(newFace);
        setIsSnapping(false);
      }, 600);
    });
  }

  function snapToFront() {
    if (faceRef.current === 'front') return;
    setIsSnapping(true);
    requestAnimationFrame(() => {
      setOffset(-containerW);
      setTimeout(() => {
        setFace('front');
        setIsSnapping(false);
      }, 320);
    });
  }

  // 3-D rotation illusion: always applied based on progress so it animates during snap.
  // At rest: visible panel always has progress=0 → rotateY(0°) = flat.
  // Off-screen panel has progress=1 but is not visible so doesn't matter.
  const MAX_ROTATE    = 80;
  const PERSP         = containerW * 2;
  // sideProgress: 0 = side fully facing viewer, 1 = side rotated away (front visible)
  const sideProgress  = Math.min(1, Math.max(0, -offset / containerW));
  // frontProgress: 0 = front fully facing viewer, 1 = front rotated away (side visible)
  const frontProgress = Math.min(1, Math.max(0, (offset + containerW) / containerW));
  const panelTransition = isSnapping ? 'transform 320ms ease' : 'none';

  // rotateY(+θ) with origin=right  → left edge goes away from viewer → appears shorter ✓
  const sidePanelStyle = {
    width:           containerW,
    height:          '100%',
    flexShrink:      0,
    overflow:        'hidden',
    position:        'relative',
    transformOrigin: 'right center',
    transform:       `perspective(${PERSP}px) rotateY(-${sideProgress * MAX_ROTATE}deg)`,
    transition:      panelTransition,
  };

  // rotateY(-θ) with origin=left  → right edge goes away from viewer → appears shorter ✓
  const frontPanelStyle = {
    width:           containerW,
    height:          '100%',
    flexShrink:      0,
    overflow:        'hidden',
    position:        'relative',
    transformOrigin: 'left center',
    transform:       `perspective(${PERSP}px) rotateY(${frontProgress * MAX_ROTATE}deg)`,
    transition:      panelTransition,
  };

  return (
    <div className="mobile-app">
      <div
        ref={areaRef}
        className="mobile-machine-area"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── Sliding track ────────────────────────────────────────────── */}
        <div style={{
          display:    'flex',
          width:      containerW * 2,
          height:     '100%',
          transform:  `translateX(${offset}px)`,
          transition: isSnapping ? 'transform 320ms ease' : 'none',
          willChange: 'transform',
        }}>

          {/* Side panel */}
          <div style={sidePanelStyle}>
            <img
              src="/images/rest/Vending_machine_side3.png"
              alt=""
              className="mobile-machine-bg"
            />
            <img
              src="/images/rest/Vending_machine_side_bottom3.png"
              alt=""
              className="mobile-machine-bg"
              style={{ zIndex: 100 }}
            />
            <LeftSide onSwipeToFront={snapToFront} />
          </div>

          {/* Front panel */}
          <div style={frontPanelStyle}>
            <div className="mobile-front-scaler" data-scaler="true" style={{
              transformOrigin: 'top left',
              transform:  `scale(${machineScale})`,
              width:      MACHINE_NATURAL_W,
              height:     MACHINE_NATURAL_H,
              '--design-vh': `${MACHINE_NATURAL_H / 100}px`,
              '--design-vw': `${MACHINE_DESIGN_VW}px`,
            }}>
              <CenterMachine
                repos={repos}
                loading={loading}
                error={error}
                droppedRepo={droppedRepo}
                selectedRepo={selectedRepo}
                showDescription={showDescription}
                onProjectDrop={handleProjectDrop}
                onProjectSelect={handleProjectSelect}
                onChuteClick={handleChuteClick}
                onVideoClose={handleVideoClose}
                daytime={Daytime}
                designHeight={MACHINE_NATURAL_H}
              />
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default MobileApp;
