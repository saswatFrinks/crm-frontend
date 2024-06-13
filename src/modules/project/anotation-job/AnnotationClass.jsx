import { RECTANGLE_TYPE } from '@/core/constants';
import axiosInstance from '@/core/request/aixosinstance';
import Box from '@/shared/icons/Box';
import { getRandomHexColor } from '@/util/util';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  annotationMapAtom,
  currentRectangleIdAtom,
  editingAtom,
  labelClassAtom,
  polygonsTypeAtom,
  rectanglesAtom,
  rectanglesTypeAtom,
} from '../state';
import { rectangleColorAtom } from '../assembly/state';
import toast from 'react-hot-toast';
import Label from '@/shared/ui/Label';
import Button from '@/shared/ui/Button';
import Pen from '@/shared/icons/Pen';

export default function AnnotationClass({ labelClass }) {
  const { projectId } = useParams();
  const [selectedClassId, setSelectedClassId] = useRecoilState(labelClassAtom);
  const setRectangleType = useSetRecoilState(rectanglesTypeAtom);
  const setPolygonType = useSetRecoilState(polygonsTypeAtom);
  // const setIsEditing = useSetRecoilState(editingAtom);
  const [isEditing, setIsEditing] = useRecoilState(editingAtom);
  const rectangles = useRecoilValue(rectanglesAtom);
  const [annotationMap, setAnnotationMap] = useRecoilState(annotationMapAtom);
  const setSelectedPloyId = useSetRecoilState(currentRectangleIdAtom);

  const [rectangleColor, setRectangleColor] =
    useRecoilState(rectangleColorAtom);

  const handleClick = async (t) => {
    console.log("isEditing1",{isEditing});
    if (isEditing === true) {
      toast(
        'Please confirm the creation of the new label first before proceeding',
        {
          icon: '⚠️',
        }
      );
      return;
    }
    setIsEditing(true);
    setRectangleType(RECTANGLE_TYPE.ANNOTATION_LABEL);
    setPolygonType(RECTANGLE_TYPE.ANNOTATION_LABEL);
    setSelectedClassId(t);
    console.log({ labelClass });
  };

  useEffect(() => {
    setRectangleColor({
      all: [],
      selectedColor: getRandomHexColor(),
    });
  }, []);

  // React.useEffect(() => {
  //   let annotations = rectangles.filter(e=>e.rectType==RECTANGLE_TYPE.ANNOTATION_LABEL && annotationMap[e.uuid]==undefined);
  //   if(annotations.length){
  //     setAnnotationMap(prev=>{
  //       const updates = {}
  //       annotations.forEach(annot=>{
  //         updates[annot.uuid] = selectedClassId.id
  //       })
  //       return {...prev, ...updates}
  //     })
  //     setSelectedPloyId(annotations[0].uuid)
  //   }
  // }, [rectangles, annotationMap])
  return (
    <div className="">
      <p className='font-medium'>First label the Primary Object Class in the image</p>
      <div className="flex items-center gap-4 mt-4">
        <Label main={false}>Primary Object Class Annotation:</Label>
        <div className="w-44 max-w-xs">
          <Button
            size="tiny"
            // color={genLabelClass(t.status)}
            fullWidth={false}
            onClick={() => {
              // if (isEditing) {
              //   toast('Please confirm the current Class', {
              //     icon: '⚠️',
              //   });
              //   return;
              // }
            }}
          >
            <div className="flex items-center gap-2">
              <Pen /> Label Class
            </div>
          </Button>
        </div>
      </div>
      <p className="mb-4 mt-10 break-all font-medium">Click the classes below to label them</p>
      <ul className="flex flex-wrap gap-4">
        {labelClass.map((t, i) => (
          <li
            key={t.color}
            className={`bg-[${t.color}] flex cursor-pointer items-center gap-1 rounded-md px-3 py-1.5`}
            style={{ backgroundColor: t.color }}
            onClick={() => {
              handleClick(t);
              const clickedLabelClass = labelClass.find(
                (label) => label.id === t.id
              );
              setRectangleColor({
                ...rectangleColor,
                selectedColor: clickedLabelClass.color,
              });
            }}
          >
            <Box size="xs" />
            {t.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
