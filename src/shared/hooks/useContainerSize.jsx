import { useEffect, useState } from 'react';

/**
 * @param {containerRef} param0 container ref
 * @param {isOpen} param1 recalculate when toggle sidebar
 * @param {image} param2 calculate image size
 * @returns {scaleFactor, size}
 */

export const useContainerSize = ({ containerRef, isOpen, image }) => {
  // console.log('333', image);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const [img, setImg] = useState(image);

  const [scaleFactor, setScaleFactor] = useState(1);

  const checkSize = () => {
    setSize({
      width: containerRef.current?.offsetWidth,
      height: containerRef.current?.offsetHeight,
    });
  };

  useEffect(() => {
    if (image?.width && image?.height) {
      setImg(image);
      setScaleFactor(
        Math.min(size.width / image.width, size.height / image.height)
      );
    }
  }, [image, size]);

  useEffect(() => {
    checkSize();
  }, [image]);

  useEffect(() => {
    checkSize();

    window.addEventListener('resize', checkSize);

    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // console.log(scaleFactor, img?.width, img?.height);

  return { size, scaleFactor };
};
