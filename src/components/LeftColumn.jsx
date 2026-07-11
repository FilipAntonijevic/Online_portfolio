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
        src={import.meta.env.BASE_URL + "images_webp/rest/Poster.webp"}
        alt=""
          style={{
            width: '58%',
            height: 'auto',
            display: 'block',
            transform: 'translate(5%, -30%)',
          }}
      />

      <a href="https://github.com/FilipAntonijevic" target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', right: '-10%', top: '25%', width: '25%', height: 'auto', zIndex: 20, pointerEvents: 'auto', display: 'block', transform: 'translateY(-50%) rotate(4deg)' }}>
        <img
          src={import.meta.env.BASE_URL + "images_webp/rest/Github_graffiti.webp"}
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
          src={import.meta.env.BASE_URL + "images_webp/rest/Mail.webp"}
          alt=""
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            pointerEvents: 'none'
          }}
        />
      </a>

      <a href="https://www.linkedin.com/in/filip-antonijevic-bbb3923a6/" target="_blank" rel="noopener noreferrer" 
      style={{ position: 'absolute', right: '10%', top: '67%', width: '14%', height: 'auto', zIndex: 20, pointerEvents: 'auto', display: 'block' }}>
        <img
          src={import.meta.env.BASE_URL + "images_webp/rest/Linkedin_graffiti.webp"}
          alt=""
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            pointerEvents: 'none'
          }}
        />
      </a>

      <a
        href={import.meta.env.BASE_URL + "Filip_Antonijevic_CV.pdf"}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'absolute',
          right: '75%',
          top: '37%',
          transform: 'translateY(-50%)',
          width: '30%',
          zIndex: 20,
        }}
      >
        <img
          src={import.meta.env.BASE_URL + "images_webp/rest/CV_graffiti.webp"}
          alt="CV"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </a>
    </aside>
  );
}

export default LeftColumn;