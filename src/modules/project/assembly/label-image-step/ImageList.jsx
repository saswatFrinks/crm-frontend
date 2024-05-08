import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { ChevronLeft, ChevronRight } from 'react-feather';
import { selectedFileAtom, uploadedFileListAtom } from '../../state';

export default function ImageList() {
  const [selectedFile, setSelectedFile] = useRecoilState(selectedFileAtom);

  const [images, setImages] = useRecoilState(uploadedFileListAtom);

  const handleNext = () => {
    let currentIndex = images.findIndex((t) => t.id == selectedFile.id);

    if (currentIndex + 1 > images.length - 1) {
      currentIndex = 0;
    } else {
      currentIndex += 1;
    }
    setImages((t) =>
      t.map((k, i) => ({
        ...k,
        checked: i == currentIndex,
      }))
    );
    setSelectedFile(images.find((_, i) => i == currentIndex));
  };

  const handlePrev = () => {
    let currentIndex = images.findIndex((t) => t.id == selectedFile.id);

    if (currentIndex - 1 < 0) {
      currentIndex = images.length - 1;
    } else {
      currentIndex -= 1;
    }
    setImages((t) =>
      t.map((k, i) => ({
        ...k,
        checked: i == currentIndex,
      }))
    );
    setSelectedFile(images.find((_, i) => i == currentIndex));
  };

  const sortImages = () => {
    const masterImages = images.filter(img => img.type === 'master');
    const goodImages = images.filter(img => img.type === 'good');
    const badImages = images.filter(img => img.type === 'bad');

    setImages([...masterImages, ...goodImages, ...badImages]);
  }

  useEffect(() => {
    sortImages();
  }, [])

  return (
    <div className="absolute bottom-0 right-0 z-50 flex w-full items-center gap-4 border-b-[1px] border-t-[1px] bg-white p-2">
      <ChevronLeft className="cursor-pointer" onClick={handlePrev} />
      <ul className="flex grow gap-12  overflow-x-auto">
        {images.map((t) => (
          <li
            key={t.id}
            className={`flex flex-col gap-2 rounded-md p-2 ${selectedFile.id == t.id ? 'bg-f-primary text-white' : ''}`}
          >
            <img src={t.url} className="h-12 object-contain" />
            <div className="line-clamp-1 h-7 w-24 select-none">
              {t.fileName}
            </div>
          </li>
        ))}
      </ul>
      <ChevronRight className="cursor-pointer" onClick={handleNext} />
    </div>
  );
}
