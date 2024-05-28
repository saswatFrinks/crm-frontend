import { useContainerSize } from '@/shared/hooks/useContainerSize';
import { useMouseWheel } from '@/modules/project/assembly/hooks/useMouseWheel';
import BigImage from '@/shared/icons/BigImage';
import Upload from '@/shared/icons/Upload';
import React from 'react';
import { Stage, Layer, Image, Text, Line as LineShape } from 'react-konva';
import useImage from 'use-image';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  assemblyAtom,
  currentRectangleIdAtom,
  currentRoiIdAtom,
  dragAtom,
  editingAtom,
  imageStatusAtom,
  labelClassAtom,
  mousePositionAtom,
  rectanglesAtom,
  rectanglesTypeAtom,
  selectedFileAtom,
  selectedRoiSelector,
  stageAtom,
  uploadedFileListAtom,
} from '../../state';
import Crosshair from './Crosshair';
import useDrawRectangle from '../hooks/useDrawRectangle';
import Rectangle from './Rectangle';
import ImageList from '../label-image-step/ImageList';
import { editingRectAtom, stepAtom } from '../state';
import { RECTANGLE_TYPE } from '@/core/constants';
import KonvaImageView from './KonvaImageView';

export default function UploadImage() {
  const [file, setFile] = React.useState(null);

  const rectType = useRecoilValue(rectanglesTypeAtom)

  const [rectangles, setRectangles] = useRecoilState(rectanglesAtom);

  const step = useRecoilValue(stepAtom);

  const selectedFile = useRecoilValue(selectedFileAtom);

  const [image] = useImage(file);

  const [configuration, setConfiguration] = useRecoilState(assemblyAtom);
  const selectedRoiId = useRecoilValue(currentRoiIdAtom);
  const seletectedLabel = useRecoilValue(labelClassAtom)
  const setRectType = useSetRecoilState(rectanglesTypeAtom)

  const roiIndex = configuration.rois.findIndex(v=>v.id==selectedRoiId)
  const roiName = roiIndex>=0? 
    `ROI ${roiIndex}`: 
    seletectedLabel? `${seletectedLabel.name} ${1+rectangles.reduce((p,c)=>{return c.rectType==RECTANGLE_TYPE.ANNOTATION_LABEL && c.imageId==selectedFile.id ? p+1: p}, 0)}`
    : undefined

  React.useEffect(() => {
    if (selectedFile?.url) {
      setFile(selectedFile?.url);
    }
    console.log(selectedFile)
  }, [selectedFile?.id, selectedFile]);

  const updateRectangles = (rects) => {
    setRectangles(rects)
  }

  React.useEffect(()=>{
    setRectType(RECTANGLE_TYPE.ROI)
  },[])

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4"
      style={{
        width: ((window.innerWidth - 16 * 4) * 7) / 12,
        maxHeight: '91.65vh'
      }}
    >
      {step == 0 ? (
        <>
          <BigImage />
          <label className="px-20 py-2 text-xl">
            Upload images to get started with the configuration
          </label>
        </>
      ) : null}

      {file &&
      [1, 2, 3].includes(step) &&
      image?.width ?
      <KonvaImageView image={image} onDrawStop={updateRectangles} rectangles={rectangles} title={roiName} imageId={selectedFile.id}/> 
      : null}
    </div>
  );
}
