import { RECTANGLE_TYPE } from '@/core/constants';
import axiosInstance from '@/core/request/aixosinstance';
import Box from '@/shared/icons/Box';
import { getRandomHexColor } from '@/util/util';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  annotationMapAtom,
  currentRectangleIdAtom,
  editingAtom,
  labelClassAtom,
  rectanglesAtom,
  rectanglesTypeAtom,
} from '../state';
import { rectangleColorAtom } from '../assembly/state';



export default function AnnotationClass({ labelClass }) {
  const { projectId } = useParams();
  const [selectedClassId, setSelectedClassId] = useRecoilState(labelClassAtom);
  const setRectangleType = useSetRecoilState(rectanglesTypeAtom);
  const setIsEditing = useSetRecoilState(editingAtom);
  const rectangles = useRecoilValue(rectanglesAtom);
  const [annotationMap, setAnnotationMap] = useRecoilState(annotationMapAtom);
  const setSelectedPloyId = useSetRecoilState(currentRectangleIdAtom);

  const [rectangleColor, setRectangleColor] = useRecoilState(rectangleColorAtom);

  const handleClick = async (t) => {
    setIsEditing(true);
    setRectangleType(RECTANGLE_TYPE.ANNOTATION_LABEL);
    setSelectedClassId(t);
    console.log({ labelClass });
  };

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
      <p className="mb-4 break-all">Click the class below to label it</p>
      <ul className="flex flex-wrap gap-4">
        {labelClass.map((t, i) => (
          <li
            key={t.color}
            className={`bg-[${t.color}] flex cursor-pointer items-center gap-1 rounded-md px-3 py-1.5`}
            style={{ backgroundColor: t.color }}
            onClick={() => {
              handleClick(t);
              const clickedLabelClass = labelClass.find((label) => label.id === t.id);
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
