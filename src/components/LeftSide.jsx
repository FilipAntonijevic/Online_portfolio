import React from 'react';

// Side view of the vending machine for mobile.
// Rendered over Vending_machine_side2.png background.
function LeftSide({ onSwipeToFront }) {
  return (
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
          left: '28%',
          top: '10%',
          width: '50%',
          height: 'auto',
          display: 'block',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      <a
        href="https://github.com/FilipAntonijevic"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'absolute',
          right: '2%',
          top: '20%',
          width: '20%',
          zIndex: 20,
          display: 'block',
          transform: 'rotate(4deg)',
        }}
      >
        <img
          src="/images/rest/Github_graffiti.png"
          alt=""
          style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
        />
      </a>

      <a
        href="mailto:filipdantonijevic@gmail.com"
        style={{
          position: 'absolute',
          left: '7.8%',
          top: '74.9%',
          width: '13%',
          zIndex: 20,
          display: 'block',
          transform: 'rotate(-43deg)',
        }}
      >
        <img
          src="/images/rest/Mail.png"
          alt=""
          style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
        />
      </a>

      <a
        href="https://www.linkedin.com/in/filip-antonijevic-bbb3923a6/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'absolute',
          right: '18%',
          top: '75%',
          width: '14%',
          zIndex: 200,
          display: 'block',
        }}
      >
        <img
          src="/images/rest/Linkedin_graffiti.png"
          alt=""
          style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
        />
      </a>

      <img
        src="/images/rest/CV_graffiti.png"
        alt=""
        style={{
          position: 'absolute',
          left: '3%',
          top: '44%',
          width: '25%',
          height: 'auto',
          zIndex: 20,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      
        <img
          src="/images/rest/Arrow_graffiti.png"
          alt="Go to machine"
          onClick={onSwipeToFront}
          style={{
            position: 'absolute',
            right: '1%',
            top: '90%',
            width: '10%',
            zIndex: 200,
            display: 'block',
            cursor: 'pointer',
          }}
        />
    </div>
  );
}

export default LeftSide;
