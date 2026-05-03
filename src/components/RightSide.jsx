import React from 'react';

// Right side view of the vending machine — mirror image of the left side.
// The entire content is flipped horizontally so the machine looks correct
// when viewed from the opposite side.
function RightSide({ onSwipeToFront }) {
  return (
    <>
        <img
            src="/images/rest/Vending_machine_right.png"
            alt=""
            className="mobile-machine-bg"
        />
     
        <div style={{ position: 'absolute', inset: 0 }}>
            <div
            className="mobile-side-view"
            style={{ position: 'relative', width: '100%', height: '100%' }}
            >
            <a
            href="https://github.com/FilipAntonijevic"
            target="_blank"
            rel="noopener noreferrer"
            style={{
            position: 'absolute',
            left: '13%',
            top: '9%',
            width: '60%',
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
            href="https://www.linkedin.com/in/filip-antonijevic-bbb3923a6/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
            position: 'absolute',
            right: '18%',
            top: '79%',
            width: '20%',
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
            left: '0%',
            top: '66%',
            width: '40%',
            height: 'auto',
            zIndex: 20,
            pointerEvents: 'none',
            userSelect: 'none',
            }}
        />
        </div>
      </div>
    </>
  );
}

export default RightSide;
