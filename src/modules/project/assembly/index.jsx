import Button from '@/shared/ui/Button';

import UploadImage from './components/UploadImage';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { ASSEMBLY_CONFIG, RECTANGLE_TYPE, STATUS } from '@/core/constants';
import Steps from './components/Steps';
import UploadImageStep from './upload-image-step';
import InspectionParameterStep from './inspection-parameter-step';
import LabelImage from './label-image-step';
import PreTrainingStep from './pre-training-step';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';
import Actions from './components/Actions';
import {useParams} from 'react-router-dom'

import { editingRectAtom, stepAtom } from './state';
import { useEffect, useState } from 'react';
import axiosInstance from '@/core/request/aixosinstance';
import { assemblyAtom, currentRoiIdAtom, editingAtom, rectanglesTypeAtom, uploadedFileListAtom } from '../state';

export default function Assembly() {
  const [isEditing, setIsEditing] = useRecoilState(editingAtom);
  const setRectangleType = useSetRecoilState(rectanglesTypeAtom)
  
  const {projectId} = useParams()

  const [type, setType] = useState(ASSEMBLY_CONFIG.STATIONARY)
  const [configuration, setConfiguration] = useRecoilState(assemblyAtom);

  const [currentRoiId, setCurrentRoiId] = useRecoilState(currentRoiIdAtom);
  

  const [isEditingRect, setEditingRect] = useRecoilState(editingRectAtom);

  const [step, setStep] = useRecoilState(stepAtom);

  const getProject = async () => {
    try {
      const {data} = await axiosInstance.get('/project', {
        params: {
          projectId
        }
      })
      !data.data.isItemFixed && setType(ASSEMBLY_CONFIG.MOVING)
    } catch (error) {
      console.log(error)
    }
  }
  const [images, setImages] = useRecoilState(uploadedFileListAtom);

  const handleNext = () => {
    setStep((t) => {
      if(images.length !== 10 || (t == 0 && images.some(img => !img)))return 0;
      if (t == 3) return t;
      return t + 1;
    });
  };

  const handlePrev = () => {
    setStep((t) => {
      if (t == 0) return t;
      return t - 1;
    });
  };

  const calcHeight = () => {
    return (window.innerHeight * 11) / 12 - 154;
  };

  const cancel = () => {
    setEditingRect(false);
    setIsEditing(false);
    setCurrentRoiId(null)
    setRectangleType(RECTANGLE_TYPE.ROI)
  };

  const submit = () => {
    setEditingRect(false);
    setIsEditing(false);
    setCurrentRoiId(null)
    setConfiguration((t) => ({
      ...t,
      rois: t.rois.map((k) => ({
        ...k,
        status: k.id == currentRoiId ? STATUS.FINISH : k.status,
      })),
    }));
    setRectangleType(RECTANGLE_TYPE.ROI)
  };

  const stepObj = {
    0: <UploadImageStep />,
    1: <InspectionParameterStep type={type}/>,
    2: <LabelImage />,
    3: <PreTrainingStep />,
  };

  useEffect(()=>{
    getProject()
  },[])

  return (
    <>
      <div className="grid h-screen grid-cols-12 ">
        <div className="col-span-5 grid grid-rows-12 border-r-[1px] border-gray-400">
          <div className="row-span-11 bg-white">
            <h1 className="mb-4 px-6 pt-6 text-3xl font-bold">
              Assembly Configuration
            </h1>

            <Steps />

            <div
              className="overflow-y-auto p-6"
              style={{
                height: calcHeight(),
              }}
            >
              {stepObj[step]}
            </div>
          </div>

          <div className=" flex justify-center border-t-[1px] border-gray-400 bg-white">
            <div className="flex max-w-md flex-1 items-center justify-center gap-4">
              <Button size="xs" variant="border">
                Cancel
              </Button>
              {
                step > 0 && (
                  <Button size="xs" variant="flat" onClick={handlePrev}>
                    Back
                  </Button>
                )
              }
              <Button size="xs" disabled = {images.length !== 10 || (step == 0 && images.some(img => !img))} onClick={handleNext}>
                Next
              </Button>
            </div>
          </div>
        </div>

        <div className="col-span-7 grid grid-rows-12">
          <div className="row-span-11 flex flex-col items-center justify-center gap-4 bg-[#EAEDF1]">
            <UploadImage />
          </div>

          <div className="flex items-center justify-between border-t-[1px] border-gray-400 bg-white">
            <Actions cancel={cancel} submit={submit} />
          </div>
        </div>
      </div>
      {false && (
        <ProjectCreateLoader title="Please wait while we analyse the project..." />
      )}
    </>
  );
}
