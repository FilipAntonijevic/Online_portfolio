import React, { useState } from 'react';

function Spring({ repo, onSelect, style, scale = 0.8, rotation = -105, image }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    console.log('Clicked repo (spring):', repo?.name);
    if (onSelect) onSelect(repo);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Compose transform string: translate, scale, rotate
    const imgTransform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
    const imgSrc = image || "/images/spring.png";

  return (
    <>
      <div
        style={style}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        tabIndex={0}
        role="button"
        aria-label={`Drop project ${repo?.name}`}
        aria-describedby={showTooltip ? `tooltip-${repo?.id}` : undefined}
      >
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
              pointerEvents: 'auto'
            }}
          />
      </div>
    </>
  );
}

export default Spring;
