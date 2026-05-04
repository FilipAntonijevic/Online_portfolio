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

            {/* Top-left large fan */}
             <img
              src="/images/rest/Vent.png"
              alt=""
              className="vent-spin"
              style={{
                position: 'absolute',
                left: '12.5%',
                top: '6.4%',
                width: '35%',
                height: 'auto',
                display: 'block',
                pointerEvents: 'none',
                userSelect: 'none',
                animationDuration: '4s',
              }}
            />


            <img
              src="/images/rest/Vent_grill.png"
              alt=""
              style={{
                position: 'absolute',
                left: '13.5%',
                top: '7.4%',
                width: '33%',
                height: 'auto',
                display: 'block',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />

            {/* Top-right small fan */}
            <img
              src="/images/rest/Vent.png"
              alt=""
              className="vent-spin"
              style={{
                position: 'absolute',
                left: '75.39%',
                top: '33.14%',
                width: '18%',
                height: 'auto',
                display: 'block',
                pointerEvents: 'none',
                userSelect: 'none',
                animationDuration: '1s',
              }}
            />
            <img
              src="/images/rest/Vent_grill.png"
              alt=""
              style={{
                position: 'absolute',
                left: '75.5%',
                top: '33.4%',
                width: '17.5%',
                height: 'auto',
                display: 'block',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />

            {/* Bottom-right large fan */}
            <img
              src="/images/rest/Vent.png"
              alt=""
              className="vent-spin"
              style={{
                position: 'absolute',
                left: '59%',
                top: '67.1%',
                width: '35%',
                height: 'auto',
                display: 'block',
                pointerEvents: 'none',
                userSelect: 'none',
                animationDuration: '1.5s',
              }}
            />
            <img
              src="/images/rest/Vent_grill.png"
              alt=""
              style={{
                position: 'absolute',
                left: '60%',
                top: '68%',
                width: '33%',
                height: 'auto',
                display: 'block',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />

    </div>
  );
}

export default BackSide;
