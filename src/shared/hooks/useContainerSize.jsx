import { useEffect, useState } from 'react';

/**
 * @param {containerRef} param0 container ref
 * @param {isOpen} param1 recalculate when toggle sidebar
 * @param {image} param2 calculate image size
 * @returns {scaleFactor, size}
 */

export const useContainerSize = ({ containerRef, isOpen, image }) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const [img, setImg] = useState(null);

  let scaleFactor = null;

  const checkSize = () => {
    setSize({
      width: containerRef.current?.offsetWidth,
      height: containerRef.current?.offsetHeight,
    });
  };

  if (img) {
    scaleFactor = Math.min(size.width / img.width, size.height / img.height);
  }

  useEffect(() => {
    setImg(image);
  }, [image]);

  useEffect(() => {
    checkSize();
  }, [image]);

  useEffect(() => {
    checkSize();

    window.addEventListener('resize', checkSize);

    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return { size, scaleFactor };
};
