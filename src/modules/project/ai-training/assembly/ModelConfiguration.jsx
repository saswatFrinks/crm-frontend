import Checkbox from '@/shared/ui/Checkbox';
import Label from '@/shared/ui/Label';
import Radio from '@/shared/ui/Radio';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { augmentationsAtom, modelSizeAtom } from './state';

const defaultModel = {
  small: false,
  medium: false,
  large: false,
};

export default function ModelConfiguration() {
  const [augmentations, setAugmentations] = useRecoilState(augmentationsAtom);
  const [modelSize, setModelSize] = useRecoilState(modelSizeAtom);

  const handleModelChange = (key) => {
    setModelSize({ ...defaultModel, [key]: true });
  };

  const handleAugmentationsChange = (key) => {
    setAugmentations({ ...augmentations, [key]: !augmentations[key] });
  };

  return (
    <div className="flex flex-col gap-8">
      <h3 className=" text-2xl font-semibold">Model Configuration</h3>
      <p>
        Configure the model parameters as per your project requirement. Use the
        default recommended parameters if you aren’t sure. Reach out to Frinks
        AI technical team if you need support.
      </p>

      <div className="flex flex-col gap-2">
        <p>Model size:</p>
        <div className="flex gap-2">
          <Radio
            value="small"
            name="small"
            id="small"
            checked={modelSize['small']}
            onClick={() => handleModelChange('small')}
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
            onClick={() => handleModelChange('medium')}
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
            onClick={() => handleModelChange('large')}
          />
          <Label htmlFor="large" main={false}>
            Large
          </Label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p>Augmentations:</p>
        <div className="flex gap-2">
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
        </div>
      </div>
    </div>
  );
}
