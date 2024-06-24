import React from 'react'

const SpinLoader = ({size = ''}) => {
  return (
    <div className='animate-rotate'>
      <svg 
        width={size || "80"} 
        height={size || "80"}
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 2.66602V7.99935M16 23.9993V29.3327M6.57335 6.57268L10.3467 10.346M21.6534 21.6527L25.4267 25.426M2.66669 15.9993H8.00002M24 15.9993H29.3334M6.57335 25.426L10.3467 21.6527M21.6534 10.346L25.4267 6.57268" stroke="#0E0F0F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  )
}

export default SpinLoader
