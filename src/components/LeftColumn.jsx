import React from 'react';

function LeftColumn() {
  return (
    <aside className="column left-column">
      <h2 className="column-heading">About me</h2>
      <div className="column-content">
        {/* 
          CUSTOMIZATION: Edit the text below to personalize your bio.
          Keep it concise (2-4 sentences recommended).
        */}
        <p className="bio-text">
          Software developer with a degree in Mathematics from the University of Belgrade. 
          I build web applications with modern JavaScript and React.
        </p>
      </div>
    </aside>
  );
}

export default LeftColumn;
