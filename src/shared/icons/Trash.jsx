import React from 'react';

const Trash = ({color = ''}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.75 3.49935H2.91667M2.91667 3.49935H12.25M2.91667 3.49935V11.666C2.91667 11.9754 3.03958 12.2722 3.25838 12.491C3.47717 12.7098 3.77391 12.8327 4.08333 12.8327H9.91667C10.2261 12.8327 10.5228 12.7098 10.7416 12.491C10.9604 12.2722 11.0833 11.9754 11.0833 11.666V3.49935H2.91667ZM4.66667 3.49935V2.33268C4.66667 2.02326 4.78958 1.72652 5.00838 1.50772C5.22717 1.28893 5.52391 1.16602 5.83333 1.16602H8.16667C8.47609 1.16602 8.77283 1.28893 8.99162 1.50772C9.21042 1.72652 9.33333 2.02326 9.33333 2.33268V3.49935M5.83333 6.41602V9.91602M8.16667 6.41602V9.91602"
        stroke={color || "#464A4D"}
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Trash;
