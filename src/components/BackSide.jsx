import React from 'react';

// Back side of the vending machine.
function BackSide() {
  return (
    <div>
        <img
        src="/images/rest/Vending_machine_back.png"
        alt=""
        className="mobile-machine-bg"
        />

        <a
                href="mailto:filipdantonijevic@gmail.com"
                style={{
                position: 'absolute',
                right: '38%',
                top: '50%',
                width: '22%',
                zIndex: 20,
                display: 'block',
                transform: 'rotate(-20deg)',
                }}
            >
                <img
                src="/images/rest/Mail.png"
                alt=""
                style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
                />
            </a>
    </div>
  );
}

export default BackSide;
