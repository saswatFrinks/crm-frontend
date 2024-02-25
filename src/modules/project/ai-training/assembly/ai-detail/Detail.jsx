import Chip from '@/shared/ui/Chip';
import React from 'react';

export default function Detail() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="" className="font-semibold">
          Model Name:
        </label>
        <span> Assembly 123 </span>
      </div>

      <div>
        <label htmlFor="" className="font-semibold">
          Model Description:
        </label>
        <span>
          {' '}
          Assembly model for variant 1,2,3 xyz. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Nullam rhoncus luctus rhoncus. In hac
          habitasse platea dictumst. Aenean malesuada, magna ut semper rutrum,
          mauris ex ornare metus, eu placerat nulla sem non dui.{' '}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="" className="font-semibold">
          Classes
        </label>
        <div className="flex gap-2">
          <Chip color={'color-2'}>Class 1</Chip>
          <Chip color={'color-3'}>Class 1</Chip>
        </div>
      </div>

      <div>
        <p className="font-semibold">
          Following configurations will run this AI model:
        </p>
        <div className="p-4">
          {Array(2)
            .fill(1)
            .map((t, i) => (
              <div key={i}>
                <div className="flex justify-between gap-2 border-b-[1px] py-2">
                  <div>Variant 1</div>
                  <div>CP1</div>
                  <div>CC1</div>
                  <div>ROI 1</div>
                  <div className="flex gap-2">
                    <Chip color="color-2">Class 1</Chip>
                    <Chip color="color-4">Class 2</Chip>
                  </div>
                </div>
                <div></div>
              </div>
            ))}
        </div>
      </div>

      <div>
        <p className="font-semibold">
          Following datasets will be used for training:
        </p>
        <div className="p-4">
          {Array(2)
            .fill(1)
            .map((t, i) => (
              <div key={i}>
                <div className="flex justify-between gap-2 border-b-[1px] py-2">
                  <div>Variant 1</div>
                  <div>CP1</div>
                  <div className="flex gap-2">CC1</div>
                </div>
                <div className="flex justify-between gap-2 py-2 ps-12">
                  <div>Folder 1</div>
                  <div>200 images</div>
                  <div>
                    <p className="text-green-500">Annotations complete</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div>
        <label htmlFor="" className="font-semibold">
          Model Size:
        </label>
        <span> L </span>
      </div>

      <div>
        <label htmlFor="" className="font-semibold">
          Augmentations:
        </label>
        <span> Horizontal Flip, Vertical Flip, Rotations, Noise </span>
      </div>
    </div>
  );
}
