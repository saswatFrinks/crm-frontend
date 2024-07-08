import React from 'react';

const RadialProgressBar = ({ value, max = 100, size = 200, strokeWidth = 10, showMax=false }) => {

  let percentage = value/max;
  percentage = parseInt(percentage * 100 - (percentage == 1 && !showMax? 1: 0));

  const radius = 30;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-10 h-10">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="absolute transform -rotate-90"
      >
        <circle
          stroke="#BCCCBF"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: 0 }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#16A799"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          // strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <hr className="absolute w-16 h-0.5 bg-white border-none" style={{ transform: 'rotate(90deg)' }} />
      <hr className="absolute w-16 h-0.5 bg-white border-none" style={{ transform: 'rotate(126deg)' }} />
      <hr className="absolute w-16 h-0.5 bg-white border-none" style={{ transform: 'rotate(162deg)' }} />
      <hr className="absolute w-16 h-0.5 bg-white border-none" style={{ transform: 'rotate(198deg)' }} />
      <hr className="absolute w-16 h-0.5 bg-white border-none" style={{ transform: 'rotate(234deg)' }} />
      <span className="absolute text-md font-bold w-full mx-auto">{percentage}%</span>
    </div>
  );
};

export default RadialProgressBar;