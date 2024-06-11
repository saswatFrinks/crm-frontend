import React from 'react';

const RadialProgressBar = ({ value, max = 100, size = 200, strokeWidth = 10, color = 'green', showMax=false }) => {
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  let perc = value/max;
  perc = parseInt(perc * 100 - (perc == 1 && !showMax? 1: 0));

  return (
    <div className="relative flex justify-center">
      <svg className="progress-ring radial-progess-item" width={size} height={size}>
        <circle
          className="progress-ring__circle"
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-l font-bold">
        {parseInt(perc)}%
      </div>
    </div>
  );
};

export default RadialProgressBar;