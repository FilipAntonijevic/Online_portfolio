import React from 'react';

// Left side view of the vending machine for mobile.
function LeftSide({ onSwipeToFront }) {
  return (
    <>
      <img
        src={import.meta.env.BASE_URL + "images_webp/rest/Vending_machine_left2.webp"}
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
        src={import.meta.env.BASE_URL + "images_webp/rest/Poster.webp"}
        alt=""
        style={{
          position: 'absolute',
          left: '35%',
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
