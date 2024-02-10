import React from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useClickOutSide(ref, handler) {
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
}

export default useClickOutSide;
