import React from 'react';

function LeftColumn() {
  return (
    <aside
      className="left-column"
      style={{
        flex: 1,
        height: 'calc(var(--design-vh, 1vh) * 100)',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        /*outline: '2px solid red',*/
      }}
    >
      <img
        src="/images/rest/Poster.png"
        alt=""
          style={{
            width: '50%',
            height: 'auto',
            display: 'block',
            transform: 'translate(10%, -35%)',
          }}
      />

      <a href="https://github.com/FilipAntonijevic" target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', right: '-10%', top: '25%', width: '25%', height: 'auto', zIndex: 20, pointerEvents: 'auto', display: 'block', transform: 'translateY(-50%) rotate(4deg)' }}>
        <img
          src="/images/rest/Github_graffiti.png"
          alt=""
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            pointerEvents: 'none'
          }}
        />
      </a>

      <a href="mailto:filipdantonijevic@gmail.com" style={{ position: 'absolute', right: '68%', top: '85%', width: '20%', height: 'auto', zIndex: 20, pointerEvents: 'auto', display: 'block', transform: 'translateY(-50%) rotate(8deg)' }}>
        <img
          src="/images/rest/Mail.png"
          alt="Email"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            pointerEvents: 'none'
          }}
        />
      </a>

      <a href="https://www.linkedin.com/in/filip-antonijevic-bbb3923a6/" target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', right: '10%', top: '63%', width: '14%', height: 'auto', zIndex: 20, pointerEvents: 'auto', display: 'block' }}>
        <img
          src="/images/rest/Linkedin_graffiti.png"
          alt=""
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            pointerEvents: 'none'
          }}
        />
      </a>

      <img
        src="/images/rest/CV_graffiti.png"
        alt=""
        style={{
          position: 'absolute',
          right: '71%',
          top: '39%',
          transform: 'translateY(-50%)',
          width: '30%',
          height: 'auto',
          zIndex: 20,
          pointerEvents: 'auto',
        }}
      />
    </aside>
  );
}

export default LeftColumn;