import { RECTANGLE_TYPE } from '@/core/constants';
import Box from '@/shared/icons/Box';
import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  editingAtom,
  imageStatusAtom,
  imgBrightnessAtom,
  labelClassAtom,
  polygonsTypeAtom,
  rectanglesTypeAtom,
} from '../state';
import { rectangleColorAtom } from '../assembly/state';
import toast from 'react-hot-toast';

export default function AnnotationClass({ labelClass, isPrimary }) {
  const [selectedClassId, setSelectedClassId] = useRecoilState(labelClassAtom);
  const setRectangleType = useSetRecoilState(rectanglesTypeAtom);
  const setPolygonType = useSetRecoilState(polygonsTypeAtom);
  // const setIsEditing = useSetRecoilState(editingAtom);
  const [isEditing, setIsEditing] = useRecoilState(editingAtom);
  const setImageStatus = useSetRecoilState(imageStatusAtom);
  const imageBrightness = useRecoilValue(imgBrightnessAtom);

  const [rectangleColor, setRectangleColor] =
    useRecoilState(rectangleColorAtom);

  const handleClick = async (t) => {
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
    setImageStatus((prev) => ({...prev, draw: !prev.draw}))
  };

  // useEffect(() => {
  //   setRectangleColor({
  //     all: [],
  //     selectedColor: getRandomHexColor(),
  //   });
  // }, []);

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
      {isPrimary ? (
        <p className="mb-4 mt-10 break-all font-medium">Click the Primary Object Class below to label it in the image</p>
      ) : (
        <p className="mb-4 mt-10 break-all font-medium">Click the classes below to label them</p>
      )}
      <ul className="flex flex-wrap gap-4">
        {labelClass.map((t, i) => (
          <li
            key={t.color}
            className={`bg-[${t.color}] flex cursor-pointer items-center gap-1 rounded-md px-3 py-1.5 ${imageBrightness >= 128 ? 'text-[#ddd]' : 'text-black'}`}
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
            <Box size="xs" labelColor={imageBrightness >= 128 ? '#ddd' : '#000'}/>
            {t.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
