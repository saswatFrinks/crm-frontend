import React from 'react';

import { useRecoilValue } from 'recoil';
import Select from '@/shared/ui/Select';
import { Trash } from 'react-feather';
import { selectedFileAtom } from '../state';

export default function AnnotationLabels() {
  const selectedImage = useRecoilValue(selectedFileAtom);
  const remove = (id) => {};
  const selectClass = (id) => {};
  return (
    <div>
      <p className="mb-4  px-2">
        Current labels for{' '}
        <span className="font-semibold">{selectedImage?.fileName}</span>
      </p>
      <div
        className="flex h-[calc(100vh-478px)] flex-col gap-2 overflow-y-scroll"
        onClick={() => selectClass('id')}
      >
        {Array(10)
          .fill(null)
          .map((t, i) => (
            <div
              key={i}
              className="flex cursor-pointer items-center gap-4 px-4  py-1.5 duration-100 hover:bg-gray-100"
            >
              <span>{i + 1}.</span>
              Label {i + 1}
              <div className=" flex grow justify-center">
                <div className=" w-full max-w-sm">
                  <Select size="xs" />
                </div>
              </div>
              <Trash
                size={16}
                className="cursor-pointer"
                onClick={() => remove('id')}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
