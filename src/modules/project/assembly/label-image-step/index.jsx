import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { Trash } from 'react-feather';
import Select from '@/shared/ui/Select';
import {
  assemblyAtom,
  rectanglesAtom,
  selectedFileAtom,
  selectedRoiSelector,
} from '../../state';

export default function LabelImage() {
  const configuration = useRecoilValue(assemblyAtom)
  const colors = [
    '#C6C4FF',
    '#7DDE86',
    '#FF9898',
    '#9BDCFD',
    '#FFD188',
    '#E3E5E5',
  ]

  const [labelClass, setLabelClass] = useState([])

  const addClasses = () => {
    const temp = []
    configuration.rois.forEach((roi)=> {
      roi.objects.forEach((obj)=> {
        temp.push(obj.className)
      })
    })
    setLabelClass([...temp])
  }
  
  useEffect(()=>{
    addClasses()
  },[])

  const selectedImage = useRecoilValue(selectedFileAtom);

  const selectedRois = useRecoilValue(selectedRoiSelector(selectedImage?.id));

  const setRectangle = useSetRecoilState(rectanglesAtom);

  const removeRoi = (id) => {
    setRectangle((t) => t.filter((k) => k.id !== id));
  };
  

  return (
    <div className="flex flex-col gap-4">
      <p>Choose the class below you wish to label in the image</p>
      <ul className="flex flex-wrap gap-4">
        {labelClass.map((t, index) => (
          <li
            key={t}
            className={`bg-[${colors[index%6]}] cursor-pointer rounded-md px-3 py-1.5`}
          >
            {t}
          </li>
        ))}
      </ul>

      <div>
        Current labels for{' '}
        <span className="font-semibold">{selectedImage.fileName}</span>
      </div>

      <div className="flex flex-col gap-4">
        {selectedRois.map((t, i) => (
          <div key={t.id} className="flex items-center gap-4 ">
            <span>{i + 1}.</span>
             {t.rectType} {t.roiId != null ? t.roiId : t.id}
            <div className=" flex grow justify-center">
              <div className=" w-full max-w-sm">
              </div>
            </div>
            <Trash
              size={16}
              className="cursor-pointer"
              onClick={() => removeRoi(t.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
