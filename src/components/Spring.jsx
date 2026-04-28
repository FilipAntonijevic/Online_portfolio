import React, { forwardRef, useImperativeHandle } from 'react';

const Spring = forwardRef(function Spring({ repo, onSelect, style, scale = 0.8, rotation = -125, image }, ref) {
  useImperativeHandle(ref, () => ({
    onProjectClick: () => {},
    onProjectHover: () => {},
  }), []);


  // Compose transform string: translate, scale, rotate
    const imgTransform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
    const imgSrc = image || "/images/spring2.png";

  return (
    <>
      <div style={style}>
          <img
            src={imgSrc}
            alt={repo?.name || 'spring'}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transform: imgTransform,
              transformOrigin: 'center',
              position: 'absolute',
              left: '50%',
              top: '50%',
              pointerEvents: 'auto',
              marginLeft: '-10px'
            }}
          />
      </div>
    </>
  );
});

export default Spring;
