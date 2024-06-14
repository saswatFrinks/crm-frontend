import Chip from '@/shared/ui/Chip';
import React from 'react';
import { useRecoilValue } from 'recoil';
import {
  augmentationsAtom,
  classAtom,
  configurationAtom,
  datasetAtom,
  modelInfoAtom,
  primaryClassAtom,
  // modelSizeAtom,
} from './state';
import { augmentationsMap } from '.';
import { removeDuplicates } from '@/util/util';

// const getModelName = (model) => {
//   if (model['large']) {
//     return 'L';
//   } else if (model['medium']) {
//     return 'M';
//   } else {
//     return 'S';
//   }
// };

const getAllAugmentations = (obj) => {
  return Object.keys(obj).filter((key) => obj[key] === true);
};

const filterDataSet = (data) => {
  const dataset = [];

  for (const ele of data) {
    const folders = [];

    for (const folder of ele.folders) {
      if (folder.check) {
        folders.push(folder);
      }
    }

    if (folders.length > 0) {
      dataset.push({ ...ele, folders });
    }
  }

  return dataset;
};

export default function Finish({isMoving}) {
  const modelInfo = useRecoilValue(modelInfoAtom);
  const configuration = useRecoilValue(configurationAtom);
  // const modelSize = useRecoilValue(modelSizeAtom);
  const augmentations = useRecoilValue(augmentationsAtom);
  const classes = useRecoilValue(classAtom)
    .filter((classObj) => {
      console.log(classObj);
      return classObj.check;
    })
    .map((classObj) => classObj.name);
  const dataset = filterDataSet(useRecoilValue(datasetAtom));
  const primaryClasses = useRecoilValue(primaryClassAtom);
  console.log(dataset, {primaryClasses});

  return (
    <div className="flex flex-col gap-8">
      <h3 className=" text-2xl font-semibold">Finish</h3>
      <p>
        Review the details below before starting the training process. Training
        may take some time and you can track the progress in the home page of AI
        model training
      </p>

      <div>
        <label htmlFor="" className="font-semibold">
          Model Name:
        </label>
        <span> {modelInfo.modelName} </span>
      </div>
      <div>
        <label htmlFor="" className="font-semibold">
          Model Description:
        </label>
        <span> {modelInfo.modelDescription} </span>
      </div>

      {isMoving && (
        <div className="flex items-center gap-2">
          <label htmlFor="" className="font-semibold">
            Primary Object Classes:
          </label>
          <div className="flex gap-2">
            {removeDuplicates(primaryClasses.map(cl => cl.className)).map((className, index) => (
              <Chip key={className} color={`color-${index + 1}`}>
                {className}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label htmlFor="" className="font-semibold">
          Classes:
        </label>
        <div className="flex gap-2">
          {classes.filter(cl => !primaryClasses.map(c => c.className).includes(cl)).map((className, index) => (
            <Chip key={className} color={`color-${index + 1}`}>
              {className}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="font-semibold">
          Following configurations will run this AI model:
        </p>
        <div className="p-4">
          {configuration.map((obj, i) => {
            return (
              obj.check && (
                <div key={obj.roi.id}>
                  <div className="flex justify-between gap-2 border-b-[1px] py-2">
                    <div className="flex-1">{obj.variant.name}</div>
                    <div className="flex-1">{obj.capturePosition.name}</div>
                    <div className="flex-1">{obj.cameraConfig.name}</div>
                    <div className="flex-1">{obj.roi.name}</div>
                    <div className="flex flex-1 gap-2">
                      {obj.classes.map((className, index) => (
                        <Chip key={className} color={`color-${index + 1}`}>
                          {className}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div></div>
                </div>
              )
            );
          })}
        </div>
      </div>

      <div>
        <p className="font-semibold">
          Following datasets will be used for training:
        </p>
        <div className="p-4">
          <div className='text-lg border-b-[1px] text-right'>Annotated Images</div>
          {dataset.map((obj, i) => (
            <div key={obj.roi.id}>
              <div className="flex justify-between gap-2 border-b-[1px] py-2">
                <div className="flex-1">{obj.variant.name}</div>
                <div className="flex-1">{obj.capturePosition.name}</div>
                <div className="flex flex-1 gap-2">{obj.cameraConfig.name}</div>
              </div>
              {obj.folders.map((folder) => {
                return (
                  <div
                    key={folder.folderName}
                    className="flex flex-1 justify-between gap-2 py-2 ps-5"
                  >
                    <div className="flex-1">{folder.folderName}</div>
                    <div className="flex-1"></div>
                    <div className="flex-1">
                      <p
                        className={`text-${folder.annotated ? 'green' : 'red'}-500`}
                      ></p>
                    </div>
                    <div className="flex-1 text-right pr-4">
                      <p
                        className={`text-${folder.annotated ? 'green' : 'red'}-500`}
                      >
                        {`${folder?.annotatedImages}/${folder?.totalImages}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* <div>
        <label htmlFor="" className="font-semibold">
          Model Size:
        </label>
        <span> {getModelName(modelSize)} </span>
      </div> */}

      <div>
        <label htmlFor="" className="font-semibold">
          Augmentations:{' '}
        </label>
        {/* <span> Horizontal Flip, Vertical Flip, Rotations, Noise </span> */}
        {getAllAugmentations(augmentations)
          .map((name) => augmentationsMap[name])
          .join(', ')}
      </div>
    </div>
  );
}
