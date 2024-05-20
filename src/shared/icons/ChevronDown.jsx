export default function ChevronDown({ className }) {
  return (
    <svg 
      width="32"
      height="32"
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M8 12L16 20L24 12" 
        stroke="#0E0F0F" 
        stroke-width="1.5" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      />
    </svg>
  );
}