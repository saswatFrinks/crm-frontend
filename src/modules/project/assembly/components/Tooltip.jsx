import React, { useState } from 'react';

const Tooltip = ({ children, text }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer"
      >
        {children}
      </div>
      {showTooltip && (
        <div className="absolute left-1/2 transform -translate-x-1/2 bg-gray-800 text-white py-1 px-2 rounded-md text-sm mt-1 z-10 inline-block " style={{maxWidth: '20rem', width: 'max-content'}}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;