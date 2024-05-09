import Chip from '@/shared/ui/Chip';
import React from 'react';
import { useRecoilValue } from 'recoil';
import {
  augmentationsAtom,
  classAtom,
  configurationAtom,
  datasetAtom,
  modelInfoAtom,
  // modelSizeAtom,
} from './state';

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

export default function Finish() {
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
  console.log(dataset);

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
          Model Key:
        </label>
        <span> {modelInfo.modelKey} </span>
      </div>
      <div>
        <label htmlFor="" className="font-semibold">
          Model Description:
        </label>
        <span> {modelInfo.modelDescription} </span>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="" className="font-semibold">
          Classes
        </label>
        <div className="flex gap-2">
          {classes.map((className) => (
            <Chip key={className} color={'color-3'}>
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
                      {obj.classes.map((className) => (
                        <Chip key={className} color={'color-3'}>
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
                    <div className="flex-1">{`${folder.totalImages} image${folder?.totalImages == 1 ? '' : 's'}`}</div>
                    <div className="flex-1">
                      <p
                        className={`text-${folder.annotated ? 'green' : 'red'}-500`}
                      >
                        Annotations {folder.annotated ? '' : 'in'}complete
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
          Augmentations:
        </label>
        {/* <span> Horizontal Flip, Vertical Flip, Rotations, Noise </span> */}
        {getAllAugmentations(augmentations).map((name) => (
          <span key={name}> {name} </span>
        ))}
      </div>
    </div>
  );
}
