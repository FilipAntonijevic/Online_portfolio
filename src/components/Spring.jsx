
// Animation durations (in ms)
const SPRING_ROTATE_DURATION = 1000;
const SPRING_ANIMATE_TO_DEFAULT = 400;

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';


const Spring = forwardRef(function Spring({ repo, onSelect, style, scale = 0.8, rotation = -120, image }, ref) {
  const [currentRotation, setCurrentRotation] = useState(rotation);
  const animationRef = useRef(null);
  const rotationRef = useRef(rotation);

  // Sync state and ref
  const setRotation = (val) => {
    setCurrentRotation(val);
    rotationRef.current = val;
  };

  const animateTo = (target, duration = SPRING_ANIMATE_TO_DEFAULT) => {
    return new Promise((resolve) => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      const start = performance.now();
      const initial = rotationRef.current;
      const delta = target - initial;
      if (Math.abs(delta) < 0.5) {
        setRotation(target);
        resolve();
        return;
      }
      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        setRotation(initial + delta * progress);
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(step);
        } else {
          setRotation(target);
          resolve();
        }
      }
      animationRef.current = requestAnimationFrame(step);
    });
  };


  useImperativeHandle(ref, () => ({
    async onProjectClick(callback) {
      // Rotiraj za 360 stepeni od trenutnog ugla za SPRING_ROTATE_DURATION
      await animateTo(rotationRef.current - 360, SPRING_ROTATE_DURATION);
      if (callback) callback();
    }
  }), [rotation]);

  const imgTransform = `translate(-50%, -50%) scale(${scale}) rotate(${currentRotation}deg)`;
  const imgSrc = image || `${import.meta.env.BASE_URL}images/rest/spring.png`;

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
