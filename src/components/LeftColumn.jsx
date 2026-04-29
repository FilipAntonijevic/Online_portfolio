import React from 'react';

function LeftColumn() {
  return (
    <aside
      className="left-column"
      style={{
        flex: 1,
        height: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src="/images/Poster.png"
        alt="Poster"
          style={{
            width: '60%',
            height: 'auto',
            display: 'block',
            transform: 'translate(9%, -15%)',
          }}
      />
    </aside>
  );
}

export default LeftColumn;