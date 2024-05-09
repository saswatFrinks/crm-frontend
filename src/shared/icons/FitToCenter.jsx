import { tv } from "tailwind-variants";

export default function FitToCenter ({ active = false }) {
    const clx = tv({
        base: 'w-6 h-6',
        variants: {
          active: {
            true: 'text-f-primary',
            false: '',
          },
        },
    });

    return (
        <svg 
            className={clx({ active })}
            viewBox="0 0 30 30" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M10.6667 4H6.66667C5.95942 4 5.28115 4.28095 4.78105 4.78105C4.28095 5.28115 4 5.95942 4 6.66667V10.6667M28 10.6667V6.66667C28 5.95942 27.719 5.28115 27.219 4.78105C26.7189 4.28095 26.0406 4 25.3333 4H21.3333M21.3333 28H25.3333C26.0406 28 26.7189 27.719 27.219 27.219C27.719 26.7189 28 26.0406 28 25.3333V21.3333M17 14.5V7.5M17 7.5L13.5 10M17 7.5L20.5 10M20 17H27M27 17L24 13M27 17L24 21M4 21.3333V25.3333C4 26.0406 4.28095 26.7189 4.78105 27.219C5.28115 27.719 5.95942 28 6.66667 28H10.6667H15C16.1046 28 17 27.1046 17 26V19C17 17.8954 16.1046 17 15 17H6C4.89543 17 4 17.8954 4 19V21.3333Z" stroke="#0E0F0F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>  
    )
}