import Checkbox from '@/shared/ui/Checkbox';
import Label from '@/shared/ui/Label';
import Radio from '@/shared/ui/Radio';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  augmentationsAtom,
  //  modelSizeAtom
} from './state';
import { augmentationsMap } from '.';

import sampleImage from '../../../../assets/augmentationSample.svg';
import ArrowUp from '@/shared/icons/ArrowUp';

export default function ModelConfiguration() {
  const [augmentations, setAugmentations] = useRecoilState(augmentationsAtom);
  // const [modelSize, setModelSize] = useRecoilState(modelSizeAtom);

  // const handleModelChange = (key) => {
  //   setModelSize({ ...defaultModel, [key]: true });
  // };

  const handleAugmentationsChange = (key) => {
    setAugmentations({ ...augmentations, [key]: !augmentations[key] });
  };

  const augmentationOptions = [
    {
      title: 'Horizontal Flip',
      description: 'Images provided for training this model will be flipped along their horizontal axis in a random manner to augment the training dataset',
      changeTo: 'transform scale-x-[-1]' 
    },
    {
      title: 'Vertical Flip',
      description: 'Images provided for training this model will be flipped along their vertical axis in a random manner to augment the training dataset',
      changeTo: 'transform rotate-180 scale-x-[-1]'
    },
    {
      title: 'Rotation',
      description: 'Images provided for training this model will be rotated along their center in a random manner to augment the training dataset',
      changeTo: 'transform -rotate-45'
    },
    {
      title: 'Random Crop',
      description: 'Images provided for training this model will be cropped from random positions in a random manner to augment the training dataset',
      changeTo: 'w-full h-full object-cover object-center transform scale-150'
    },
    {
      title: 'Gaussian Blur',
      description: 'Images provided for training this model will be blurred in a random manner to augment the training dataset',
      changeTo: 'filter blur-[1px]'
    },
    {
      title: 'Random Brightness Contrast',
      description: 'Images provided for training this model will be adjusted for random brightness in a random manner to augment the training dataset',
      changeTo: 'filter contrast-200 brightness-125'
    }
  ]

  return (
    <div className="flex flex-col gap-8">
      <h3 className=" text-2xl font-semibold">Model Configuration</h3>
      <p>
        Configure the model parameters as per your project requirement. Use the
        default recommended parameters if you aren’t sure. Reach out to Frinks
        AI technical team if you need support.
      </p>

      {/* <div className="flex flex-col gap-2">
        <p>Model size:</p>
        <div className="flex gap-2">
          <Radio
            value="small"
            name="small"
            id="small"
            checked={modelSize['small']}
            onClick={() => handleModelChange(0)}
          />
          <Label htmlFor="small" main={false}>
            Small
          </Label>
        </div>

        <div className="flex gap-2">
          <Radio
            value="medium"
            name="medium"
            id="medium"
            checked={modelSize['medium']}
            onClick={() => handleModelChange(1)}
          />
          <Label htmlFor="medium" main={false}>
            Medium <span className=" text-blue-400">*Recommended</span>
          </Label>
        </div>

        <div className="flex gap-2">
          <Radio
            value="large"
            name="large"
            id="large"
            checked={modelSize['large']}
            onClick={() => handleModelChange(2)}
          />
          <Label htmlFor="large" main={false}>
            Large
          </Label>
        </div>
      </div> */}

      <div className="flex flex-col gap-2">
        <p className='text-xl font-medium'>Augmentations</p>
        {Object.keys(augmentations).map((item, index) => {
          const option = augmentationOptions[index];
          return (
            <div key={index} className="flex gap-2 items-start bg-f-light-purple rounded-lg p-2">
              <div className='min-w-8 pt-1'>
                <Checkbox
                  id={item}
                  value={item}
                  name={item}
                  htmlFor={item}
                  checked={augmentations[item]}
                  onClick={() => handleAugmentationsChange(item)}
                />
              </div>
              <div className="flex flex-col justify-start">
                <Label htmlFor={item}>
                  <div className="text-lg">{option.title}</div>
                </Label>
                <div>{option.description}</div>
                <div className="flex items-center gap-2 mt-2 justify-evenly">
                  <img
                    src={sampleImage}
                    style={{
                      width: 'auto',
                      height: '90px'
                    }}
                  />
                  <ArrowUp className="rotate-90" />
                  <div className='h-[90px] overflow-hidden'>
                    <img
                      src={sampleImage}
                      style={{
                        width: 'auto',
                        height: '90px'
                      }}
                      className={option.changeTo}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* <div className="flex gap-2">
          <Checkbox
            id="horizontalFlip"
            value="horizontalFlip"
            name="horizontalFlip"
            htmlFor="horizontalFlip"
            checked={augmentations['horizontal']}
            onClick={() => handleAugmentationsChange('horizontal')}
          />
          <Label htmlFor="horizontalFlip" main={false}>
            Horizontal Flip
          </Label>
        </div>

        <div className="flex gap-2">
          <Checkbox
            id="verticalFlip"
            value="verticalFlip"
            name="verticalFlip"
            htmlFor="verticalFlip"
            checked={augmentations['vertical']}
            onClick={() => handleAugmentationsChange('vertical')}
          />
          <Label htmlFor="verticalFlip" main={false}>
            Vertical Flip
          </Label>
        </div>

        <div className="flex gap-2">
          <Checkbox
            id="rotations"
            value="rotations"
            name="rotations"
            htmlFor="rotations"
            checked={augmentations['rotation']}
            onClick={() => handleAugmentationsChange('rotation')}
          />
          <Label htmlFor="rotations" main={false}>
            Rotations
          </Label>
        </div>

        <div className="flex gap-2">
          <Checkbox
            id="noise"
            value="noise"
            name="noise"
            htmlFor="noise"
            checked={augmentations['noise']}
            onClick={() => handleAugmentationsChange('noise')}
          />
          <Label htmlFor="noise" main={false}>
            Noise
          </Label>
        </div> */}
      </div>
    </div>
  );
}
