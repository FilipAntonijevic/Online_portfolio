import React from 'react';

// Left side view of the vending machine for mobile.
function LeftSide({ onSwipeToFront }) {
  return (
    <>
      <img
        src="/images/rest/Vending_machine_left.png"
        alt=""
        className="mobile-machine-bg"
      />
      <div
        className="mobile-side-view"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
      <img
        src="/images/rest/Poster.png"
        alt=""
        style={{
          position: 'absolute',
          left: '31%',
          top: '9%',
          width: '55%',
          height: 'auto',
          display: 'block',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      
      </div>
    </>
  );
}

export default LeftSide;
