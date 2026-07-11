import React from 'react';

// Right side view of the vending machine — mirror image of the left side.
// The entire content is flipped horizontally so the machine looks correct
// when viewed from the opposite side.
function RightSide({ onSwipeToFront }) {
  return (
    <>
        <img
            src={import.meta.env.BASE_URL + "images_webp/rest/Vending_machine_right2.webp"}
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
            left: '25%',
            top: '9%',
            width: '45%',
            zIndex: 20,
            display: 'block',
            transform: 'rotate(4deg)',
            }}
        >
            <img
            src={import.meta.env.BASE_URL + "images_webp/rest/Github_graffiti.webp"}
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
            right: '33%',
            top: '65%',
            width: '22%',
            zIndex: 200,
            display: 'block',
            }}
        >
            <img
            src={import.meta.env.BASE_URL + "images_webp/rest/Linkedin_graffiti.webp"}
            alt=""
            style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
            />
        </a>

        <a
            href={import.meta.env.BASE_URL + "Filip_Antonijevic_CV.pdf"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ position: 'absolute', left: '-2%', top: '35%', width: '47%', zIndex: 20 }}
        >
            <img
                src={import.meta.env.BASE_URL + "images_webp/rest/CV_graffiti.webp"}
                alt="CV"
                style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                userSelect: 'none',
                }}
            />
        </a>
          <a
                href="mailto:filipdantonijevic@gmail.com"
                style={{
                position: 'absolute',
                right: '11%',
                top: '46.8%',
                width: '17%',
                zIndex: 20,
                display: 'block',
                transform: 'rotate(-24deg)',
                }}
            >
                <img
                src={import.meta.env.BASE_URL + "images_webp/rest/Mail.webp"}
                alt=""
                style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
                />
            </a>


            <img
            src={import.meta.env.BASE_URL + "images_webp/rest/Vending_machine_right_bottom.webp"}
            alt=""
            style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 2000,
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
