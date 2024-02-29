import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { Trash } from 'react-feather';
import Select from '@/shared/ui/Select';
import {
  rectanglesAtom,
  selectedFileAtom,
  selectedRoiSelector,
} from '../../state';

export default function LabelImage() {
  const [labelClass, setLabelClass] = React.useState([
    {
      name: 'Class 1',
      color: '#C6C4FF',
    },
    {
      name: 'Class 2',
      color: '#7DDE86',
    },
    {
      name: 'Class 3',
      color: '#FF9898',
    },
    {
      name: 'Class 4',
      color: '#9BDCFD',
    },
    {
      name: 'Class 5',
      color: '#FFD188',
    },
    {
      name: 'Class 6',
      color: '#E3E5E5',
    },
  ]);

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
        {labelClass.map((t) => (
          <li
            key={t}
            className={`bg-[${t.color}] cursor-pointer rounded-md px-3 py-1.5`}
          >
            {t.name}
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
            Label {i + 1}
            <div className=" flex grow justify-center">
              <div className=" w-full max-w-sm">
                <Select size="sm" />
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
