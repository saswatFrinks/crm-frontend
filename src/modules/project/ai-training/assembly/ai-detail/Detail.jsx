/* eslint-disable no-prototype-builtins */
import Chip from '@/shared/ui/Chip';
import React, { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
// import { modelIdAtom } from '../state';
import axiosInstance from '@/core/request/aixosinstance';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';
import { useParams } from 'react-router-dom';
import { augmentationsMap } from '..';
import { removeDuplicates, setUniqueClassColors } from '@/util/util';

export default function Detail({ loader, modelInfo, datasets }) {
  React.useEffect(() => {
    console.log('updating:', modelInfo);
    if(modelInfo){
      setColorsOfClasses();
    }
  }, [modelInfo]);

  const [classColors, setClassColors] = useState(new Map());

  const setColorsOfClasses = () => {
    let allClasses = [...modelInfo?.classes];
    modelInfo?.rois?.forEach(roi => {
      allClasses = [...allClasses, ...roi?.classes]
    });
    console.log({allClasses})
    setClassColors(setUniqueClassColors(allClasses));
  }

  return (
    <div className="flex flex-col gap-4">
      {loader ? (
        <ProjectCreateLoader title={'Getting model info...'} />
      ) : (
        <>
          <div>
            <label htmlFor="" className="font-semibold">
              Model Name:
            </label>
            <span> {modelInfo?.name} </span>
          </div>

          <div>
            <label htmlFor="" className="font-semibold">
              Model Description:
            </label>
            <span> {modelInfo?.comment} </span>
          </div>

          {modelInfo?.isTracker ? (
            <div className="flex items-center gap-2">
              <label htmlFor="" className="font-semibold">
                Primary Object Class:
              </label>
              <div className="flex gap-2">
                {removeDuplicates(modelInfo?.rois?.map(r => r?.primaryClass?.className)).map((item, index) => {
                    return (
                      <Chip key={index} color={classColors.get(item)?.color}>
                        {item}
                      </Chip>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <label htmlFor="" className="font-semibold">
                Classes:
              </label>
              <div className="flex gap-2">
                {modelInfo?.hasOwnProperty('classes') &&
                  modelInfo.classes?.length &&
                  modelInfo.classes.map((item, index) => {
                    return (
                      <Chip key={index} color={classColors.get(item)?.color}>
                        {item}
                      </Chip>
                    );
                  })}
              </div>
            </div>
          )}

          <div className='w-[80%]'>
            <p className="font-semibold">
              Following configurations will run this AI model:
            </p>
            <div className="p-4">
              {modelInfo?.hasOwnProperty('rois') &&
                modelInfo.rois?.length &&
                modelInfo.rois?.map((roiItem, i) => (
                  <div key={i}>
                    <div className="flex justify-between gap-2 border-b-[1px] py-2">
                      <div className="flex-1">{roiItem.variantName}</div>
                      <div className="flex-1">{roiItem.capturePositionName}</div>
                      <div className="flex-1">{roiItem.cameraConfig}</div>
                      <div className="flex-1">{roiItem.roi}</div>
                      {!modelInfo?.isTracker && (
                        <div className="flex flex-1 gap-2">
                          {roiItem?.hasOwnProperty('classes') &&
                            roiItem.classes?.length &&
                            roiItem.classes.map((item, index) => {
                              return (
                                <Chip key={index} color={classColors.get(item)?.color}>
                                  {item}
                                </Chip>
                              );
                            })}
                        </div>
                      )}
                    </div>
                    <div></div>
                  </div>
                ))}
            </div>
          </div>

          <div className='w-[80%]'>
            <p className="font-semibold">
              Following datasets will be used for training:
            </p>
            <div className="p-4">
              <div className='text-lg font-medium text-right'>Annotated Images</div>
              {datasets &&
                Object.keys(datasets).map((key) => {
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between font-medium">
                        <div>{datasets[key].datasetInfo.variantName}</div>
                        <div>
                          {datasets[key].datasetInfo.capturePositionName}
                        </div>
                        <div>{datasets[key].datasetInfo.cameraConfigName}</div>
                        <div></div>
                      </div>
                      <div>
                        {datasets[key].hasOwnProperty('datasets') &&
                          datasets[key]['datasets'] &&
                          datasets[key]['datasets']?.length &&
                          datasets[key]['datasets'].map((dataset, i) => (
                            <div key={i}>
                              <div className="flex justify-between gap-2 border-b-[1px] py-2">
                                <div>{dataset.variant}</div>
                                <div>{dataset.capturePosition}</div>
                                <div className="flex gap-2">
                                  {dataset.cameraConfig}
                                </div>
                              </div>
                              <div className="flex justify-between gap-2 py-2 ps-12">
                                <div>{dataset?.datasetName}</div>
                                <div>
                                  <p
                                    className={`text-green-500 font-medium mr-4`}
                                  >
                                    {`${dataset?.annotatedImages}`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div>
            <label htmlFor="" className="font-semibold">
              Augmentations:{' '}
            </label>
            <span>
              {modelInfo?.hasOwnProperty('augmentations') &&
                modelInfo.augmentations?.length &&
                modelInfo.augmentations
                  .map((item) => augmentationsMap[item])
                  .join(', ')}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
