import { imageDimensionAtom } from '@/modules/project/state';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

/**
 * @param {containerRef} param0 container ref
 * @param {isOpen} param1 recalculate when toggle sidebar
 * @param {image} param2 calculate image size
 * @returns {scaleFactor, size}
 */

export const useContainerSize = ({ containerRef, isOpen, image }) => {
  const [size, setSize] = useState(null);
  const setImageDimensions = useSetRecoilState(imageDimensionAtom)


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
      const tempScale = Math.min(size.width / image.width, size.height / image.height)
      setScaleFactor(
        tempScale
      );
      setImageDimensions({
        height: image.height * tempScale,
        width: image.width * tempScale,
      })
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
